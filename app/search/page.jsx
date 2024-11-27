import React, { Suspense } from "react";
import SearchPageContent from "/components/search/SearchPageContent"

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
