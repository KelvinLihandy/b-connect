import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Check,
  Maximize2,
  ZoomIn,
  Star,
  Heart,
  ChevronDown,
  Search,
  Filter,
  ShoppingCart,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Direct imports for vector decorative elements (these exist in your assets folder)
import Vector from "../../assets/Vector.png";
import Vector1 from "../../assets/Vector-1.png";
import Vector2 from "../../assets/Vector-2.png";
import Vector3 from "../../assets/Vector-3.png";
import Vector4 from "../../assets/Vector-4.png";
import Vector5 from "../../assets/Vector-5.png";

import fireworks from "../../assets/fireworks.png";

// Particel dot dot
import particle from "../../assets/Group 14582649.png";

// Direct imports for service images
import WebDevImage from "../../assets/webdev.png";
import DesignGraphicsImage from "../../assets/designgraph.png";
import VideographerImage from "../../assets/videographer.jpg";
import { debounce } from "lodash";
import axios from "axios";
import { gigAPI } from "../../constants/APIRoutes";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import GigItem from "../../components/gig_item/GigItem";

const CatalogPage = () => {
  const { auth } = useContext(AuthContext);
  const itemsPerPage = 9; // Keep 9 items for 3x3 grid
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [totalGigs, setTotalGigs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [appliedFilter, setAppliedFilter] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(itemsPerPage);
  const navigate = useNavigate();
  const catalogScrollUp = useRef(null);
  const navScrollUp = useRef(null);

  // Enhanced animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  // IMPROVED: Removed shadow and reduced hover effects
  const serviceCardVariants = {
    initial: { 
      scale: 1, 
      y: 0,
      rotateX: 0
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      },
    },
  };

  // Enhanced floating animation for decorative elements
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Filter toggle effect with smooth animation
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const getGig = async (name, category, minPrice, maxPrice, rating) => {
    console.log({
      name,
      category,
      minPrice,
      maxPrice: maxPrice * 1000,
      rating,
    });
    try {
      const response = await axios.post(`${gigAPI}/get-gig`, {
        name,
        category,
        minPrice,
        maxPrice: maxPrice * 1000,
        rating,
      });
      const res = response.data.filteredGigs;
      setGigs(res);
      setTotalGigs(res.length);
      setTotalPages(Math.max(1, Math.ceil(res.length / itemsPerPage)));
      console.log("gig fetched", res);
    } catch (error) {
      console.error("Error fetching gigs:", error.response || error);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query, category, minPrice, maxPrice, rating) => {
      const hasFilters = category || minPrice || maxPrice || rating;
      if (!query.length && !hasFilters) return;
      await getGig(query, category, minPrice, maxPrice, rating);
    }, 500),
    []
  );

  useEffect(() => {
    const fetchGigs = async () => {
      if (!searchQuery.length && !appliedFilter) {
        await getGig("");
      } else if (!appliedFilter) {
        debouncedSearch(searchQuery);
      } else {
        debouncedSearch(searchQuery, selectedCategory, minPrice, maxPrice, selectedRating);
      }
    };

    fetchGigs();
  }, [searchQuery, debouncedSearch, appliedFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" ref={catalogScrollUp}>
      <Navbar search alt setSearchQuery={setSearchQuery} />

      {/* Enhanced Hero Section with Improved Animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full py-20 relative overflow-hidden mt-20"
        style={{
          background: "linear-gradient(135deg, #2D4F76 0%, #217A9D 40%, #1E9CB7 80%, #17B8CC 100%)",
        }}
      >
        {/* Enhanced animated particle effects with floating animation */}
        <motion.img
          className="absolute right-0 top-0 p-3"
          src={particle}
          variants={floatingVariants}
          animate="animate"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.img
          className="absolute -left-5 bottom-0 p-2"
          src={particle}
          variants={pulseVariants}
          animate="animate"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        />
        <motion.img
          className="absolute left-30 -top-13"
          src={particle}
          variants={floatingVariants}
          animate="animate"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        />

        {/* Enhanced lightning decorative elements with improved animations */}
        <motion.img
          className="absolute top-30 left-57"
          src={Vector1}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        />
        <motion.img
          className="absolute top-30 left-65"
          src={Vector2}
          initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "backOut" }}
          whileHover={{ scale: 1.1, rotate: -5 }}
        />
        <motion.img
          className="absolute top-30 left-50"
          src={Vector4}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "backOut" }}
          whileHover={{ scale: 1.1, y: -5 }}
        />
        <motion.img
          className="absolute top-30 right-267"
          src={Vector}
          initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
          whileHover={{ scale: 1.1, rotate: -10 }}
        />
        <motion.img
          className="absolute top-30 right-257"
          src={Vector3}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        />
        <motion.img
          className="absolute top-30 right-250"
          src={Vector5}
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "backOut" }}
          whileHover={{ scale: 1.1, y: 5 }}
        />

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Enhanced left side with better text animations */}
            <motion.div
              className="flex flex-col gap-3 font-poppin self-center w-full md:w-[800px] px-4 md:px-20 text-center mb-12 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.h2
                className="text-white text-4xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Our Popular
              </motion.h2>
              <motion.div
                className="flex justify-center items-center"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.img
                  className="mr-2 md:mr-6 w-8 md:w-auto"
                  src={fireworks}
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 4,
                    ease: "easeInOut"
                  }}
                />
                <motion.span 
                  className="text-yellow-300 text-4xl md:text-6xl font-bold"
                  animate={{
                    textShadow: [
                      "0px 0px 10px rgba(255, 193, 7, 0.5)",
                      "0px 0px 20px rgba(255, 193, 7, 0.8)",
                      "0px 0px 10px rgba(255, 193, 7, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Services
                </motion.span>
                <motion.img
                  className="ml-2 md:ml-6 w-8 md:w-auto"
                  src={fireworks}
                  animate={{
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 4,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>

            {/* IMPROVED: Enhanced Service Cards with better styling */}
            <div className="w-full md:w-2/3 relative h-[350px]">
              {/* Design Graphics - Top with enhanced styling */}
              <motion.div
                className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-64 z-20"
                initial={{ y: -100, opacity: 0, rotateX: -45 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover="hover"
                variants={serviceCardVariants}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="p-2 bg-white shadow-lg overflow-hidden 
                  rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[70px] rounded-br-[70px] relative
                  transition-all duration-300"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <motion.img
                      src={DesignGraphicsImage}
                      className="w-full h-full object-cover object-center 
                      rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[70px] rounded-br-[70px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    {/* IMPROVED: Better label design */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                      bg-white bg-opacity-95 backdrop-blur-sm px-4 py-2 rounded-full 
                      border border-gray-200 shadow-lg"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-gray-800 font-semibold text-sm text-center tracking-wide">
                        GRAPHICS
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Web Developer - Bottom Left with enhanced styling */}
              <motion.div
                className="absolute bottom-0 left-10 w-64 z-10"
                initial={{ x: -100, opacity: 0, rotateY: -45 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover="hover"
                variants={serviceCardVariants}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="p-2 bg-white shadow-lg overflow-hidden  
                  rounded-tl-[35px] rounded-tr-[55px] rounded-bl-[70px] relative
                  transition-all duration-300"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <motion.img
                      src={WebDevImage}
                      className="w-full h-full object-cover object-center 
                      rounded-tl-[35px] rounded-tr-[55px] rounded-bl-[70px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    {/* IMPROVED: Better label design */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                      bg-white bg-opacity-95 backdrop-blur-sm px-4 py-2 rounded-full 
                      border border-gray-200 shadow-lg"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-gray-800 font-semibold text-sm text-center tracking-wide">
                        WEB DEVELOPER
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Videographer - Bottom Right with enhanced styling */}
              <motion.div
                className="absolute bottom-0 right-10 w-64 z-10"
                initial={{ x: 100, opacity: 0, rotateY: 45 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover="hover"
                variants={serviceCardVariants}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="p-2 bg-white shadow-lg overflow-hidden  
                  rounded-tl-[35px] rounded-tr-[55px] rounded-br-[70px] relative
                  transition-all duration-300"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <motion.img
                      src={VideographerImage}
                      className="w-full h-full object-cover object-center 
                      rounded-tl-[35px] rounded-tr-[55px] rounded-br-[70px]"
                      alt="Videographer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    {/* IMPROVED: Better label design */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                      bg-white bg-opacity-95 backdrop-blur-sm px-4 py-2 rounded-full 
                      border border-gray-200 shadow-lg"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-gray-800 font-semibold text-sm text-center tracking-wide">
                        VIDEOGRAPHER
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        {/* Enhanced Greeting and Product Count */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-6 w-full" ref={navScrollUp}>
            <motion.h2 
              className="text-2xl font-semibold sm:w-1/4 sm:max-w-1/4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Hey {auth?.data?.auth?.name ?? "Guest"}👋👋
            </motion.h2>
            <motion.p
              className="text-black self-start sm:self-center text-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.span
                key={totalGigs}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {totalGigs}
              </motion.span>{" "}
              services
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Mobile Filter Toggle */}
        <motion.div
          className="md:hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            onClick={toggleFilters}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium shadow-sm"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Filter size={18} />
            </motion.div>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </motion.button>
        </motion.div>

        {/* Enhanced Filters and Products Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Sidebar with smooth show/hide animation */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                className="w-full lg:w-1/4 self-start"
                initial={{ opacity: 0, x: -30, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  whileHover={{ 
                    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)" 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Categories Filter */}
                  <div className="p-5 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-800">Kategorisasi</h3>
                  </div>
                  <motion.div 
                    className="p-5 space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      "Graphics Design",
                      "UI/UX Design",
                      "Video Editing",
                      "Content Writing",
                      "Translation",
                      "Photography",
                      "Web Development",
                    ].map((category, index) => (
                      <motion.div
                        key={category}
                        className="flex items-center group cursor-pointer"
                        variants={cardVariants}
                        custom={index}
                        whileHover={{ 
                          x: 8,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (selectedCategory == category) setSelectedCategory("");
                          else setSelectedCategory(category);
                        }}
                      >
                        <motion.div
                          className={`w-5 h-5 rounded mr-3 border flex items-center justify-center ${
                            selectedCategory === category
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 group-hover:border-blue-400"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <AnimatePresence>
                            {selectedCategory === category && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check size={14} className="text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <label
                          className={`text-sm cursor-pointer transition-colors duration-200 ${
                            selectedCategory === category
                              ? "font-medium text-blue-600"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {category}
                        </label>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Enhanced Pricing Filter */}
                  <div className="p-5 border-t flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-800">Harga (Ribu Rupiah Rp)</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between text-sm mb-4">
                      <div>
                        <span className="mr-2 text-gray-600">Max</span>
                        <motion.input
                          type="text"
                          className="w-20 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <motion.input
                        type="range"
                        min="0"
                        max="2000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        whileHover={{ scale: 1.02 }}
                      />
                    </div>
                  </div>

                  {/* Enhanced Reviews Filter */}
                  <div className="p-5 border-t flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-800">Reviews</h3>
                  </div>
                  <motion.div 
                    className="p-5 space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[5, 4, 3, 2, 1].map((stars, index) => (
                      <motion.div
                        key={stars}
                        className="flex items-center cursor-pointer"
                        variants={cardVariants}
                        custom={index}
                        whileHover={{ 
                          x: 8,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.input
                          type="radio"
                          id={`star${stars}`}
                          name="rating"
                          className="mr-3 accent-blue-600 h-4 w-4"
                          checked={selectedRating === stars}
                          onClick={() => {
                            if (selectedRating == stars) setSelectedRating(0);
                            else setSelectedRating(stars);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                        <label htmlFor={`star${stars}`} className="flex items-center cursor-pointer">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.1 }}
                              >
                                <Star
                                  className="w-4 h-4"
                                  fill={i < stars ? "#FFD700" : "none"}
                                  stroke={i < stars ? "#FFD700" : "#CBD5E0"}
                                />
                              </motion.div>
                            ))}
                          <span className="ml-2 text-sm text-gray-600">{stars}+ stars</span>
                        </label>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Enhanced Apply Filters Button */}
                  <div className="p-4 border-t">
                    <motion.button
                      className={`w-full ${
                        appliedFilter
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-blue-600 hover:bg-blue-700"
                      }  text-white font-medium py-2 rounded-lg transition-colors duration-200 text-sm shadow-sm`}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setAppliedFilter(!appliedFilter);
                        window.scrollTo({
                          top: navScrollUp.current.offsetTop - 150,
                          behavior: "smooth",
                        });
                      }}
                    >
                      {appliedFilter ? "Nonaktifkan Filter" : "Terapkan Filter"}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Products Grid - Modified for 3x3 Layout */}
          <motion.div
            className="w-full lg:w-4/5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 3x3 Grid Layout - Fixed to always show 3 columns */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              layout
            >
              <GigItem start={start} end={end} data={gigs} />
            </motion.div>

            {/* Enhanced Pagination */}
            <AnimatePresence>
              {gigs.length > 0 && (
                <motion.div
                  className="flex justify-center mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                      whileHover={{ 
                        scale: currentPage !== 1 ? 1.05 : 1,
                        boxShadow: currentPage !== 1 ? "0px 2px 8px rgba(0, 0, 0, 0.1)" : "none"
                      }}
                      whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        setStart((prev) => Math.max(0, (prev - itemsPerPage)));
                        setEnd((prev) => Math.max(itemsPerPage - 1, prev - itemsPerPage));
                      }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {getPageNumbers().map((page, index) => (
                      <motion.button
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          page === currentPage
                            ? "bg-blue-600 text-white shadow-lg"
                            : "border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                        } transition-colors duration-200`}
                        whileHover={{ 
                          scale: page !== "..." ? 1.05 : 1,
                          boxShadow: page !== "..." ? "0px 2px 8px rgba(0, 0, 0, 0.1)" : "none"
                        }}
                        whileTap={{ scale: page !== "..." ? 0.95 : 1 }}
                        onClick={() => {
                          if (page !== "...") {
                            setCurrentPage(page);
                            setStart((page - 1) * itemsPerPage);
                            setEnd(page * itemsPerPage - 1);
                            window.scrollTo({
                              top: navScrollUp.current.offsetTop - 150,
                              behavior: "smooth",
                            });
                          }
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {page}
                      </motion.button>
                    ))}

                    <motion.button
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                      whileHover={{ 
                        scale: currentPage !== totalPages ? 1.05 : 1,
                        boxShadow: currentPage !== totalPages ? "0px 2px 8px rgba(0, 0, 0, 0.1)" : "none"
                      }}
                      whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage((prev) => prev + 1);
                          setStart((prev) => prev + itemsPerPage);
                          setEnd((prev) => prev + itemsPerPage);
                        }
                      }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Footer refScrollUp={catalogScrollUp} />
    </div>
  );
};

export default CatalogPage;