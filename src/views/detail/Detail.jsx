import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { ChevronLeft, ChevronRight, Clock, RefreshCw, Check, Maximize2, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { socket } from '../../App';

// Import images directly
import profileReview1 from "../../assets/profileReview1.png";
import profileReview2 from "../../assets/profileReview2.png";
import profileReview3 from "../../assets/profileReview3.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { gigAPI, userAPI } from "../../constants/APIRoutes";
import { DynamicStars } from "../../components/dynamic_stars/DynamicStars";
import { imageShow } from "../../constants/DriveLinkPrefixes";

const Detail = () => {
  const { auth } = useContext(AuthContext);
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [imageMode, setImageMode] = useState("cover"); // cover or contain
  const [activePackage, setActivePackage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZoomOverlay, setShowZoomOverlay] = useState(false);
  const [gigDetail, setGigDetail] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [images, setImages] = useState([]);
  const detailScrollUp = useRef(null);
  console.log("detail", gigDetail)
  const getDetail = async () => {
    try {
      const response = await axios.post(`${gigAPI}/get-gig/${gigId}`, {});
      const res = response.data.detail;
      setGigDetail(res);
      setImages(res.image);
      console.log("detail", res);
    } catch (error) {
      console.error('Error fetching detail:', error.response || error);
      navigate("/catalog");
    }
  }

  const getFreelancer = async () => {
    try {
      const response = await axios.post(`${userAPI}/get-user/${gigDetail?.creator}`, {});
      const res = response.data.user;
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
  }, [gigDetail]);

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (isAutoplay && !isFullscreen) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrentImage((prev) => (prev + 1) % images?.length);
      }, 5000); // Change image every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoplay, images?.length, isFullscreen]);

  // Pause autoplay on hover
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

  // Toggle between cover and contain modes for images
  const toggleImageMode = () => {
    setImageMode(prev => prev === "cover" ? "contain" : "cover");
  };

  // Toggle fullscreen mode for the carousel
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    setIsAutoplay(false);
  };

  // Animation variants for the carousel
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

  // Zoom animation for fullscreen mode
  const fullscreenVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  // Transition settings for smooth animation
  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 }
  };

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: "Siti warlok",
      rating: 4.3,
      comment: "Sangat direkomendasikan! Adam bekerja dengan detail dan memberikan hasil yang sangat memuaskan.",
      daysAgo: 2
    },
    {
      id: 2,
      name: "Mandela",
      rating: 4.3,
      comment: "Desain logonya sangat elegant dan sesuai dengan branding bisnis saya. Terima kasih, Adam!",
      daysAgo: 3
    },
    {
      id: 3,
      name: "Kevin Zuberi",
      rating: 4.3,
      comment: "Revisi dilakukan dengan cepat dan tepat. Komunikasinya juga sangat baik. Highly recommended!",
      daysAgo: 5
    }
  ];

  // Function to get reviewer profile image based on id
  const getReviewerImage = (id) => {
    switch (id) {
      case 1: return profileReview1;
      case 2: return profileReview2;
      case 3: return profileReview3;
      default: return profileReview1;
    }
  };

  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    });
  };

  // Progress indicator for carousel
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

  // Fullscreen image view component
  const FullscreenView = () => {
    if (!isFullscreen) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fullscreenVariants}
        onClick={toggleFullscreen}
      >
        <div className="relative w-full h-full max-w-6xl max-h-screen p-8" onClick={e => e.stopPropagation()}>
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2 z-10"
            onClick={toggleFullscreen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="relative h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentImage}
                src={`${imageShow}${images[currentImage]}`}
                alt={`Logo Design Preview ${currentImage + 1}`}
                className="max-w-full max-h-full object-contain"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              />
            </AnimatePresence>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-0 right-0">
              <ProgressIndicator current={currentImage} total={images?.length} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={detailScrollUp}
    >
      <Navbar alt />

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8 mt-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - takes 8/12 of the grid on large screens */}
          <div className="lg:col-span-8">
            {/* Title and Rating */}
            <h1 className="text-4xl font-bold text-gray-800">
              {gigDetail?.name}
            </h1>
            <div className="flex items-center mt-2 mb-6">
              <span className="font-medium text-gray-700 mr-2">
                {freelancer?.name}
              </span>
              <div className="flex text-yellow-400">
                <DynamicStars number={freelancer?.rating} type={"service"} />
              </div>
              <span className="text-yellow-500 ml-1">
                {freelancer?.rating}
              </span>
              <span className="text-gray-500 ml-1">
                {freelancer?.reviews}
              </span>
            </div>

            {/* Enhanced Animated Carousel */}
            <div
              className="relative mb-6 rounded-lg overflow-hidden bg-gray-100 h-128 shadow-lg"
              onMouseEnter={() => {
                handleMouseEnter();
                setShowZoomOverlay(true);
              }}
              onMouseLeave={() => {
                handleMouseLeave();
                setShowZoomOverlay(false);
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

              {/* Control buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  className="bg-white rounded-full p-2 shadow-md opacity-80 hover:opacity-100 transition-all"
                  onClick={toggleImageMode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={imageMode === "cover" ? "View full image" : "Fill frame"}
                >
                  {imageMode === "cover" ? (
                    <ZoomIn size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </motion.button>
                <motion.button
                  className="bg-white rounded-full p-2 shadow-md opacity-80 hover:opacity-100 transition-all"
                  onClick={toggleFullscreen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="View fullscreen"
                >
                  <Maximize2 size={18} />
                </motion.button>
              </div>

              {/* Zoom overlay */}
              {showZoomOverlay && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={toggleFullscreen}
                >
                  <div className="bg-white bg-opacity-80 rounded-full p-3 shadow-lg">
                    <ZoomIn size={24} className="text-gray-800" />
                  </div>
                </div>
              )}

              {/* Progress indicator dots */}
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
                  />
                </motion.div>
              ))}
            </div>

            {/* Description Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 mb-3">
                {gigDetail?.description}
              </p>
            </div>

            {/* Workflow Section */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Workflow Overview</h2>
              <div className="space-y-4">
                {gigDetail?.workflow.map((flows, index) => (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium">
                      {index + 1}. {flows.flow}
                    </h3>
                    <p className="text-gray-600">
                      {flows.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Freelancer Profile Section */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Freelancer Profile</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={`${imageShow}${freelancer?.picture}`}
                  alt={freelancer?.picture}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{freelancer?.name}</h3>
                    <div className="flex items-center ml-2">
                      <span className="text-yellow-400 font-semibold">
                        {freelancer?.rating}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({freelancer?.reviews} Reviews)
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-md flex items-center">
                    <Clock size={14} className="mr-1" />
                    Member since {new Date(freelancer?.joinedDate).getFullYear()}
                  </p>
                  <p className="mt-2 text-gray-700">
                    {freelancer?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-gray-100">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={getReviewerImage(review.id)}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{review.name}</h3>
                        <div className="flex items-center text-yellow-400">
                          <DynamicStars number={review.rating}/>
                          <span className="ml-1 text-gray-700">{review.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{review.daysAgo} days ago</p>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - takes 4/12 of the grid on large screens */}
          <div className="lg:col-span-4">
            <div className="sticky top-30">
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
                        <h3 className="font-medium uppercase">{gigDetail?.packages[activePackage]?.name}</h3>
                        <h3>Rp. {formattedPrice(gigDetail?.packages[activePackage]?.price)}</h3>
                      </div>
                      <p className="text-xl font-bold mt-1">{gigDetail?.packages[activePackage]?.description}</p>

                      <div className="text-gray-600 text-sm mt-3">
                        {Array.isArray(gigDetail?.packages?.[activePackage]?.description) &&
                          gigDetail.packages[activePackage].description.map((desc, idx) => (
                            <p key={idx} className={idx > 0 ? "mt-1" : ""}>
                              {desc}
                            </p>
                          ))}

                      </div>

                      <div className="flex flex-wrap mt-4 gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Clock size={16} />
                          {gigDetail?.packages[activePackage]?.deliveryDay} Days Delivery
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <RefreshCw size={16} />
                          {gigDetail?.packages[activePackage]?.revision}
                        </div>
                      </div>

                      {/* Feature List */}
                      <ul className="space-y-2 text-gray-700 mt-4">
                        {gigDetail?.packages[activePackage]?.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>

                  {/* Buttons */}
                  <motion.button
                    className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                    <ChevronRight size={18} className="ml-1" />
                  </motion.button>

                  <motion.button
                    className="w-full mt-3 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-md font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => initiateChat()}
                  >
                    Contact B-Partner
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer refScrollUp={detailScrollUp} />

      {/* Fullscreen view modal */}
      <AnimatePresence>
        {isFullscreen && <FullscreenView />}
      </AnimatePresence>
    </div>
  );
};

export default Detail;