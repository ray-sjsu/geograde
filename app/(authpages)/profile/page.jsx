"use client";
import SignOutButton from '@/components/auth-components/SignOutButton'
import { URL_SIGN_IN } from '@/lib/CONSTANTS';
import { useRouter } from 'next/navigation';
import { auth } from "@/app/firebase/config";
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

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
      <h1>Profile Page</h1>
      <SignOutButton/>
    </div>
  )
}

export default ProfilePage