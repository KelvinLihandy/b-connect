import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import product1 from "../../assets/image 35.png";
import product2 from "../../assets/image.png";
import reviewProduct from "../../assets/reviewProduct1.png";
import reviewProduct2 from "../../assets/reviewProduct2.png";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("purchase");

  const purchaseHistory = [
    {
      id: 1,
      title: "I will design UI/UX for mobile app with figma",
      date: "Order #001, Jun 15, 2020",
      status: "In Progress",
      price: "Rp 210.000",
      image: product1,
      statusType: "progress",
    },
    {
      id: 2,
      title: "I will create landing page for your business",
      date: "Order #002, Jun 15, 2020",
      status: "Completed",
      price: "Rp 210.000",
      image: product2,
      statusType: "completed",
    },
    {
      id: 3,
      title: "I will design UI/UX for mobile app with figma",
      date: "Order #003, Jun 15, 2020",
      status: "Completed",
      price: "Rp 210.000",
      image: product1,
      statusType: "completed",
    },
    {
      id: 4,
      title: "I will create landing page for your business",
      date: "Order #004, Jun 15, 2020",
      status: "Completed",
      price: "Rp 210.000",
      image: product2,
      statusType: "completed",
    },
  ];

  const reviewsData = [
    {
      id: 1,
      title: "I will design UI/UX for mobile app with figma",
      orderId: "Order #001, Jun 15, 2020",
      rating: 4.5,
      reviewText: "The service was excellent! The designer understood my requirements perfectly and delivered the UI/UX design exactly as I wanted. The communication was clear and prompt, and the revisions were handled professionally. I'm very satisfied with the final result.",
      image: product1,
      wireframes: [reviewProduct, reviewProduct2]
    },
    {
      id: 2,
      title: "I will design UI/UX for mobile app with figma", 
      orderId: "Order #002, Jun 15, 2020",
      rating: 4.5,
      reviewText: "The service was excellent! The designer understood my requirements perfectly and delivered the UI/UX design exactly as I wanted. The communication was clear and prompt, and the revisions were handled professionally. I'm very satisfied with the final result.",
      image: product2,
      wireframes: []
    }
  ];

  const userStats = {
    memberSince: "2020",
    profileFinish: "85%",
    activeVouchers: "3",
    totalOrder: "12",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      {/* Spacer untuk memberikan jarak setelah navbar */}
      <div className="h-24"></div>

      <div className="max-w-6xl mx-auto p-5 bg-white mt-8 mb-20 rounded-xl shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-8 text-white relative">
          <div className="mr-5">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">Adam Warlok</h1>
            <p className="text-base opacity-90">AdamWarlok@gmail.com</p>
          </div>
          <div className="absolute top-5 right-5">
            <button className="bg-white bg-opacity-20 border-none rounded-lg p-2 text-white cursor-pointer hover:bg-opacity-30 transition-all duration-300">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="flex items-center p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl mr-4">📅</div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Member Since:</span>
              <span className="text-lg font-semibold text-gray-700">{userStats.memberSince}</span>
            </div>
          </div>
          <div className="flex items-center p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl mr-4">📋</div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Profile Finish:</span>
              <span className="text-lg font-semibold text-gray-700">{userStats.profileFinish}</span>
            </div>
          </div>
          <div className="flex items-center p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl mr-4">🎫</div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Active Vouchers:</span>
              <span className="text-lg font-semibold text-gray-700">{userStats.activeVouchers}</span>
            </div>
          </div>
          <div className="flex items-center p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl mr-4">📦</div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Total Order:</span>
              <span className="text-lg font-semibold text-gray-700">{userStats.totalOrder}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-gray-200 mb-8">
          <button
            className={`px-8 py-4 text-base font-medium cursor-pointer border-b-2 transition-all duration-300 ${
              activeTab === "purchase"
                ? "text-blue-500 border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("purchase")}
          >
            Purchase History
          </button>
          <button
            className={`px-8 py-4 text-base font-medium cursor-pointer border-b-2 transition-all duration-300 ${
              activeTab === "reviews"
                ? "text-blue-500 border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === "purchase" && (
            <div className="flex flex-col gap-5 pb-8">
              {purchaseHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col lg:flex-row items-start gap-5 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full lg:w-30 h-20 object-cover rounded-lg bg-gray-200"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{item.date}</p>
                    <div className="flex items-center gap-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                          item.statusType === "progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <span key={index} className="text-yellow-400 text-sm">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">300 Items sold</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                    <div className="text-xl font-bold text-gray-700">{item.price}</div>
                    <button
                      className={`px-5 py-2 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-300 min-w-32 ${
                        item.statusType === "progress"
                          ? "bg-cyan-500 text-white hover:bg-cyan-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {item.statusType === "progress" ? "Order Details" : "Buy Again"}
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8 mb-8">
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  ‹
                </button>
                <button className="bg-blue-500 text-white border-blue-500 px-3 py-2 rounded-md cursor-pointer min-w-10">
                  1
                </button>
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  2
                </button>
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  3
                </button>
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  ›
                </button>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6 pb-8">
              {reviewsData.map((review, index) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  {/* Review Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={review.image}
                        alt={review.title}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-200"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">{review.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{review.orderId}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, starIndex) => (
                            <span 
                              key={starIndex} 
                              className={`text-sm ${starIndex < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{review.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Edit</button>
                      <button className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {review.reviewText}
                    </p>
                  </div>

                  {/* Wireframes/Mockups - Only show if wireframes exist */}
                  {review.wireframes && review.wireframes.length > 0 && (
                    <div className="mb-4">
                      <div className="flex gap-3 flex-wrap">
                        {review.wireframes.map((wireframe, wireIndex) => (
                          <div key={wireIndex} className="w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                            <img 
                              src={wireframe}
                              alt={`Wireframe ${wireIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Divider */}
                  {index < reviewsData.length - 1 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400 text-center">
                        Review {index + 1} of {reviewsData.length}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination for Reviews */}
              <div className="flex justify-center items-center gap-2 mt-8 mb-8">
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  ‹
                </button>
                <button className="bg-blue-500 text-white border-blue-500 px-3 py-2 rounded-md cursor-pointer min-w-10">
                  1
                </button>
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  2
                </button>
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  3
                </button>
                <button className="border border-gray-300 px-3 py-2 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-300 min-w-10">
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer untuk memberikan jarak dengan footer */}
      <div className="h-20"></div>

      <Footer />
    </div>
  );
};

export default UserProfile;