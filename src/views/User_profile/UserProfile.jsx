import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { userAPI } from "../../constants/APIRoutes";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("purchase");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const [userStats, setUserStats] = useState({
    memberSince: "",
    profileCompletion: "",
    activeVouchers: "",
    totalOrders: "",
    totalSpent: ""
  });

  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    memberSince: ""
  });

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  console.log("review", reviews);
  const [purchasePagination, setPurchasePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Memoize getCurrentUserId to prevent unnecessary re-renders
  const getCurrentUserId = useCallback(() => {
    return auth?.data?.auth?.id || userId;
  }, [auth?.data?.auth?.id, userId]);

  // Memoize fallback image URL
  const fallbackImage = useMemo(() => {
    // Use a data URL instead of external placeholder to avoid network requests
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDMyMCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMzMuNSA5OEMxMzMuNSA5NC4xMzQgMTM2LjYzNCA5MSAxNDAuNSA5MUgxNzkuNUMxODMuMzY2IDkxIDE4Ni41IDk0LjEzNCAxODYuNSA5OFYxMjZDMTg2LjUgMTI5Ljg2NiAxODMuMzY2IDEzMyAxNzkuNSAxMzNIMTQwLjVDMTM2LjYzNCAxMzMgMTMzLjUgMTI5Ljg2NiAxMzMuNSAxMjZWOThaIiBmaWxsPSIjOUNBM0FGIi8+Cjxzdmcgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMTYgMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDNDMSAyLjQ0NzcyIDEuNDQ3NzIgMiAyIDJIMTRDMTQuNTUyMyAyIDE1IDIuNDQ3NzIgMTUgM1Y5QzE1IDkuNTUyMjggMTQuNTUyMyAxMCAxNCAxMEgyQzEuNDQ3NzIgMTAgMSA5LjU1MjI4IDEgOVYzWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjEiIGZpbGw9IiM5Q0EzQUYiLz4KPHN0aCBkPSJNOSA3TDEyIDQiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cjx0ZXh0IHg9IjE2MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0EzQUYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";
  }, []);

  // Enhanced image error handler with debugging
  const handleImageError = useCallback((e) => {
    console.log('🖼️ Image failed to load:', e.target.src);
    console.log('🖼️ Image alt text:', e.target.alt);
    
    if (e.target.src !== fallbackImage) {
      console.log('🖼️ Switching to fallback image');
      e.target.src = fallbackImage;
    } else {
      console.error('❌ Even fallback image failed to load');
    }
  }, [fallbackImage]);

  // Function to process and validate image URLs
  const processImageUrl = useCallback((imageUrl, itemTitle = '') => {
    console.log('🔍 Processing image URL:', imageUrl, 'for item:', itemTitle);
    
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      console.log('⚠️ No valid image URL provided, using fallback');
      return fallbackImage;
    }
    
    // If it's already a data URL, return as is
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    try {
      // Try to create URL object to validate
      const url = new URL(imageUrl);
      console.log('✅ Valid URL format:', url.href);
      return imageUrl;
    } catch (error) {
      console.error('❌ Invalid URL format:', error);
      return fallbackImage;
    }
  }, [fallbackImage]);

  // Enhanced status detection function
  const getStatusInfo = useCallback((item) => {
    const status = (item.status || '').toLowerCase();
    const statusType = (item.statusType || '').toLowerCase();
    
    console.log('🔍 Analyzing status for:', item.title || 'Unknown item');
    console.log('   - status:', item.status);
    console.log('   - statusType:', item.statusType);
    
    // More comprehensive status detection
    if (status.includes('delivered') || status.includes('completed') || 
        status.includes('done') || statusType === 'delivered' || 
        statusType === 'completed') {
      console.log('   ✅ Detected as: DELIVERED');
      return { type: 'delivered', color: 'green', display: item.status || 'Delivered' };
    } else if (status.includes('progress') || status.includes('processing') || 
               status.includes('ongoing') || status.includes('active') || 
               statusType === 'progress' || statusType === 'processing') {
      console.log('   🟡 Detected as: IN PROGRESS');
      return { type: 'progress', color: 'orange', display: item.status || 'In Progress' };
    } else if (status.includes('cancelled') || status.includes('canceled') || 
               status.includes('failed') || status.includes('rejected') || 
               statusType === 'cancelled' || statusType === 'canceled') {
      console.log('   ❌ Detected as: CANCELLED');
      return { type: 'cancelled', color: 'red', display: item.status || 'Cancelled' };
    } else {
      console.log('   ❓ Status unclear, defaulting to unknown');
      return { type: 'unknown', color: 'gray', display: item.status || 'Status Unknown' };
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const targetUserId = getCurrentUserId();
    if (!targetUserId) return;

    try {
      const response = await axios.post(
        `${userAPI}/get-user/${targetUserId}`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.user) {
        const user = response.data.user;
        setCurrentUser({
          name: user.name || auth?.data?.auth?.name || "",
          email: user.email || auth?.data?.auth?.email || "",
          memberSince: user.joinedDate ? new Date(user.joinedDate).getFullYear().toString() : ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (auth?.data?.auth) {
        setCurrentUser({
          name: auth.data.auth.name || "",
          email: auth.data.auth.email || "",
          memberSince: auth.data.auth.joinedDate ? new Date(auth.data.auth.joinedDate).getFullYear().toString() : ""
        });
      }
    }
  }, [getCurrentUserId, auth?.data?.auth]);

  const fetchUserStats = useCallback(async () => {
    const targetUserId = getCurrentUserId();
    if (!targetUserId) return;

    try {
      const response = await axios.post(
        `${userAPI}/user-stats/${targetUserId}`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.stats) {
        setUserStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [getCurrentUserId]);

  const fetchPurchaseHistory = useCallback(async (page = 1) => {
    const targetUserId = getCurrentUserId();
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${userAPI}/purchase-history/${targetUserId}?page=${page}&limit=10`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.purchaseHistory) {
        const { purchaseHistory, pagination } = response.data;

        console.log('📊 Raw purchase history data:', purchaseHistory);

        // Process each item with enhanced validation
        const processedHistory = purchaseHistory.map(item => {
          const processedItem = {
            ...item,
            image: processImageUrl(item.image, item.title),
            id: item.id || Date.now() + Math.random() // Ensure unique ID
          };
          
          // Log status info for debugging
          const statusInfo = getStatusInfo(processedItem);
          console.log(`📋 Item "${item.title}" status info:`, statusInfo);
          
          return processedItem;
        });

        console.log('✅ Processed purchase history:', processedHistory);
        setPurchaseHistory(processedHistory);
        setPurchasePagination({
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage
        });
      }
    } catch (error) {
      console.error("❌ Error fetching purchase history:", error);
      setError("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserId, processImageUrl, getStatusInfo]);

  const fetchReviews = useCallback(async (page = 1) => {
    const targetUserId = getCurrentUserId();
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${userAPI}/user-reviews/${targetUserId}?page=${page}&limit=10`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.reviews) {
        const { reviews, pagination } = response.data;

        console.log('📊 Raw reviews data:', reviews);

        // Process each review with enhanced validation
        const processedReviews = reviews.map(review => ({
          ...review,
          image: processImageUrl(review.image, review.title),
          id: review.id || Date.now() + Math.random() // Ensure unique ID
        }));

        console.log('✅ Processed reviews:', processedReviews);
        setReviews(processedReviews);
        setReviewsPagination({
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage
        });
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserId, processImageUrl]);

  // Debug function for troubleshooting
  const debugOrderStatus = useCallback(() => {
    console.log('🔍 === DEBUG ORDER STATUS ===');
    console.log('Purchase History:', purchaseHistory);
    console.log('Current User ID:', getCurrentUserId());
    console.log('Auth Data:', auth?.data?.auth);
    
    // Check for stuck orders
    const progressOrders = purchaseHistory.filter(item => {
      const statusInfo = getStatusInfo(item);
      return statusInfo.type === 'progress';
    });
    
    console.log('🟡 Orders in progress:', progressOrders);
    
    if (progressOrders.length > 0) {
      console.log('⚠️ Found orders stuck in progress. Check backend status update logic.');
      progressOrders.forEach(order => {
        console.log(`   - Order ${order.orderNumber}: Status="${order.status}", Type="${order.statusType}"`);
      });
    }
    
    console.log('🔍 === END DEBUG ===');
  }, [purchaseHistory, getCurrentUserId, auth?.data?.auth, getStatusInfo]);

  // Initial data loading effect - only run once when component mounts or auth changes
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (auth?.data?.auth) {
          setCurrentUser({
            name: auth.data.auth.name || "",
            email: auth.data.auth.email || "",
            memberSince: auth.data.auth.joinedDate ? new Date(auth.data.auth.joinedDate).getFullYear().toString() : ""
          });
        }

        await Promise.all([
          fetchUserProfile(),
          fetchUserStats()
        ]);

      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [auth?.data?.auth?.id, userId]); // Only depend on stable auth ID and userId

  // Separate effect for tab-specific data loading
  useEffect(() => {
    const loadTabData = async () => {
      if (activeTab === "purchase" && purchaseHistory.length === 0) {
        await fetchPurchaseHistory(1);
      } else if (activeTab === "reviews" && reviews.length === 0) {
        await fetchReviews(1);
      }
    };

    loadTabData();
  }, [activeTab]); // Only depend on activeTab

  const handleTabChange = useCallback(async (tab) => {
    setActiveTab(tab);
    setError(null);

    if (tab === "purchase" && purchaseHistory.length === 0) {
      await fetchPurchaseHistory(1);
    } else if (tab === "reviews" && reviews.length === 0) {
      await fetchReviews(1);
    }
  }, [purchaseHistory.length, reviews.length, fetchPurchaseHistory, fetchReviews]);

  const handlePurchasePagination = useCallback(async (page) => {
    await fetchPurchaseHistory(page);
  }, [fetchPurchaseHistory]);

  const handleReviewsPagination = useCallback(async (page) => {
    await fetchReviews(page);
  }, [fetchReviews]);

  const handleSettingsClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  console.log("📊 Purchase history debug:", purchaseHistory);

  const PurchaseCard = React.memo(({ item }) => {
    const statusInfo = getStatusInfo(item);
    
    return (
      <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-[#2E5077]/30 transition-all duration-300 hover:shadow-xl overflow-hidden">
        {/* Debug info overlay (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs p-1 rounded z-10">
            Type: {statusInfo.type}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row">
          <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-56">
            <img
              src={item.image || fallbackImage}
              alt={item.title || 'Product image'}
              className="w-full h-full object-cover border-b lg:border-b-0 lg:border-r border-gray-200"
              onError={handleImageError}
              loading="lazy"
              onLoad={() => console.log('✅ Image loaded successfully for:', item.title)}
            />
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {Array.isArray(item.category) ? (
                    item.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {item.category || 'General'}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {item.title || 'Untitled Service'}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description || 'No description available'}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#2E5077] to-[#2E90EB] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {(item.seller || 'U').charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.seller || 'Unknown Seller'}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{item.sellerRating || '0.0'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    statusInfo.type === "progress"
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : statusInfo.type === "delivered"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : statusInfo.type === "cancelled"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}>
                    {statusInfo.display}
                  </span>

                  {statusInfo.type === "delivered" && item.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Your rating:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <svg key={index} className={`w-4 h-4 ${index < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  {item.orderNumber || 'N/A'} • {item.date || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {item.deliveryTime || 'N/A'}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 ml-6">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.price || 'Rp 0'}
                  </div>
                </div>              
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      if (statusInfo.type === "progress") {
                        navigate(`/manage-order/${item.orderNumber}`);
                      } else {
                        navigate(`/detail/${item.serviceId || item.id}`);
                      }
                    }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 ${
                      statusInfo.type === "progress"
                        ? "bg-[#2E5077] text-white hover:bg-[#1e3a5f] shadow-lg shadow-[#2E5077]/20"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20"
                    }`}
                  >
                    {statusInfo.type === "progress" ? "View Details" : "Buy Again"}
                  </button>

                  {statusInfo.type === "delivered" && (
                    <button 
                      onClick={() => navigate(`/chat/${item.sellerId || item.seller}`)}
                      className="px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#2E5077] text-[#2E5077] hover:bg-[#2E5077] hover:text-white transition-all duration-300"
                    >
                      Contact Seller
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const ReviewCard = React.memo(({ review }) => (
    <div className="group relative bg-white rounded-xl p-8 border border-gray-200 hover:border-[#2E5077]/30 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0 w-full lg:w-72 h-48 lg:h-52">
          <img
            src={review.image || fallbackImage}
            alt={review.title || 'Service image'}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
            onError={handleImageError}
            loading="lazy"
            onLoad={() => console.log('✅ Review image loaded for:', review.title)}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                  {Array.isArray(review.category) ? (
                    review.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {review.category || 'General'}
                    </span>
                  )}
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  COMPLETED
                </span>
                {review.verified && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Purchase
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {review.title || 'Untitled Service'}
              </h3>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#2E5077] to-[#2E90EB] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {(review.seller || 'U').charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.seller || 'Unknown Seller'}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{review.sellerRating || '0.0'}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">{review.orderId || 'N/A'}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">My Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, starIndex) => (
                      <svg key={starIndex} className={`w-5 h-5 ${starIndex < Math.floor(review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-900 font-semibold ml-1">{review.rating || 0}.0</span>
                </div>

                <span className="text-sm text-gray-600">• {review.deliveryTime || 'N/A'}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 ml-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {review.price || 'Rp 0'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => navigate(`/detail/${review.serviceId || review.id}`)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20"
                >
                  Buy Again
                </button>
                <button 
                  onClick={() => {}}//revisi redirect ke roomid
                  className="px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#2E5077] text-[#2E5077] hover:bg-[#2E5077] hover:text-white transition-all duration-300"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-700 leading-relaxed text-sm">
              {review.reviewText || 'No review text available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));

  const PaginationControls = React.memo(({ pagination, onPageChange }) => (
    <div className="flex justify-center items-center gap-2.5 mt-12">
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="group w-12 h-12 border-2 border-gray-200 rounded-xl text-black hover:text-white hover:bg-[#2E5077] hover:border-[#2E5077] transition-all duration-300 hover:scale-110 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
      >
        ‹
      </button>

      {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
        const pageNum = index + 1;
        const isActive = pageNum === pagination.currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-12 h-12 rounded-xl font-bold text-lg transition-all duration-300 ${isActive
              ? "bg-[#2E5077] text-white shadow-lg shadow-[#2E5077]/25 scale-110"
              : "border-2 border-gray-200 text-black hover:text-white hover:bg-[#2E5077] hover:border-[#2E5077] hover:scale-110"
              }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="group w-12 h-12 border-2 border-gray-200 rounded-xl text-black hover:text-white hover:bg-[#2E5077] hover:border-[#2E5077] transition-all duration-300 hover:scale-110 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
      >
        ›
      </button>
    </div>
  ));

  const LoadingSpinner = React.memo(() => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E5077]"></div>
    </div>
  ));

  const ErrorMessage = React.memo(({ message }) => (
    <div className="text-center py-16">
      <div className="text-red-500 text-xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Error</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="bg-[#2E5077] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a5f] transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  ));

  // Show loading spinner if essential data is still loading
  if (loading && !currentUser.name && !userStats.memberSince) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="h-32"></div>
        <LoadingSpinner />
        <div className="h-32"></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      <div className="h-32"></div>

      <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-none bg-white rounded-2xl shadow-xl shadow-gray-500/10 overflow-hidden">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#2E5077] via-[#2F5379] to-[#2E5077] p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#2E90EB] opacity-15 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="group relative">
                  <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 transition-all duration-700 group-hover:scale-105 group-hover:bg-white/20">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">{currentUser.name || "User"}</h1>
                  <p className="text-lg opacity-90 font-medium mb-1">{currentUser.email}</p>
                  <p className="text-sm opacity-75">
                    {currentUser.memberSince && `Member since ${currentUser.memberSince}`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSettingsClick}
                className="group bg-white/15 backdrop-blur-sm border border-white/20 cursor-pointer rounded-xl p-3 text-white hover:bg-white/25 transition-all duration-300 hover:scale-110"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-700 group-hover:rotate-180"
                >
                  <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-8 bg-gradient-to-br from-gray-50/50 to-white">
            <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2E5077]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-500">📅</div>
              <span className="text-xs text-gray-600 mb-1 font-medium tracking-wide uppercase text-center">Member Since</span>
              <span className="text-lg font-bold text-gray-900">{userStats.memberSince || "-"}</span>
            </div>

            <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2E5077]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-500">📋</div>
              <span className="text-xs text-gray-600 mb-1 font-medium tracking-wide uppercase text-center">Profile</span>
              <span className="text-lg font-bold text-green-600">{userStats.profileCompletion || "0%"}</span>
            </div>

            <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2E5077]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-500">🎫</div>
              <span className="text-xs text-gray-600 mb-1 font-medium tracking-wide uppercase text-center">Vouchers</span>
              <span className="text-lg font-bold text-blue-600">{userStats.activeVouchers || "0"}</span>
            </div>

            <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2E5077]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-500">📦</div>
              <span className="text-xs text-gray-600 mb-1 font-medium tracking-wide uppercase text-center">Orders</span>
              <span className="text-lg font-bold text-purple-600">{userStats.totalOrders || "0"}</span>
            </div>

            <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2E5077]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-500">💰</div>
              <span className="text-xs text-gray-600 mb-1 font-medium tracking-wide uppercase text-center">Total Spent</span>
              <span className="text-sm font-bold text-green-600">{userStats.totalSpent || "Rp 0"}</span>
            </div>
          </div>

          <div className="px-8 pt-6">
            <div className="flex justify-between items-center">
              <div className="inline-flex bg-gray-100 rounded-xl p-1.5">
                <button
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-wide rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "purchase"
                    ? "bg-[#2E5077] text-white shadow-lg shadow-[#2E5077]/25 scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                  onClick={() => handleTabChange("purchase")}
                >
                  Purchase History
                </button>
                <button
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-wide rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "reviews"
                    ? "bg-[#2E5077] text-white shadow-lg shadow-[#2E5077]/25 scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                  onClick={() => handleTabChange("reviews")}
                >
                  My Reviews
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <>
                {activeTab === "purchase" && (
                  <div className="space-y-6">
                    {purchaseHistory.length > 0 ? (
                      <>
                        {purchaseHistory.map((item) => (
                          <PurchaseCard key={item.id} item={item} />
                        ))}
                        {purchasePagination.totalPages > 1 && (
                          <PaginationControls
                            pagination={purchasePagination}
                            onPageChange={handlePurchasePagination}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-gray-400 text-8xl mb-6">📦</div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">No Purchase History</h3>
                        <p className="text-gray-500 text-lg">You haven't made any purchases yet.</p>
                        <button 
                          className="mt-6 bg-[#2E5077] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1e3a5f] transition-colors cursor-pointer"
                          onClick={() => navigate("/catalog")}
                        >
                          Browse Services
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-8">
                    {reviews.length > 0 ? (
                      <>
                        {reviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                        {reviewsPagination.totalPages > 1 && (
                          <PaginationControls
                            pagination={reviewsPagination}
                            onPageChange={handleReviewsPagination}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-gray-400 text-8xl mb-6">⭐</div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">No Reviews Yet</h3>
                        <p className="text-gray-500 text-lg">You haven't written any reviews yet.</p>
                        <button
                          className="mt-6 bg-[#2E5077] text-white px-8 py-3 rounded-lg cursor-pointer font-medium hover:bg-[#1e3a5f] transition-colors"
                          onClick={() => handleTabChange("purchase")}
                        >
                          View Purchase History
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-32"></div>

      <Footer />
    </div>
  );
};

export default UserProfile;