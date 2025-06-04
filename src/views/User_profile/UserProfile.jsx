import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { userAPI } from "../../constants/APIRoutes";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import default_avatar from "../../assets/default-avatar.png";
import { socket } from "../../App";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("purchase");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const abortControllerRef = useRef(null);

  // Improved caching system
  const dataCache = useRef({
    purchase: {
      data: [],
      pagination: { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      loaded: false,
      loading: false
    },
    reviews: {
      data: [],
      pagination: { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      loaded: false,
      loading: false
    },
    userProfile: null,
    userStats: null
  });

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

  // Utility function to normalize delivery status
  const normalizeDeliveryStatus = useCallback((deliveryInfo, status) => {
    if (!deliveryInfo || deliveryInfo === 'N/A' || deliveryInfo === 'null' || deliveryInfo === 'undefined') {
      if (status && (status.includes('completed') || status.includes('delivered'))) {
        return 'Delivered on time';
      }
      return 'Standard delivery';
    }

    const cleaned = deliveryInfo.toLowerCase().trim();
    if (cleaned.includes('on time') || cleaned.includes('ontime')) {
      return 'Delivered on time';
    }
    if (cleaned.includes('late') || cleaned.includes('delayed')) {
      return 'Delivered late';
    }
    if (cleaned.includes('fast') || cleaned.includes('quick') || cleaned.includes('rapid')) {
      return 'Fast delivery';
    }
    if (cleaned.includes('standard') || cleaned.includes('normal')) {
      return 'Standard delivery';
    }

    return deliveryInfo;
  }, []);

  const getCurrentUserId = useMemo(() => {
    return auth?.data?.auth?.id || userId;
  }, [auth?.data?.auth?.id, userId]);

  const fallbackImage = useMemo(() => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='224' viewBox='0 0 320 224'%3E%3Crect width='320' height='224' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image Available%3C/text%3E%3C/svg%3E";
  }, []);

  const processImageUrl = useCallback((imageUrl, imageUrls, itemTitle = '') => {
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '' || imageUrl === 'temp') {
      return fallbackImage;
    }

    if (imageUrl.startsWith('data:')) return imageUrl;
    if (imageUrls?.primary) return imageUrls.primary;
    if (imageUrl.includes('drive.google.com/thumbnail') || imageUrl.includes('googleusercontent.com')) return imageUrl;

    if (imageUrl.length > 10 && !imageUrl.includes('http')) {
      return `https://drive.google.com/thumbnail?id=${imageUrl}&sz=w400-h300`;
    }

    const idMatch = imageUrl.match(/\/d\/([^\/]+)/) || imageUrl.match(/id=([^&]+)/);
    if (idMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w400-h300`;
    }

    return imageUrl;
  }, [fallbackImage]);

  const handleImageError = useCallback((e) => {
    const img = e.target;
    if (img.src !== fallbackImage) {
      img.src = fallbackImage;
    }
  }, [fallbackImage]);

  // Enhanced status detection with better logic for manage order button
  const getStatusInfo = useCallback((item) => {
    const status = (item.status || '').toLowerCase();
    const statusType = (item.statusType || '').toLowerCase();
    const orderStatus = (item.orderStatus || '').toLowerCase();
    const paymentStatus = (item.paymentStatus || '').toLowerCase();
    const hasValidOrderNumber = item.orderNumber && item.orderNumber !== 'N/A' && item.orderNumber !== 'null' && item.orderNumber !== 'undefined';

    console.log('🔍 Analyzing status for:', item.title || 'Unknown item');
    console.log('   - status:', item.status);
    console.log('   - statusType:', item.statusType);
    console.log('   - orderNumber:', item.orderNumber);
    console.log('   - hasValidOrderNumber:', hasValidOrderNumber);

    // Enhanced logic for showing manage order button
    if (statusType === 'progress' || status.includes('progress') || 
        status.includes('processing') || status.includes('ongoing') || 
        status.includes('active') || status.includes('pending') ||
        status.includes('in progress') || statusType === 'processing') {
      console.log('   🟡 Detected as: IN PROGRESS - Show Manage Order');
      return { 
        type: 'progress', 
        color: 'orange', 
        display: item.status || 'In Progress',
        showManageOrder: hasValidOrderNumber 
      };
    }
    // Handle completed status
    else if (statusType === 'completed' || status.includes('completed') || 
             status.includes('delivered') || status.includes('done') || 
             statusType === 'delivered') {
      console.log('   ✅ Detected as: COMPLETED');
      return { 
        type: 'completed', 
        color: 'green', 
        display: item.status || 'Completed',
        showManageOrder: false 
      };
    }
    // Handle cancelled status
    else if (status.includes('cancelled') || status.includes('canceled') ||
             status.includes('failed') || status.includes('rejected') ||
             statusType === 'cancelled' || statusType === 'canceled') {
      console.log('   ❌ Detected as: CANCELLED');
      return { 
        type: 'cancelled', 
        color: 'red', 
        display: item.status || 'Cancelled',
        showManageOrder: false 
      };
    } 
    // Default - show manage order for any order with valid order number
    else {
      console.log('   ❓ Status unclear, checking order number');
      return { 
        type: 'unknown', 
        color: 'gray', 
        display: item.status || 'Processing',
        showManageOrder: hasValidOrderNumber 
      };
    }
  }, []);

  const makeAPICall = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          withCredentials: true,
          timeout: 10000,
          ...options
        }
      );
      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }, []);

  // Enhanced handler for manage order with better validation
  const handleViewDetails = useCallback((orderNumber, item) => {
    console.log('🔍 Attempting to view order details:', orderNumber);
    
    if (orderNumber && orderNumber !== 'N/A' && orderNumber !== 'null' && orderNumber !== 'undefined') {
      console.log('✅ Navigating to manage order:', orderNumber);
      navigate(`/manage-order/${orderNumber}`);
    } else {
      console.log('❌ Invalid order number, cannot navigate');
      // Fallback - try to use item ID or show error
      if (item?.id) {
        console.log('🔄 Using item ID as fallback:', item.id);
        navigate(`/manage-order/${item.id}`);
      } else {
        alert('Order details not available');
      }
    }
  }, [navigate]);

  const handleBuyAgain = useCallback((item) => {
    const serviceId = item.serviceId || item.id;
    if (serviceId) {
      navigate(`/detail/${serviceId}`);
    }
  }, [navigate]);

  const handleContactSeller = useCallback((item) => {
    const sellerId = item.sellerId || item.seller;
    socket.emit("create_room", [sellerId, getCurrentUserId])
    const handleSwitchRoom = (url) => {
      console.log("Navigating to chat:", url);
      navigate(url);
      socket.off("switch_room", handleSwitchRoom);
    };

    socket.on("switch_room", handleSwitchRoom);
  }, [navigate, getCurrentUserId]);

  const fetchUserStats = useCallback(async () => {
    if (!getCurrentUserId) return;

    try {
      const data = await makeAPICall(`${userAPI}/user-stats/${getCurrentUserId}`);

      if (data && data.stats) {
        setUserStats(data.stats);
      } else {
        setUserStats({
          memberSince: new Date().getFullYear().toString(),
          profileCompletion: "0%",
          activeVouchers: "0",
          totalOrders: "0",
          totalSpent: "Rp 0"
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setUserStats({
        memberSince: new Date().getFullYear().toString(),
        profileCompletion: "0%",
        activeVouchers: "0",
        totalOrders: "0",
        totalSpent: "Rp 0"
      });
    }
  }, [getCurrentUserId, makeAPICall]);

  const fetchPurchaseHistory = useCallback(async (page = 1, force = false) => {
    if (!getCurrentUserId) return;

    const cache = dataCache.current.purchase;
    if (!force && cache.loaded && page === 1) {
      setPurchaseHistory(cache.data);
      setPurchasePagination(cache.pagination);
      return;
    }

    if (cache.loading) return;

    try {
      cache.loading = true;
      setLoading(true);
      setError(null);

      const data = await makeAPICall(
        `${userAPI}/purchase-history/${getCurrentUserId}?page=${page}&limit=10`
      );

      if (data && data.purchaseHistory) {
        const { purchaseHistory, pagination } = data;

        const processedHistory = purchaseHistory.map(item => ({
          ...item,
          image: processImageUrl(item.image, item.imageUrls, item.title),
          id: item.id || `purchase-${Date.now()}-${Math.random()}`,
          deliveryTime: normalizeDeliveryStatus(
            item.deliveryTime || item.delivery,
            item.status || item.orderStatus
          ),
          paymentStatus: item.paymentStatus === 'processing' ? 'paid' : item.paymentStatus
        }));

        cache.data = processedHistory;
        cache.pagination = {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage
        };
        cache.loaded = true;

        setPurchaseHistory(processedHistory);
        setPurchasePagination(cache.pagination);
      } else {
        const emptyState = {
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
          },
          loaded: true
        };

        cache.data = emptyState.data;
        cache.pagination = emptyState.pagination;
        cache.loaded = emptyState.loaded;

        setPurchaseHistory(emptyState.data);
        setPurchasePagination(emptyState.pagination);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setError("Failed to load purchase history");
      setPurchaseHistory([]);
    } finally {
      cache.loading = false;
      setLoading(false);
    }
  }, [getCurrentUserId, makeAPICall, processImageUrl, normalizeDeliveryStatus]);

  const fetchReviews = useCallback(async (page = 1, force = false) => {
    if (!getCurrentUserId) return;

    const cache = dataCache.current.reviews;
    if (!force && cache.loaded && page === 1) {
      setReviews(cache.data);
      setReviewsPagination(cache.pagination);
      return;
    }

    if (cache.loading) return;

    try {
      cache.loading = true;
      setLoading(true);
      setError(null);

      const data = await makeAPICall(
        `${userAPI}/user-reviews/${getCurrentUserId}?page=${page}&limit=10`
      );

      if (data && data.reviews) {
        const { reviews, pagination } = data;

        const processedReviews = reviews.map(review => ({
          ...review,
          image: processImageUrl(review.image, review.imageUrls, review.title),
          id: review.id || review._id || `review-${Date.now()}-${Math.random()}`,
          reviewText: review.reviewText || review.comment || review.review || review.description || '',
          serviceTitle: review.title || review.serviceName || review.service || 'Unknown Service',
          serviceSeller: review.seller || review.freelancer || review.provider || 'Unknown Seller',
          servicePrice: review.price || 'Rp 0',
          userRating: review.rating || review.userRating || 0,
          reviewDate: review.date || review.createdAt || review.reviewDate || new Date().toISOString(),
          orderId: review.orderId || review.orderNumber || review.order || 'N/A',
          category: review.category || 'General',
          deliveryTime: normalizeDeliveryStatus(
            review.deliveryTime || review.delivery,
            'completed'
          ),
          verified: review.verified !== false,
          orderStatus: 'completed',
          description: review.description || review.serviceDescription || 'Professional service provided'
        }));

        cache.data = processedReviews;
        cache.pagination = {
          currentPage: pagination?.currentPage || 1,
          totalPages: pagination?.totalPages || 1,
          hasNextPage: pagination?.hasNextPage || false,
          hasPrevPage: pagination?.hasPrevPage || false
        };
        cache.loaded = true;

        setReviews(processedReviews);
        setReviewsPagination(cache.pagination);
      } else {
        const emptyState = {
          data: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          },
          loaded: true
        };

        cache.data = emptyState.data;
        cache.pagination = emptyState.pagination;
        cache.loaded = emptyState.loaded;

        setReviews(emptyState.data);
        setReviewsPagination(emptyState.pagination);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      const emptyState = {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        },
        loaded: true
      };

      cache.data = emptyState.data;
      cache.pagination = emptyState.pagination;
      cache.loaded = emptyState.loaded;

      setReviews(emptyState.data);
      setReviewsPagination(emptyState.pagination);

      if (error.response?.status && error.response.status !== 404) {
        setError("Failed to load reviews");
      }
    } finally {
      cache.loading = false;
      setLoading(false);
    }
  }, [getCurrentUserId, makeAPICall, processImageUrl, normalizeDeliveryStatus]);

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        if (auth?.data?.auth) {
          setCurrentUser({
            name: auth.data.auth.name || "",
            email: auth.data.auth.email || "",
            memberSince: auth.data.auth.joinedDate ? new Date(auth.data.auth.joinedDate).getFullYear().toString() : ""
          });
        }

        await fetchUserStats();

        if (activeTab === "purchase") {
          await fetchPurchaseHistory(1);
        }

      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
      } finally {
        setInitialLoading(false);
      }
    };

    if (getCurrentUserId) {
      loadInitialData();
    }
  }, [auth?.data?.auth?.id, userId, getCurrentUserId, fetchUserStats, fetchPurchaseHistory, activeTab]);

  const handleTabChange = useCallback(async (tab) => {
    setActiveTab(tab);
    setError(null);

    if (tab === "purchase") {
      const cache = dataCache.current.purchase;
      if (cache.loaded) {
        setPurchaseHistory(cache.data);
        setPurchasePagination(cache.pagination);
      } else if (!cache.loading) {
        fetchPurchaseHistory(1);
      }
    } else if (tab === "reviews") {
      const cache = dataCache.current.reviews;
      if (cache.loaded) {
        setReviews(cache.data);
        setReviewsPagination(cache.pagination);
      } else if (!cache.loading) {
        fetchReviews(1);
      }
    }
  }, [fetchPurchaseHistory, fetchReviews]);

  const handlePurchasePagination = useCallback(async (page) => {
    await fetchPurchaseHistory(page, true);
  }, [fetchPurchaseHistory]);

  const handleReviewsPagination = useCallback(async (page) => {
    await fetchReviews(page, true);
  }, [fetchReviews]);

  const handleSettingsClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  // Enhanced Purchase Card with better design and manage order button
  const PurchaseCard = React.memo(({ item }) => {
    const statusInfo = useMemo(() => getStatusInfo(item), [item, getStatusInfo]);

    return (
      <div className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-3xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row">
          {/* Enhanced Image Section */}
          <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-60 relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              src={item.image}
              alt={item.title || 'Product image'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
            {/* Status overlay */}
            <div className="absolute top-4 left-4 z-20">
              <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-xl backdrop-blur-md border transition-all duration-300 transform group-hover:scale-105 ${
                statusInfo.type === "progress"
                  ? "bg-orange-100/90 text-orange-800 border-orange-300/50"
                  : statusInfo.type === "completed"
                    ? "bg-green-100/90 text-green-800 border-green-300/50"
                    : statusInfo.type === "cancelled"
                      ? "bg-red-100/90 text-red-800 border-red-300/50"
                      : "bg-gray-100/90 text-gray-800 border-gray-300/50"
              }`}>
                {statusInfo.display}
              </span>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="flex-1 p-8 relative">
            <div className="flex justify-between items-start h-full">
              <div className="flex-1 space-y-4">
                {/* Category Tags */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(item.category) ? (
                    item.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-100/80"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1.5 bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-100/80">
                      {item.category || 'General'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {item.title || 'Untitled Service'}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                  {item.description || 'No description available'}
                </p>

                {/* Seller Info */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white">
                      <span className="text-white text-sm font-bold">
                        {(item.seller || 'U').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 block">
                        {item.seller || 'Unknown Seller'}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(item.sellerRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">{item.sellerRating || '0.0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span className="font-medium">Order: {item.orderNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                    </svg>
                    <span>{item.date || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.deliveryTime || 'Standard delivery'}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Section */}
              <div className="flex flex-col items-end gap-4 ml-8">
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                    {item.price || 'Rp 0'}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Show Manage Order button for orders with valid order numbers */}
                  {statusInfo.showManageOrder && (
                    <button
                      onClick={() => handleViewDetails(item.orderNumber, item)}
                      className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Manage Order
                      </span>
                    </button>
                  )}

                  {/* Show Buy Again and Contact Seller for completed orders */}
                  {(statusInfo.type === "completed" || statusInfo.type === "delivered") && !statusInfo.showManageOrder && (
                    <>
                      <button
                        onClick={() => handleBuyAgain(item)}
                        className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Buy Again
                        </span>
                      </button>
                      <button
                        onClick={() => handleContactSeller(item)}
                        className="px-8 py-3 rounded-2xl font-semibold border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                      >
                        Contact Seller
                      </button>
                    </>
                  )}

                  {/* Show Buy Again for cancelled orders */}
                  {statusInfo.type === "cancelled" && (
                    <button
                      onClick={() => handleBuyAgain(item)}
                      className="group relative bg-gradient-to-r from-gray-500 to-slate-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/40 overflow-hidden"
                    >
                      <span className="relative z-10">Buy Again</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [getStatusInfo, handleViewDetails, handleBuyAgain, handleContactSeller, handleImageError]);

  // Enhanced Review Card with better design
  const ReviewCard = React.memo(({ review }) => (
    <div className="group relative bg-gradient-to-br from-white to-green-50/30 rounded-3xl border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Enhanced Image Section */}
        <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-60 relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          <img
            src={review.image}
            alt={review.serviceTitle || 'Service image'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
          {/* Review badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-4 py-2 bg-green-100/90 text-green-800 border border-green-300/50 rounded-2xl text-sm font-bold shadow-xl backdrop-blur-md transition-all duration-300 transform group-hover:scale-105">
              ⭐ REVIEWED
            </span>
          </div>
          {/* Rating overlay */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg">
              <span className="text-sm font-semibold text-gray-700">Your rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className={`w-4 h-4 ${index < Math.floor(review.userRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="flex-1 p-8 relative">
          <div className="flex justify-between items-start h-full">
            <div className="flex-1 space-y-4">
              {/* Category and Status Tags */}
              <div className="flex flex-wrap gap-2">
                {Array.isArray(review.category) ? (
                  review.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-green-50/80 text-green-700 text-xs font-semibold rounded-full border border-green-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-100/80"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1.5 bg-green-50/80 text-green-700 text-xs font-semibold rounded-full border border-green-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-100/80">
                    {review.category || 'General'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                {review.serviceTitle || 'Untitled Service'}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                {review.description || 'Professional service provided'}
              </p>

              {/* Seller Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white">
                    <span className="text-white text-sm font-bold">
                      {(review.serviceSeller || 'U').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 block">
                      {review.serviceSeller || 'Unknown Seller'}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < Math.floor(review.sellerRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">{review.sellerRating || '0.0'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span className="font-medium">Order: {review.orderId || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                  </svg>
                  <span>{review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{review.deliveryTime || 'Delivered on time'}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Action Section */}
            <div className="flex flex-col items-end gap-4 ml-8">
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
                  {review.servicePrice || 'Rp 0'}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleBuyAgain({
                    serviceId: review.serviceId,
                    id: review.serviceId,
                    title: review.serviceTitle
                  })}
                  className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Buy Again
                  </span>
                </button>
                <button
                  onClick={() => handleContactSeller({
                    sellerId: review.sellerId,
                    seller: review.serviceSeller
                  })}
                  className="px-8 py-3 rounded-2xl font-semibold border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Review Text Section */}
          <div className="mt-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-2xl p-6 border border-green-100/50 group-hover:border-green-200/70 group-hover:shadow-lg transition-all duration-500 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                My Review
              </h4>
            </div>
            <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 text-base">
              "{review.reviewText || 'No review text provided.'}"
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [handleBuyAgain, handleContactSeller, handleImageError]);

  const PaginationControls = React.memo(({ pagination, onPageChange }) => (
    <div className="flex justify-center items-center gap-4 mt-16">
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="group w-14 h-14 border-2 border-gray-200 rounded-2xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent transition-all duration-300 hover:scale-110 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
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
            className={`w-14 h-14 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-110"
                : "border-2 border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent hover:scale-105"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="group w-14 h-14 border-2 border-gray-200 rounded-2xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent transition-all duration-300 hover:scale-110 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
      >
        ›
      </button>
    </div>
  ));

  const LoadingSpinner = React.memo(() => (
    <div className="space-y-8">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gradient-to-br from-white to-gray-50/30 rounded-3xl border border-gray-200/50 overflow-hidden animate-pulse">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-60 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="flex-1 p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  </div>
                  <div className="w-3/4 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                  <div className="w-full h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="w-1/2 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="w-1/3 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                </div>
                <div className="flex flex-col items-end gap-3 ml-6">
                  <div className="w-24 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                  <div className="w-32 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ));

  const ErrorMessage = React.memo(({ message }) => (
    <div className="text-center py-20">
      <div className="text-red-500 text-8xl mb-8">⚠️</div>
      <h3 className="text-3xl font-bold text-gray-600 mb-4">Oops! Something went wrong</h3>
      <p className="text-gray-500 mb-8 text-xl">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="group relative bg-gradient-to-r from-red-500 to-pink-600 text-white px-10 py-4 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 font-semibold text-lg overflow-hidden"
      >
        <span className="relative z-10">Try Again</span>
      </button>
    </div>
  ));

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="h-32"></div>
        <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-none bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-500/20 overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 relative overflow-hidden">
              <div className="relative z-10 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 rounded-3xl animate-pulse"></div>
                  <div>
                    <div className="w-64 h-10 bg-white/20 rounded-xl mb-3 animate-pulse"></div>
                    <div className="w-80 h-7 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
                    <div className="w-40 h-5 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-32"></div>
                  </div>
                ))}
              </div>
              <LoadingSpinner />
            </div>
          </div>
        </div>
        <div className="h-32"></div>
        <Footer />
      </div>
    );
  }

 return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      <div className="h-32"></div>

      <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="max-w-none bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-500/20 overflow-hidden border border-white/50">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 text-white">
            {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg" width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg%3E%3Cg" fill="none" fill-rule="evenodd%3E%3Cg" fill="%23ffffff" fill-opacity="0.1" cx="30" cy="30" r="2")></div> */}
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="group relative">
                  <div className="w-28 h-28 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/30 transition-all duration-700 group-hover:scale-110 overflow-hidden shadow-2xl ring-4 ring-white/20">
                    <img
                      className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
                      src={auth?.data?.auth?.picture === "temp"
                        ? default_avatar
                        : `${imageShow}${auth?.data?.auth?.picture}`}
                      alt="profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = default_avatar;
                      }}
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-4 tracking-tight text-white filter drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                    {auth?.data?.auth?.name || "User"}
                  </h1>
                  <p className="text-xl opacity-90 font-medium filter drop-shadow-sm">{auth?.data?.auth?.email}</p>
                </div>
              </div>

              <button
                onClick={handleSettingsClick}
                className="group bg-white/15 backdrop-blur-sm border-2 border-white/30 cursor-pointer rounded-3xl p-5 text-white hover:bg-white/25 hover:border-white/50 transition-all duration-500 hover:scale-125 shadow-xl hover:shadow-2xl ring-2 ring-white/10 hover:ring-white/20"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-1000 group-hover:rotate-180 filter drop-shadow-lg"
                >
                  <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
            <div className="group relative flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 hover:border-blue-300/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-4xl mb-4">📅</div>
              <span className="relative z-10 text-xs text-gray-600 mb-3 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Member Since</span>
              <span className="relative z-10 text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-all duration-300">{userStats.memberSince || "-"}</span>
            </div>

            <div className="group relative flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 hover:border-green-300/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-4xl mb-4">📋</div>
              <span className="relative z-10 text-xs text-gray-600 mb-3 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Profile</span>
              <span className="relative z-10 text-2xl font-bold text-green-600 transition-all duration-300">{userStats.profileCompletion || "0%"}</span>
            </div>

            <div className="group relative flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 hover:border-purple-300/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-4xl mb-4">🎫</div>
              <span className="relative z-10 text-xs text-gray-600 mb-3 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Vouchers</span>
              <span className="relative z-10 text-2xl font-bold text-purple-600 transition-all duration-300">{userStats.activeVouchers || "0"}</span>
            </div>

            <div className="group relative flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 hover:border-orange-300/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-4xl mb-4">📦</div>
              <span className="relative z-10 text-xs text-gray-600 mb-3 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Orders</span>
              <span className="relative z-10 text-2xl font-bold text-orange-600 transition-all duration-300">{userStats.totalOrders || "0"}</span>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="px-8 pt-8 bg-white/80 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/60 gap-2">
                <button
                  className={`px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden whitespace-nowrap ${
                    activeTab === "purchase"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 z-10 scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:shadow-md z-0 hover:scale-105"
                  }`}
                  onClick={() => handleTabChange("purchase")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Purchase History
                  </span>
                </button>
                <button
                  className={`px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg shadow-green-500/25 z-10 scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:shadow-md z-0 hover:scale-105"
                  }`}
                  onClick={() => handleTabChange("reviews")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    My Reviews
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 bg-white/80 backdrop-blur-sm">
            {loading && (!dataCache.current[activeTab].loaded || dataCache.current[activeTab].data.length === 0) ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <>
                {activeTab === "purchase" && (
                  <div className="space-y-10">
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
                      <div className="text-center py-24 relative">
                        <div className="text-gray-300 text-9xl mb-10">📦</div>
                        <h3 className="text-4xl font-bold text-gray-600 mb-6">No Purchase History</h3>
                        <p className="text-gray-500 text-xl mb-10">You haven't made any purchases yet.</p>
                        <button
                          className="group relative mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-5 rounded-3xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 text-xl overflow-hidden"
                          onClick={() => navigate("/catalog")}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Browse Services
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-10">
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
                      <div className="text-center py-24 relative">
                        <div className="text-gray-300 text-9xl mb-10">📝</div>
                        <h3 className="text-4xl font-bold text-gray-600 mb-6">No Reviews Written Yet</h3>
                        <p className="text-gray-500 text-xl mb-4">You haven't written any reviews for completed orders yet.</p>
                        <p className="text-gray-400 text-base mb-10">Reviews can only be written after your orders are completed or delivered.</p>
                        <button
                          className="group relative mt-8 bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-5 rounded-3xl cursor-pointer font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 text-xl overflow-hidden"
                          onClick={() => handleTabChange("purchase")}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View Purchase History
                          </span>
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
  </>
  );
};
export default UserProfile;