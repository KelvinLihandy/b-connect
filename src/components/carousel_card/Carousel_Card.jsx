import React from "react";

const CarouselCard = ({ image, title, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
      <img src={image} alt={title} className="w-full h-32 sm:h-48 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>
  );
};

export default CarouselCard;
