"use client";
import { useRouter } from "next/navigation";
import Link from 'next/link'
import React from 'react';
import { useState, useEffect } from "react";

//keep in mind these dynamically changed since i debugged this from only including explicit filters
const Browse = () => {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState("");
  const [categories, setCategories] = useState({
    coffeeAndTea: false,
    library: false,
    bookstore: false,
  });

  const [preferences, setPreferences] = useState({
    outdoors: false,
    indoors: false,
    outlets: false,
    wifi: false,
    seating: false,
  });

  //btw this defaults to level 5 so slide down to make quieter
  const [noiseLevel, setNoiseLevel] = useState(5); 
  const [spots, setSpots] = useState([]);

  ///////////////////these are hardcoded for now, will pull from tripadvisor or firebase later ///////////////////////
  const hardcodedSpots = [
    { name: "Nirvana Soul", 
      city: "San Jose", 
      rating: 5, 
      description: "Great atmosphere for study, but pretty loud.", 
      category: "coffeeAndTea", 
      preferences: ["wifi", "seating"], 
      noiseLevel: 3 },

    { name: "MLK Library", 
      city: "Palo Alto", 
      rating: 4, 
      description: "Quiet and spacious. Is frequently busy though.", 
      category: "library", 
      preferences: ["indoors", "outlets"], 
      noiseLevel: 1 },

    { name: "Barnes and Nobles", 
      city: "Fremont", 
      rating: 4, 
      description: "Cozy bookstore with reading nooks.", 
      category: "bookstore", 
      preferences: ["seating", "wifi"], 
      noiseLevel: 2 },
  ];

  useEffect(() => {
    //dynamically updates filler or query changes
      const filteredSpots = hardcodedSpots.filter(spot => {
      const matchesQuery = spot.name.toLowerCase().includes(query.toLowerCase());

      //filter by city if applied
      const matchesCity = !city || spot.city === city;

      //filter by rating if specified
      const matchesRating = !rating || spot.rating >= rating;

      //filter by categories if one is selected
      const categorySelected = Object.values(categories).some(selected => selected);
      const matchesCategory = !categorySelected || categories[spot.category];

      //filter by preferences if one is selected
      const preferenceSelected = Object.values(preferences).some(selected => selected);
      const matchesPreferences = !preferenceSelected || Object.keys(preferences).every(pref => !preferences[pref] || spot.preferences.includes(pref));

      //filter if changed from default 5
      const matchesNoiseLevel = spot.noiseLevel <= noiseLevel;

      //combine the conditions but allow for space if filters not set,, i think this should fix the too specific problem
      return matchesQuery && matchesCity && matchesRating && matchesCategory && matchesPreferences && matchesNoiseLevel;
    });

    setSpots(filteredSpots);
  }, [query, city, rating, categories, preferences, noiseLevel]);

  ///=================================keep in mind that this is the setting where all options are displayed
  ///======================================before being filtered
  const handleCategoryChange = (category) => {
    setCategories({ ...categories, [category]: !categories[category] });
  };

  const handlePreferenceChange = (preference) => {
    setPreferences({ ...preferences, [preference]: !preferences[preference] });
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      <div className="bg-gray-800 p-6 w-1/4 space-y-4">
        <h1 className="text-white text-2xl mb-5">Filter Study Spots</h1>

        {/*Search by name, dont need to search by details bc of filters*/}
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />

        {/*city filter*/}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white"
        >
          <option value="">Select City</option>
          <option value="San Jose">San Jose</option>
          <option value="Palo Alto">Palo Alto</option>
          <option value="Fremont">Fremont</option>
        </select>

        {/*spot ratings*/}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white"
        >
          <option value="">Select Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
        </select>

        {/*categories*/}
        <div className="text-white">
          <h2 className="mb-2">Category</h2>
          <div>
            <input
              type="checkbox"
              id="coffeeAndTea"
              checked={categories.coffeeAndTea}
              onChange={() => handleCategoryChange("coffeeAndTea")}
            />
            <label htmlFor="coffeeAndTea" className="ml-2">Coffee and Tea</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="library"
              checked={categories.library}
              onChange={() => handleCategoryChange("library")}
            />
            <label htmlFor="library" className="ml-2">Library</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="bookstore"
              checked={categories.bookstore}
              onChange={() => handleCategoryChange("bookstore")}
            />
            <label htmlFor="bookstore" className="ml-2">Bookstore</label>
          </div>
        </div>

        {/*preferences/amenities*/}
        <div className="text-white">
          <h2 className="mb-2">Preferences</h2>
          <div>
            <input
              type="checkbox"
              id="outdoors"
              checked={preferences.outdoors}
              onChange={() => handlePreferenceChange("outdoors")}
            />
            <label htmlFor="outdoors" className="ml-2">Outdoors</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="indoors"
              checked={preferences.indoors}
              onChange={() => handlePreferenceChange("indoors")}
            />
            <label htmlFor="indoors" className="ml-2">Indoors</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="outlets"
              checked={preferences.outlets}
              onChange={() => handlePreferenceChange("outlets")}
            />
            <label htmlFor="outlets" className="ml-2">Outlets</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="wifi"
              checked={preferences.wifi}
              onChange={() => handlePreferenceChange("wifi")}
            />
            <label htmlFor="wifi" className="ml-2">WiFi</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="seating"
              checked={preferences.seating}
              onChange={() => handlePreferenceChange("seating")}
            />
            <label htmlFor="seating" className="ml-2">Seating</label>
          </div>
        </div>

        {/*Noise slider*/}
        <div className="text-white">
          <h2 className="mb-2">Noise Level</h2>
          <input
            type="range"
            min="1"
            max="5"
            value={noiseLevel}
            onChange={(e) => setNoiseLevel(e.target.value)}
            className="w-full"
          />
          <p className="text-center">{noiseLevel}</p>
        </div>
      </div>

      {/*results panel*/}
      <div className="bg-gray-800 p-6 w-3/4">
        {spots.length > 0 ? (
          spots.map((spot, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg mb-4">
              <h3 className="text-white text-xl">{spot.name}</h3>
              <p className="text-gray-400">City: {spot.city}</p>
              <p className="text-gray-400">Rating: {spot.rating} Stars</p>
              <p className="text-gray-400">{spot.description}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No study spots found.</p>
        )}
      </div>
    </div>
  );
};

export default Browse;