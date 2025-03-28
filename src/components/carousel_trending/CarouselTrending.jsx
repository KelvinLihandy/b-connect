import React, { useState } from 'react'
import { DynamicStars } from '../dynamic_stars/DynamicStars';
import arrow_right from '../../assets/arrow_right.svg'

const CarouselTrending = ({ trendingData }) => {
  const itemsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalIndex = Math.ceil(trendingData.length / itemsPerPage);

  return (
    <>
      <div className='flex flex-row gap-5 h-64'>
        {trendingData.slice(currentIndex * itemsPerPage, currentIndex * itemsPerPage + itemsPerPage).map((partner) => (
          <div className='w-md flex flex-row justify-around items-center p-4 bg-gradient-to-b from-[#2D4F76] via-[#217A9D] via-70% to-[#21789B] rounded-2xl shadow-[7px_8px_10px_rgba(0,0,0,0.25)]'
            key={partner.id || index}
          >
            <div className='flex flex-col gap-3'>
              <div>
                <p className='text-4xl font-semibold'>
                  {partner.firstName}
                </p>
                <p className='text-4xl font-semibold'>
                  {partner.lastName}
                </p>
              </div>
              <div className='flex flex-col'>
                <DynamicStars number={partner.rating} />
                <p className='text-xl font-inter mx-1'>
                  {partner.rating}
                </p>
                <p className='text-xl font-inter'>
                  ({partner.raters})
                </p>
              </div>
              <div className='flex flex-row font-inter gap-2'>
                <p className='text-lg'>
                  {partner.role}
                </p>
                <img src={arrow_right}
                  alt="arrow right"
                />
              </div>
            </div>
            <div className='max-w-60 ml-auto'>
              <img className='max-50 max-w-60'
                src={partner.picture}
                alt="picture" />
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-row gap-5 pt-15'>
        {totalIndex > 0 && (
          Array.from({ length: totalIndex }, (_, index) => (
            <button className={`${currentIndex === index ? 'bg-[#1E88E5]' : 'bg-[#9D9D9D]'} rounded-full w-23 h-5`}
              onClick={() => setCurrentIndex(index)}
            />
          ))
        )}
      </div>
    </>
  )
}

export default CarouselTrending