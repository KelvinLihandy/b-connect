import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';

import bankTransfer from '../../assets/mo_bank_transfer.svg';
import logo from '../../assets/invoice_logo.svg';

// Importing API routes
import { orderAPI, gigAPI } from '../../constants/APIRoutes';

const formatRupiah = (amount) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

const Invoice = () => {
  // Get orderId from URL params
  const { orderId } = useParams();

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    COMPANY: {
      NAME: "B-Connect",
      EMAIL: "bconnect404@gmail.com"
    },
    INVOICE: {
      NUMBER: "",
      DATE: "",
      STATUS: "PAID"
    },
    CUSTOMER: {
      NAME: "",
      EMAIL: ""
    },
    ORDER: {
      SERVICE_NAME: "",
      ORDER_NUMBER: "",
      PACKAGE: "",
      PRICE: 0,
      DISCOUNT: 0,
      PROCESSING_FEE: 0
    }, PAYMENT: {
      METHOD: "Bank Transfer",
      TRANSACTION_ID: "",
      DATE: ""
    }
  });

  // Calculate total
  const total = invoiceData.ORDER.PRICE + invoiceData.ORDER.PROCESSING_FEE - invoiceData.ORDER.DISCOUNT;

  // Helper function to format a date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        try {
          const response = await axios.get(`${orderAPI}/${orderId}`, {
            withCredentials: true
          });

          const orderData = response.data;
          const startDate = new Date(orderData.startTime);
          console.log("Fetched order data:", orderData);
          let gigDetails = null;
          try {
            const gigResponse = await axios.post(`${gigAPI}/get-gig/${orderData.gigId}`);
            gigDetails = gigResponse.data.detail;
            console.log("Fetched gig details:", gigDetails);
          } catch (gigError) {
            console.error("Error fetching gig details:", gigError);
          }

          setInvoiceData({
            COMPANY: {
              NAME: "B-Connect",
              EMAIL: "B-Connect404@gmail.com"
            },
            INVOICE: {
              NUMBER: `#INV-${orderData._id}`,
              DATE: formatDate(startDate),
              STATUS: orderData.transaction?.status,
            },
            CUSTOMER: {
              NAME: orderData.buyer?.name || "Customer",
              EMAIL: orderData.buyer?.email || ""
            },
            ORDER: {
              SERVICE_NAME: gigDetails ? gigDetails.name : (orderData.gigInfo?.title || "Service"),
              ORDER_NUMBER: orderData.orderId,
              PACKAGE: orderData.package?.type || "Basic",
              PRICE: orderData.package?.price || 0,
              DISCOUNT: 0,
              PROCESSING_FEE: 0,
              SERVICE_IMAGE: gigDetails && gigDetails.images && gigDetails.images.length > 0
                ? gigDetails.images[0]
                : orderData.gigInfo?.image || null
            },
            PAYMENT: {
              METHOD: "Bank Transfer",
              TRANSACTION_ID: orderId,
              DATE: formatDate(startDate)
            }
          });

        } catch (err) {
          if (err.response && err.response.status === 403) {
            setError("You are not authorized to view this invoice. Only the buyer and seller can access this page.");
          } else {
            console.error("Error fetching order data:", err);
            setError("Failed to load invoice data");
          }
          throw err;
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  // Show loading state
  if (loading) {
    return (
      <div className="font-Archivo">
        <div className="container mx-auto bg-[#F8F8F8] rounded-lg shadow-md p-10 mt-15 mb-15 max-w-4xl">
          <div className="flex justify-center items-center py-20">
            <p className="text-xl">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="font-Archivo">
        <div className="container mx-auto bg-[#F8F8F8] rounded-lg shadow-md p-10 mt-15 mb-15 max-w-4xl">
          <div className="flex justify-center items-center py-20">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-Archivo">
      {/* <Navbar alt />         */}
      <div className="container mx-auto bg-[#F8F8F8] rounded-lg shadow-md p-4 sm:p-6 md:p-10 mt-8 mb-8 max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-10">
          <div className="mb-6 sm:mb-0">
            <img src={logo} alt="B-Connect Logo" className="h-10 sm:h-12 mb-4" />
            <h2 className="text-lg font-bold">{invoiceData.COMPANY.NAME}</h2>
            <p className="text-gray-600">{invoiceData.COMPANY.EMAIL}</p>
          </div>
          <div className="text-left sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">INVOICE</h1>
            <p className="text-lg sm:text-xl text-gray-700">{invoiceData.INVOICE.NUMBER}</p>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-8" />

        {/* Client and Invoice Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">BILLED TO</h3>
            <p className="font-semibold">{invoiceData.CUSTOMER.NAME}</p>
            <p className="text-gray-600">{invoiceData.CUSTOMER.EMAIL}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">INVOICE NUMBER</h3>
            <p>{invoiceData.INVOICE.NUMBER}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">DATE OF ISSUE</h3>
            <p>{invoiceData.INVOICE.DATE}</p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">STATUS</h3>
          <span className={`px-3 py-1 ${invoiceData.INVOICE.STATUS === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-sm rounded-md`}>
            {invoiceData.INVOICE.STATUS}
          </span>
        </div>
        {/* Service Details */}
        <div className="mb-8">
          <div className="hidden sm:grid grid-cols-5 text-sm font-bold text-gray-600 uppercase border-b pb-2">
            <div className="col-span-4">DESCRIPTION</div>
            <div className="text-right">PRICE</div>
          </div>
          <div className="py-4 border-b">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-2">
              <div className="col-span-1 sm:col-span-4">
                <div>
                  <p className="font-semibold">{invoiceData.ORDER.SERVICE_NAME}</p>
                  <p className="text-gray-600 mt-1">Order {invoiceData.ORDER.ORDER_NUMBER} · {invoiceData.ORDER.PACKAGE}</p>
                </div>
              </div>
              <div className="text-left sm:text-right font-semibold">
                {formatRupiah(invoiceData.ORDER.PRICE)}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-semibold">{formatRupiah(invoiceData.ORDER.PRICE)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span className="font-semibold">{formatRupiah(invoiceData.ORDER.DISCOUNT)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Processing Fee</span>
              <span className="font-semibold">{formatRupiah(invoiceData.ORDER.PROCESSING_FEE)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-4">Payment Details</h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <img src={bankTransfer} alt="Bank Transfer" className="h-6 mr-2" />
              <div className="flex flex-col sm:flex-row">
                <span className="font-medium">{invoiceData.PAYMENT.METHOD}</span>
                <span className="text-gray-600 sm:ml-2">(Transaction ID: {invoiceData.PAYMENT.TRANSACTION_ID})</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              {invoiceData.PAYMENT.DATE}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Notes</h3>
          <p className="text-gray-600">Thank you for your purchase! This invoice was automatically generated and is valid without a signature.</p>
        </div>

        {/* Terms */}
        <p className="text-sm text-gray-500">
          All services provided are subject to our Terms of Service. Payment is expected within the terms specified.
        </p>
      </div>
    </div>
  );
}

export default Invoice;