import React from 'react'
import PlaceCard from './PlaceCard'

function PlaceList({ placeList }) {
    // Ensure this function does NOT trigger any setState directly during render
    return (
      <div className="px-[10px] md:px-[120px] mt-7">
        <h1 className="text-base-content text-2xl font-semibold">Popular Spots in San Jose</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {placeList.map((place, index) => (
            <div key={index}>
              <PlaceCard place={place} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  

export default PlaceList