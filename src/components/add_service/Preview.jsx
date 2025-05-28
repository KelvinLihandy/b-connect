import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, RefreshCw, Check, Maximize2, ZoomIn, X } from "lucide-react";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import { DynamicStars } from "../dynamic_stars/DynamicStars";
import { AuthContext } from "../../contexts/AuthContext";

const Preview = ({ serviceData, onClose }) => {
  console.log("preview data", serviceData);
  const { title, categories, images, description, packages } = serviceData;
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageMode, setImageMode] = useState("cover");
  const [activePackage, setActivePackage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZoomOverlay, setShowZoomOverlay] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const { auth } = useContext(AuthContext);

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

  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

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

  const previewModalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4 
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 }
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleImageMode = () => {
    setImageMode(prev => prev === "cover" ? "contain" : "cover");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    setIsAutoplay(false);
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
                src={images[currentImage].preview}
                alt={`Preview ${currentImage + 1}`}
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
              <ProgressIndicator current={currentImage} total={images.length} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="relative h-screen"
        variants={previewModalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bg-white w-full h-full shadow-2xl relative">
          <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-center text-red-500 font-Archivo flex-grow">
              ***This is Preview of Your Add Page Progress***
            </h2>
            <div className="flex items-center space-x-2">
              <motion.button
                className="text-gray-500 hover:text-gray-800 p-1"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <div className="h-[calc(100%-64px)] overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <h1 className="text-4xl font-bold text-gray-800">
                    {title || "Service Title"}
                  </h1>
                  <div className="flex items-center mt-2 mb-6 text-lg font-bold">
                    <span className="font-bold text-gray-700 mr-2">
                      {auth?.data?.auth?.name || "Service Provider"}
                    </span>
                    <span className="px-2">|</span>
                    <div className="flex text-yellow-400">
                      <DynamicStars number={0} type={"service"} />
                    </div>
                    <span className="text-yellow-500 ml-1">
                      0
                    </span>
                    <span className="text-gray-500 ml-1 font-medium">
                      (Preview)
                    </span>
                  </div>

                  <div
                    className="relative mb-6 rounded-lg overflow-hidden bg-gray-100 h-150 shadow-lg"
                    onMouseEnter={() => {
                      handleMouseEnter();
                      setShowZoomOverlay(true);
                    }}
                    onMouseLeave={() => {
                      handleMouseLeave();
                      setShowZoomOverlay(false);
                    }}
                  >
                    {images && images.length > 0 ? (
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
                            src={images[currentImage].preview}
                            alt={`Preview ${currentImage + 1}`}
                            className={`w-full h-full object-${imageMode} transition-all duration-300`}
                            style={{
                              backgroundColor: '#f9fafb',
                              objectPosition: 'center'
                            }}
                          />
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No images uploaded</p>
                      </div>
                    )}

                    {images && images.length > 1 && (
                      <>
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
                      </>
                    )}
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
                    {showZoomOverlay && images && images.length > 0 && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={toggleFullscreen}
                      >
                        <div className="bg-white bg-opacity-80 rounded-full p-3 shadow-lg">
                          <ZoomIn size={24} className="text-gray-800" />
                        </div>
                      </div>
                    )}
                    {images && images.length > 1 && (
                      <ProgressIndicator current={currentImage} total={images.length} />
                    )}
                  </div>
                  {images && images.length > 0 && (
                    <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                      {images.map((image, index) => (
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
                            src={image.preview}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-24 h-16 object-cover ${index !== currentImage ? 'opacity-70 hover:opacity-100' : ''
                              } transition-opacity`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="border-t my-6">
                    <h2 className="text-xl font-bold my-2">Description</h2>
                    <p className="text-gray-700 font-medium">
                      {description || "No description provided"}
                    </p>
                  </div>

                  <div className="border-t my-6">
                    <h2 className="text-xl font-bold my-2">Workflow Overview</h2>
                    <div className="flex flex-col gap-1">
                      {serviceData?.workFlows?.map((flow, index) => (
                        <h3 key={index} className="font-bold text-lg">
                          {index + 1}. {flow}
                        </h3>
                      ))}
                      {(!serviceData?.workFlows || serviceData?.workFlows.length === 0) && (
                        <p className="text-gray-500">No workflow steps provided</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="sticky top-35">
                    <div className="border rounded-lg shadow-sm overflow-hidden">
                      <div className="flex">
                        <motion.button
                          className={`flex-1 py-3 text-center font-medium transition-colors duration-300 ${activePackage === 0
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                          onClick={() => setActivePackage(0)}
                          whileTap={{ scale: 0.98 }}
                        >
                          Basic
                        </motion.button>
                        <motion.button
                          className={`flex-1 py-3 text-center font-medium transition-colors duration-300 ${activePackage === 1
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                          onClick={() => setActivePackage(1)}
                          whileTap={{ scale: 0.98 }}
                        >
                          Advance
                        </motion.button>
                      </div>

                      <div className="p-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activePackage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            {activePackage === 0 ? (
                              <div>
                                <div className="flex flex-row justify-between">
                                  <h3 className="text-3xl font-bold font-inter">Rp. {formattedPrice(packages?.basic?.harga || 0)}</h3>
                                </div>
                                <div className="text-gray-600 text-sm mt-3 border-t">
                                  <div className="flex items-start gap-2 mt-4">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                    <span>Jumlah Batas Konsep: {packages?.basic?.konsep || "0"} Konsep</span>
                                  </div>
                                  <div className="flex items-start gap-2 mt-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                    <span>Durasi Pengerjaan: {packages?.basic?.waktu || "0"} Hari</span>
                                  </div>
                                  <div className="flex items-start gap-2 mt-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                    <span>Jumlah Batas Revisi: {packages?.basic?.revisi || "0"} Kali</span>
                                  </div>
                                  <div className="flex items-start gap-2 mt-2">
                                    <Check className={`${packages?.basic?.sourceFile === true ? "text-green-500" : "text-gray-500"} mt-0.5 flex-shrink-0`} size={16} />
                                    <span>Source File</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex flex-row justify-between">
                                  <h3 className="text-3xl font-bold font-inter">Rp. {formattedPrice(packages?.advance?.harga || 0)}</h3>
                                </div>
                                <div className="text-gray-600 text-sm mt-3 border-t">
                                  <div className="flex items-start gap-2 mt-4">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                    <span>Jumlah Batas Konsep: {packages?.advance?.konsep || "0"} Konsep</span>
                                  </div>
                                  <div className="flex items-start gap-2 mt-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                    <span>Durasi Pengerjaan: {packages?.advance?.waktu || "0"} Hari</span>
                                  </div>
                                  <div className="flex items-start gap-2 mt-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                    <span>Jumlah Batas Revisi: {packages?.advance?.revisi || "0"} Kali</span>
                                  </div>
                                  <div className="flex items-start gap-2 mt-2">
                                    <Check className={`${packages?.advance?.sourceFile === true ? "text-green-500" : "text-gray-500"} mt-0.5 flex-shrink-0`} size={16} />
                                    <span>Source File</span>
                                  </div>
                                </div>
                              </div>
                            )}
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
                            >
                              Contact B-Partner
                            </motion.button>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullscreen && <FullscreenView />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Preview;