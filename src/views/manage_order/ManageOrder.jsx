import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Review from '../../components/review/Review';
import { UserTypeContext } from '../../contexts/UserTypeContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../App';

import check from '../../assets/mo_check.svg';
import clock from '../../assets/mo_clock.svg';
import bankTransfer from '../../assets/mo_bank_transfer.svg';
import image from '../../assets/mo_image.svg';
import invoice from '../../assets/mo_invoice.svg';
import send from '../../assets/mo_send.svg';
import status from '../../assets/mo_status.svg';
import message_icon from '../../assets/message_icon.svg';
import dummy1 from "../../assets/Gemini_Generated_Image_at3j5bat3j5bat3j.png";
import dummy2 from "../../assets/Gemini_Generated_Image_at3j5fat3j5fat3j.png";
import dummy3 from "../../assets/Gemini_Generated_Image_sgjvdqsgjvdqsgjv.png";
import dummy4 from "../../assets/Gemini_Generated_Image_zhjybwzhjybwzhjy.png";

import { orderAPI, gigAPI } from '../../constants/APIRoutes';
import { imageShow } from '../../constants/DriveLinkPrefixes';
import { AuthContext } from '../../contexts/AuthContext';

// Status constants based on current step
const STATUS_COLORS = {
  0: "bg-gray-500",
  1: "bg-yellow-500",
  2: "bg-blue-500",
  3: "bg-green-500"
};

const STATUS_ICONS = {
  0: status,
  1: status,
  2: status,
  3: check
};

const STATUS_TEXT = {
  0: "Waiting",
  1: "In Progress",
  2: "Delivered",
  3: "Finished"
};

const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
  return (price ?? 0).toLocaleString(locale, {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
  });
};

const ManageOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isFreelancer } = useContext(UserTypeContext);
  const { auth } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGigCreator, setIsGigCreator] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [randomDummy, setRandomDummy] = useState(null);
  const dummyImages = [
    dummy1,
    dummy2,
    dummy3,
    dummy4
  ];

  useEffect(() => {
    setRandomDummy(dummyImages[Math.floor(Math.random() * dummyImages.length)]);
  }, [])

  const [orderDates, setOrderDates] = useState({
    START_DATE: "",
    EXPECTED_DELIVERY: "",
    IN_PROGRESS_DATE: "",
    DELIVERY_DATE: "",
    FINISHED_DATE: ""
  });

  // Order details state
  const [orderDetails, setOrderDetails] = useState({
    ORDER_NUMBER: "",
    SERVICE_NAME: "",
    SERVICE_PRICE: 0,
    PROCESSING_FEE: 0,
    DISCOUNT: 0,
    SERVICE_IMAGE: image
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState({
    TYPE: "Bank Transfer",
    STATUS: "Paid"
  }); const handleInvoiceClick = () => {
    const invoiceUrl = `/invoice/${orderId}`;

    window.open(invoiceUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  }; const initiateChat = () => {
    if (!auth) {
      navigate("/sign-in");
      return;
    }

    if (!orderData) {
      alert("Order data not available. Please wait for data to load.");
      return;
    }

    // Get the other party's ID based on current user role
    let otherPartyId;

    if (isFreelancer) {
      // If current user is freelancer, chat with the buyer
      otherPartyId = orderData.buyer?._id || orderData.userId;
    } else {
      // If current user is buyer, chat with the freelancer
      otherPartyId = orderData.gigInfo?.creator?.id;
    }

    if (!otherPartyId) {
      console.error("Order data structure:", orderData);
      console.error("Current user is freelancer:", isFreelancer);
      console.error("Looking for buyer ID:", orderData.buyer?._id || orderData.userId);
      console.error("Looking for freelancer ID:", orderData.gigInfo?.creator?.id);
      alert("Unable to start chat. User information not available.");
      return;
    }

    console.log("Initiating chat between:", auth?.data?.auth?.id, "and", otherPartyId);

    // Create room and navigate to chat
    socket.emit("create_room", [auth?.data?.auth?.id, otherPartyId]);

    // Handle room creation response
    const handleSwitchRoom = (url) => {
      console.log("Navigating to chat:", url);
      navigate(url);
      // Clean up the listener to prevent memory leaks
      socket.off("switch_room", handleSwitchRoom);
    };

    socket.on("switch_room", handleSwitchRoom);
  };

  const handleFinishOrder = () => {
    // Only allow non-freelancers (buyers) to access review modal
    if (!isFreelancer) {
      setShowReviewModal(true);
    } else {
      alert("Only buyers can finish orders and leave reviews.");
    }
  };
  const handleReviewSubmit = async (reviewData) => {
    try {
      console.log("Review submitted:", reviewData);

      const reviewResponse = await axios.post(
        `${orderAPI}/${orderId}/review`,
        {
          rating: reviewData.rating,
          feedback: reviewData.feedback
        },
        { withCredentials: true }
      );

      if (reviewResponse.status === 200) {
        setCurrentStep(3);
        const today = new Date();
        const formattedToday = formatDate(today);

        setOrderDates(prevDates => ({
          ...prevDates,
          FINISHED_DATE: formattedToday
        }));

        setShowReviewModal(false);
        // alert("Order finished successfully! Thank you for your review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      if (err.response && err.response.status === 403) {
        alert("You are not authorized to review this order. Only buyers can submit reviews.");
      } else if (err.response && err.response.status === 400) {
        alert("Order must be delivered before submitting a review.");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  const handleUpdateProgress = async (newProgress) => {
    try {
      const response = await axios.put(
        `${orderAPI}/${orderId}/progress`,
        { progress: newProgress },
        { withCredentials: true }
      );
      console.log("Update response:", response);
      if (response.status === 200) {
        setCurrentStep(response.data.contract.progress);
        const today = new Date();
        const formattedToday = formatDate(today);

        if (newProgress === 1) {
          setOrderDates(prevDates => ({
            ...prevDates,
            IN_PROGRESS_DATE: formattedToday
          }));
        }
        else if (newProgress === 2) {
          setOrderDates(prevDates => ({
            ...prevDates,
            DELIVERY_DATE: formattedToday
          }));
        }
        else if (newProgress === 3) {
          setOrderDates(prevDates => ({
            ...prevDates,
            FINISHED_DATE: formattedToday
          }));
        }
      }
    } catch (err) {
      console.error("Error updating order progress:", err);
      if (err.response && err.response.status === 403) {
        alert("You are not authorized to update this order. Only the freelancer who created this gig can update the progress.");
      } else {
        alert("Failed to update order status. Please try again.");
      }
    }
  };

  // Helper function to format a date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to add days to a date
  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days); return date;
  };
  // Fetch order data from API
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);

        try {
          const response = await axios.get(`${orderAPI}/${orderId}`, {
            withCredentials: true
          });

          setOrderData(response.data);
          setCurrentStep(response.data.progress);

          let gigDetails = null;
          try {
            const gigResponse = await axios.post(`${gigAPI}/get-gig/${response.data.gigId}`);
            gigDetails = gigResponse.data.detail;
            setIsGigCreator(isFreelancer && auth?.data.auth.id === response.data.gigInfo.creator.id.toString());
          } catch (gigError) {
            setIsGigCreator(false);
            console.error("Error fetching gig details:", gigError);
          }

          // Update order details with gig information
          setOrderDetails({
            ORDER_NUMBER: response.data.orderId,
            SERVICE_NAME: gigDetails ? gigDetails.name : response.data.gigInfo.title,
            SERVICE_PRICE: response.data.package.price || 0,
            PROCESSING_FEE: 0,
            DISCOUNT: 0, // No discount by default
            SERVICE_IMAGE: gigDetails && gigDetails.images && gigDetails.images.length > 0
              ? gigDetails.images[0]
              : response.data.gigInfo.image || image
          });

          // Update payment method if available
          if (response.data.transaction) {
            setPaymentMethod({
              TYPE: "Bank Transfer",
              STATUS: response.data.transaction.status === "paid" ? "Paid" : "Pending"
            });
          }

          const formatIfExists = (dateStr) => dateStr ? formatDate(new Date(dateStr)) : "";

          const formattedStartDate = formatIfExists(response.data.startTime);
          const formattedProgressDate = formatIfExists(response.data.progressTime);
          const formattedDeliveredDate = formatIfExists(response.data.deliveredTime);
          const formattedFinishedDate = formatIfExists(response.data.finishedTime);


          const workDuration = response.data.package.workDuration || 3;
          const expectedDelivery = addDays(new Date(response.data.startTime), workDuration);
          const formattedDeliveryExpected = formatDate(expectedDelivery);

          // Set order dates
          setOrderDates({
            START_DATE: formattedStartDate,
            EXPECTED_DELIVERY: formattedDeliveryExpected,
            IN_PROGRESS_DATE: formattedProgressDate,
            DELIVERY_DATE: formattedDeliveredDate,
            FINISHED_DATE: formattedFinishedDate,
          });

        } catch (err) {
          if (err.response && err.response.status === 403) {
            // User is not authorized to view this order
            setError("You are not authorized to view this order. Only the buyer and seller can access this page.");
          } else {
            console.error("Error fetching order data:", err);
            if (err.response) {
              console.log("Error response status:", err.response.status);
              console.log("Error response data:", err.response.data);
            }
            setError(`Failed to load order data: ${err.response?.data?.error || err.message || "Unknown error"}`);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchOrderData:", err);
        setError(`An unexpected error occurred: ${err.message}`);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }

    // Cleanup function to remove socket listeners when component unmounts
    return () => {
      socket.off("switch_room");
    };
  }, [orderId]);
  const totalPrice = orderDetails.SERVICE_PRICE + orderDetails.PROCESSING_FEE - orderDetails.DISCOUNT;

  const steps = [
    {
      id: 0,
      name: "Order Sent",
      icon: check,
      date: orderDates.START_DATE
    },
    {
      id: 1,
      name: "In Progress",
      icon: clock,
      date: orderDates.IN_PROGRESS_DATE
    },
    {
      id: 2,
      name: "Delivered",
      icon: send,
      date: orderDates.DELIVERY_DATE
    },
    {
      id: 3,
      name: "Finished",
      icon: check,
      date: orderDates.DELIVERY_DATE
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="font-Archivo">
        <Navbar alt />
        <div className="container mx-auto bg-[#F8F8F8] rounded-lg shadow-md px-4 py-4 mt-35 mb-15">
          <div className="flex justify-center items-center py-20">
            <p className="text-xl">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="font-Archivo">
        <Navbar alt />
        <div className="container mx-auto bg-[#F8F8F8] rounded-lg shadow-md px-4 py-4 mt-35 mb-15">
          <div className="flex justify-center items-center py-20">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-Archivo">
      <Navbar alt />
      <div className='container mx-auto bg-[#F8F8F8] rounded-lg shadow-md px-4 py-4 mt-35 mb-15'>
        {/* Order Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Order #{orderDetails.ORDER_NUMBER}</h1>
          <div className="flex text-lg gap-4">
            <button
              onClick={initiateChat}
              className="flex items-center gap-2 border-4 border-blue-500 bg-blue-400 cursor-pointer rounded px-4 transition-colors"
            >
              <img
                src={message_icon}
                alt="Contact"
                className="w-[25px] h-[25px]"
              />
              <span className='text-white'>Contact</span>
            </button>
            <button
              onClick={handleInvoiceClick}
              className="flex items-center gap-2 border-4 border-gray-300 bg-white cursor-pointer rounded px-4 hover:bg-gray-50 transition-colors"
            >
              <img src={invoice} alt="Invoice" className="" />
              <span>Invoice</span>
            </button>
            <div className={`flex items-center gap-2 ${STATUS_COLORS[currentStep]} text-white rounded px-4`}>
              <img
                src={STATUS_ICONS[currentStep]}
                alt={STATUS_TEXT[currentStep]}
                className="w-[37px] h-[37px]"
              />
              <span>{STATUS_TEXT[currentStep]}</span>
            </div>
          </div>
        </div>

        {/* Order Date Info */}
        <div className="pb-4">
          <div className="flex text-lg gap-8">
            <p>Order date: {orderDates.START_DATE}</p>
            <p>Expected delivery: <span className="text-green-500">{orderDates.EXPECTED_DELIVERY}</span></p>
          </div>
        </div>

        <div className="border-t border-[#000] w-full mb-6"></div>
        <div className="mb-8">
          <div className="flex justify-between items-center px-[5%] mb-1 relative">
            <div className="absolute h-1 top-[35px] -translate-y-1/2 left-[10%] right-[10%] flex">
              <div className="flex-1 bg-gray-200 relative">
                {currentStep > 0 && (
                  <div className="absolute inset-0 bg-green-500 transition-all duration-300" />
                )}
              </div>
              <div className="flex-1 bg-gray-200 relative">
                {currentStep > 1 && (
                  <div className="absolute inset-0 bg-green-500 transition-all duration-300" />
                )}
              </div>
              <div className="flex-1 bg-gray-200 relative">
                {currentStep > 2 && (
                  <div className="absolute inset-0 bg-green-500 transition-all duration-300" />
                )}
              </div>
            </div>
            {steps.map((step, index) => (
              <div key={step.id} className="z-10 flex flex-col items-center">
                {/* Circle indicator */}
                <div
                  className={`w-[70px] h-[70px] flex items-center justify-center rounded-full 
                    ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'} 
                    border-4 border-white shadow-md mb-2`}
                >
                  <img
                    src={step.icon}
                    alt={step.name}
                    className="w-8 h-8"
                  />
                </div>
                {/* Step name and date */}
                <div className="text-center mt-2">
                  <p className="font-medium text-lg">{step.name}</p>
                  <p className="text-gray-500 text-base">{step.date ? step.date : '\u00A0'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#000] w-full mb-6"></div>
        <div className="flex items-center py-4 mb-6">
          <div className="rounded mr-4">
            {orderDetails.SERVICE_IMAGE && orderDetails.SERVICE_IMAGE.startsWith('1') ? (
              <img
                src={`${imageShow}${orderDetails.SERVICE_IMAGE}`}
                alt="Service"
                className="w-[120px] h-[120px] object-cover rounded bg-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = randomDummy;
                }}
              />
            ) : (
              <img
                src={image}
                alt="Service"
                className="w-[80px] h-[80px] rounded bg-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = randomDummy;
                }}
              />
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-2xl">{orderDetails.SERVICE_NAME}</h3>
            <div className="text-gray-500 text-lg flex items-center gap-2">
              <p>Order {orderDetails.ORDER_NUMBER}</p>
              <p>{orderDates.ORDER_CONFIRMATION_DATE}</p>
            </div>
            <span className={`inline-block ${STATUS_COLORS[currentStep]} text-white rounded px-2 py-1 text-sm mt-1`}>{STATUS_TEXT[currentStep]}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">RP. {formattedPrice(orderDetails.SERVICE_PRICE)}</p>
          </div>
        </div>

        <div className="border-t border-[#000] w-full mb-6"></div>
        {/* Payment Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-2">Payment</h2>
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-xl font-Archivo">
              <img src={bankTransfer} alt="Bank Transfer" className="" />
              <span>Bank Transfer</span>
              <span className="bg-[#DBEAFE] text-gray-600 rounded px-2 py-1 text-sm ml-2">{paymentMethod.STATUS}</span>
            </div>
            <div className="ml-auto">
              {isGigCreator ?
                (
                  <div className='flex'>
                    {currentStep === 0 && (
                      <button
                        onClick={() => handleUpdateProgress(1)}
                        className="bg-yellow-500 cursor-pointer text-white text-lg rounded px-4 py-1 flex items-center gap-2"
                      >
                        <img src={status} alt="Status" className="h-10" />
                        <span>Confirm Order</span>
                      </button>
                    )}
                    {currentStep === 1 && (
                      <button
                        onClick={() => handleUpdateProgress(2)}
                        className="bg-yellow-500 cursor-pointer text-white text-lg rounded px-4 py-1 flex items-center gap-2"
                      >
                        <img src={check} alt="Check" className="h-10 w-10" />
                        <span>Deliver Order</span>
                      </button>
                    )}
                  </div>)
                :
                (
                  <>
                    {currentStep === 2 && !isFreelancer && (
                      <button
                        onClick={handleFinishOrder}
                        className="bg-yellow-500 cursor-pointer text-white text-lg rounded px-4 py-1 flex items-center gap-2"
                      >
                        <img src={check} alt="Check" className="" />
                        <span>Finish Order</span>
                      </button>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#000] w-full mb-6"></div>

        <div className="flex">
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl mb-3">Order Summary</h2>
            <div className="space-y-2 text-lg font-Archivo">
              <div className="flex justify-between">
                <span>Service Price</span>
                <span>Rp. {formattedPrice(orderDetails.SERVICE_PRICE)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>Rp. {formattedPrice(orderDetails.DISCOUNT)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>Rp. {formattedPrice(orderDetails.PROCESSING_FEE)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp. {formattedPrice(totalPrice)}</span>
                </div>
              </div>            </div>
          </div>
        </div>
      </div>      <Footer />

      {/* Review Modal - Only for buyers (non-freelancers) */}
      {!isFreelancer && (
        <Review
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          orderData={{
            orderNumber: orderDetails.ORDER_NUMBER,
            serviceName: orderDetails.SERVICE_NAME
          }}
        />
      )}
    </div>
  );
};

export default ManageOrder;