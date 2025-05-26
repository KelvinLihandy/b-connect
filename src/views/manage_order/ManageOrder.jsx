import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { UserTypeContext } from '../../contexts/UserTypeContext';

import check from '../../assets/mo_check.svg';
import clock from '../../assets/mo_clock.svg';
import gopay from '../../assets/mo_gopay.svg';
import image from '../../assets/mo_image.svg';
import information from '../../assets/mo_information.svg';
import invoice from '../../assets/mo_invoice.svg';
import Return from '../../assets/mo_return.svg';
import send from '../../assets/mo_send.svg';
import status from '../../assets/mo_status.svg';



// Date Constants
const ORDER_DATES = {
  ORDER_CONFIRMATION_DATE: "Apr 05, 2022",
  EXPECTED_DELIVERY: "Apr 10, 2022",
  IN_PROGRESS_DATE: "Apr 6, 2022",
  DELIVERY_DATE: "Expected by Apr 10"
};

// Order Details Constants
const ORDER_DETAILS = {
  ORDER_NUMBER: "001",
  SERVICE_NAME: "I will design UI/UX for mobile app with figma",
  SERVICE_PRICE: 210000, // In Rupiah
  PROCESSING_FEE: 10500, // In Rupiah
  DISCOUNT: 0, // In Rupiah
  SERVICE_IMAGE: image, // Reference to the imported image SVG
};

// Calculate total order cost
const TOTAL_PRICE = ORDER_DETAILS.SERVICE_PRICE + ORDER_DETAILS.PROCESSING_FEE - ORDER_DETAILS.DISCOUNT;

// Status constants based on current step
const STATUS_COLORS = {
  0: "bg-orange-500", // Waiting status with orange background
  1: "bg-green-500",  // Confirmed status with green background
  2: "bg-yellow-500", // In Progress status with yellow background
  3: "bg-green-500"   // Delivered status with green background
};

const STATUS_ICONS = {
  0: status,
  1: status,
  2: status,
  3: check
};

const STATUS_TEXT = {
  0: "Waiting",
  1: "Order Confirmed",
  2: "In Progress",
  3: "Delivered"
};

// Format currency as Indonesian Rupiah
const formatRupiah = (amount) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

// Payment method constants
const PAYMENT_METHOD = {
  TYPE: "GoPay",
  STATUS: "Paid"
};

// Order Status Timeline Constants
const STEPS = [
  {
    id: 1,
    name: "Order Confirmed", 
    icon: check, 
    date: ORDER_DATES.ORDER_CONFIRMATION_DATE
  },
  {
    id: 2,
    name: "In Progress", 
    icon: clock, 
    date: ORDER_DATES.IN_PROGRESS_DATE
  },
  {
    id: 3,
    name: "Delivered", 
    icon: send, 
    date: ORDER_DATES.DELIVERY_DATE
  }
];

const ManageOrder = () => {
  // Access the user type context to check if user is a freelancer
  const { isFreelancer } = useContext(UserTypeContext);
  
  // Current active step - this would be set by backend data in a real app
  // 0 = Waiting, 1 = Order Confirmed, 2 = In Progress, 3 = Delivered
  const [currentStep, setCurrentStep] = useState(0);

  // Handle invoice button click - opens invoice in new window
  const handleInvoiceClick = () => {
    // Generate invoice URL - in a real app this would be from backend
    const invoiceUrl = `/invoice`; // Tambahin aja di belakang nanti utk order ID (e.g. `/invoice/001`)
    
    // Open invoice in new window/tab
    window.open(invoiceUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  // This useEffect would simulate getting the order status from backend
  useEffect(() => {
    // In a real app, you would fetch order status from backend API
    // and then update the current step based on that data
    // Example: 
    // fetchOrderStatus(orderId).then(status => {
    //   if (status === "delivered") setCurrentStep(3);
    //   else if (status === "in_progress") setCurrentStep(2);
    //   else if (status === "confirmed") setCurrentStep(1);
    //   else setCurrentStep(0); // Waiting status
    // });
  }, []);
  
  return (
    <div className="font-Archivo">
      <Navbar alt />
      <div className='container mx-auto bg-[#F8F8F8] rounded-lg shadow-md px-4 py-4 mt-35 mb-15'>        {/* Order Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Order #{ORDER_DETAILS.ORDER_NUMBER}</h1>
          <div className="flex text-lg gap-8">
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
            <p>Order date: {ORDER_DATES.ORDER_CONFIRMATION_DATE}</p>
            <p>Expected delivery: <span className="text-green-500">{ORDER_DATES.EXPECTED_DELIVERY}</span></p>
          </div>
        </div>
        
        <div className="border-t border-[#000] w-full mb-6"></div>        
        {/* Order Status Timeline*/}        
        <div className="mb-8">
          {/* Progress bar background */}
          <div className="flex justify-between items-center px-[5%] mb-1 relative">
            {/* Progress line - only between steps (not at edges) */}
            <div className="absolute h-1 top-[35px] -translate-y-1/2 left-[10%] right-[10%]">
              {/* First progress segment (between steps 1-2) */}
              <div className="absolute left-0 right-1/2 h-full bg-gray-200">
                {currentStep > 1 && <div className="h-full bg-green-500 w-full transition-all duration-300"></div>}
              </div>
              {/* Second progress segment (between steps 2-3) */}
              <div className="absolute left-1/2 right-0 h-full bg-gray-200">
                {currentStep > 2 && <div className="h-full bg-green-500 w-full transition-all duration-300"></div>}
              </div>
            </div>
            
            {/* Steps indicators */}
            {STEPS.map((step, index) => (
              <div key={step.id} className="z-10 flex flex-col items-center">
                {/* Circle indicator */}
                <div 
                  className={`w-[70px] h-[70px] flex items-center justify-center rounded-full 
                    ${index + 1 <= currentStep ? 'bg-green-500' : 'bg-gray-300'} 
                    border-4 border-white shadow-md mb-2`}
                >
                  <img 
                    src={step.icon} 
                    alt={step.name} 
                    className="w-8 h-8"
                  />
                </div>                {/* Step name and date */}
                <div className="text-center mt-2">
                  <p className="font-medium text-lg">{step.name}</p>
                  <p className="text-gray-500 text-base">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
          <div className="border-t border-[#000] w-full mb-6"></div>

        {/* Status Testing Controls - Uncomment for testing */}
        {/* <div className="flex justify-center gap-4 mb-4">
          <button 
            onClick={() => setCurrentStep(0)} 
            className={`px-3 py-1 ${currentStep === 0 ? 'bg-orange-500 text-white font-bold' : 'bg-gray-200'} rounded`}
          >
            Waiting
          </button>
          <button 
            onClick={() => setCurrentStep(1)} 
            className={`px-3 py-1 ${currentStep === 1 ? 'bg-green-500 text-white font-bold' : 'bg-gray-200'} rounded`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setCurrentStep(2)} 
            className={`px-3 py-1 ${currentStep === 2 ? 'bg-yellow-500 text-white font-bold' : 'bg-gray-200'} rounded`}
          >
            In Progress
          </button>
          <button 
            onClick={() => setCurrentStep(3)} 
            className={`px-3 py-1 ${currentStep === 3 ? 'bg-green-500 text-white font-bold' : 'bg-gray-200'} rounded`}
          >
            Delivered
          </button>
        </div> */}
            
        {/* Order Item */}
        <div className="flex items-center py-4 mb-6">
          <div className="bg-gray-200 p-4 rounded mr-4">
            <img src={ORDER_DETAILS.SERVICE_IMAGE} alt="Service" className="w-20 h-20" />
          </div>          <div className="flex-grow">
            <h3 className="font-medium text-2xl">{ORDER_DETAILS.SERVICE_NAME}</h3>
            <div className="text-gray-500 text-lg flex items-center gap-2">
              <p>Order #{ORDER_DETAILS.ORDER_NUMBER}</p>
              <p>{ORDER_DATES.ORDER_CONFIRMATION_DATE}</p>
            </div>
            <span className={`inline-block ${STATUS_COLORS[currentStep]} text-white rounded px-2 py-1 text-sm mt-1`}>{STATUS_TEXT[currentStep]}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">{formatRupiah(ORDER_DETAILS.SERVICE_PRICE)}</p>
          </div>
        </div>
        
        <div className="border-t border-[#000] w-full mb-6"></div>        {/* Payment Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-2">Payment</h2>
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-xl font-Archivo">
              <img src={gopay} alt={PAYMENT_METHOD.TYPE} className="" />
              <span>{PAYMENT_METHOD.TYPE}</span>
              <span className="bg-[#DBEAFE] text-gray-600 rounded px-2 py-1 text-sm ml-2">{PAYMENT_METHOD.STATUS}</span>
            </div>
            
            {isFreelancer && (
              <div className="ml-auto">
                {currentStep === 0 && (
                  <button 
                    onClick={() => setCurrentStep(2)} 
                    className="bg-yellow-500 cursor-pointer text-white text-lg rounded px-4 py-1 flex items-center gap-2"
                  >
                    <img src={status} alt="Status" className="" />
                    <span>Confirm Order</span>
                  </button>
                )}
                {currentStep === 2 && (
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    className="bg-yellow-500 cursor-pointer text-white text-lg rounded px-4 py-1 flex items-center gap-2"
                  >
                    <img src={check} alt="Check" className="" />
                    <span>Finish Order</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-[#000] w-full mb-6"></div>

        {/* Help and Order Summary */}
        <div className="flex">          {/* Need Help Section */}
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl font-medium font-Archivo mb-3">Need Help</h2>
            <div className="space-y-3 font-Archivo text-lg">
              <button className="flex items-center gap-2 cursor-pointer">
                <img src={information} alt="Order Issues" className="" />
                <span>Order Issues</span>
              </button>
              <button className="flex items-center gap-2 cursor-pointer">
                <img src={information} alt="Delivery Info" className="" />
                <span>Delivery Info</span>
              </button>
              <button className="flex items-center gap-2 cursor-pointer">
                <img src={Return} alt="Returns" className="" />
                <span>Returns</span>
              </button>
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl mb-3">Order Summary</h2>
            <div className="space-y-2 text-lg font-Archivo"><div className="flex justify-between">
                <span>Service Price</span>
                <span>{formatRupiah(ORDER_DETAILS.SERVICE_PRICE)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>{formatRupiah(ORDER_DETAILS.DISCOUNT)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>{formatRupiah(ORDER_DETAILS.PROCESSING_FEE)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(TOTAL_PRICE)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageOrder;