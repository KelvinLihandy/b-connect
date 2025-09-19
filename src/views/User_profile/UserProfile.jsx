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
  const [tabLoading, setTabLoading] = useState(false); // New state for tab transitions
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

  // Enhanced status detection with rejected status handling
  const getStatusInfo = useCallback((item) => {
    const status = (item.status || '').toLowerCase();
    const statusType = (item.statusType || '').toLowerCase();
    const orderStatus = (item.orderStatus || '').toLowerCase();
    const paymentStatus = (item.paymentStatus || '').toLowerCase();
    const hasValidOrderNumber = item.orderNumber && item.orderNumber !== 'N/A' && item.orderNumber !== 'null' && item.orderNumber !== 'undefined';

    console.log('🔍 Analyzing status for:', item.title || 'Unknown item');
    console.log('   - status:', item.status);
    console.log('   - statusType:', item.statusType);
    console.log('   - progress:', item.progress);
    console.log('   - step:', item.step);
    console.log('   - hasValidOrderNumber:', hasValidOrderNumber);

    // Handle rejected status specifically (PRIORITY CHECK)
    if (status === 'rejected' || statusType === 'rejected' || 
        status.includes('rejected') || item.progress === 4 || item.step === 4) {
      console.log('   ❌ Detected as: REJECTED');
      return { 
        type: 'rejected', 
        color: 'red', 
        display: 'Rejected',
        showManageOrder: hasValidOrderNumber, // Allow viewing order details
        isCompleted: false
      };
    }
    // Status "Finished" → Show Buy Again & Contact FL
    else if (status === 'finished' || statusType === 'finished' || 
             item.progress === 3 || item.step === 3) {
      console.log('   ✅ Detected as: FINISHED - Show Buy Again & Contact FL');
      return { 
        type: 'completed', 
        color: 'green', 
        display: 'Finished',
        showManageOrder: false,
        isCompleted: true
      };
    }
    // Status "Delivered" → Still show Manage Order
    else if (status === 'delivered' || statusType === 'delivered' || 
             item.progress === 2 || item.step === 2) {
      console.log('   🚚 Detected as: DELIVERED - Show Manage Order');
      return { 
        type: 'delivered', 
        color: 'orange', 
        display: 'Delivered',
        showManageOrder: hasValidOrderNumber,
        isCompleted: false
      };
    }
    // Enhanced logic for showing manage order button
    else if (statusType === 'progress' || status.includes('progress') || 
            status.includes('processing') || status.includes('ongoing') || 
            status.includes('active') || status.includes('pending') ||
            status.includes('in progress') || statusType === 'processing' ||
            item.progress === 1 || item.step === 1) {
      console.log('   🟡 Detected as: IN PROGRESS - Show Manage Order');
      return { 
        type: 'progress', 
        color: 'orange', 
        display: item.status || 'In Progress',
        showManageOrder: hasValidOrderNumber,
        isCompleted: false
      };
    }
    // Handle waiting/sent status
    else if (status === 'waiting' || statusType === 'waiting' || 
             status.includes('sent') || item.progress === 0 || item.step === 0) {
      console.log('   ⏳ Detected as: WAITING - Show Manage Order');
      return { 
        type: 'waiting', 
        color: 'gray', 
        display: 'Waiting',
        showManageOrder: hasValidOrderNumber,
        isCompleted: false
      };
    }
    // Handle completed status (fallback)
    else if (statusType === 'completed' || status.includes('completed') || 
             status.includes('done')) {
      console.log('   ✅ Detected as: COMPLETED');
      return { 
        type: 'completed', 
        color: 'green', 
        display: item.status || 'Completed',
        showManageOrder: false,
        isCompleted: true
      };
    }
    // Handle cancelled status (excluding rejected which is handled above)
    else if (status.includes('cancelled') || status.includes('canceled') ||
             status.includes('failed') || statusType === 'cancelled' || statusType === 'canceled') {
      console.log('   ❌ Detected as: CANCELLED');
      return { 
        type: 'cancelled', 
        color: 'red', 
        display: item.status || 'Cancelled',
        showManageOrder: false,
        isCompleted: false
      };
    } 
    // Default - show manage order for any order with valid order number
    else {
      console.log('   ❓ Status unclear, checking order number');
      return { 
        type: 'unknown', 
        color: 'gray', 
        display: item.status || 'Processing',
        showManageOrder: hasValidOrderNumber,
        isCompleted: false
      };
    }
  }, []);

  // Enhanced sorting function for purchase history with rejected status handling
  const sortPurchaseHistory = useCallback((items) => {
    return [...items].sort((a, b) => {
      const statusA = getStatusInfo(a);
      const statusB = getStatusInfo(b);
      
      // Define order priority: Active orders (1), Failed orders (2), Completed orders (3)
      const getOrderPriority = (status) => {
        if (status.isCompleted) return 3; // Bottom (finished orders)
        if (status.type === 'rejected' || status.type === 'cancelled') return 2; // Middle (failed orders)
        return 1; // Top (active orders: waiting, progress, delivered)
      };
      
      const priorityA = getOrderPriority(statusA);
      const priorityB = getOrderPriority(statusB);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority number = higher position
      }
      
      // Secondary sort: by date within same priority group
      const dateA = new Date(a.date || a.createdAt || '1970-01-01');
      const dateB = new Date(b.date || b.createdAt || '1970-01-01');
      
      // For all groups, newest first
      return dateB.getTime() - dateA.getTime();
    });
  }, [getStatusInfo]);

  // Enhanced sorting function for reviews
  const sortReviews = useCallback((items) => {
    return [...items].sort((a, b) => {
      // Sort reviews by date: oldest first
      const dateA = new Date(a.reviewDate || a.date || a.createdAt || '1970-01-01');
      const dateB = new Date(b.reviewDate || b.date || b.createdAt || '1970-01-01');
      
      return dateA.getTime() - dateB.getTime(); // Oldest first
    });
  }, []);

  // Memoized sorted purchase history
  const sortedPurchaseHistory = useMemo(() => {
    return sortPurchaseHistory(purchaseHistory);
  }, [purchaseHistory, sortPurchaseHistory]);

  // Memoized sorted reviews
  const sortedReviews = useMemo(() => {
    return sortReviews(reviews);
  }, [reviews, sortReviews]);

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

  const fetchPurchaseHistory = useCallback(async (page = 1, force = false, isTabSwitch = false) => {
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
      
      // For tab switch, use light loading
      if (isTabSwitch) {
        setTabLoading(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const data = await makeAPICall(
        `${userAPI}/purchase-history/${getCurrentUserId}?page=${page}&limit=10`
      );

      if (data && data.purchaseHistory) {
        const { purchaseHistory, pagination } = data;

        const processedHistory = purchaseHistory.map(item => {
          // Map progress/step numbers to status strings for better detection
          let mappedStatus = item.status;
          let mappedStatusType = item.statusType;
          
          // Handle numeric progress/step values (from ManageOrder component)
          if (item.progress !== undefined || item.step !== undefined) {
            const progressValue = item.progress ?? item.step;
            switch (progressValue) {
              case 0:
                mappedStatus = 'waiting';
                mappedStatusType = 'waiting';
                break;
              case 1:
                mappedStatus = 'in progress';
                mappedStatusType = 'progress';
                break;
              case 2:
                mappedStatus = 'delivered';
                mappedStatusType = 'delivered';
                break;
              case 3:
                mappedStatus = 'finished';
                mappedStatusType = 'finished';
                break;
              case 4:
                mappedStatus = 'rejected';
                mappedStatusType = 'rejected';
                break;
              default:
                // Keep original status if not recognized
                break;
            }
          }

          return {
            ...item,
            // Use mapped status for better detection
            status: mappedStatus || item.status,
            statusType: mappedStatusType || item.statusType,
            // Keep original values for reference
            originalStatus: item.status,
            originalStatusType: item.statusType,
            progress: item.progress,
            step: item.step,
            // Process other fields
            image: processImageUrl(item.image, item.imageUrls, item.title),
            id: item.id || `purchase-${Date.now()}-${Math.random()}`,
            deliveryTime: normalizeDeliveryStatus(
              item.deliveryTime || item.delivery,
              mappedStatus || item.status || item.orderStatus
            ),
            paymentStatus: item.paymentStatus === 'processing' ? 'paid' : item.paymentStatus
          };
        });

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
      setTabLoading(false);
    }
  }, [getCurrentUserId, makeAPICall, processImageUrl, normalizeDeliveryStatus]);

  const fetchReviews = useCallback(async (page = 1, force = false, isTabSwitch = false) => {
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
      
      // For tab switch, use light loading
      if (isTabSwitch) {
        setTabLoading(true);
      } else {
        setLoading(true);
      }
      
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
      setTabLoading(false);
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

  // Modified handleTabChange - key improvement here
  const handleTabChange = useCallback(async (tab) => {
    setActiveTab(tab);
    setError(null);

    if (tab === "purchase") {
      const cache = dataCache.current.purchase;
      if (cache.loaded) {
        // Data already exists, show immediately without loading
        setPurchaseHistory(cache.data);
        setPurchasePagination(cache.pagination);
      } else if (!cache.loading) {
        // Data doesn't exist, fetch with light loading
        fetchPurchaseHistory(1, false, true);
      }
    } else if (tab === "reviews") {
      const cache = dataCache.current.reviews;
      if (cache.loaded) {
        // Data already exists, show immediately without loading
        setReviews(cache.data);
        setReviewsPagination(cache.pagination);
      } else if (!cache.loading) {
        // Data doesn't exist, fetch with light loading
        fetchReviews(1, false, true);
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

  // Enhanced Purchase Card with rejected status handling
  const PurchaseCard = React.memo(({ item }) => {
    const statusInfo = useMemo(() => getStatusInfo(item), [item, getStatusInfo]);

    return (
      <div className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-sm">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 flex flex-col sm:flex-row">
          {/* Responsive Image Section */}
          <div className="flex-shrink-0 w-full sm:w-48 md:w-64 h-40 sm:h-44 md:h-48 relative overflow-hidden rounded-t-xl sm:rounded-l-2xl sm:rounded-tr-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              src={item.image}
              alt={item.title || 'Product image'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
            {/* Status overlay */}
            <div className="absolute top-3 left-3 z-20">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md border transition-all duration-300 transform group-hover:scale-105 ${
                statusInfo.type === "progress"
                  ? "bg-orange-100/90 text-orange-800 border-orange-300/50"
                  : statusInfo.type === "completed"
                    ? "bg-green-100/90 text-green-800 border-green-300/50"
                    : statusInfo.type === "delivered"
                      ? "bg-blue-100/90 text-blue-800 border-blue-300/50"
                      : statusInfo.type === "rejected"
                        ? "bg-red-100/90 text-red-800 border-red-300/50"
                        : statusInfo.type === "cancelled"
                          ? "bg-red-100/90 text-red-800 border-red-300/50"
                          : statusInfo.type === "waiting"
                            ? "bg-gray-100/90 text-gray-800 border-gray-300/50"
                            : "bg-gray-100/90 text-gray-800 border-gray-300/50"
              }`}>
                {statusInfo.display}
              </span>
            </div>
          </div>

          {/* Responsive Content Section */}
          <div className="flex-1 p-4 sm:p-5 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start h-full gap-4">
              <div className="flex-1 space-y-3">
                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(item.category) ? (
                    item.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-100/80"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-100/80">
                      {item.category || 'General'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {item.title || 'Untitled Service'}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                  {item.description || 'No description available'}
                </p>

                {/* Seller Info */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300 ring-2 ring-white">
                      <span className="text-white text-xs font-bold">
                        {(item.seller || 'U').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-300 block">
                        {item.seller || 'Unknown Seller'}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-2.5 h-2.5 ${i < Math.floor(item.sellerRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">{item.sellerRating || '0.0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                  <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span className="font-medium">Order: {item.orderNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                    </svg>
                    <span>{item.date || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`${statusInfo.type === 'rejected' ? 'text-red-600 font-semibold' : statusInfo.type === 'cancelled' ? 'text-red-600 font-semibold' : ''}`}>
                      {statusInfo.type === 'rejected' || statusInfo.type === 'cancelled' 
                        ? statusInfo.display 
                        : (item.deliveryTime || 'Standard delivery')
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsive Action Section */}
              <div className="flex flex-col sm:items-end gap-2 sm:gap-3 sm:ml-6 mt-4 sm:mt-0">
                <div className="text-left sm:text-right">
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                    {item.price || 'Rp 0'}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  {/* Show Manage Order button for orders with valid order numbers */}
                  {statusInfo.showManageOrder && (
                    <button
                      onClick={() => handleViewDetails(item.orderNumber, item)}
                      className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {statusInfo.type === "rejected" ? "View Details" : "Manage Order"}
                      </span>
                    </button>
                  )}

                  {/* Show Buy Again and Contact Seller for completed orders */}
                  {(statusInfo.type === "completed" || statusInfo.type === "delivered") && !statusInfo.showManageOrder && (
                    <>
                      <button
                        onClick={() => handleBuyAgain(item)}
                        className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-green-500/25 hover:shadow-lg hover:shadow-green-500/40 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Buy Again
                        </span>
                      </button>
                      <button
                        onClick={() => handleContactSeller(item)}
                        className="px-5 py-2 rounded-xl font-semibold text-sm border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-500/25"
                      >
                        Contact Seller
                      </button>
                    </>
                  )}

                  {/* Show Try Again for rejected/cancelled orders */}
                  {(statusInfo.type === "rejected" || statusInfo.type === "cancelled") && (
                    <button
                      onClick={() => handleBuyAgain(item)}
                      className="group relative bg-gradient-to-r from-gray-500 to-slate-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-gray-500/25 hover:shadow-lg hover:shadow-gray-500/40 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                      </span>
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

  // Enhanced Review Card with smaller design
  const ReviewCard = React.memo(({ review }) => (
    <div className="group relative bg-gradient-to-br from-white to-green-50/30 rounded-xl sm:rounded-2xl border border-gray-200/50 hover:border-green-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/10 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-sm">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative z-10 flex flex-col sm:flex-row">
        {/* Responsive Image Section */}
        <div className="flex-shrink-0 w-full sm:w-48 md:w-64 h-40 sm:h-44 md:h-48 relative overflow-hidden rounded-t-xl sm:rounded-l-2xl sm:rounded-tr-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          <img
            src={review.image}
            alt={review.serviceTitle || 'Service image'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
          {/* Review badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="px-3 py-1.5 bg-green-100/90 text-green-800 border border-green-300/50 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md transition-all duration-300 transform group-hover:scale-105">
              ⭐ REVIEWED
            </span>
          </div>
          {/* Rating overlay */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1.5 shadow-md">
              <span className="text-xs font-semibold text-gray-700">Your rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className={`w-3 h-3 ${index < Math.floor(review.userRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Content Section */}
        <div className="flex-1 p-4 sm:p-5 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start h-full gap-4">
            <div className="flex-1 space-y-3">
              {/* Category and Status Tags */}
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(review.category) ? (
                  review.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-50/80 text-green-700 text-xs font-semibold rounded-lg border border-green-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-100/80"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-1 bg-green-50/80 text-green-700 text-xs font-semibold rounded-lg border border-green-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-100/80">
                    {review.category || 'General'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                {review.serviceTitle || 'Untitled Service'}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                {review.description || 'Professional service provided'}
              </p>

        {/* Seller Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300 ring-2 ring-white">
                    <span className="text-white text-xs font-bold">
                      {(review.serviceSeller || 'U').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-300 block">
                      {review.serviceSeller || 'Unknown Seller'}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-2.5 h-2.5 ${i < Math.floor(review.sellerRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">{review.sellerRating || '0.0'}</span>
                    </div>
                  </div>
                </div>
              </div>

        {/* Order Details */}
          <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span className="font-medium">Order: {review.orderId || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                  </svg>
                  <span>{review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{review.deliveryTime || 'Delivered on time'}</span>
                </div>
              </div>
            </div>

            {/* Responsive Action Section */}
            <div className="flex flex-col sm:items-end gap-2 sm:gap-3 sm:ml-6 mt-4 sm:mt-0">
              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
                  {review.servicePrice || 'Rp 0'}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleBuyAgain({
                    serviceId: review.serviceId,
                    id: review.serviceId,
                    title: review.serviceTitle
                  })}
                  className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-green-500/25 hover:shadow-lg hover:shadow-green-500/40 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="px-5 py-2 rounded-xl font-semibold text-sm border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-green-500/25"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Review Text Section - Made smaller */}
          <div className="mt-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-xl p-4 border border-green-100/50 group-hover:border-green-200/70 group-hover:shadow-md transition-all duration-500 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                My Review
              </h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
              "{review.reviewText || 'No review text provided.'}"
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [handleBuyAgain, handleContactSeller, handleImageError]);

  const PaginationControls = React.memo(({ pagination, onPageChange }) => (
    <div className="flex justify-center items-center gap-3 mt-12">
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="group w-10 h-10 border-2 border-gray-200 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent transition-all duration-300 hover:scale-110 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:scale-100 shadow-md hover:shadow-lg disabled:hover:shadow-md"
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
            className={`w-10 h-10 rounded-xl font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-110"
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
        className="group w-10 h-10 border-2 border-gray-200 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent transition-all duration-300 hover:scale-110 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:scale-100 shadow-md hover:shadow-lg disabled:hover:shadow-md"
      >
        ›
      </button>
    </div>
  ));

  const LoadingSpinner = React.memo(() => (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-gray-200/50 overflow-hidden animate-pulse">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-shrink-0 w-full lg:w-64 h-48 lg:h-44 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="flex-1 p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-16 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  <div className="w-1/2 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  <div className="w-1/3 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-5">
                  <div className="w-20 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="w-24 h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
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
      <div className="text-red-500 text-6xl mb-6">⚠️</div>
      <h3 className="text-2xl font-bold text-gray-600 mb-3">Oops! Something went wrong</h3>
      <p className="text-gray-500 mb-6 text-lg">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="group relative bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 font-semibold text-base overflow-hidden"
      >
        <span className="relative z-10">Try Again</span>
      </button>
    </div>
  ));

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="h-24"></div>
        <div className="w-full px-4 lg:px-6 xl:px-8 2xl:px-12">
          <div className="max-w-none bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-500/20 overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 relative overflow-hidden">
              <div className="relative z-10 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl animate-pulse"></div>
                  <div>
                    <div className="w-48 h-8 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
                    <div className="w-64 h-5 bg-white/20 rounded mb-1 animate-pulse"></div>
                    <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl h-24"></div>
                  </div>
                ))}
              </div>
              <LoadingSpinner />
            </div>
          </div>
        </div>
        <div className="h-24"></div>
        <Footer />
      </div>
    );
  }

 return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      <div className="h-32"></div>

      <div className="w-full px-4 lg:px-6 xl:px-8 2xl:px-12 relative z-10 pt-8">
        <div className="max-w-none bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-500/20 overflow-hidden border border-white/50">
          {/* Enhanced Header - Made smaller and more responsive */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-4 sm:p-6 text-white">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                <div className="group relative">
                  <div className="w-24 h-24 sm:w-20 sm:h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 transition-all duration-700 group-hover:scale-110 overflow-hidden shadow-xl ring-2 ring-white/20">
                    <img
                      className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
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
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                </div>
                <div className="text-center sm:text-left mt-3 sm:mt-0">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 tracking-tight text-white filter drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                    {auth?.data?.auth?.name || "User"}
                  </h1>
                  <p className="text-sm sm:text-base opacity-90 font-medium filter drop-shadow-sm break-all sm:break-normal">
                    {auth?.data?.auth?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSettingsClick}
                className="group bg-white/15 backdrop-blur-sm border-2 border-white/30 cursor-pointer rounded-2xl p-2 sm:p-3 text-white hover:bg-white/25 hover:border-white/50 transition-all duration-500 hover:scale-110 sm:hover:scale-125 shadow-lg hover:shadow-xl ring-2 ring-white/10 hover:ring-white/20 mt-2 sm:mt-0"
              >
                <svg
                  width="18"
                  height="18"
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

          {/* Enhanced Stats Section - Made responsive */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
            <div className="group relative flex flex-col items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/60 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] sm:hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-xl sm:text-2xl mb-1.5 sm:mb-2">📅</div>
              <span className="relative z-10 text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Member Since</span>
              <span className="relative z-10 text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-all duration-300">{userStats.memberSince || "-"}</span>
            </div>

            <div className="group relative flex flex-col items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/60 hover:border-green-300/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] sm:hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-xl sm:text-2xl mb-1.5 sm:mb-2">📋</div>
              <span className="relative z-10 text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Profile</span>
              <span className="relative z-10 text-base sm:text-lg font-bold text-green-600 transition-all duration-300">{userStats.profileCompletion || "0%"}</span>
            </div>

            <div className="group relative flex flex-col items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/60 hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] sm:hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-xl sm:text-2xl mb-1.5 sm:mb-2">🎫</div>
              <span className="relative z-10 text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Vouchers</span>
              <span className="relative z-10 text-base sm:text-lg font-bold text-purple-600 transition-all duration-300">{userStats.activeVouchers || "0"}</span>
            </div>

            <div className="group relative flex flex-col items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/60 hover:border-orange-300/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] sm:hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-xl sm:text-2xl mb-1.5 sm:mb-2">📦</div>
              <span className="relative z-10 text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2 font-bold tracking-wider uppercase text-center group-hover:text-gray-800 transition-colors duration-300">Orders</span>
              <span className="relative z-10 text-base sm:text-lg font-bold text-orange-600 transition-all duration-300">{userStats.totalOrders || "0"}</span>
            </div>
          </div>

          {/* Enhanced Tab Navigation with loading indicator - Made responsive */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col xs:flex-row justify-between items-stretch xs:items-center">
              <div className="flex flex-col xs:flex-row bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-white/60 gap-1">
                <button
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg sm:rounded-xl cursor-pointer transition-all duration-500 relative overflow-hidden ${
                    activeTab === "purchase"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/25 z-10 scale-[1.02] sm:scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:shadow-sm z-0 hover:scale-[1.01] sm:hover:scale-105"
                  } ${tabLoading ? 'opacity-75' : ''}`}
                  onClick={() => handleTabChange("purchase")}
                  disabled={tabLoading}
                >
                  <span className="relative z-10 flex items-center justify-center xs:justify-start gap-1.5 sm:gap-2">
                    {tabLoading && activeTab === "purchase" ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    )}
                    <span className="whitespace-nowrap">Purchase History</span>
                  </span>
                </button>
                <button
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg sm:rounded-xl cursor-pointer transition-all duration-500 relative overflow-hidden ${
                    activeTab === "reviews"
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-md shadow-green-500/25 z-10 scale-[1.02] sm:scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:shadow-sm z-0 hover:scale-[1.01] sm:hover:scale-105"
                  } ${tabLoading ? 'opacity-75' : ''}`}
                  onClick={() => handleTabChange("reviews")}
                  disabled={tabLoading}
                >
                  <span className="relative z-10 flex items-center justify-center xs:justify-start gap-1.5 sm:gap-2">
                    {tabLoading && activeTab === "reviews" ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                    <span className="whitespace-nowrap">My Reviews</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Section - Modified loading logic */}
          <div className="p-6 bg-white/80 backdrop-blur-sm">
            {loading && initialLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <>
                {activeTab === "purchase" && (
                  <div className="space-y-6">
                    {sortedPurchaseHistory.length > 0 ? (
                      <>
                        <div className={`${tabLoading ? 'opacity-70 pointer-events-none' : ''} transition-opacity duration-300 space-y-6`}>
                          {sortedPurchaseHistory.map((item) => (
                            <PurchaseCard key={item.id} item={item} />
                          ))}
                        </div>
                        {purchasePagination.totalPages > 1 && (
                          <PaginationControls
                            pagination={purchasePagination}
                            onPageChange={handlePurchasePagination}
                          />
                        )}
                      </>
                    ) : (
                      // Show loading spinner only if data hasn't been loaded yet
                      !dataCache.current.purchase.loaded && loading ? (
                        <LoadingSpinner />
                      ) : (
                        <div className="text-center py-16 relative">
                          <div className="text-gray-300 text-6xl mb-6">📦</div>
                          <h3 className="text-2xl font-bold text-gray-600 mb-4">No Purchase History</h3>
                          <p className="text-gray-500 text-lg mb-6">You haven't made any purchases yet.</p>
                          <button
                            className="group relative mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 text-lg overflow-hidden"
                            onClick={() => navigate("/catalog")}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Browse Services
                            </span>
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {sortedReviews.length > 0 ? (
                      <>
                        <div className={`${tabLoading ? 'opacity-70 pointer-events-none' : ''} transition-opacity duration-300 space-y-6`}>
                          {sortedReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                          ))}
                        </div>
                        {reviewsPagination.totalPages > 1 && (
                          <PaginationControls
                            pagination={reviewsPagination}
                            onPageChange={handleReviewsPagination}
                          />
                        )}
                      </>
                    ) : (
                      // Show loading spinner only if data hasn't been loaded yet
                      !dataCache.current.reviews.loaded && loading ? (
                        <LoadingSpinner />
                      ) : (
                        <div className="text-center py-16 relative">
                          <div className="text-gray-300 text-6xl mb-6">📝</div>
                          <h3 className="text-2xl font-bold text-gray-600 mb-4">No Reviews Written Yet</h3>
                          <p className="text-gray-500 text-lg mb-3">You haven't written any reviews for completed orders yet.</p>
                          <p className="text-gray-400 text-sm mb-6">Reviews can only be written after your orders are completed or delivered.</p>
                          <button
                            className="group relative mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-2xl cursor-pointer font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 text-lg overflow-hidden"
                            onClick={() => handleTabChange("purchase")}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              View Purchase History
                            </span>
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-24"></div>
      <Footer />
    </div>
  </>
  );
};

export default UserProfile;