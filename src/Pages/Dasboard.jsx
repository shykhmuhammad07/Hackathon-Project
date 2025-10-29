// Dashboard.jsx - Fully Functional
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db, auth } from "../Config/Firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const pitchesQuery = query(
        collection(db, "pitches"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(pitchesQuery);
      const pitchesArray = [];

      querySnapshot.forEach((doc) => {
        const pitchData = doc.data();
        if (pitchData.userId === userId) {
          pitchesArray.push({ id: doc.id, ...pitchData });
        }
      });

      setData(pitchesArray);
      
      // Calculate stats
      const total = pitchesArray.length;
      const recent = pitchesArray.filter(pitch => {
        const pitchDate = new Date(pitch.createdAt?.toDate?.() || pitch.createdAt);
        const daysAgo = (Date.now() - pitchDate.getTime()) / (1000 * 3600 * 24);
        return daysAgo <= 7;
      }).length;

      setStats({ total, recent });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePitch = async (pitchId) => {
    if (window.confirm("Are you sure you want to delete this pitch?")) {
      try {
        await deleteDoc(doc(db, "pitches", pitchId));
        setData(data.filter(item => item.id !== pitchId));
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
      } catch (error) {
        console.error("Error deleting pitch:", error);
        alert("Error deleting pitch. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut(auth)
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ViewPitchModal = ({ pitch, onClose }) => {
    if (!pitch) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-3xl border border-purple-400/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-purple-400/20">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-purple-300">Pitch Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Original Idea */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Original Idea</h4>
              <p className="text-gray-300 bg-white/5 p-4 rounded-xl">{pitch.input}</p>
            </div>

            {/* Generated Content */}
            {pitch.result && (
              <>
                {/* Names */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-3">Generated Names</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pitch.result.names?.map((name, index) => (
                      <div key={index} className="bg-white/10 p-3 rounded-xl text-center">
                        <span className="text-white font-medium">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Taglines */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-3">Taglines</h4>
                  <div className="space-y-2">
                    {pitch.result.taglines?.map((tagline, index) => (
                      <div key={index} className="bg-white/10 p-3 rounded-xl">
                        <p className="text-gray-300 italic">"{tagline}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pitch */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-3">Elevator Pitch</h4>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-gray-300 leading-relaxed">{pitch.result.pitch}</p>
                  </div>
                </div>

                {/* Website Preview */}
                {pitch.result.website_ui && (
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Website Preview</h4>
                    <iframe
                      srcDoc={pitch.result.website_ui.html}
                      title="Website Preview"
                      className="w-full h-64 border border-purple-400/30 rounded-xl"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="p-6 border-t border-purple-400/20 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-xl font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [selectedPitch, setSelectedPitch] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading your pitches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="relative py-12 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to PitchCraft
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your AI-powered startup pitch generator. Transform ideas into compelling pitches instantly.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 min-w-[150px]">
              <h3 className="text-3xl font-bold text-purple-300">{stats.total}</h3>
              <p className="text-gray-400">Total Pitches</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 min-w-[150px]">
              <h3 className="text-3xl font-bold text-purple-300">{stats.recent}</h3>
              <p className="text-gray-400">This Week</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 min-w-[150px]">
              <h3 className="text-3xl font-bold text-purple-300">{user?.email ? user.email.split('@')[0] : 'User'}</h3>
              <p className="text-gray-400">Username</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              🚀 Create New Pitch
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Pitches Grid */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Your Generated Pitches
          </h2>

          {data.length === 0 ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20">
              <div className="text-6xl mb-6">💡</div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                No Pitches Yet
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start creating amazing startup pitches with our AI generator! Turn your ideas into compelling stories.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30"
              >
                Create Your First Pitch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((pitch) => (
                <div
                  key={pitch.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 group"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs text-purple-300 bg-purple-900/50 px-3 py-1 rounded-full">
                      {formatDate(pitch.createdAt)}
                    </span>
                    <button
                      onClick={() => handleDeletePitch(pitch.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete pitch"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                    {pitch.input}
                  </h3>
                  
                  {pitch.result && (
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-purple-300 font-medium">Top Name:</p>
                        <p className="text-white">{pitch.result.names?.[0]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300 font-medium">Tagline:</p>
                        <p className="text-gray-300 text-sm line-clamp-2">"{pitch.result.taglines?.[0]}"</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {pitch.input?.length > 100 ? 'Detailed' : 'Quick'} Idea
                    </span>
                    <button 
                      onClick={() => setSelectedPitch(pitch)}
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white/5 mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose PitchCraft?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered</h3>
              <p className="text-gray-400">
                Advanced AI algorithms generate creative startup names, taglines, and complete pitch decks.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Results</h3>
              <p className="text-gray-400">
                Get professional pitches, website previews, and marketing copy in seconds, not hours.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Save & Organize</h3>
              <p className="text-gray-400">
                All your generated pitches are saved securely and easily accessible anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedPitch && (
        <ViewPitchModal 
          pitch={selectedPitch} 
          onClose={() => setSelectedPitch(null)} 
        />
      )}
    </div>
  );
}

export default Dashboard;