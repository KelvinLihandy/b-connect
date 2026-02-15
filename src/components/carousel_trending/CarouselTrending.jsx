import React, { useContext, useEffect, useState } from 'react'
import { DynamicStars } from '../dynamic_stars/DynamicStars';
import arrow_right from '../../assets/arrow_right.svg'
import { AnimatePresence, motion } from 'framer-motion';
import default_avatar from '../../assets/default-avatar.png'
import { imageShow } from '../../constants/DriveLinkPrefixes';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const CarouselTrending = ({ data }) => {
  const itemsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalIndex = Math.ceil(data?.length / itemsPerPage);
  const [loadingImages, setLoadingImages] = useState({});
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const handleIndexChange = (newIndex) => {
    const dir = newIndex > currentIndex ? 1 : -1;
    setDirection(dir);
    setCurrentIndex(newIndex);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  const currentItems = data?.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  useEffect(() => {
    if (data?.length === 0) return;
    let interval;
    interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [data?.length]);

  useEffect(() => {
    if (!currentItems) return;
    const initialLoadingState = {};
    currentItems.forEach(partner => {
      initialLoadingState[partner.id] = true;
    });
    setLoadingImages(initialLoadingState);
  }, [currentIndex, data]);

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  return (
    <>
      <div className='flex flex-col md:flex-row gap-4 md:gap-5 h-auto md:h-64 overflow-x-hidden'>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row gap-4 w-full"
          >
            {currentItems?.map((partner) => (
              <div
                className='w-full md:w-1/3 flex flex-row justify-between items-center p-4 bg-gradient-to-b from-[#2D4F76] via-[#217A9D] via-70% to-[#21789B] rounded-2xl shadow-[7px_8px_10px_rgba(0,0,0,0.25)]'
                key={partner._id}
              >
                <div className='flex flex-col gap-3'>
                  <div>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-semibold'>{partner.name.split(/ (.+)/)[0]}</p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-semibold'>{partner.name.split(/ (.+)/)[1] ? partner.name.split(/ (.+)/)[1] : "\u00A0"}</p>
                  </div>
                  <div className='flex flex-row gap-1 items-center'>
                    <DynamicStars number={partner.rating} />
                    <div className='flex flex-row'>
                      <p className='text-lg sm:text-xl font-inter mx-1'>{partner.rating}</p>
                      <p className='text-lg sm:text-xl font-inter'>({partner.reviews})</p>
                    </div>
                  </div>
                  <div className='flex flex-row font-inter gap-2 items-center'>
                    <p className='text-base sm:text-lg'>{partner.type[0]}</p>
                    <img className='cursor-pointer w-6 h-6'
                      src={arrow_right}
                      alt="arrow right"
                      onClick={() => { navigate(`/freelancer-profile/${partner._id}`) }}
                    />
                  </div>
                </div>
                <div className='w-32 h-32 sm:w-40 sm:h-40 md:w-50 md:h-50 ml-auto bg-blue-300 flex items-center justify-center rounded-lg overflow-hidden'>
                  <div className="w-full h-full aspect-square">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        !partner.picture || partner.picture === "temp"
                          ? default_avatar
                          : `${imageShow}${partner.picture}`
                      }
                      alt="picture"
                      onLoad={() => handleImageLoad(partner.id)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = default_avatar;
                        console.log("image user", partner._id, "fail load")
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex flex-row gap-3 md:gap-5 pt-8 justify-center'>
        {totalIndex > 1 && (
          Array.from({ length: totalIndex }, (_, index) => (
            <button
              key={index}
              className={`${currentIndex === index ? 'bg-[#1E88E5]' : 'bg-[#9D9D9D]'
                } rounded-full w-10 h-2 sm:w-16 sm:h-3 md:w-20 md:h-4`}
              onClick={() => handleIndexChange(index)}
            />
          ))
        )}
      </div>
    </>
  )
}

export default CarouselTrending;