import React from 'react'
import { Star } from 'lucide-react';

export const DynamicStars = ({ number }) => {
  if (number > 5) number = 5;
  return (
    <div className='flex flex-row'>
      {Array(5)
        .fill()
        .map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4"
            fill={i < Math.floor(number) ? "#FFD700" : "#D1D5DB"}
            stroke={i < Math.floor(number) ? "#FFD700" : "#D1D5DB"}
          />
        ))}
    </div>

  )
}
