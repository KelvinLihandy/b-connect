import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { userAPI } from "../../constants/APIRoutes";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import default_avatar from "../../assets/default-avatar.png";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("purchase");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const abortControllerRef = useRef(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

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
      // Default based on order status
      if (status && (status.includes('completed') || status.includes('delivered'))) {
        return 'Delivered on time';
      }
      return 'Standard delivery';
    }
    
    // Clean up common variations
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

  // Optimized fallback image (memoized)
  const fallbackImage = useMemo(() => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='224' viewBox='0 0 320 224'%3E%3Crect width='320' height='224' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image Available%3C/text%3E%3C/svg%3E";
  }, []);

  // Optimized image processing (reduced complexity)
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

  // Simplified image error handler
  const handleImageError = useCallback((e) => {
    const img = e.target;
    if (img.src !== fallbackImage) {
      img.src = fallbackImage;
    }
  }, [fallbackImage]);

  // Improved status calculation - no more "processing payment"
  const getStatusInfo = useMemo(() => {
    const statusCache = new Map();
    
    return (item) => {
      const cacheKey = `${item.status}-${item.statusType}-${item.orderStatus}-${item.paymentStatus}-${item.completed}-${item.delivered}`;
      if (statusCache.has(cacheKey)) {
        return statusCache.get(cacheKey);
      }
      
      const status = (item.status || '').toLowerCase();
      const statusType = (item.statusType || '').toLowerCase();
      const orderStatus = (item.orderStatus || '').toLowerCase();
      const paymentStatus = (item.paymentStatus || '').toLowerCase();
      const completed = item.completed;
      const delivered = item.delivered;
      
      let result;
      
      // Cancelled/Failed orders
      if (status.includes('cancelled') || status.includes('canceled') || 
          status.includes('failed') || status.includes('rejected') || 
          status.includes('expire') || status.includes('refund') ||
          statusType === 'cancelled' || statusType === 'canceled' || 
          statusType === 'failed' || statusType === 'rejected' ||
          orderStatus === 'cancelled' || orderStatus === 'failed' ||
          paymentStatus === 'failed' || paymentStatus === 'cancelled') {
        result = { type: 'cancelled', color: 'red', display: 'Cancelled' };
      }
      // Completed orders (payment already processed if user can see the order)
      else if (completed === true || delivered === true ||
               status.includes('completed') || status.includes('delivered') || 
               status.includes('settlement') || status.includes('capture') || 
               status.includes('done') || status.includes('finish') || status.includes('success') ||
               statusType === 'delivered' || statusType === 'completed' || 
               statusType === 'settlement' || statusType === 'capture' || 
               statusType === 'success' ||
               orderStatus === 'completed' || orderStatus === 'delivered' ||
               orderStatus === 'finished' || paymentStatus === 'settlement' ||
               paymentStatus === 'capture') {
        result = { type: 'delivered', color: 'green', display: 'Completed' };
      }
      // In Progress orders (payment already confirmed, work in progress)
      else {
        result = { type: 'progress', color: 'orange', display: 'In Progress' };
      }
      
      statusCache.set(cacheKey, result);
      return result;
    };
  }, []);

  const isOrderCompleted = useCallback((item) => {
    const status = (item.status || '').toLowerCase();
    const statusType = (item.statusType || '').toLowerCase();
    const orderStatus = (item.orderStatus || '').toLowerCase();
    const paymentStatus = (item.paymentStatus || '').toLowerCase();
    
    return (
      item.completed === true || 
      item.delivered === true ||
      status.includes('completed') || 
      status.includes('delivered') || 
      status.includes('settlement') || 
      status.includes('capture') || 
      status.includes('done') || 
      status.includes('finish') || 
      status.includes('success') ||
      statusType === 'delivered' || 
      statusType === 'completed' || 
      statusType === 'settlement' || 
      statusType === 'capture' || 
      statusType === 'success' ||
      orderStatus === 'completed' ||
      orderStatus === 'delivered' ||
      orderStatus === 'finished' ||
      paymentStatus === 'settlement' ||
      paymentStatus === 'capture'
    ) && !(
      status.includes('cancelled') || 
      status.includes('canceled') || 
      status.includes('failed') || 
      status.includes('rejected') || 
      status.includes('expire') || 
      status.includes('refund') ||
      statusType === 'cancelled' || 
      statusType === 'canceled' || 
      statusType === 'failed' || 
      statusType === 'rejected' ||
      orderStatus === 'cancelled' || 
      orderStatus === 'failed' ||
      paymentStatus === 'failed' || 
      paymentStatus === 'cancelled'
    );
  }, []);

  const handleViewDetails = useCallback((orderNumber) => {
    if (orderNumber) {
      navigate(`/manage-order/${orderNumber}`);
    }
  }, [navigate]);

  const handleBuyAgain = useCallback((item) => {
    const serviceId = item.serviceId || item.id;
    if (serviceId) {
      navigate(`/service/${serviceId}`);
    }
  }, [navigate]);

  const handleContactSeller = useCallback((item) => {
    const sellerId = item.sellerId || item.seller;
    if (sellerId) {
      navigate(`/chat/${sellerId}`);
    }
  }, [navigate]);

  const handleWriteReview = useCallback((item) => {
    setReviewModalData(item);
    setShowReviewModal(true);
  }, []);

  const handleCloseReviewModal = useCallback(() => {
    setShowReviewModal(false);
    setReviewModalData(null);
  }, []);

  const submitReview = useCallback(async (reviewData) => {
    if (!reviewModalData) return;

    setReviewSubmitting(true);
    try {
      const submitData = {
        orderId: reviewModalData.orderId || reviewModalData.orderNumber,
        serviceId: reviewModalData.serviceId || reviewModalData.id,
        sellerId: reviewModalData.sellerId || reviewModalData.seller,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText,
        deliveryRating: reviewData.deliveryRating,
        communicationRating: reviewData.communicationRating,
        qualityRating: reviewData.qualityRating,
        wouldRecommend: reviewData.wouldRecommend
      };

      const response = await axios.post(
        `${userAPI}/submit-review`,
        submitData,
        { withCredentials: true }
      );

      if (response.data.success) {
        const newReview = {
          id: `review-${Date.now()}`,
          ...reviewModalData,
          reviewText: reviewData.reviewText,
          userRating: reviewData.rating,
          deliveryRating: reviewData.deliveryRating,
          communicationRating: reviewData.communicationRating,
          qualityRating: reviewData.qualityRating,
          wouldRecommend: reviewData.wouldRecommend,
          reviewDate: new Date().toISOString(),
          verified: true,
          orderStatus: 'completed',
          serviceTitle: reviewModalData.title,
          serviceSeller: reviewModalData.seller,
          servicePrice: reviewModalData.price,
          hasReview: true
        };

        // Update reviews cache
        dataCache.current.reviews.data = [newReview, ...dataCache.current.reviews.data];
        setReviews(prev => [newReview, ...prev]);

        // Update purchase history cache
        const updatedPurchaseHistory = dataCache.current.purchase.data.map(item => 
          (item.orderId === reviewModalData.orderId || item.orderNumber === reviewModalData.orderNumber)
            ? { ...item, hasReview: true, rating: reviewData.rating }
            : item
        );
        dataCache.current.purchase.data = updatedPurchaseHistory;
        setPurchaseHistory(updatedPurchaseHistory);

        handleCloseReviewModal();
        
        if (activeTab !== "reviews") {
          setActiveTab("reviews");
        }

        alert("Review berhasil dikirim!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Gagal mengirim review. Silakan coba lagi.");
    } finally {
      setReviewSubmitting(false);
    }
  }, [reviewModalData, activeTab, handleCloseReviewModal]);

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

    // Check cache first
    const cache = dataCache.current.purchase;
    if (!force && cache.loaded && page === 1) {
      setPurchaseHistory(cache.data);
      setPurchasePagination(cache.pagination);
      return;
    }

    // Prevent duplicate requests
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
          // Ensure consistent delivery status format
          deliveryTime: normalizeDeliveryStatus(
            item.deliveryTime || item.delivery, 
            item.status || item.orderStatus
          ),
          // Clean up payment status - no "processing payment" for visible orders
          paymentStatus: item.paymentStatus === 'processing' ? 'paid' : item.paymentStatus
        }));

        // Update cache
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

    // Check cache first
    const cache = dataCache.current.reviews;
    if (!force && cache.loaded && page === 1) {
      setReviews(cache.data);
      setReviewsPagination(cache.pagination);
      return;
    }

    // Prevent duplicate requests
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
          // Consistent delivery status format
          deliveryTime: normalizeDeliveryStatus(
            review.deliveryTime || review.delivery, 
            'completed'
          ),
          verified: review.verified !== false,
          orderStatus: 'completed', // Reviews only exist for completed orders
          // Additional service info for consistency
          description: review.description || review.serviceDescription || 'Professional service provided'
        }));

        // Update cache
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

  // Optimized tab change handler - instant switching
  const handleTabChange = useCallback(async (tab) => {
    setActiveTab(tab);
    setError(null);

    // Instant tab switch - load data in background if needed
    if (tab === "purchase") {
      const cache = dataCache.current.purchase;
      if (cache.loaded) {
        // Data already loaded, switch instantly
        setPurchaseHistory(cache.data);
        setPurchasePagination(cache.pagination);
      } else if (!cache.loading) {
        // Load data in background
        fetchPurchaseHistory(1);
      }
    } else if (tab === "reviews") {
      const cache = dataCache.current.reviews;
      if (cache.loaded) {
        // Data already loaded, switch instantly
        setReviews(cache.data);
        setReviewsPagination(cache.pagination);
      } else if (!cache.loading) {
        // Load data in background
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

  const ReviewModal = React.memo(() => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [deliveryRating, setDeliveryRating] = useState(5);
    const [communicationRating, setCommunicationRating] = useState(5);
    const [qualityRating, setQualityRating] = useState(5);
    const [wouldRecommend, setWouldRecommend] = useState(true);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (reviewText.trim().length < 10) {
        alert('Review must be at least 10 characters long');
        return;
      }
      
      await submitReview({
        rating,
        reviewText: reviewText.trim(),
        deliveryRating,
        communicationRating,
        qualityRating,
        wouldRecommend
      });
    };

    const StarRating = ({ value, onChange, size = "w-8 h-8" }) => (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`${size} transition-all duration-200 hover:scale-110 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );

    if (!showReviewModal || !reviewModalData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-[#2E5077] to-[#2E90EB] p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20">
                  <img
                    src={reviewModalData.image}
                    alt={reviewModalData.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold mb-1">Write Your Review</h2>
                  <p className="text-white/80 text-sm">{reviewModalData.title}</p>
                  <p className="text-white/60 text-xs">by {reviewModalData.seller}</p>
                </div>
              </div>
              <button
                onClick={handleCloseReviewModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-blue-800">Service Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <span className="ml-2 font-medium">{reviewModalData.orderNumber || reviewModalData.orderId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-2 font-medium text-green-600">{reviewModalData.price}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">{reviewModalData.date}</span>
                </div>
                <div>
                  <span className="text-gray-600">Delivery:</span>
                  <span className="ml-2 font-medium">{reviewModalData.deliveryTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <StarRating value={rating} onChange={setRating} />
                  <span className="text-lg font-bold text-gray-700">{rating}.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                  <StarRating value={qualityRating} onChange={setQualityRating} size="w-6 h-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Communication</label>
                  <StarRating value={communicationRating} onChange={setCommunicationRating} size="w-6 h-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <StarRating value={deliveryRating} onChange={setDeliveryRating} size="w-6 h-6" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this service. What did you like? What could be improved?"
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E5077] focus:border-transparent resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewText.length} characters (minimum 10 required)
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={wouldRecommend}
                    onChange={(e) => setWouldRecommend(e.target.checked)}
                    className="w-5 h-5 text-[#2E5077] rounded focus:ring-[#2E5077]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I would recommend this service to others
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseReviewModal}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reviewSubmitting || reviewText.trim().length < 10}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#2E5077] to-[#2E90EB] text-white rounded-xl hover:from-[#1e3a5f] hover:to-[#2180d1] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  });

  const PurchaseCard = React.memo(({ item }) => {
    const statusInfo = useMemo(() => getStatusInfo(item), [item, getStatusInfo]);
    
    return (
      <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-[#2E5077]/30 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-56">
            <img
              src={item.image}
              alt={item.title || 'Product image'}
              className="w-full h-full object-cover border-b lg:border-b-0 lg:border-r border-gray-200"
              onError={handleImageError}
              loading="lazy"
              data-image-urls={item.imageUrls ? JSON.stringify(item.imageUrls) : null}
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
                        handleViewDetails(item.orderNumber);
                      } else {
                        handleBuyAgain(item);
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
                    <>
                      <button 
                        onClick={() => handleContactSeller(item)}
                        className="px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#2E5077] text-[#2E5077] hover:bg-[#2E5077] hover:text-white transition-all duration-300"
                      >
                        Contact Seller
                      </button>
                      
                      {!item.hasReview && (
                        <button 
                          onClick={() => handleWriteReview(item)}
                          className="px-6 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                        >
                          Write Review
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [getStatusInfo, handleViewDetails, handleBuyAgain, handleContactSeller, handleWriteReview, handleImageError]);

  const ReviewCard = React.memo(({ review }) => (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-[#2E5077]/30 transition-all duration-300 hover:shadow-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-56">
          <img
            src={review.image}
            alt={review.serviceTitle || 'Service image'}
            className="w-full h-full object-cover border-b lg:border-b-0 lg:border-r border-gray-200"
            onError={handleImageError}
            loading="lazy"
            data-image-urls={review.imageUrls ? JSON.stringify(review.imageUrls) : null}
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {review.category || 'General'}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  REVIEWED
                </span>
                {review.verified && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Review
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                {review.serviceTitle || 'Untitled Service'}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {review.description || 'Professional service provided'}
              </p>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#2E5077] to-[#2E90EB] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {(review.serviceSeller || 'U').charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.serviceSeller || 'Unknown Seller'}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{review.userRating || '0.0'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  Completed
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">Your rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className={`w-4 h-4 ${index < Math.floor(review.userRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {review.orderId || 'N/A'} • {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {review.deliveryTime || 'Delivered on time'}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 ml-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {review.servicePrice || 'Rp 0'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleBuyAgain({
                    serviceId: review.serviceId,
                    id: review.serviceId,
                    title: review.serviceTitle
                  })}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20"
                >
                  Buy Again
                </button>
                <button 
                  onClick={() => handleContactSeller({
                    sellerId: review.sellerId,
                    seller: review.serviceSeller
                  })}
                  className="px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#2E5077] text-[#2E5077] hover:bg-[#2E5077] hover:text-white transition-all duration-300"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">My Review:</h4>
            <p className="text-gray-700 leading-relaxed text-sm">
              {review.reviewText || 'No review text provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [handleBuyAgain, handleContactSeller, handleImageError]);

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
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-56 bg-gray-200"></div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-full h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="w-1/3 h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-col items-end gap-3 ml-6">
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                  <div className="w-24 h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ));

  const ErrorMessage = React.memo(({ message }) => (
    <div className="text-center py-16">
      <div className="text-red-500 text-xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Error</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#2E5077] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a5f] transition-colors"
      >
        Retry
      </button>
    </div>
  ));

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="h-32"></div>
        <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-none bg-white rounded-2xl shadow-xl shadow-gray-500/10 overflow-hidden">
            <div className="bg-[#2E5077] p-8">
              <div className="animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl"></div>
                  <div>
                    <div className="w-48 h-8 bg-white/20 rounded mb-2"></div>
                    <div className="w-64 h-6 bg-white/20 rounded mb-1"></div>
                    <div className="w-32 h-4 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-24"></div>
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
                  <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 transition-all duration-700 group-hover:scale-105 group-hover:bg-white/20 overflow-hidden">
                    <img
                      className="w-full h-full object-cover rounded-2xl"
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
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">{auth?.data?.auth?.name || "User"}</h1>
                  <p className="text-lg opacity-90 font-medium">{auth?.data?.auth?.email}</p>
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
              <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
                <button
                  className={`px-8 py-3 text-sm font-bold uppercase tracking-wide rounded-lg cursor-pointer transition-all duration-300 transform ${activeTab === "purchase"
                    ? "bg-[#2E5077] text-white shadow-lg shadow-[#2E5077]/25 scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102"
                    }`}
                  onClick={() => handleTabChange("purchase")}
                >
                  Purchase History
                </button>
                <button
                  className={`px-8 py-3 text-sm font-bold uppercase tracking-wide rounded-lg cursor-pointer transition-all duration-300 transform ${activeTab === "reviews"
                    ? "bg-[#2E5077] text-white shadow-lg shadow-[#2E5077]/25 scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-102"
                    }`}
                  onClick={() => handleTabChange("reviews")}
                >
                  My Reviews
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading && (!dataCache.current[activeTab].loaded || dataCache.current[activeTab].data.length === 0) ? (
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
                        <div className="text-gray-400 text-8xl mb-6">📝</div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">No Reviews Written Yet</h3>
                        <p className="text-gray-500 text-lg mb-2">You haven't written any reviews for completed orders yet.</p>
                        <p className="text-gray-400 text-sm mb-6">Reviews can only be written after your orders are completed or delivered.</p>
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
      
      <ReviewModal />
    </div>
  );
};

export default UserProfile;