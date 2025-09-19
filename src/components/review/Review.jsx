import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CancelIcon from "../../assets/addservice-cancel.svg";

const Review = ({ isOpen, onClose, orderData, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [ratingError, setRatingError] = useState("");    const handleClose = () => {
        setRating(0);
        setFeedback("");
        setRatingError("");
        onClose();
    };const handleStarClick = (starIndex) => {
        setRating(starIndex + 1);
        if (ratingError) {
            setRatingError("");
        }
    };    const handleSubmit = () => {
        if (rating === 0) {
            setRatingError("Please select a rating before submitting.");
            return;
        }
        
        setRatingError(""); // Clear any existing error
        
        const reviewData = {
            rating,
            feedback,
            orderData
        };
        
        // Call the onSubmit function passed from parent
        if (onSubmit) {
            onSubmit(reviewData);
        } else {
            // Fallback behavior
            console.log("Review submitted:", reviewData);
            alert("Review submitted successfully!");
            setRating(0);
            setFeedback("");
            onClose();
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.7,
            y: 60,
            rotateX: -15
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 30,
            rotateX: 10,
            transition: {
                duration: 0.25,
                ease: "easeIn"
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.25,
                ease: "easeIn"
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div
                        className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <nav className="flex flex-row items-center justify-between px-4 sm:px-6 h-[60px] sm:h-[68px] bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)] flex-shrink-0">
                            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-Archivo">
                                Review
                            </h2>
                            <motion.img
                                onClick={handleClose}
                                src={CancelIcon}
                                whileHover={{ scale: 1.1 }}
                                className="w-7 h-7 sm:w-9 sm:h-9 cursor-pointer"
                                alt="Close"
                            />
                        </nav>

                        {/* Content */}
                        <div className="p-4 sm:p-6 md:p-8">
                            {/* Title */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                                    Review Your Experience
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Help us improve our service by rating your recent order.
                                </p>
                            </div>

                            {/* Order Information */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                            Order #{orderData?.orderNumber || "#001"}
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {orderData?.serviceName || "UI/UX Design for Mobile App"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Stars */}
                            <div className="mb-6">
                                <div className="flex justify-center space-x-1 sm:space-x-2 mb-4">
                                    {[...Array(5)].map((_, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleStarClick(index)}
                                            className="focus:outline-none"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg
                                                className={`w-8 h-8 sm:w-10 sm:h-10 ${
                                                    index < rating 
                                                        ? "text-yellow-400 fill-current" 
                                                        : "text-gray-300"
                                                }`}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                />
                                            </svg>                                        </motion.button>
                                    ))}
                                </div>
                                {ratingError && (
                                    <div className="text-center">
                                        <p className="text-red-500 text-sm font-medium">{ratingError}</p>
                                    </div>
                                )}
                            </div>

                            {/* Feedback Text Area */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Share your feedback (optional)
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                                    rows="4"
                                    placeholder="Tell us about your experience..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <motion.button
                                    onClick={handleSubmit}
                                    className="bg-[#4DA1A9] hover:bg-[#3d8a92] text-white font-medium py-2 px-6 sm:py-3 sm:px-8 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={rating === 0}
                                >
                                    <span>Submit Review</span>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Review;