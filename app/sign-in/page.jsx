"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { loginWithGooglePopup } from "@/lib/auth/loginWithGooglePopup";

const SignIn = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  if (user) {
    router.push("/"); // add profile page here later
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 flex-col space-y-2">
      <h1>Sign-in/Sign-up Page</h1>
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <button
          onClick={loginWithGooglePopup}
          className="flex items-center justify-center p-2 bg-white border border-gray-300 text-gray-700 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Logo"
            className="w-6 h-6 mr-2"
          />
          Sign in or create an account with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
