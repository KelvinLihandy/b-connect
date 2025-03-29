import React from 'react'
import star from '../../assets/star.svg'
import star_black from '../../assets/star_black.svg'

export const DynamicStars = ({ number, type }) => {
  if (number > 5) number = 5;
  const wholeNumber = Math.floor(number);
  return (
    <div className='flex flex-row'>
      {type == null && Array.from({ length: wholeNumber }, () => (
        <img src={star}
          alt="*"
        />
      ))}
      {type === "service" && (
        <>
          {Array.from({ length: wholeNumber }).map(() => (
            <img src={star_black}
              alt="*"
            />
          ))}

          {Array.from({ length: 5 - wholeNumber }).map(() => (
            <img className="opacity-50"
              src={star_black}
              alt="*"
            />
          ))}
        </>
      )}
    </div>
  )
}
