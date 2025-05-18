import product1 from "../../assets/image.png";
import { imageShow } from '../../constants/DriveLinkPrefixes';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { DynamicStars } from "../dynamic_stars/DynamicStars";
import { CircularProgress } from '@mui/material'
import { useState } from "react";

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

const GigItem = ({ data, home = false, start = 0, end = 5 }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      {data?.length > 0 ?
        <>
          {
            data.slice(start, end).map((gig, i) => (
              <motion.div
                key={gig._id}
                className="bg-white w-80 h-90 rounded-xl shadow-sm overflow-hidden relative group border-2 border-gray-100 hover:border-black hover:shadow-lg transition-all duration-200"
                variants={cardVariants}
                custom={i}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/detail/${gig._id}`)}
              >
                {/* Product Image with hover effect */}
                <div className="relative ">
                  {imageLoading && (
                    <div className="w-full text-center">
                      <CircularProgress color="inherit" size={80} />
                    </div>
                  )}
                  <motion.img
                    src={gig.images[0] == "temp" ? product1 : `${imageShow}${gig.images[0]}`}
                    alt={gig.name}
                    className="w-full h-48 object-cover bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onLoad={() => { setImageLoading(false) }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-5 h-42">
                  <h3 className="text-md font-medium mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-100">
                    {gig.name}
                  </h3>
                  <div className="flex-col items-center mb-2">
                    <p className="text-md font-semibold text-blue-600">
                      Rp. {formattedPrice(gig.packages[0].price)}
                    </p>
                    <p className="text-md font-semibold text-blue-600">
                      Rp. {formattedPrice(gig.packages[gig.packages.length - 1].price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-md w-full justify-between">
                      <div className="flex flex-row items-center gap-3 flex-wrap">
                        <div className="flex flex-row">
                          <DynamicStars number={gig.rating} />
                        </div>
                        <div>{gig.rating}</div>
                      </div>
                      <div className="ml-1 text-gray-500">{gig.sold} items sold</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          }
        </>
        :
        <>
          <motion.div
            className={`text-center font-Archivo text-black font-semibold text-xl py-10 ${!home && "w-297"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            There is currently no gigs with this specification.
          </motion.div>
        </>
      }
    </>
  )
}

export default GigItem