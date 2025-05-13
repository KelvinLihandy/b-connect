import { useState } from "react";
import {
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
  BarChart2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

// Import service images
import product1 from "../../assets/image.png";
import product2 from "../../assets/image 35.png";

export default function FreelancerView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Navigate to edit profile page
  const navigateToEditProfile = () => {
    navigate(`/freelancer/edit/${id}`);
  };

  // Navigate to create new gig page
  const navigateToCreateGig = () => {
    navigate("/freelancer/gigs/create");
  };

  // Navigate to edit specific gig
  const navigateToEditGig = (gigId) => {
    navigate(`/freelancer/gigs/edit/${gigId}`);
  };

  // Navigate to dashboard/analytics
  const navigateToDashboard = () => {
    navigate("/freelancer/dashboard");
  };

  // Freelancer data
  const freelancerData = {
    name: "Adam Warlok",
    title: "Video Editor",
    email: "AdamWarlok@gmail.com",
    rating: 4.9,
    totalReviews: "4.8k",
    online: true,
    location: "Jakarta",
    memberSince: "June 2021",
    projectFinish: "98%",
    languages: ["English, Indonesia"],
    verified: true,
    openForWork: true,
    overview:
      "Hi there! My name is Adam and I offer Professional Video Editing services here on Fiverr. In the last 6 years, I have over 6000 completed orders. I have had previous experience working on a TV station for over 4 years, so I know my stuff! I can do professional video editing and post-production...",
    portfolio: [
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
      {
        id: 3,
        title: "I will create professional real estate videos",
        price: "From $25",
        rating: 4.8,
        reviewCount: 320,
        image: product1,
        category: "Real Estate",
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
          "Great video editing work! The result was professional, clear, and matched exactly what I was looking for. Highly recommended for any video editing needs.",
      },
      {
        id: 2,
        client: {
          name: "sarah",
          avatar: "/avatar-2.jpg",
          rating: 5.0,
        },
        date: "1 month ago",
        comment:
          "Excellent work on my social media video ads. The engagement has increased significantly since I started using Srecko's services. Will definitely work with him again!",
      },
    ],

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

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-gray-50 pt-25">
        {/* Admin Actions Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="font-medium text-gray-800">My Freelancer Profile</h2>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <div className="w-2 h-2 rounded-full mr-1 bg-green-500"></div>
                  Public & Visible
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={navigateToDashboard}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Analytics
                </button>
                <button
                  onClick={() => navigate("/freelancer/settings")}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </button>
                <button
                  onClick={() => navigate("/freelancer/preview")}
                  className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
                >
                  Preview Public View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main profile section - styled like a professional freelancer dashboard */}
        <div className="container mx-auto px-5 mt-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left section - Profile and content */}
            <div className="lg:w-8/12">
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

                    <button
                      onClick={navigateToEditProfile}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>

                  {/* Right side with profile info */}
                  <div className="md:w-3/4 md:pl-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h1 className="text-2xl font-semibold">{freelancerData.name}</h1>
                          {freelancerData.verified && (
                            <CheckCircle className="w-5 h-5 text-blue-500 ml-2" />
                          )}
                        </div>

                        <span className="text-gray-500 text-sm block mb-2">
                          {freelancerData.email}
                        </span>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 font-medium">{freelancerData.rating}</span>
                            <span className="ml-1 text-gray-500 text-sm">
                              ({freelancerData.totalReviews})
                            </span>
                          </div>
                          <span className="mx-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                            Top Rated ⭐⭐⭐
                          </span>
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
                          Share Profile
                        </button>
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
                          <p className="text-lg font-medium">98%</p>
                        </div>
                      </div>
                    </div>

                    {/* About section */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-lg">About me</h2>
                        <button
                          onClick={navigateToEditProfile}
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                      </div>
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
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Gigs</h2>
                  <button
                    onClick={navigateToCreateGig}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create New Gig
                  </button>
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {freelancerData.portfolio.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={cardVariants}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />

                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => navigateToEditGig(item.id)}
                            className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 text-gray-700" />
                          </button>
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigateToEditGig(item.id)}
                              className="text-blue-600 text-sm font-medium hover:underline"
                            >
                              Edit
                            </button>
                            <button className="text-gray-600 text-sm font-medium hover:underline">
                              Preview
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Reviews section */}
              <div className="mt-8 mb-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl">Reviews</h2>
                  </div>

                  {freelancerData.reviews.length === 0 ? (
                    // Empty reviews state
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-gray-500 text-sm mb-1">
                        No reviews yet for your services.
                      </p>
                      <p className="text-gray-500 text-sm">Complete more gigs to get reviews!</p>
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
                            <div className="mt-3">
                              <button className="text-blue-600 text-xs hover:underline">
                                Respond to review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Average response time info */}
                      <div className="flex justify-center items-center mt-6 bg-green-50 p-3 rounded-lg text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-green-600" />
                        Your average response time:{" "}
                        <span className="font-medium ml-1">3 hours</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right sidebar - Profile Stats and Performance */}
            <div className="lg:w-4/12">
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                  <div className="border-b border-gray-100 p-4">
                    <h3 className="font-medium text-gray-800">Profile Stats</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm">Profile Views</span>
                      <span className="font-medium">324</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm">Profile Completion</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm">Response Rate</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Active Gigs</span>
                      <span className="font-medium">{freelancerData.portfolio.length}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={navigateToDashboard}
                        className="w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <BarChart2 className="w-4 h-4 mr-1" />
                        View Full Analytics
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-100 p-4">
                    <h3 className="font-medium text-gray-800">Profile Settings</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-gray-800 text-sm font-medium">
                          Available for Work
                        </span>
                        <p className="text-gray-500 text-xs mt-1">Show you're open to offers</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          name="toggle"
                          id="work-toggle"
                          className="sr-only"
                        />
                        <div className="block bg-green-500 w-10 h-6 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-800 text-sm font-medium">
                          Email Notifications
                        </span>
                        <p className="text-gray-500 text-xs mt-1">Receive new request alerts</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          name="toggle"
                          id="email-toggle"
                          className="sr-only"
                        />
                        <div className="block bg-green-500 w-10 h-6 rounded-full"></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate("/freelancer/settings")}
                        className="w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
