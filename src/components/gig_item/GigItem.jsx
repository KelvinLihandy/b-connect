import dummy1 from "../../assets/Gemini_Generated_Image_at3j5bat3j5bat3j.png";
import dummy2 from "../../assets/Gemini_Generated_Image_at3j5fat3j5fat3j.png";
import dummy3 from "../../assets/Gemini_Generated_Image_sgjvdqsgjvdqsgjv.png";
import dummy4 from "../../assets/Gemini_Generated_Image_zhjybwzhjybwzhjy.png";
import { imageShow } from '../../constants/DriveLinkPrefixes';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DynamicStars } from "../dynamic_stars/DynamicStars";
import { useEffect, useState } from "react";
import arrow_right from '../../assets/arrow_right.svg'
import mr_pink_hair from '../../assets/mr_pink_hair.svg'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
  return (price ?? 0).toLocaleString(locale, {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
  });
};

const GigItem = ({ data, home = false, start = 0, end = 6, starter = false }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();
  const [fallbackMap, setFallbackMap] = useState({});

  useEffect(() => {
    if (data?.length > 0) {
      const fallbacks = [dummy1, dummy2, dummy3, dummy4];
      const randomFallbacks = {};
      data.forEach(gig => {
        const randomIndex = Math.floor(Math.random() * fallbacks.length);
        randomFallbacks[gig._id] = fallbacks[randomIndex];
      });
      setFallbackMap(randomFallbacks);
    }
  }, [data]);


  return (
    <>
      {data?.length > 0 ?
        <>
          {starter && (
            <div className="flex flex-col">
              <motion.div
                className="bg-white h-auto md:h-58 rounded-xl shadow-sm overflow-hidden relative group border-2 border-gray-100 hover:border-black hover:shadow-lg transition-all duration-200"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-58 p-3 flex flex-col justify-between relative">
                  <p className='font-Archivo font-bold text-2xl md:text-4xl text-gray-800 w-full md:w-1/2'>
                    Our Best Sellers
                  </p>
                  <motion.img
                    className='absolute right-8 bottom-10 hidden md:block'
                    src={mr_pink_hair}
                    alt="mr pink hair"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ maxHeight: '140px', pointerEvents: 'none', userSelect: 'none' }}
                  />
                  <motion.button
                    className='bg-[#CFD2DA] flex flex-row w-full md:w-57 gap-4 justify-center p-3 rounded-md hover:bg-[#2E90EB] hover:text-white transition-all duration-300 mb-5 relative z-10'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/catalog")}
                  >
                    <p className='font-Archivo text-2xl md:text-3xl font-bold text-[#565E6D]'>
                      Shop Now
                    </p>
                    <motion.img
                      src={arrow_right}
                      alt="arrow right"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.button>
                </div>
              </motion.div>
              <div className="h-auto md:h-42" />
            </div>
          )}
          {
            data.slice(start, end).map((gig, i) => {
              const fallbackImage = fallbackMap[gig._id];
              const imageSrc =
                !gig.images[0] || gig.images[0] === "temp"
                  ? fallbackImage
                  : `${imageShow}${gig.images[0]}`;

              return (
                <motion.div
                  key={gig._id}
                  className="bg-white h-full rounded-xl shadow-sm overflow-hidden relative group border-2 border-gray-100 hover:border-black hover:shadow-lg transition-all duration-200 flex flex-col"
                  variants={cardVariants}
                  custom={i}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/detail/${gig._id}`)}
                >
                  <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                    <motion.img
                      src={imageSrc}
                      alt={gig.name}
                      className="absolute top-0 left-0 w-full h-full object-cover bg-black"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onLoad={() => {
                        setImageLoading(false);
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                  </div>

                  <div className="p-3 md:p-4 flex flex-col flex-grow">
                    <h3 className="text-sm md:text-base font-medium mb-2 line-clamp-2 flex-grow">
                      {gig.name}
                    </h3>
                    <div className="flex-col items-center mb-2">
                      <p className="text-base font-semibold text-black">
                        Rp. {formattedPrice(gig.packages[0].price)}
                      </p>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm w-full justify-between mb-3">
                      <div className="flex flex-row items-center gap-1 sm:gap-2">
                        <div className="flex flex-row">
                          <DynamicStars number={gig.rating} />
                        </div>
                        <div>{gig.rating}</div>
                      </div>
                      <div className="ml-1 text-gray-500">{gig.sold} sold</div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {Array.isArray(gig.categories) ? (
                        gig.categories.slice(0, 2).map((cat, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {'No Category'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          }
        </>
        :
        <>
          <motion.div
            className={`text-center font-Archivo text-black font-semibold text-lg sm:text-xl py-10 ${!home && "w-full"} col-span-full`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            There are currently no gigs with this specification.
          </motion.div>
        </>
      }
    </>
  )
}

export default GigItem;