import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { ChevronLeft, ChevronRight, Clock, RefreshCw, Check, Maximize2, ZoomIn, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { socket } from '../../App';

import dummy1 from "../../assets/Gemini_Generated_Image_at3j5bat3j5bat3j.png";
import dummy2 from "../../assets/Gemini_Generated_Image_at3j5fat3j5fat3j.png";
import dummy3 from "../../assets/Gemini_Generated_Image_sgjvdqsgjvdqsgjv.png";
import dummy4 from "../../assets/Gemini_Generated_Image_zhjybwzhjybwzhjy.png";
import default_avatar from '../../assets/default-avatar.png'
import profile_square from "../../assets/user-profile-square.svg"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { gigAPI, userAPI } from "../../constants/APIRoutes";
import { DynamicStars } from "../../components/dynamic_stars/DynamicStars";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import Contract from "../../components/contract/Contract";
import { DisabledGigsContext } from "../../contexts/DisabledGigsContext";

const Detail = () => {
  const { auth } = useContext(AuthContext);
  const { disabledGigs } = useContext(DisabledGigsContext);
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [imageMode, setImageMode] = useState("cover"); // cover or contain
  const [activePackage, setActivePackage] = useState(0);
  const [gigDetail, setGigDetail] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [images, setImages] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const detailScrollUp = useRef(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isOwnGig, setIsOwnGig] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [randomDummy, setRandomDummy] = useState(null);
  const dummyImages = [
    dummy1,
    dummy2,
    dummy3,
    dummy4
  ];
  useEffect(() => {
    setRandomDummy(dummyImages[Math.floor(Math.random() * dummyImages.length)]);
  }, [])

  useEffect(() => {
    const reasons = disabledGigs[gigId];
    if (reasons && reasons.length > 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [disabledGigs, gigId]);

  const getReasonText = () => {
    const reasons = disabledGigs[gigId];
    if (!reasons || reasons.length === 0) {
      return "";
    }
    if (reasons.includes("contract-in-progress")) {
      return "Contract in progress";
    } else if (reasons.includes("transaction-pending")) {
      return "Transaction pending";
    } else {
      return reasons.join(", ");
    }
  };
  const reasonText = getReasonText();

  const getDetail = async () => {
    try {
      const response = await axios.post(`${gigAPI}/get-gig/${gigId}`);
      const res = response.data;
      setGigDetail(res.detail);
      setReviews(res.reviews)
      console.log("detail", res);
    } catch (error) {
      console.error('Error fetching detail:', error.response || error);
    }
  }
  const getFreelancer = async () => {
    try {
      const response = await axios.post(`${userAPI}/get-freelancer-data/${gigDetail?.creator}`, {});
      const res = response.data.freelancer;
      if (res._id === auth?.data?.auth?.id) {
        setIsOwnGig(true);
        setIsDisabled(true);
      }
      setFreelancer(res);
      console.log("freelancer", res);
    } catch (error) {
      console.error('Error fetching freelancer:', error.response || error);
    }
  }

  const initiateChat = () => {
    if (!auth) {
      navigate("/sign-in");
      return;
    };
    socket.emit("create_room", [auth?.data?.auth?.id, gigDetail?.creator]);
    socket.on("switch_room", (url) => {
      navigate(url);
    })
  }

  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    if (gigDetail?.creator) {
      getFreelancer();
    }
    if (gigDetail?.images) {
      setImages(gigDetail?.images);
    }
  }, [gigDetail]);

  useEffect(() => {
    let interval;
    if (isAutoplay) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrentImage((prev) => (prev + 1) % images?.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, images?.length]);

  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  const nextImage = () => {
    setDirection(1);
    setCurrentImage((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImage((prev) => (prev === 0 ? images?.length - 1 : prev - 1));
  };

  const slideVariants = {
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

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 }
  };

  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    });
  };

  const ProgressIndicator = ({ current, total }) => {
    return (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {[...Array(total)].map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentImage ? 1 : -1);
              setCurrentImage(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${index === current
              ? "w-8 bg-blue-500"
              : "w-2 bg-white bg-opacity-60 hover:bg-opacity-100"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={detailScrollUp}
    >
      <Navbar alt />

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8 mt-27">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - takes 8/12 of the grid on large screens */}
          <div className="lg:col-span-8">
            {/* Title and Rating */}
            <h1 className="text-4xl font-bold text-gray-800">
              {gigDetail?.name}
            </h1>
            <div className="flex items-center mt-2 mb-6 text-lg font-bold">
              <span className="font-bold text-gray-700 mr-2">
                {Array.isArray(gigDetail?.categories) ? (
                  gigDetail.categories.map((cat, index) => (
                    <span key={index} className="">
                      {cat}
                      {index < gigDetail.categories.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  <span className="">
                    {'No Registered Category'}
                  </span>
                )}
              </span>
              <span className="px-2">|</span>
              <div className="flex text-yellow-400">
                <DynamicStars number={gigDetail?.rating} type={"service"} />
              </div>
              <span className="text-yellow-500 ml-1">
                {gigDetail?.rating}
              </span>
              <span className="text-gray-500 ml-1 font-medium">
                ({gigDetail?.reviewCount})
              </span>
            </div>
            <div
              className="relative mb-6 rounded-lg overflow-hidden bg-gray-100 h-150 shadow-lg"
              onMouseEnter={() => {
                handleMouseEnter();
              }}
              onMouseLeave={() => {
                handleMouseLeave();
              }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImage}
                  className="absolute inset-0 bg-gray-900/5"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                >
                  <img
                    src={`${imageShow}${images[currentImage]}`}
                    alt={`Logo Design Preview ${currentImage + 1}`}
                    className={`w-full h-full object-${imageMode} transition-all duration-300`}
                    style={{
                      backgroundColor: '#f9fafb',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = randomDummy;
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons with hover effects */}
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-80 hover:opacity-100 hover:scale-110 transition-all z-10"
                onClick={prevImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-80 hover:opacity-100 hover:scale-110 transition-all z-10"
                onClick={nextImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={24} />
              </motion.button>
              <ProgressIndicator current={currentImage} total={images?.length} />
            </div>

            {/* Thumbnail Images with active state */}
            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
              {images?.map((thumb, index) => (
                <motion.div
                  key={index}
                  className={`border-2 rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${index === currentImage
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                  onClick={() => {
                    setDirection(index > currentImage ? 1 : -1);
                    setCurrentImage(index);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={`${imageShow}${thumb}`}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-24 h-16 object-cover ${index !== currentImage ? 'opacity-70 hover:opacity-100' : ''
                      } transition-opacity`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = randomDummy;
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="border-t my-6">
              <h2 className="text-xl font-bold my-2">Description</h2>
              <p className="text-gray-700 font-medium">
                {gigDetail?.description}
              </p>
            </div>
            <div className="border-t my-6">
              <h2 className="text-xl font-bold my-2">Workflow Overview</h2>
              <div className="flex flex-col gap-1">
                {gigDetail?.workflow?.map((flows, index) => (
                  <h3 className="font-bold text-lg">
                    {index + 1}. {flows}
                  </h3>
                ))}
              </div>
            </div>
            <div className="border-t my-6 h-40">
              <h2 className="text-xl font-bold my-2">Freelancer Profile</h2>
              <div className="flex gap-3 h-26"
                onClick={() => { navigate(`/freelancer-profile/${freelancer?._id}`) }}
              >
                <div className="w-20 h-full flex items-center justify-center">
                  <img
                    className="w-20 h-20 rounded-full object-cover"
                    src={
                      !freelancer?.picture || freelancer?.picture === "temp"
                        ? default_avatar
                        : `${imageShow}${freelancer?.picture}`
                    }
                    alt="freelancer"
                    onLoad={() => setIsImageLoading(false)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = default_avatar;
                      console.log("Image load failed for freelancer:", freelancer?._id);
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center gap-1 py-3">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <img src={profile_square} alt="profile" className="w-6 h-6" />
                    {freelancer?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xl">
                    <DynamicStars number={freelancer?.rating} />
                    <span className="text-yellow-400 font-bold">{freelancer?.rating}</span>
                    <span className="text-gray-500">({freelancer?.reviews} Reviews)</span>
                  </div>
                  <p className="text-gray-700 text-lg flex gap-2 items-center">
                    <Clock size={20} className="" />
                    Member since {new Date(freelancer?.joinedDate).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t my-6">
              <p className="text-gray-700 my-2 font-medium text-base">
                {freelancer?.description?.trim()
                  ? freelancer.description
                  : `${freelancer?.name} has not set a description`
                }
              </p>
            </div>
            <div className="border-t mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold my-2">Reviews</h2>
              </div>
              {reviews?.length <= 0 ?
                (
                  <div>
                    <p>No review is currently available for this gig</p>
                  </div>
                )
                :
                (
                  <div className="flex flex-col gap-2 overflow-y-auto h-105">
                    {reviews?.map((review) => (
                      <div
                        key={review._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 w-full"
                      >
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 font-semibold border">
                              <img
                                className="w-full h-full rounded-full object-cover"
                                src={
                                  !review?.reviewerPicture || review?.reviewerPicture === "temp"
                                    ? default_avatar
                                    : `${imageShow}${review?.reviewerPicture}`
                                }
                                alt="reviewer"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = default_avatar;
                                  console.log("Image load failed for reviewer:", review.reviewerName);
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <div className="text-sm font-medium mr-2">
                                  {review.reviewerName}
                                  <div className="flex gap-3">
                                    <DynamicStars number={review.rating} />
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-lg text-gray-700 mt-2">{review.reviewMessage}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Right column - takes 4/12 of the grid on large screens */}
          <div className="lg:col-span-4">
            <div className="sticky top-35">
              {/* Pricing Tabs & Card */}
              <div className="border rounded-lg shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex">
                  {gigDetail?.packages.map((pkg, index) => (
                    <motion.button
                      className={`flex-1 py-3 text-center font-medium transition-colors duration-300 ${activePackage == index
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                        }`}
                      onClick={() => setActivePackage(index)}
                      whileTap={{ scale: 0.98 }}
                    >
                      {pkg?.type}
                    </motion.button>
                  ))}
                </div>

                {/* Pricing Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePackage._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-row justify-between">
                        <h3 className="text-3xl font-bold font-inter">Rp. {formattedPrice(gigDetail?.packages[activePackage]?.price)}</h3>
                      </div>
                      <div className="text-gray-600 text-sm mt-3 border-t">
                        <div className="flex items-start gap-2 mt-4">
                          <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                          <span>Jumlah Batas Konsep: {gigDetail?.packages[activePackage]?.conceptLimit} Hari</span>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                          <span>Durasi Pengerjaan: {gigDetail?.packages[activePackage]?.workDuration} Hari</span>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                          <span>Jumlah Batas Revisi: {gigDetail?.packages[activePackage]?.revisionLimit} Kali</span>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          <Check className={`${gigDetail?.packages[activePackage]?.sourceFile ? "text-green-500" : "text-gray-500"} mt-0.5 flex-shrink-0`} size={16} />
                          <span>Source File</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <motion.button
                    disabled={isDisabled}
                    className={`w-full mt-6 py-3 px-4 rounded-md font-medium flex items-center justify-center cursor-pointer text-white 
                      ${isDisabled ? 'bg-gray-600 hover:bg-gray-800' : 'bg-blue-700 hover:bg-blue-800'}`}
                    whileHover={isDisabled ? {} : { scale: 1.02 }}
                    whileTap={isDisabled ? {} : { scale: 0.98 }}
                    onClick={() => {
                      if (isDisabled) {
                        // navigate()
                        // nav to history order
                        return;
                      }
                      if (!auth) {
                        navigate("/sign-in");
                        return;
                      }
                      setShowContractModal(true);
                    }}
                  >
                    {isOwnGig ? "This is your gig" : isDisabled ? reasonText : "Continue"}
                    {!isOwnGig && <ChevronRight size={18} className="ml-1" />}
                  </motion.button>

                  {!isOwnGig &&
                    <motion.button
                      className="w-full mt-3 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-md font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => initiateChat()}
                    >
                      Contact B-Partner
                    </motion.button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer refScrollUp={detailScrollUp} />

      <Contract
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        gigId={gigId}
        packages={gigDetail?.packages}
      />
    </div >
  );
};

export default Detail;