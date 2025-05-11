import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Star,
  Edit,
  ExternalLink,
  Clock,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

// Import service images - only 2 images available
import product1 from "../../assets/image.png";
import product2 from "../../assets/image 35.png";

export default function FreelancerProfile() {
  const { id } = useParams();

  const [isFreelancerView, setIsFreelancerView] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState(true);
  const [favoriteServices, setFavoriteServices] = useState([]);

  // Handle toggle between freelancer and user view
  const handleModeToggle = (isFreelancer) => {
    setIsFreelancerView(isFreelancer);
  };

  // Toggle portfolio state (for demo purposes)
  const togglePortfolioStatus = () => {
    setHasPortfolio(!hasPortfolio);
  };

  // Toggle favorite status for a service
  const toggleFavorite = (serviceId) => {
    if (favoriteServices.includes(serviceId)) {
      setFavoriteServices(favoriteServices.filter((id) => id !== serviceId));
    } else {
      setFavoriteServices([...favoriteServices, serviceId]);
    }
  };

  // Sample data for the freelancer
  const freelancerData = {
    name: "Adam Warlok",
    title: "Web Developer",
    email: "adamwarlok@gmail.com",
    rating: 4.8,
    totalReviews: 10,
    online: true,
    location: "Jakarta",
    verified: true,
    openForWork: true,
    overview:
      "Hello, saya Adam seorang designer logo profesional dengan pengalaman bertahun-tahun dalam dunia menciptakan identitas merek yang kuat dan berkesan. Setiap logo yang saya ciptakan menyampaikan nilai dan tujuan bisnis anda dengan baik. Saya juga memiliki keahlian dalam branding visual secara keseluruhan, termasuk pemilihan warna, elemen grafis, dan desain material promosi.",
    portfolio: [
      {
        id: 1,
        title: "I will design UI UX for mobile app with figma for ios",
        price: "Rp 210.000",
        rating: 4.9,
        reviewCount: 360,
        image: product1,
        category: "UI/UX Design",
      },
      {
        id: 2,
        title: "I will design UI UX for mobile app with figma for ios",
        price: "Rp 210.000",
        rating: 4.7,
        reviewCount: 360,
        image: product2,
        category: "Web Development",
      },
      {
        id: 3,
        title: "I will design UI UX for mobile app with figma for ios",
        price: "Rp 210.000",
        rating: 4.8,
        reviewCount: 360,
        image: product1,
        category: "Graphics Design",
      },
      {
        id: 4,
        title: "I will design UI UX for mobile app with figma for ios",
        price: "Rp 210.000",
        rating: 4.7,
        reviewCount: 360,
        image: product2,
        category: "Video Editing",
      },
      {
        id: 5,
        title: "I will design UI UX for mobile app with figma for ios",
        price: "Rp 210.000",
        rating: 4.9,
        reviewCount: 360,
        image: product1,
        category: "Content Writing",
      },
      {
        id: 6,
        title: "I will design UI UX for mobile app with figma for ios",
        price: "Rp 210.000",
        rating: 4.8,
        reviewCount: 360,
        image: product2,
        category: "Translation",
      },
    ],
    reviews: [
      {
        id: 1,
        client: {
          name: "patrick",
          avatar: "/avatar-1.jpg",
          rating: 4.8,
        },
        date: "2 month ago",
        comment:
          "Saya sangat puas dengan hasil pekerjaan websitenya! Designnya modern, loading cepat, dan mudah diakses. Proses untuk kerja sama pun sesuai dengan keinginan/kesepakatan.",
      },
      {
        id: 2,
        client: {
          name: "patrick",
          avatar: "/avatar-1.jpg",
          rating: 4.8,
        },
        date: "2 month ago",
        comment:
          "Saya sangat puas dengan hasil pekerjaan websitenya! Designnya modern, loading cepat, dan mudah diakses. Proses untuk kerja sama pun sesuai dengan keinginan/kesepakatan.",
      },
    ],
    ratingBreakdown: {
      1: 1,
      2: 2,
      3: 7,
      4: 20,
      5: 70,
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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

  const sortedRatings = Object.entries(freelancerData.ratingBreakdown)
    .map(([rating, percentage]) => ({ rating, percentage }))
    .sort((a, b) => parseInt(b.rating) - parseInt(a.rating));

  // Categories for filter chips
  const categories = [...new Set(freelancerData.portfolio.map((item) => item.category))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter portfolio items based on selected category
  const filteredPortfolio =
    selectedCategory === "All"
      ? freelancerData.portfolio
      : freelancerData.portfolio.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-gray-100 pt-15">
        {/* Main profile content */}
        {/* White profile card */}
        <div className="container mx-auto px-4 mt-20">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div className="flex items-start">
                {/* Profile avatar */}
                <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center">
                    <h1 className="text-lg font-semibold">{freelancerData.name}</h1>
                    <span className="text-xs text-gray-500 ml-2">• {freelancerData.title}</span>
                  </div>
                  <p className="text-sm text-gray-500">{freelancerData.email}</p>
                  <div className="flex flex-wrap mt-2">
                    <div className="flex items-center mr-4 mb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mr-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">{freelancerData.location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mr-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">Verified Email</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit profile button (only in freelancer view) */}
              {isFreelancerView && (
                <button className="flex items-center justify-center px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}

              {/* Open to work tag (only in freelancer view) */}
              {isFreelancerView && (
                <div className="flex items-center justify-center px-4 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                  <span className="mr-1">Open for work</span>
                </div>
              )}
            </div>

            {/* About me section */}
            <div className="mt-6">
              <h2 className="font-semibold text-sm mb-2">About me</h2>
              <p className="text-sm text-gray-700">{freelancerData.overview}</p>
            </div>
          </div>
        </div>

        {/* Services section - Redesigned to match the image */}
        <div className="container mx-auto mt-6 px-4">
          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-xl">Services</h2>
              {hasPortfolio && (
                <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              )}
            </div>

            {/* Category filter chips */}
            {hasPortfolio && (
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
            ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("All")}
                >
                  All
                </motion.button>

                {categories.map((category) => (
                  <motion.button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {!hasPortfolio ? (
              // Empty portfolio state
              <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-48 h-48 mb-4">
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <polygon
                      points="50,0 150,0 200,86.6 150,173.2 50,173.2 0,86.6"
                      fill="#f0f0f0"
                      stroke="#e0e0e0"
                      strokeWidth="2"
                    />
                    <g transform="translate(60, 50)">
                      <path
                        d="M40,10 C40,10 40,15 40,20 C40,35 60,35 60,20 C60,15 60,10 60,10 M30,40 C30,40 40,60 50,70 C60,60 70,40 70,40 M20,80 C20,80 40,90 50,90 C60,90 80,80 80,80 M30,100 C40,105 60,105 70,100 M40,110 C45,115 55,115 60,110"
                        fill="none"
                        stroke="#999"
                        strokeWidth="2"
                      />
                    </g>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Layanan masih kosong</p>
                <p className="text-gray-500 text-sm">Pilihan fitur dan tampilkan layanan</p>
              </motion.div>
            ) : (
              // Updated Portfolio Grid Display to match the design in the image
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPortfolio.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="bg-white rounded-md overflow-hidden shadow hover:shadow-lg transition-all duration-200"
                    variants={cardVariants}
                    custom={i}
                    whileHover={{ y: -2 }}
                  >
                    <div className="relative">
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.button
                        className="absolute top-51 right-4 z-10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(item.id)}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favoriteServices.includes(item.id)
                              ? "text-red-500 fill-red-500"
                              : "text-black"
                          }`}
                        />
                      </motion.button>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-md font-semibold mb-2">{item.price}</p>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4"
                              fill={i < Math.floor(item.rating) ? "#FFD700" : "none"}
                              stroke={i < Math.floor(item.rating) ? "#FFD700" : "#CBD5E0"}
                            />
                          ))}
                        </div>
                        <span className="ml-auto text-xs text-gray-500">
                          {item.reviewCount} items sold
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Reviews section */}
        <div className="container mx-auto mt-6 px-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Reviews</h2>

            {!hasPortfolio || freelancerData.reviews.length === 0 ? (
              // Empty reviews state
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 text-sm mb-1">Belum ada review untuk freelancer</p>
                <p className="text-gray-500 text-sm">ini. Jadilah yang pertama memberikan</p>
              </div>
            ) : (
              <div>
                {/* Rating bars */}
                <div className="mb-6">
                  {sortedRatings.map((item, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <span className="text-xs w-10">{item.rating} Star</span>
                      <div className="w-full mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs w-6 text-right">{item.percentage}%</span>
                    </div>
                  ))}
                </div>

                {/* Review comments */}
                <div className="space-y-6">
                  {freelancerData.reviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b border-gray-200">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs">
                              {review.client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{review.client.name}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3 h-3"
                                    fill={i < review.client.rating ? "#FFD700" : "none"}
                                    stroke={i < review.client.rating ? "#FFD700" : "#CBD5E0"}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-center items-center mt-6">
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full mr-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Demo controls (for testing only) */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-20">
        <div className="flex flex-col gap-2">
          <button
            onClick={togglePortfolioStatus}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Toggle Portfolio: {hasPortfolio ? "Show Empty" : "Show Portfolio"}
          </button>
          <button
            onClick={() => setIsFreelancerView(!isFreelancerView)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Toggle View: {isFreelancerView ? "User View" : "Freelancer View"}
          </button>
        </div>
      </div>
    </>
  );
}
