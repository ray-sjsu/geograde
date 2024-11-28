"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firebase/config";
import { collection, query, orderBy, limit, startAfter, startAt, getDocs } from "firebase/firestore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const FirestoreSearchResults = ({ pageSize = 10 }) => {
  const [results, setResults] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null); // Track the first document for "Previous"
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [previousPages, setPreviousPages] = useState([]); // Stack of previous cursors
  const [hasMore, setHasMore] = useState(true);

  // Fetch the first page of results
  const fetchResults = async () => {
    setLoading(true);

    try {
      const resultsRef = collection(firestore, "locations");
      const resultsQuery = query(resultsRef, orderBy("name"), limit(pageSize));

      const querySnapshot = await getDocs(resultsQuery);
      const locations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(locations);
      setFirstVisible(querySnapshot.docs[0]); // Set the first visible document
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Set the last visible document
      setHasMore(querySnapshot.docs.length === pageSize); // If less than pageSize, no more results
      setPreviousPages([]); // Reset previous pages stack
      setCurrentPage(1); // Reset to page 1
    } catch (error) {
      console.error("Error fetching Firestore results:", error);
    }

    setLoading(false);
  };

  // Fetch the next page of results
  const fetchNextPage = async () => {
    if (!lastVisible || !hasMore) return;

    setLoading(true);

    try {
      const resultsRef = collection(firestore, "locations");
      const resultsQuery = query(
        resultsRef,
        orderBy("name"),
        startAfter(lastVisible), // Use the last document as the starting point
        limit(pageSize)
      );

      const querySnapshot = await getDocs(resultsQuery);
      const newLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update results, last visible document, and previous pages stack
      setPreviousPages((prev) => [...prev, firstVisible]); // Add current firstVisible to stack
      setResults(newLocations);
      setFirstVisible(querySnapshot.docs[0]); // Update first visible document
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
      setCurrentPage((prev) => prev + 1); // Increment page count
    } catch (error) {
      console.error("Error fetching next page of results:", error);
    }

    setLoading(false);
  };

  // Fetch the previous page of results
  const fetchPreviousPage = async () => {
    if (!previousPages.length) return;

    setLoading(true);

    try {
      const resultsRef = collection(firestore, "locations");
      const previousCursor = previousPages[previousPages.length - 1]; // Get the last cursor from the stack
      const resultsQuery = query(
        resultsRef,
        orderBy("name"),
        startAt(previousCursor), // Use the previous cursor as the starting point
        limit(pageSize)
      );

      const querySnapshot = await getDocs(resultsQuery);
      const newLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update results, last visible document, and previous pages stack
      setPreviousPages((prev) => prev.slice(0, -1)); // Remove the last cursor from the stack
      setResults(newLocations);
      setFirstVisible(querySnapshot.docs[0]); // Update first visible document
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setCurrentPage((prev) => prev - 1); // Decrement page count
    } catch (error) {
      console.error("Error fetching previous page of results:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <div className="grid gap-6">
        {results.map((location) => (
        <div key={location.id} className="card card-side bg-base-100 shadow-xl rounded-xl">
        {/* Image Section */}
        <figure>
          <img
            src={"https://fastly.picsum.photos/id/42/3456/2304.jpg?hmac=dhQvd1Qp19zg26MEwYMnfz34eLnGv8meGk_lFNAJR3g"} // Placeholder if no image
            alt={location.name}
            className=" w-52 h-52 object-cover"
          />
        </figure>

        {/* Content Section */}
        <div className="card-body text-base-content">
          <h2 className="card-title">{location.name}</h2>
          <p>{location.address}</p>
          <p className="text-sm text-base-content">{`Rating: ${location.rating || "N/A"} ⭐`}</p>
          <div className="card-actions justify-end">
            <a href={`/search/${location.id}`} className="btn btn-primary">
              View Details
            </a>
          </div>
        </div>
      </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <div className="join">
          <button
            className={`join-item btn ${previousPages.length === 0 ? "btn-disabled" : ""}`}
            onClick={fetchPreviousPage}
            disabled={previousPages.length === 0 || loading}
          >
            «
          </button>
          <button className="join-item btn">Page {currentPage}</button>
          <button
            className={`join-item btn ${!hasMore ? "btn-disabled" : ""}`}
            onClick={fetchNextPage}
            disabled={!hasMore || loading}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirestoreSearchResults;
