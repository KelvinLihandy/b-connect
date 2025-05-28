import React, { useState, useEffect, useContext, useRef } from "react";
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
  User,
  ChevronLeft
} from "lucide-react";
import { socket } from "../../App";

// Import contexts
import { AuthContext } from "../../contexts/AuthContext";
import { UserTypeContext } from "../../contexts/UserTypeContext";

// Import components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import AddService from "../../components/add_service/AddService";

// Import service images (replace with your actual imports)
import default_avatar from '../../assets/default-avatar.png'
import dummy1 from "../../assets/Gemini_Generated_Image_at3j5bat3j5bat3j.png";
import dummy2 from "../../assets/Gemini_Generated_Image_at3j5fat3j5fat3j.png";
import dummy3 from "../../assets/Gemini_Generated_Image_sgjvdqsgjvdqsgjv.png";
import dummy4 from "../../assets/Gemini_Generated_Image_zhjybwzhjybwzhjy.png";
import axios from "axios";
import { userAPI } from "../../constants/APIRoutes";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import { DynamicStars } from "../../components/dynamic_stars/DynamicStars";

const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [freelancerData, setFreelancerData] = useState();
  const [gigData, setGigData] = useState([]);
  const { isFreelancer, setIsFreelancer } = useContext(UserTypeContext);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });
  const categoryList = ["All", "Graphics Design", "UI/UX Design", "Video Editing", "Content Writing", "Translation", "Photography", "Web Development"];
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [fallbackMap, setFallbackMap] = useState({});
  const itemsPerPage = 6;
  const [end, setEnd] = useState(itemsPerPage - 1);
  const [start, setStart] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [totalGigs, setTotalGigs] = useState(0);
  const [copyMessage, setCopyMessage] = useState("");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

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

  useEffect(() => {
    if (gigData?.length > 0) {
      const fallbacks = [dummy1, dummy2, dummy3, dummy4];
      const randomFallbacks = {};
      gigData?.forEach(gig => {
        const randomIndex = Math.floor(Math.random() * fallbacks.length);
        randomFallbacks[gig._id] = fallbacks[randomIndex];
      });
      setFallbackMap(randomFallbacks);
    }
  }, [gigData]);

  const getFreelancerData = async () => {
    try {
      const res = await axios.post(`${userAPI}/get-freelancer-data/${id}`);
      const response = res.data;
      console.log(response);
      if (response.freelancer._id == auth?.data?.auth?.id) setIsOwnProfile(true);
      setTotalGigs(response.freelancerGigs.length);
      setTotalPages(Math.max(1, Math.ceil(response.freelancerGigs.length / itemsPerPage)));
      setFreelancerData(response?.freelancer);
      setGigData(response?.freelancerGigs);
      setReviews(response?.reviews);
      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      response?.reviews.forEach(review => {
        const rating = Math.round(review.rating);
        if (counts[rating] !== undefined) {
          counts[rating]++;
        }
      });
      setRatingCounts(counts);
    }
    catch (error) {
      console.log("error freelancer data", error);
      setFreelancerData(null);
      setGigData([]);
      setRatingCounts({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    }
  };

  useEffect(() => {
    const load = async () => {
      await getFreelancerData();
    }

    load();
  }, [id]);

  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    });
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

  const ratings = Object.entries(ratingCounts)
    .map(([rating, count]) => ({ rating, count }))

  return (
    <>
      <Navbar alt={true} />

      <main
        className="flex flex-col min-h-screen bg-gray-50 pt-25"
      >
        {/* Main profile section */}
        <div className="container mx-auto px-5 mt-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left section - Profile and content */}
            <div className="w-full lg:w-8/12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row">
                  {/* Left side with profile photo */}
                  <div className="md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden mb-4 flex items-center justify-center relative border">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          !freelancerData?.picture || freelancerData.picture === "temp"
                            ? default_avatar
                            : `${imageShow}${freelancerData?.picture}`
                        }
                        alt="freelancer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = default_avatar;
                          console.log("Image load failed for freelancer:", freelancerData?._id);
                        }}
                      />
                    </div>
                    {!isOwnProfile && !isFreelancer &&
                      <button
                        onClick={() => {
                          if (!auth) {
                            navigate("/sign-in");
                            return;
                          };
                          socket.emit("create_room", [auth?.data?.auth?.id, freelancerData._id]);
                          socket.on("switch_room", (url) => {
                            navigate(url);
                          })
                        }}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact me
                      </button>
                    }
                    {isOwnProfile && isFreelancer &&
                      <button
                        onClick={() => { navigate(`/profile`); }}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    }
                  </div>

                  <div className="md:w-3/4 md:pl-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h1 className="text-2xl font-semibold">{freelancerData?.name}</h1>
                        </div>
                        <span className="text-gray-500 text-sm block mb-2">
                          {freelancerData?.email}
                        </span>
                        <p className="text-gray-800 font-medium mb-3">
                          {freelancerData?.type.join(', ')}
                        </p>
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {freelancerData?.location?.trim()
                                ? freelancerData.location
                                : isOwnProfile ?
                                  "You have not set a location"
                                  : `${freelancerData?.name} has not set a location`
                              }
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              Member since {new Date(freelancerData?.joinedDate).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h2 className="font-semibold text-lg mb-2">About me</h2>
                      <p className="text-gray-700">
                        {freelancerData?.description?.trim()
                          ? freelancerData.description
                          : isOwnProfile ?
                            "You have not set a description"
                            : `${freelancerData?.name} has not set a description`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center my-5">
                  <h2 className="text-xl font-semibold">
                    {isOwnProfile ? "My Gigs" : "Available Gigs"}
                  </h2>
                  {isOwnProfile && isFreelancer && (
                    <button
                      onClick={() => {
                        setShowAddServiceModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create New Gig
                    </button>
                  )}
                  {gigData?.filter(
                    (g) =>
                      selectedCategory === "All" ||
                      (Array.isArray(g.categories) && g.categories.includes(selectedCategory))
                  ).length > 0 && (
                      <motion.div
                        className="flex justify-center"
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
                              className={`w-10 h-10 flex items-center justify-center rounded-lg ${page === currentPage
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
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  {gigData?.length > 0 ?
                    (
                      <div className="flex flex-col gap-6 mb-4">
                        {/* Category Buttons */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          <div className="flex flex-row gap-4">
                            {categoryList.map((category) => (
                              <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === category
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {gigData
                            ?.filter(
                              (g) =>
                                selectedCategory === "All" ||
                                (Array.isArray(g.categories) && g.categories.includes(selectedCategory))
                            ).slice(start, end)
                            .map((gig, index) => {
                              const fallbackImage = fallbackMap[gig._id];
                              const imageSrc =
                                !gig.images[0] || gig.images[0] === "temp"
                                  ? fallbackImage
                                  : `${imageShow}${gig.images[0]}`;

                              return (
                                <motion.div
                                  key={gig._id}
                                  custom={index}
                                  variants={cardVariants}
                                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                >
                                  <div className="relative">
                                    <motion.img
                                      src={imageSrc}
                                      alt={gig.name}
                                      className="w-full h-58 object-cover bg-white"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.3 }}
                                      onLoad={() => {
                                        console.log("image load", gig.name);
                                      }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = fallbackImage;
                                      }}
                                    />
                                  </div>

                                  <div className="p-5 h-42">
                                    <h3 className="text-base font-medium mb-2 line-clamp-2 transition-colors duration-100">
                                      {gig.name}
                                    </h3>
                                    <div className="flex-col items-center mb-2">
                                      <p className="text-base font-semibold text-black">
                                        Rp. {formattedPrice(gig.packages[0].price)}
                                      </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center text-base w-full justify-between">
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
                              );
                            })}
                        </motion.div>
                        {gigData?.filter(
                          (g) =>
                            selectedCategory === "All" ||
                            (Array.isArray(g.categories) && g.categories.includes(selectedCategory))
                        ).length === 0 && (
                            <div className="flex flex-col items-center justify-center  py-6 rounded-lg">
                              <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                              <h3 className="text-lg font-medium text-gray-800 text-center">
                                No Gigs Currently Available for This Category
                              </h3>
                            </div>
                          )}
                      </div>
                    )
                    :
                    (
                      <div className="text-center p-6">
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
                            onClick={() => setShowAddServiceModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Create New Gig
                          </button>
                        )}
                      </div>
                    )
                  }
                </div>
              </div>

              <div div className="mt-8 mb-12" >
                <div className="flex justify-between items-center my-5">
                  <h2 className="text-xl font-semibold">
                    {isOwnProfile ? "My Reviews" : "Reviews"}
                  </h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  {reviews?.length === 0 ? (
                    <div className="text-center p-6">
                      <div className="mb-4 flex justify-center">
                        <Star className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {isOwnProfile
                          ? "Attract more users to form a contract!"
                          : "Be the first to leave a review!"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-6 px-25">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-3xl font-bold text-blue-700">
                            {Math.round(freelancerData.rating * 10) / 10}
                          </div>
                          <div className="flex mt-1">
                            <DynamicStars number={freelancerData.rating} />
                          </div>
                          <p className="text-lg text-gray-600 mt-1">
                            {reviews?.length} reviews
                          </p>
                        </div>
                        <div className="w-2/3">
                          {ratings.map((item, index) => (
                            <div key={index} className="flex items-center mb-1">
                              <span className="text-xs w-10"><DynamicStars number={item.rating} /></span>
                              <div className="w-full mx-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${((item.count / ratings.reduce((sum, i) => sum + i.count, 0)) * 100).toFixed(1)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-xs w-6 text-right">
                                {item.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

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
                                        <span>
                                          On "{review.reviewedGig.name}"
                                        </span>
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
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-4/12">
              <div className="sticky top-33">
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="w-16 h-16 bg-gray-300 rounded-md flex items-center justify-center mb-2">
                          <img
                            className="w-full h-full object-cover rounded-md"
                            src={
                              !freelancerData?.picture || freelancerData.picture === "temp"
                                ? default_avatar
                                : `${imageShow}${freelancerData?.picture}`
                            }
                            alt="freelancer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = default_avatar;
                              console.log("Image load failed for freelancer:", freelancerData?._id);
                            }}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{freelancerData?.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-sm text-green-600">Open for work</span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p>{copyMessage}</p>
                        <button className="p-1.5 bg-blue-100 rounded-full"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(window.location.href);
                              setCopyMessage("Url Copied!")
                            } catch (err) {
                              setCopyMessage("Failed Copy Url!")
                            }
                            setTimeout(() => setCopyMessage(""), 2000);
                          }}>
                          <Share2 className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700 text-sm font-medium mb-2">
                        {isOwnProfile ? "Your portfolio link" : "Checkout my portfolio"}
                      </p>
                      <div className="bg-white rounded-md p-3 border border-gray-200 flex text-black">
                        <div className="w-full text-gray-500 text-sm bg-transparent outline-none">
                          <a href={freelancerData?.portofolioUrl?.startsWith('http')
                            ? freelancerData.portofolioUrl
                            : `https://${freelancerData?.portofolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {freelancerData?.portofolioUrl}
                          </a>
                        </div>
                        <button
                          className="text-blue-600 text-sm font-medium"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(freelancerData?.portofolioUrl);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch (error) {
                              setCopied(false);
                            }
                          }}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </main >
      <Footer />

      <AddService
        isOpen={showAddServiceModal}
        // isOpen={true}
        onClose={() => {setShowAddServiceModal(false)}}
        onCloseAfterSave={async () => {
          await getFreelancerData();
          setShowAddServiceModal(false);
          console.log("modal saved")
        }}
      />
    </>
  );
};

export default FreelancerProfile;