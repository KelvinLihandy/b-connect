import React from 'react'
import heart from '../../assets/heart.svg'
import { DynamicStars } from '../dynamic_stars/DynamicStars';
import product1 from "../../assets/image.png";
import { imageShow } from '../../constants/DriveLinkPrefixes';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import arrow_right from '../../assets/arrow_right.svg'
import mr_pink_hair from '../../assets/mr_pink_hair.svg'

const GigItem = ({ data }) => {
  const navigate = useNavigate();
  console.log("data", data);
  return (
    <>
      {data?.length > 0 ?
        <>
          <motion.div
            className="w-sm flex flex-row h-70 font-inter bg-gradient-to-br from-[#F3F3F3] to-[#E6E6E6] relative items-center rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className='flex flex-row items-center justify-center p-3'>
              <p className='text-wrap font-Archivo font-bold text-3xl self-start -mt-4 text-gray-800'>
                Our Best Sellers
              </p>
              <motion.img
                className='-mt-10'
                src={mr_pink_hair}
                alt="mr pink hair"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <motion.button
              className='bg-[#CFD2DA] flex flex-row absolute bottom-20 w-57 left-3 gap-4 justify-center p-3 rounded-md hover:bg-[#2E90EB] hover:text-white transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/catalog")}
            >
              <p className='font-arvo text-3xl font-bold text-[#565E6D]'>
                Shop Now
              </p>
              <motion.img
                src={arrow_right}
                alt="arrow right"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
          {
            data.map((serv) => {
              const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
                return (price ?? 0).toLocaleString(locale, {
                  minimumFractionDigits: minFraction,
                  maximumFractionDigits: maxFraction,
                });
              };

              return (
                <div key={serv._id}
                  className="w-sm h-110 font-inter"
                  onClick={() => navigate(`/detail/${serv._id}`)}
                >
                  <div className="overflow-hidden h-70">
                    <img className="w-full h-full object-cover bg-black"
                      src={serv.image[0] === "temp" ? product1 : `${imageShow}${serv.image[0]}`}
                      alt="phone"
                    />
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                    <div className="flex flex-row justify-between">
                      <p className="text-wrap font-Archivo font-bold text-xl max-w-80">{serv.name}</p>
                      <img className="self-end" src={heart} alt="like" />
                    </div>
                    <div className='flex flex-row justify-between'>
                      <p className="font-bold font-inter text-xl">Rp. {formattedPrice(data.minPrice)}</p>
                      <p className="font-bold font-inter text-xl">-</p>
                      <p className="font-bold font-inter text-xl">Rp. {formattedPrice(data.maxPrice)}</p>

                    </div>
                    <div className="flex flex-row justify-between">
                      <DynamicStars number={serv.rating} type="service" />
                      <p className="font-inter text-xs self-center">{serv.sold} items sold</p>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </>
        :
        <>
        
        </>
      }
    </>
  )
}

export default GigItem