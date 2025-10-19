// Signup.jsx - Updated with unified styling
import { Link, useNavigate } from "react-router-dom";
import SignupForm from "../Component/SignupForm";
import {auth} from "../Config/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  let navigate = useNavigate();
  let getData = (value) => {
    createUserWithEmailAndPassword(auth, value.email, value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-400/20">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">NeonChat</h1>
          <p className="text-slate-400">Create your account</p>
        </div>
        <SignupForm data={getData} />
        <p className="mt-6 text-center text-slate-300 text-lg">
          Already have an account? 
          <Link to="/login" className="text-fuchsia-400 ml-2 font-semibold hover:text-fuchsia-300 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;