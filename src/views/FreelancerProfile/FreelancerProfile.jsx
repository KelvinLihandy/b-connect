import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";


export default function FreelancerProfile() {
  const [isFreelancerView, setIsFreelancerView] = useState(false);
  const [hasReviews, setHasReviews] = useState(true);
  const { id } = useParams();

  // Sample data for the freelancer - in a real app, you'd fetch this from an API
  const freelancerData = {
    name: "Adam Warbix",
    title: "UI/UX Designer",
    rating: 4.8,
    totalReviews: 10,
    online: true,
    overview: "Hello, saya Adam seorang desainer logo profesional dengan pengalaman bertahun-tahun dalam dunia menciptakan identitas merek yang kuat dan berkesan. Dengan pemahaman yang kreatif dan berbasis riset, saya mampu menuangkan ide-ide segar yang akan hadir dalam industri anda. Setiap logo yang saya ciptakan menyampaikan nilai dan tujuan bisnis anda dengan baik. Saya juga memiliki keahlian dalam branding visual secara keseluruhan, termasuk pemilihan warna, elemen grafis, dan desain material promosi. Dengan dedikasi tinggi terhadap hasil yang berkualitas, saya siap bekerja bersama Anda untuk menciptakan identitas visual yang profesional dan unik.",
    tags: ["Logo Design", "UI/UX Design", "Branding", "Web Design", "Figma"],
    reviews: [
      {
        id: 1,
        clientName: "client123",
        date: "20 Oct 2023",
        rating: 5,
        price: "$100",
        comment: "Adam is a professional designer who I have collaborated with over the past few months. He was detailed and met my project requirements."
      },
      {
        id: 2,
        clientName: "client456",
        date: "05 Jun 2023",
        rating: 4,
        price: "$200",
        comment: "I am extremely satisfied with the work done. Adam offered creative solutions for my UI/UX project. Excellent work!"
      }
    ]
  };

  // Handle toggle between freelancer and user view
  const handleModeToggle = (isFreelancer) => {
    setIsFreelancerView(isFreelancer);
  };

  // Toggle between having reviews and not having reviews (for demo purposes)
  const toggleReviewsStatus = () => {
    setHasReviews(!hasReviews);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar with toggle */}
      <Navbar onModeToggle={handleModeToggle} initialMode={isFreelancerView} />
      
      {/* Profile header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row">
            {/* Profile Info Left Column */}
            <div className="w-full md:w-2/3 pr-0 md:pr-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  {/* Profile image placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold">{freelancerData.name}</h1>
                    <span className={`ml-2 px-2 py-1 text-xs ${isFreelancerView ? "bg-blue-500" : "bg-green-500"} text-white rounded-full`}>
                      {freelancerData.online ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="text-gray-600">{freelancerData.title}</p>
                </div>
              </div>

              {/* Overview Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-gray-700">{freelancerData.overview}</p>
              </div>

              {/* Display for no reviews/history condition */}
              {!hasReviews && (
                <div className="mb-8 flex justify-center">
                  <div className="w-64 text-center">
                    <div className="hexagon-container">
                      <svg width="200" height="200" viewBox="0 0 200 200">
                        <polygon points="50,0 150,0 200,86.6 150,173.2 50,173.2 0,86.6" 
                                 fill="none" 
                                 stroke="#000" 
                                 strokeWidth="2" />
                        <g transform="translate(60, 50)">
                          <path d="M40,10 C40,10 40,15 40,20 C40,35 60,35 60,20 C60,15 60,10 60,10 M30,40 C30,40 40,60 50,70 C60,60 70,40 70,40 M20,80 C20,80 40,90 50,90 C60,90 80,80 80,80 M30,100 C40,105 60,105 70,100 M40,110 C45,115 55,115 60,110"
                                fill="none" 
                                stroke="#000" 
                                strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                    <p className="mt-4 text-gray-500">Belum ada riwayat penjualan</p>
                    <p className="text-gray-500">Beri penyelesaian proyek ya sukses!</p>
                  </div>
                </div>
              )}

              {/* Work History and Feedback Section */}
              {hasReviews && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Work History and Feedback</h2>
                  
                  {freelancerData.reviews.map(review => (
                    <div key={review.id} className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{review.clientName}</span>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <span className="font-medium">{review.price}</span>
                      </div>
                      
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className="w-4 h-4" 
                            fill={i < review.rating ? "#FFD700" : "none"} 
                            stroke={i < review.rating ? "#FFD700" : "#CBD5E0"}
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      
                      {/* Project images (placeholders) */}
                      <div className="flex mt-4 space-x-4">
                        {[1, 2, 3].map(imgId => (
                          <div key={imgId} className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button className="text-blue-500 text-sm font-medium px-4 py-2 border border-blue-500 rounded">
                    View All Reviews
                  </button>
                </div>
              )}
            </div>

            {/* Stats and Actions Right Column */}
            <div className="w-full md:w-1/3 mt-8 md:mt-0">
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
                {isFreelancerView ? (
                  <h3 className="text-lg font-semibold mb-4">Here's your profile</h3>
                ) : (
                  <h3 className="text-lg font-semibold mb-4">Messages</h3>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 font-medium">{freelancerData.rating}/5</span>
                    <span className="text-gray-500 text-sm">{freelancerData.totalReviews} reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(freelancerData.rating / 5) * 100}%` }}></div>
                  </div>
                </div>

                {/* If not freelancer view, show additional stats bars */}
                {!isFreelancerView && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-700 text-sm">Communication</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-700 text-sm">Service</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-700 text-sm">Quality</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                  </>
                )}

                {/* Skill Tags */}
                <div className="mb-4">
                  <h4 className="text-gray-700 font-medium mb-2">Skill Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {freelancerData.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio Link */}
                <div className="pt-4 border-t border-gray-200">
                  <a href="#" className="text-blue-500 font-medium">Portfolio Link</a>
                </div>

                {/* Action buttons for user view */}
                {!isFreelancerView && (
                  <div className="mt-6">
                    <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mb-3">
                      Contact
                    </button>
                    <button className="w-full bg-white text-blue-500 py-3 rounded-lg font-medium border border-blue-500">
                      Save to Favorites
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    <Footer />
      
      {/* Demo controls (for testing only) */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <button 
          onClick={toggleReviewsStatus} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Toggle Reviews: {hasReviews ? "Show No Reviews" : "Show Reviews"}
        </button>
      </div>
    </div>
    
  );
}