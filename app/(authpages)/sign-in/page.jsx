"use client"

import React, { Suspense } from "react";
import SignIn from "@/components/Profile/SignIn";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


export default function Page() {
  return (
    <Suspense fallback={
      <div>
        <DotLottieReact
          src="https://lottie.host/f78896eb-1cdc-45e7-aed9-628f1d07d3ed/kQYtSnWl1I.lottie"
          loop
          autoplay
        />
      </div>}>
      <SignIn />
    </Suspense>
  );
}
