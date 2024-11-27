"use client"

import React, { Suspense } from "react";
import SearchPageContent from "/components/search/SearchPageContent"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SearchPage = () => {
  return (
    <Suspense fallback={
    <div>
      <DotLottieReact
        src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
        loop
        autoplay
      />
    </div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
