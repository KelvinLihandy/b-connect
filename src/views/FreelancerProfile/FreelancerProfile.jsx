import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Star,
  CheckCircle,
  ChevronRight,
  MapPin,
  Globe,
  Share2,
  Clock,
  Edit,
  PlusCircle,
  Settings,
  AlertCircle,
  Eye,
  Home,
  User
} from "lucide-react";

// Import contexts
import { AuthContext } from "../../contexts/AuthContext";
import { UserTypeContext } from "../../contexts/UserTypeContext";

// Import components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

// Import service images (replace with your actual imports)
import product1 from "../../assets/image.png";
import product2 from "../../assets/image.png";

const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { isFreelancer, setIsFreelancer } = useContext(UserTypeContext);
  
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [redirectModalOpen, setRedirectModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determine if the profile belongs to the current user
  const isOwnProfile = String(auth?.data?.auth?.id) === String(id);
  
  // Is viewing own freelancer profile
  const isOwnFreelancerProfile = isFreelancer && isOwnProfile;
  
  // The portfolio URL to share/copy
  const portfolioUrl = `https://freelancer.com/profile/${id}`;
  
  // Copy portfolio URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Toggle favorite status for a service
  const toggleFavorite = (serviceId) => {
    if (favoriteServices.includes(serviceId)) {
      setFavoriteServices(favoriteServices.filter((id) => id !== serviceId));
    } else {
      setFavoriteServices([...favoriteServices, serviceId]);
    }
  };

  // Toggle contact modal
  const toggleContactModal = () => {
    setContactModalOpen(!contactModalOpen);
  };

  // Toggle redirect modal
  const toggleRedirectModal = () => {
    setRedirectModalOpen(!redirectModalOpen);
  };

  // Switch to freelancer mode
  const switchToFreelancerMode = () => {
    localStorage.setItem("isFreelancer", "true");
    setIsFreelancer(true);
    navigate(`/freelancer-profile/${auth?.data?.auth?.id}`);
  };

  // Switch to user mode
  const switchToUserMode = () => {
    localStorage.setItem("isFreelancer", "false");
    setIsFreelancer(false);
    navigate("/home");
  };

  // Navigate to edit profile page
  const navigateToEditProfile = () => {
    if (!isFreelancer && isOwnProfile) {
      toggleRedirectModal();
    } else {
      navigate(`/freelancer-edit/${id}`);
    }
  };

  // Navigate to create new gig page
  const navigateToCreateGig = () => {
    navigate("/freelancer-gigs/create");
  };

  // Navigate to edit specific gig
  const navigateToEditGig = (gigId) => {
    navigate(`/freelancer-gigs/edit/${gigId}`);
  };

  // Freelancer data - in a real app, this would come from API
  const freelancerData = {
    name: auth?.data?.auth?.name || "Adam Warlok",
    title: "Video Editor",
    email: auth?.data?.auth?.email || "user@example.com",
    rating: 4.9,
    totalReviews: "4.8k",
    online: true,
    location: "Jakarta",
    memberSince: "June 2021",
    projectFinish: "98%",
    languages: ["English", "Indonesia"],
    verified: true,
    openForWork: true,
    overview:
      "Hi there! My name is Adam and I offer Professional Video Editing services here on Fiverr. In the last 6 years, I have over 6000 completed orders. I have had previous experience working on a TV station for over 4 years, so I know my stuff! I can do professional video editing and post-production...",
    // Only show portfolio items for own profile in freelancer mode
    portfolio: isOwnProfile && isFreelancer ? [
      {
        id: 1,
        title: "I will do professional video editing",
        price: "From $25",
        rating: 4.9,
        reviewCount: 360,
        image: product1,
        category: "Video Editing",
      },
      {
        id: 2,
        title: "I will do short video ads for instagram and facebook",
        price: "From $10",
        rating: 4.7,
        reviewCount: 280,
        image: product2,
        category: "Social Media",
      },
    ] : [], // Empty for other users viewing profile
    // Only show reviews for own profile in freelancer mode
    reviews: isOwnProfile && isFreelancer ? [
      {
        id: 1,
        client: {
          name: "patrick",
          avatar: "/avatar-1.jpg",
          rating: 4.8,
        },
        date: "2 month ago",
        comment:
          "Great video editing work! The result was professional, clear, and matched exactly what I was looking for. Highly recommended for any video editing needs.",
      },
    ] : [], // Empty for other users viewing profile
    ratingBreakdown: {
      1: 1,
      2: 2,
      3: 5,
      4: 20,
      5: 72,
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

  // Determine if we should show gigs based on mode and ownership
  const showGigs = isFreelancer || !isFreelancer;

  return (
    <>
      <Navbar alt={true} />
      
      {/* Freelancer Mode Banners - Positioned right below navbar */}
      <div className="relative w-full" style={{ marginTop: "100px" }}>
        {isFreelancer && (
          <div className="w-full bg-amber-500 text-white text-center py-1 font-medium">
            You are currently in Freelancer Mode. Your profile appears different than to normal users.
          </div>
        )}
        
        {isOwnFreelancerProfile && (
          <div className="w-full bg-red-500 text-white text-center py-1 font-medium">
            Your profile is unpublished. Add gigs and complete your profile to become visible to users.
          </div>
        )}
      </div>
      
      <main className="flex flex-col min-h-screen bg-gray-50" style={{ 
        paddingTop: isFreelancer && isOwnFreelancerProfile ? "56px" : (isFreelancer ? "28px" : "0") 
      }}>
        {/* Main profile section */}
        <div className="container mx-auto px-5 mt-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left section - Profile and content */}
            <div className="w-full lg:w-8/12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row">
                  {/* Left side with profile photo */}
                  <div className="md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden mb-4 flex items-center justify-center relative">
                      <img
                        src="/api/placeholder/150/150"
                        alt={freelancerData.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex items-center mt-2 text-gray-600">
                      <div className="w-2 h-2 rounded-full mr-1 bg-green-500"></div>
                      <span className="text-sm">Online</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm">10:03 PM WIB</span>
                    </div>

                    {/* Show appropriate action button based on mode and ownership */}
                    {isOwnProfile && isFreelancer ? (
                      <button
                        onClick={navigateToEditProfile}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : isOwnProfile && !isFreelancer ? (
                      <button
                        onClick={toggleRedirectModal}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={toggleContactModal}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact me
                      </button>
                    )}
                  </div>

                  {/* Right side with profile info */}
                  <div className="md:w-3/4 md:pl-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h1 className="text-2xl font-semibold">{auth?.data?.auth?.name}</h1>
                        </div>

                        <span className="text-gray-500 text-sm block mb-2">
                          {freelancerData.email}
                        </span>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 font-medium">
                              {(!isOwnProfile || !isFreelancer) ? "0.0" : freelancerData.rating}
                            </span>
                            <span className="ml-1 text-gray-500 text-sm">
                              ({(!isOwnProfile || !isFreelancer) ? "0" : freelancerData.totalReviews})
                            </span>
                          </div>
                          {isOwnProfile && isFreelancer && (
                            <span className="mx-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                              Unpublished
                            </span>
                          )}
                        </div>

                        <p className="text-gray-800 font-medium mb-3">{freelancerData.title}</p>

                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{freelancerData.location}</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <Globe className="h-4 w-4 mr-1" />
                            <span className="text-sm">{freelancerData.languages.join(", ")}</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              Member since {freelancerData.memberSince}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 md:mt-0 flex">
                        <button className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors text-sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </button>

                        {!isOwnProfile && !isFreelancer && (
                          <button className="ml-2 p-2 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50 transition-colors">
                            <Heart 
                              className={`h-4 w-4 ${favoriteServices.includes("profile") ? "text-red-500 fill-red-500" : "text-gray-700"}`}
                              onClick={() => toggleFavorite("profile")}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stats Cards integrated into profile */}
                    <div className="mt-4 max-w-xs bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Project Completion</p>
                          <p className="text-lg font-medium">
                            {(!isOwnProfile || !isFreelancer) ? "0%" : "98%"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* About section */}
                    <div className="mt-6">
                      <h2 className="font-semibold text-lg mb-2">About me</h2>
                      <p className="text-gray-700">{freelancerData.overview}</p>
                      <button className="text-blue-600 hover:underline mt-1 font-medium text-sm flex items-center">
                        Read more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gigs/Services section */}
              {showGigs && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {isOwnProfile ? "My Gigs" : "Available Gigs"}
                    </h2>
                    {isOwnProfile && isFreelancer && (
                      <button
                        onClick={navigateToCreateGig}
                        className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Create New Gig
                      </button>
                    )}
                  </div>

                  {/* Category filter - Only for non-owner in user mode */}
                  {!isOwnProfile && !isFreelancer && categories.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                          selectedCategory === "All"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                            selectedCategory === category
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredPortfolio.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredPortfolio.map((item, index) => (
                        <motion.div
                          key={item.id}
                          custom={index}
                          variants={cardVariants}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />

                            {/* Action buttons for gig cards */}
                            <div className="absolute top-2 right-2 flex gap-1">
                              {/* Edit button - Only visible for owner in freelancer mode */}
                              {isOwnProfile && isFreelancer ? (
                                <button
                                  onClick={() => navigateToEditGig(item.id)}
                                  className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4 text-gray-700" />
                                </button>
                              ) : !isOwnProfile && !isFreelancer ? (
                                <button
                                  className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-100"
                                  onClick={() => toggleFavorite(item.id)}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      favoriteServices.includes(item.id)
                                        ? "text-red-500 fill-red-500"
                                        : "text-gray-700"
                                    }`}
                                  />
                                </button>
                              ) : null}
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="text-gray-800 font-medium mb-2 line-clamp-2 h-12">
                              {item.title}
                            </h3>
                            <div className="flex items-center mb-3">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 text-sm">{item.rating}</span>
                              <span className="ml-1 text-gray-500 text-xs">({item.reviewCount})</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-gray-800 font-semibold">{item.price}</p>
                              {isOwnProfile && isFreelancer ? (
                                <button
                                  onClick={() => navigateToEditGig(item.id)}
                                  className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                  Edit
                                </button>
                              ) : (
                                <button className="text-blue-600 text-sm font-medium hover:underline">
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    // Empty state for gigs
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                      <div className="mb-4 flex justify-center">
                        {!isOwnProfile ? (
                          <AlertCircle className="h-12 w-12 text-gray-400" />
                        ) : (
                          <PlusCircle className="h-12 w-12 text-blue-500" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {!isOwnProfile
                          ? "No Gigs Available"
                          : "Add Your First Gig"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {!isOwnProfile
                          ? "This freelancer hasn't published any gigs yet."
                          : "Create your first gig to start offering your services to potential clients."}
                      </p>
                      {isOwnProfile && isFreelancer && (
                        <button
                          onClick={navigateToCreateGig}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Create New Gig
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews section */}
              <div className="mt-8 mb-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl">Reviews</h2>

                    {/* Add review button - Only for non-owners in user mode */}
                    {!isOwnProfile && !isFreelancer && (
                      <button className="flex items-center text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <Star className="h-4 w-4 mr-1" />
                        Add Review
                      </button>
                    )}
                  </div>

                  {freelancerData.reviews.length === 0 ? (
                    // Empty reviews state - Always show for new profiles
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Star className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-700 font-medium mb-1">
                        No reviews yet
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        {isOwnProfile
                          ? "Complete more gigs to get reviews!"
                          : "Be the first to leave a review!"}
                      </p>
                      {!isOwnProfile && !isFreelancer && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                          Write a Review
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Rating summary */}
                      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-6">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-3xl font-bold text-blue-700">
                            {freelancerData.rating}
                          </div>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4"
                                fill={i < Math.floor(freelancerData.rating) ? "#FFD700" : "none"}
                                stroke={
                                  i < Math.floor(freelancerData.rating) ? "#FFD700" : "#CBD5E0"
                                }
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {freelancerData.totalReviews} reviews
                          </p>
                        </div>

                        {/* Rating bars */}
                        <div className="w-2/3">
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
                      </div>

                      {/* Review comments */}
                      <div className="space-y-6">
                        {freelancerData.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-semibold">
                                  <span>{review.client.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">
                                      {review.client.name}
                                    </span>
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
                            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                            
                            {/* Review response option - Only for owner */}
                            {isOwnProfile && isFreelancer && (
                              <div className="mt-3">
                                <button className="text-blue-600 text-xs hover:underline">
                                  Respond to review
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Average response time info */}
                      <div className="flex justify-center items-center mt-6 bg-green-50 p-3 rounded-lg text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-green-600" />
                        {isOwnProfile ? "Your" : "Average"} response time:{" "}
                        <span className="font-medium ml-1">3 hours</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right sidebar - Profile card as shown in screenshot */}
            <div className="w-full lg:w-4/12">
              <div className="sticky top-20">
                {/* Profile Card */}
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="w-16 h-16 bg-gray-300 rounded-md flex items-center justify-center mb-2">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{freelancerData.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-sm text-green-600">Open for work</span>
                        </div>
                      </div>
                      <button className="p-1.5 bg-blue-100 rounded-full">
                        <Share2 className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700 text-sm font-medium mb-2">
                        {isOwnProfile ? "Your portfolio link" : "Checkout my portfolio"}
                      </p>
                      <div className="bg-white rounded-md p-3 border border-gray-200 flex">
                        <input
                          type="text"
                          value={portfolioUrl}
                          readOnly
                          className="w-full text-gray-500 text-sm bg-transparent outline-none"
                        />
                        <button 
                          className="text-blue-600 text-sm font-medium"
                          onClick={copyToClipboard}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Call-to-action buttons */}
                    {!isOwnProfile ? (
                      <div className="mt-6 space-y-3">
                        <button 
                          className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                          onClick={toggleContactModal}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Hire me
                        </button>
                      </div>
                    ) : !isFreelancer ? (
                      <div className="mt-6 space-y-3">
                        <button
                          onClick={switchToFreelancerMode}
                          className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                        >
                          <Edit className="w-4 w-4 mr-2" />
                          Switch to Freelancer Mode
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-3">
                        <button
                          onClick={navigateToCreateGig}
                          className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create New Gig
                        </button>
                        <button
                          onClick={switchToUserMode}
                          className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                        >
                          Back to User Mode
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact {freelancerData.name}</h3>
              <button onClick={toggleContactModal} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter message subject"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your message here..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={toggleContactModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for redirecting to freelancer mode */}
      {redirectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="mb-4 text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Switch to Freelancer Mode</h3>
              <p className="text-gray-600 mt-2">
                You need to be in freelancer mode to edit your profile. Would you like to switch?
              </p>
            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <button
                onClick={toggleRedirectModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toggleRedirectModal();
                  switchToFreelancerMode();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Switch to Freelancer Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreelancerProfile;