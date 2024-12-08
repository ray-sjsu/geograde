"use client"

import React, { Suspense } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PlacesPageContent from "@/components/search/PlacesPageContent";

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div>
        <DotLottieReact
          src="https://lottie.host/f78896eb-1cdc-45e7-aed9-628f1d07d3ed/kQYtSnWl1I.lottie"
          loop
          autoplay
        />
      </div>}>
      <PlacesPageContent />
    </Suspense>
  );
};

export default SearchPage;
