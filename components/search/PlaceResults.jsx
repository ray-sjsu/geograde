import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firebase/config";
import { collection, query, orderBy, limit, startAfter, startAt, getDocs } from "firebase/firestore";
import PlaceCard from "./PlaceCard";

const FirestoreSearchResults = ({ pageSize = 10 }) => {
  const [results, setResults] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPages, setPreviousPages] = useState([]);
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
      setFirstVisible(querySnapshot.docs[0]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
      setPreviousPages([]);
      setCurrentPage(1);
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
        startAfter(lastVisible),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(resultsQuery);
      const newLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPreviousPages((prev) => [...prev, firstVisible]);
      setResults(newLocations);
      setFirstVisible(querySnapshot.docs[0]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
      setCurrentPage((prev) => prev + 1);
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
      const previousCursor = previousPages[previousPages.length - 1];
      const resultsQuery = query(
        resultsRef,
        orderBy("name"),
        startAt(previousCursor),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(resultsQuery);
      const newLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPreviousPages((prev) => prev.slice(0, -1));
      setResults(newLocations);
      setFirstVisible(querySnapshot.docs[0]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setCurrentPage((prev) => prev - 1);
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
          <PlaceCard
            key={location.id}
            id={location.id}
            name={location.name}
            address={location.address}
            rating={location.rating}
            imageUrl={location.photos ? location.photos[0]?.url : null} // Use photos array for image
          />
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
