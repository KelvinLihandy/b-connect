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
import { motion } from "framer-motion";

// Direct imports for vector decorative elements (these exist in your assets folder)
import Vector from "../../assets/Vector.png";
import Vector1 from "../../assets/vector-1.png";
import Vector2 from "../../assets/Vector-2.png";
import Vector3 from "../../assets/Vector-3.png";
import Vector4 from "../../assets/Vector-4.png";
import Vector5 from "../../assets/Vector-5.png";

import fireworks from "../../assets/fireworks.png";

// Particel dot dot
import particle from "../../assets/Group 14582649.png";

// gambar untuk product
import product1 from "../../assets/image.png";

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

const CatalogPage = () => {
  const { auth } = useContext(AuthContext);
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [favoriteGigs, setFavoriteGigs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedRating, setSelectedRating] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [totalGigs, setTotalGigs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [appliedFilter, setAppliedFilter] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(itemsPerPage - 1);
  const navigate = useNavigate();
  const catalogScrollUp = useRef(null);
  const navScrollUp = useRef(null);

  console.log("user", auth);
  const toggleFavorite = (gigId) => {
    if (favoriteGigs.includes(gigId)) {
      setFavoriteGigs(favoriteGigs.filter((_id) => _id !== gigId));
    } else {
      setFavoriteGigs([...favoriteGigs, gigId]);
    }
  };

  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    });
  };

  // Animation variants
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const serviceCardVariants = {
    hover: {
      y: -10,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  // Filter toggle effect
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
      maxPrice,
      rating,
    });
    try {
      const response = await axios.post(`${gigAPI}/get-gig`, {
        name,
        category,
        minPrice,
        maxPrice,
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
    <div
      className="min-h-screen bg-gray-50"
      ref={catalogScrollUp}
    >
      <Navbar
        search
        alt
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section with Animated Services */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full py-20 relative overflow-hidden mt-20"
        style={{
          background: "linear-gradient(135deg, #2D4F76 0%, #217A9D 50%, #1E9CB7 100%)",
        }}
      >
        {/* Animated particle effects */}
        <motion.img
          className="absolute right-0 top-0 p-3"
          src={particle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.img
          className="absolute -left-5 bottom-0 p-2"
          src={particle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.7, duration: 1 }}
        />
        <motion.img
          className="absolute left-30 -top-13"
          src={particle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.9, duration: 1 }}
        />

        {/* Lightning decorative elements with animations */}
        <motion.img
          className="absolute top-30 left-57"
          src={Vector1}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.img
          className="absolute top-30 left-65"
          src={Vector2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <motion.img
          className="absolute top-30 left-50"
          src={Vector4}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
        <motion.img
          className="absolute top-30 right-267"
          src={Vector}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.img
          className="absolute top-30 right-257"
          src={Vector3}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.img
          className="absolute top-30 right-250"
          src={Vector5}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left side - Title with animated text */}
            <motion.div
              className="flex flex-col gap-3 font-poppin self-center w-full md:w-[800px] px-4 md:px-20 text-center mb-12 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-white text-4xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Our Popular
              </motion.h2>
              <motion.div
                className="flex justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.img
                  className="mr-2 md:mr-6 w-8 md:w-auto"
                  src={fireworks}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                  }}
                />
                <span className="text-yellow-300 text-4xl md:text-6xl font-bold">Services</span>
                <motion.img
                  className="ml-2 md:ml-6 w-8 md:w-auto"
                  src={fireworks}
                  animate={{
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    delay: 0.5,
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Right side - Animated Service Cards */}
            <div className="w-full md:w-2/3 relative h-[350px]">
              {/* Design Graphics - Top */}
              <motion.div
                className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-64 z-20"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover="hover"
                variants={serviceCardVariants}
              >
                <div
                  className="p-2 bg-white shadow-lg overflow-hidden 
                  rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[70px] rounded-br-[70px] relative
                  transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <motion.img
                      src={DesignGraphicsImage}
                      className="w-full h-full object-cover object-center 
                      rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[70px] rounded-br-[70px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-6 py-2 rounded-full"
                      whileHover={{ y: -5 }}
                    >
                      <p className="text-white font-medium text-center">GRAPHICS</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Web Developer - Bottom Left */}
              <motion.div
                className="absolute bottom-0 left-10 w-64 z-10"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover="hover"
                variants={serviceCardVariants}
              >
                <div
                  className="p-2 bg-white shadow-lg overflow-hidden  
                  rounded-tl-[35px] rounded-tr-[55px] rounded-bl-[70px] relative
                  transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <motion.img
                      src={WebDevImage}
                      className="w-full h-full object-cover object-center 
                      rounded-tl-[35px] rounded-tr-[55px] rounded-bl-[70px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-6 py-2 rounded-full"
                      whileHover={{ y: -5 }}
                    >
                      <p className="text-white font-medium text-center">WEB DEVELOPER</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Videographer - Bottom Right */}
              <motion.div
                className="absolute bottom-0 right-10 w-64 z-10"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover="hover"
                variants={serviceCardVariants}
              >
                <div
                  className="p-2 bg-white shadow-lg overflow-hidden  
                  rounded-tl-[35px] rounded-tr-[55px] rounded-br-[70px] relative
                  transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <motion.img
                      src={VideographerImage}
                      className="w-full h-full object-cover object-center 
                      rounded-tl-[35px] rounded-tr-[55px] rounded-br-[70px]"
                      alt="Videographer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-6 py-2 rounded-full"
                      whileHover={{ y: -5 }}
                    >
                      <p className="text-white font-medium text-center">VIDEOGRAPHER</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Greeting, Search and Product Count */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-6 w-full" ref={navScrollUp}>
            <h2 className="text-2xl font-semibold sm:w-1/4 sm:max-w-1/4">
              Hey {auth?.data?.auth?.name ?? "Guest"}👋👋
            </h2>
            <motion.p
              className="text-black self-start sm:self-center text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {totalGigs}
              </motion.span>{" "}
              services
            </motion.p>
          </div>
        </motion.div>

        {/* Mobile Filter Toggle Button (only visible on mobile) */}
        <motion.div
          className="md:hidden mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </motion.div>

        {/* Filters and Products */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with Filters - With animation for mobile */}
          <motion.div
            className={`w-full lg:w-1/4 self-start ${showFilters ? "block" : "hidden md:block"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Categories Filter */}
              <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">Kategorisasi</h3>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200"></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  "Graphics Design",
                  "UI/UX Design",
                  "Video Editing",
                  "Content Writing",
                  "Translation",
                  "Photography",
                  "Web Development",
                ].map((category) => (
                  <motion.div
                    key={category}
                    className="flex items-center group cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div
                      className={`w-5 h-5 rounded mr-3 border flex items-center justify-center ${
                        selectedCategory === category
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 group-hover:border-blue-400"
                      }`}
                    >
                      {selectedCategory === category && <Check size={14} className="text-white" />}
                    </div>
                    <label
                      className={`text-sm cursor-pointer ${
                        selectedCategory === category
                          ? "font-medium text-blue-600"
                          : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {category}
                    </label>
                  </motion.div>
                ))}
              </div>

              {/* Pricing Filter */}
              <div className="p-5 border-t flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">Harga (Ribu Rupiah Rp)</h3>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200"></button>
              </div>
              <div className="p-5">
                <div className="flex justify-between text-sm mb-4">
                  <div>
                    <span className="mr-2 text-gray-600">Max</span>
                    <input
                      type="text"
                      className="w-20 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Reviews Filter */}
              <div className="p-5 border-t flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">Reviews</h3>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200"></button>
              </div>
              <div className="p-5 space-y-3">
                {[5, 4, 3, 2, 1].map((stars, index) => (
                  <motion.div
                    key={stars}
                    className="flex items-center cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="radio"
                      id={`star${stars}`}
                      name="rating"
                      className="mr-3 accent-blue-600 h-4 w-4"
                      checked={selectedRating === stars}
                      onClick={() => setSelectedRating(stars)}
                    />
                    <label htmlFor={`star${stars}`} className="flex items-center cursor-pointer">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            fill={i < stars ? "#FFD700" : "none"}
                            stroke={i < stars ? "#FFD700" : "#CBD5E0"}
                          />
                        ))}
                      <span className="ml-2 text-sm text-gray-600">{stars}+ stars</span>
                    </label>
                  </motion.div>
                ))}
              </div>

              {/* Apply Filters Button */}
              <div className="p-5 border-t">
                <motion.button
                  className={`w-full ${
                    appliedFilter
                      ? "bg-gray-400 hover:bg-gray-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  }  text-white font-medium py-3 rounded-lg transition-colors duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAppliedFilter(!appliedFilter)}
                >
                  {appliedFilter ? "Nonaktifkan Filter" : "Terapkan Filter"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Products Grid with Animation */}
          <motion.div
            className="w-full lg:w-3/4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gigs.slice(start, end).map((gig, i) => (
                <motion.div
                  key={gig._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden relative group border-2 border-gray-100 hover:border-black hover:shadow-lg transition-all duration-200"
                  variants={cardVariants}
                  custom={i}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/detail/${gig._id}`)}
                >
                  {/* Product Image with hover effect */}
                  <div className="relative ">
                    <motion.button
                      className="absolute top-51 right-3  p-2 "
                      whileHover={{ scale: 1 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleFavorite(gig._id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favoriteGigs.includes(gig._id)
                            ? "text-red-500 fill-red-500"
                            : "text-black"
                        }`}
                      />
                    
                    </motion.button>
                    <motion.img
                      src={gig.image[0] == "temp" ? product1 : `${imageShow}${gig.image[0]}`}
                      alt={gig.name}
                      className="w-full h-48 object-cover bg-blue-600"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
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
                            {Array(Math.floor(gig.rating))
                              .fill()
                              .map((_, i) => (
                                <Star key={i} className="w-4 h-4" fill="#FFD700" stroke="#FFD700" />
                              ))}
                          </div>
                          <div>{gig.rating}</div>
                        </div>
                        <div className="ml-1 text-gray-500">{gig.sold} items sold</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination with Animation */}
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <motion.button
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    setStart((prev) => Math.max(0, (prev - itemsPerPage) * itemsPerPage));
                    setEnd((prev) => Math.max(itemsPerPage, prev - itemsPerPage));
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                {getPageNumbers().map((page, index) => (
                  <motion.button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                    } transition-colors duration-200`}
                    whileHover={{ scale: page !== "..." ? 1.05 : 1 }}
                    whileTap={{ scale: page !== "..." ? 0.95 : 1 }}
                    onClick={() => {
                      if (page !== "...") {
                        setCurrentPage(page);
                        setStart((page - 1) * itemsPerPage);
                        setEnd(page * itemsPerPage);
                        window.scrollTo({
                          top: navScrollUp.current.offsetTop - 150,
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage((prev) => prev + 1);
                      setStart((prev) => Math.min(prev + itemsPerPage, totalGigs));
                      setEnd((prev) => Math.min(prev + itemsPerPage, totalGigs));
                    }
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* "Back to top" button - appears when scrolled down */}
            <motion.button
              className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ChevronUp size={24} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <motion.div
        className="bg-gray-50 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800">Featured Categories</h2>
            <p className="text-gray-600 mt-2">Explore our most popular service categories</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: "UI/UX Design", icon: "🎨", count: "1,201 services" },
              { name: "Web Development", icon: "💻", count: "842 services" },
              { name: "Video Editing", icon: "📱", count: "633 services" },
              { name: "Translation", icon: "✏️", count: "921 services" },
            ].map((category, i) => (
              <motion.div
                key={category.name}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300"
                variants={cardVariants}
                custom={i}
                whileHover={{ y: -5 }}
              >
                <span className="text-4xl mb-4">{category.icon}</span>
                <h3 className="font-medium text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <Footer refScrollUp={catalogScrollUp} />
    </div>
  );
};

export default CatalogPage;
