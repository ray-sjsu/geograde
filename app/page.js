import SignInOutSection from "@/components/auth-components/SignInOutButton";

export default function Home() {

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to the Landing Page
        </h1>
        <SignInOutSection />
      </div>
    </div>
  );
}
