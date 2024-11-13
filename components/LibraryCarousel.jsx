// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function LibraryCarousel() {
//   const [libraries, setLibraries] = useState([]);
//   const zipCode = '95112'; // San Jose ZIP code

//   useEffect(() => {
//     const fetchCityInfo = async () => {
//       try {
//         // First, get city and state info using Ziptastic API
//         const zipResponse = await axios.get(`http://ZiptasticAPI.com/${zipCode}`);
//         const { city, state } = zipResponse.data;

//         // Then, search for libraries using the TripAdvisor API with the city
//         const libraryResponse = await axios.get('/api/locations/search', {
//           params: {
//             searchQuery: `${city} ${state} library`,
//             language: 'en',
//           },
//         });
//         setLibraries(libraryResponse.data.data); // Assuming response.data.data holds the array of libraries
//       } catch (error) {
//         console.error('Error fetching libraries:', error);
//       }
//     };

//     fetchCityInfo();
//   }, []);

//   return (
//     <section className="space-y-6">
//       <h2 className="ml-3 text-2xl font-semibold">Libraries Near ZIP Code 95112</h2>
//       <div className="relative flex items-center">
//         <div className="carousel carousel-center bg-base-100 rounded-box max-w-screen space-x-4 p-4">
//           {libraries.map((library) => (
//             <div key={library.location_id} className="carousel-item">
//               <div className="card card-compact bg-neutral w-96 shadow-xl mx-2">
//                 <figure>
//                   <img
//                     src={library.photos?.[0]?.images?.medium?.url || 'https://via.placeholder.com/250'}
//                     alt={library.name}
//                     className="rounded-xl"
//                   />
//                 </figure>
//                 <div className="card-body items-center text-center">
//                   <h2 className="card-title">{library.name}</h2>
//                   <p>{library.address_obj?.address_string}</p>
//                   <p>Distance: {parseFloat(library.distance).toFixed(2)} miles</p>
//                   <div className="card-actions">
//                     <a
//                       href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                         library.address_obj.address_string
//                       )}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="btn btn-primary"
//                     >
//                       Get Directions
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
