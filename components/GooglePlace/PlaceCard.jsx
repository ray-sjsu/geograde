import React from 'react'
import Image from 'next/image'
import StarRatingDisplay from '../StarRatingDisplay'

const BASE_URL_PHOTO =""

function PlaceCard({place}) {
  return (
    <div className="card card-compact bg-neutral rounded-xl">
        <figure>
            <Image 
                src="https://fastly.picsum.photos/id/1060/536/354.jpg?blur=2&hmac=0zJLs1ar00sBbW5Ahd_4zA6pgZqCVavwuHToO6VtcYY" 
                alt="placeholder"
                width={200}
                height={80}
                className='w-full h-[150px] object-cover'
            />
        </figure>
        <div className='card-body'>
            <h2 className='card-title'> {place.name}</h2>
            <p> ⭐️ {place.rating}</p>
            <h2> {place.formatted_address}</h2>
        </div>
    </div>
  )
}

export default PlaceCard