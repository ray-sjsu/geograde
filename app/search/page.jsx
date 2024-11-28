"use client"

import React, { Suspense } from "react";
import SearchPageContent from "/components/search/SearchPageContent"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PlacesPageContent from "@/components/search/PlacesPageContent";

const SearchPage = () => {
  return (
    <Suspense fallback={
    <div>
      <DotLottieReact
        src="/assets/Animation - 1732701110760.lottie"
        loop
        autoplay
      />
    </div>}>
      <PlacesPageContent />
    </Suspense>
  );
};

export default SearchPage;
