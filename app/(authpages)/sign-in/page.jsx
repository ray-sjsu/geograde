"use client"

import React, { Suspense } from "react";
import SignIn from "@/components/Profile/SignIn";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


export default function Page() {
  return (
    <Suspense fallback={
      <div>
        <DotLottieReact
          src="/assets/Animation - 1732701110760.lottie"
          loop
          autoplay
        />
      </div>}>
      <SignIn />
    </Suspense>
  );
}
