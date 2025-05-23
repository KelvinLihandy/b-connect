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
      <div className='flex flex-row gap-5 h-64'>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex flex-row gap-4 w-full"
          >
            {currentItems?.map((partner) => (
              <div
                className='w-md flex flex-row justify-around items-center p-4 bg-gradient-to-b from-[#2D4F76] via-[#217A9D] via-70% to-[#21789B] rounded-2xl shadow-[7px_8px_10px_rgba(0,0,0,0.25)]'
                key={partner._id}
              >
                <div className='flex flex-col gap-3'>
                  <div>
                    <p className='text-4xl font-semibold'>{partner.name.split(/ (.+)/)[0]}</p>
                    <p className='text-4xl font-semibold'>{partner.name.split(/ (.+)/)[1] ? partner.name.split(/ (.+)/)[1] : "\u00A0"}</p>
                    <p>{console.log(partner.name.split(' '))}</p>
                  </div>
                  <div className='flex flex-row gap-1 items-center'>
                    <DynamicStars number={partner.rating} />
                    <div className='flex flex-row'>
                      <p className='text-xl font-inter mx-1'>{partner.rating}</p>
                      <p className='text-xl font-inter'>({partner.reviews})</p>
                    </div>
                  </div>
                  <div className='flex flex-row font-inter gap-2'>
                    <p className='text-lg'>{partner.type[0]}</p>
                    <img className='cursor-pointer'
                      src={arrow_right}
                      alt="arrow right"
                      onClick={() => { navigate(`/freelancer-profile/${partner._id}`) }}
                    />
                  </div>
                </div>
                <div className='w-50 h-50 ml-auto bg-blue-300 flex items-center justify-center'>
                  <div className="w-full h-full aspect-square overflow-hidden">
                    {/* {loadingImages[partner.id] && (
                      <div className='w-full h-full flex justify-center items-center'>
                        <CircularProgress color="inherit" size={80} />
                      </div>
                    )} */}
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
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex flex-row gap-5 pt-15'>
        {totalIndex > 0 && (
          Array.from({ length: totalIndex }, (_, index) => (
            <button
              key={index}
              className={`${currentIndex === index ? 'bg-[#1E88E5]' : 'bg-[#9D9D9D]'
                } rounded-full w-20 h-5`}
              onClick={() => handleIndexChange(index)}
            />
          ))
        )}
      </div>
    </>
  )
}

export default CarouselTrending