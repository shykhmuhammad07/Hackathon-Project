// Create.jsx - Fully Functional
import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../Config/Firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Create = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const savePitchToFirestore = async (input, result) => {
    if (!user) return null;

    try {
      const docRef = await addDoc(collection(db, "pitches"), {
        userId: user.uid,
        userEmail: user.email,
        input: input,
        result: result,
        createdAt: serverTimestamp(),
      });
      console.log("Pitch saved with ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error saving pitch: ", e);
      throw e;
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      alert("Please enter your startup idea first!");
      return;
    }

    setLoading(true);
    setResult(null);
    setPreviewVisible(false);

    const prompt = `
You are a creative AI startup assistant.
Based on the user's idea, generate a structured JSON in the following exact format:

{
  "names": ["3 creative and catchy startup names"],
  "taglines": ["3 short and unique taglines"],
  "pitch": "Write a compelling elevator pitch and clear problem/solution statement.
   Structure it as:
   🎯The Problem: [Describe the problem]
   💡Our Solution: [Describe your solution]
   🚀The Vision: [Long-term vision]
",
  "website_ui": {
    "html": "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><script src='https://cdn.tailwindcss.com'></script><title>[Startup Name]</title></head><body class='bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white'>
    <!-- Hero Section -->
    <section class='flex flex-col items-center justify-center min-h-screen text-center px-6'>
      <h1 class='text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4'>[Startup Name]</h1>
      <p class='text-lg text-gray-300 mb-8'>[Tagline]</p>
      <button class='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all'>Get Started</button>
    </section>

    <!-- Features Section -->
    <section class='py-16 bg-gray-900/50 backdrop-blur-lg'>
      <h2 class='text-3xl text-center font-bold text-purple-300 mb-10'>Features</h2>
      <div class='max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6'>
        <div class='bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg'>
          <h3 class='text-xl font-semibold text-purple-300 mb-2'>Smart Innovation</h3>
          <p class='text-gray-400'>We use AI-driven solutions to revolutionize the industry.</p>
        </div>
        <div class='bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg'>
          <h3 class='text-xl font-semibold text-purple-300 mb-2'>User-Centric Design</h3>
          <p class='text-gray-400'>A seamless experience built around your needs.</p>
        </div>
        <div class='bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg'>
          <h3 class='text-xl font-semibold text-purple-300 mb-2'>Scalable Growth</h3>
          <p class='text-gray-400'>Built to scale as your business grows.</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class='py-16 bg-gray-800/50 text-center px-6 backdrop-blur-lg'>
      <h2 class='text-3xl font-bold text-purple-300 mb-6'>About Us</h2>
      <p class='max-w-3xl mx-auto text-gray-400'>[Startup Name] is on a mission to transform ideas into impactful realities, blending creativity, AI, and human-centered design.</p>
    </section>

    <!-- Contact Section -->
    <section class='py-16 bg-gray-900/50 text-center backdrop-blur-lg'>
      <h2 class='text-3xl font-bold text-purple-300 mb-6'>Get in Touch</h2>
      <button class='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all'>Contact Us</button>
    </section>

    <footer class='py-6 bg-black/50 text-center text-gray-500 text-sm backdrop-blur-lg'>
      © 2025 [Startup Name]. All rights reserved.
    </footer>
    </body></html>"
  }
}

Rules:
- Return only valid JSON, no explanations.
- Replace [Startup Name] and [Tagline] with generated content.
- Keep Tailwind classes consistent and professional.
- Make sure the HTML is valid and properly formatted.

User idea: ${input}
`;

    try {
      const res = await model.generateContent(prompt);
      const text = res.response.text();
      const cleanText = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const json = JSON.parse(jsonMatch[0]);
      setResult(json);

      // Auto-save to Firestore
      setSaving(true);
      try {
        await savePitchToFirestore(input, json);
      } catch (saveError) {
        console.error("Failed to save pitch:", saveError);
        // Don't show error to user, just log it
      } finally {
        setSaving(false);
      }
    } catch (err) {
      console.error("Generation error:", err);
      setResult({
        error:
          "⚠️ Failed to generate pitch. Please try again with a different idea or check your API key.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePitch = async () => {
    if (!result || result.error) return;

    setSaving(true);
    try {
      await savePitchToFirestore(input, result);
      alert("✅ Pitch saved successfully to your dashboard!");
    } catch (error) {
      alert("❌ Failed to save pitch. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const regenerateItem = async (type) => {
    if (!input.trim()) return;

    const regeneratePrompt = `
    Regenerate only the ${type} for this startup idea: "${input}"
    Return ONLY a JSON array for names or a string for pitch, no other text.
    
    ${
      type === "names"
        ? 'Return format: ["name1", "name2", "name3"]'
        : type === "taglines"
        ? 'Return format: ["tagline1", "tagline2", "tagline3"]'
        : 'Return format: "pitch text here"'
    }
    `;

    try {
      const res = await model.generateContent(regeneratePrompt);
      const text = res.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      const newData = JSON.parse(text);

      setResult((prev) => ({
        ...prev,
        [type]: newData,
      }));
    } catch (err) {
      console.error(`Regeneration error for ${type}:`, err);
      alert(`Failed to regenerate ${type}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/20 p-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🚀 Startup Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into complete startup pitches with AI-powered
            names, taglines, and live website previews
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter your startup idea... (e.g., 'AI-powered fitness app for seniors')"
              className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400 text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Generate Magic"
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
              <p className="text-purple-300 text-lg animate-pulse">
                AI is crafting your startup masterpiece...
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && !result.error && (
          <div className="space-y-8 animate-fade-in">
            {/* Save Button */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-purple-400/20">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">
                  Pitch Generated Successfully! 🎉
                </h3>
                <p className="text-gray-400 text-sm">
                  Your pitch has been automatically saved to your dashboard
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSavePitch}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "💾 Save Again"}
                </button>
                <button
                  onClick={() => navigate("/dash")}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  📊 View Dashboard
                </button>
              </div>
            </div>

            {/* Names Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-300 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    🧠
                  </span>
                  Creative Startup Names
                </h2>
                <button
                  onClick={() => regenerateItem("names")}
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all"
                >
                  🔄 Regenerate
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.names?.map((n, i) => (
                  <div
                    key={i}
                    className="bg-white/10 p-4 rounded-xl border border-white/5 hover:border-purple-400/30 transition-all group relative"
                  >
                    <span className="text-white font-medium">{n}</span>
                    <button
                      onClick={() => copyToClipboard(n)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 p-1 rounded transition-all"
                      title="Copy name"
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Taglines Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-300 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    💬
                  </span>
                  Catchy Taglines
                </h2>
                <button
                  onClick={() => regenerateItem("taglines")}
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all"
                >
                  🔄 Regenerate
                </button>
              </div>
              <div className="space-y-3">
                {result.taglines?.map((t, i) => (
                  <div
                    key={i}
                    className="bg-white/10 p-4 rounded-xl border border-white/5 hover:border-purple-400/30 transition-all group relative"
                  >
                    <span className="text-gray-300 italic">"{t}"</span>
                    <button
                      onClick={() => copyToClipboard(t)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 p-1 rounded transition-all"
                      title="Copy tagline"
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-300 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    🎯
                  </span>
                  Elevator Pitch
                </h2>
                <button
                  onClick={() => regenerateItem("pitch")}
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all"
                >
                  🔄 Regenerate
                </button>
              </div>
              <div className="bg-white/10 p-6 rounded-xl border border-purple-400/20 group relative">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {result.pitch}
                </p>
                <button
                  onClick={() => copyToClipboard(result.pitch)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
                  title="Copy pitch"
                >
                  📋
                </button>
              </div>
            </div>

            {/* Website UI Section */}
            {result.website_ui && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    🌐
                  </span>
                  Live Website Preview
                </h2>

                {/* Preview Toggle */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={() => setPreviewVisible(!previewVisible)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30"
                  >
                    {previewVisible ? "👁️ Hide Preview" : "👁️ Show Preview"}
                  </button>

                  <button
                    onClick={() => copyToClipboard(result.website_ui.html)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    📋 Copy HTML Code
                  </button>
                </div>

                {/* Preview Iframe */}
                {previewVisible && (
                  <div className="mb-6">
                    <iframe
                      srcDoc={result.website_ui.html}
                      title="Website Preview"
                      className="w-full h-[500px] border-2 border-purple-400/30 rounded-2xl shadow-2xl shadow-purple-500/20 bg-white"
                    />
                  </div>
                )}

                {/* Code Viewer */}
                <details className="group">
                  <summary className="cursor-pointer text-purple-300 hover:text-purple-200 font-semibold text-lg flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <span>📜 View HTML Code</span>
                    <svg
                      className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </summary>
                  <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-purple-400/20 overflow-x-auto">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {result.website_ui.html}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {result?.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-300 text-lg">{result.error}</p>
            <button
              onClick={() => setResult(null)}
              className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-12 space-y-6">
            <div className="text-6xl">✨</div>
            <h3 className="text-2xl font-semibold text-gray-300">
              Ready to Create Magic?
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter your startup idea above and watch as AI generates names,
              taglines, pitches, and even a complete website for your vision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
              <div>🚀 Get startup names</div>
              <div>💡 Generate taglines</div>
              <div>🌐 Create website previews</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
