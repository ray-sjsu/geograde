"use client";
import SignOutButton from '@/components/auth-components/SignOutButton'
import { URL_SIGN_IN } from '@/lib/CONSTANTS';
import { useRouter } from 'next/navigation';
import { auth } from "@/app/firebase/config";
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import FavoritesList from '/components/FavoritesList';

const ProfilePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log("Redirecting to sign-in page...");
      router.push(URL_SIGN_IN);
    }
  }, [user, router]);

  return (
    <div>
        <div className="min-h-screen bg-base-100 p-6">
          <FavoritesList /> 
        </div>
      <SignOutButton/>
    </div>
  )
}

export default ProfilePage