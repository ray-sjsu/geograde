"use client"; 
import { useRouter } from 'next/navigation';

//
//      This page is for the sign-in button at the top right
//

const Button = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/sign-in'); //redirect to sign-in but update later to be logout
  };

  return (
    <button 
      className="h-12 rounded-lg bg-white text-black font-bold px-5"
      onClick={handleClick} 
    >
      Sign In
    </button>
  );
};

export default Button;