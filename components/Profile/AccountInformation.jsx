 "use client";

import React, { useState, useEffect } from "react";
import { firestore } from "@/app/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "@/app/firebase/config";

const AccountInformation = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      try {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserData(userData);
          setName(userData.name || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateName = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser || !name.trim()) return;

    try {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userDocRef, { name });

      setUserData((prev) => ({ ...prev, name }));
      setEditing(false);
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name. Please try again.");
    }
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Account Information</h1>
      <div className="space-y-4">
        <div>
          <label className="font-semibold text-lg">Name:</label>
          {editing ? (
            <div className="mt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full max-w-md"
              />
              <div className="mt-2">
                <button
                  onClick={handleUpdateName}
                  className="btn btn-primary mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center mt-2">
              <p className="text-lg">{userData?.name || "No name provided"}</p>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-outline btn-sm ml-4"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="font-semibold text-lg">Email:</label>
          <div className="text-lg mt-2">{userData?.email || "No email provided"}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
