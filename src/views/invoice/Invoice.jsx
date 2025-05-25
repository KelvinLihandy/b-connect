import React from 'react';
import Navbar from '../../components/navbar/Navbar';

import gopay from '../../assets/mo_gopay.svg';
import logo from '../../assets/invoice_logo.svg';

// Invoice Constants
const INVOICE_DATA = {
  COMPANY: {
    NAME: "B-Connect",
    EMAIL: "B-Connect404@gmail.com"
  },
  INVOICE: {
    NUMBER: "#INV-001-15042025",
    DATE: "Apr 15, 2025",
    STATUS: "PAID"
  },
  CUSTOMER: {
    NAME: "Adam Warlok",
    EMAIL: "AdamWarlok@gmail.com"
  },
  ORDER: {
    SERVICE_NAME: "I will design UI/UX for mobile app with figma",
    ORDER_NUMBER: "#001",
    PACKAGE: "Basic Package",
    PRICE: 210000,
    DISCOUNT: 0,
    PROCESSING_FEE: 10000
  },
  PAYMENT: {
    METHOD: "GoPay",
    TRANSACTION_ID: "GP257896354",
    DATE: "Apr 15, 2025"
  }
};

// Calculate total
const TOTAL = INVOICE_DATA.ORDER.PRICE + INVOICE_DATA.ORDER.PROCESSING_FEE - INVOICE_DATA.ORDER.DISCOUNT;

// Format currency as Indonesian Rupiah
const formatRupiah = (amount) => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

const Invoice = () => {
  return (
    <div className="font-Archivo">
        <Navbar alt />        
        <div className="container mx-auto bg-white rounded-lg shadow-md p-10 mt-30 mb-15 max-w-4xl">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <img src={logo} alt="B-Connect Logo" className="h-12 mb-4" />
                    <h2 className="text-lg font-bold">{INVOICE_DATA.COMPANY.NAME}</h2>
                    <p className="text-gray-600">{INVOICE_DATA.COMPANY.EMAIL}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                    <p className="text-xl text-gray-700">{INVOICE_DATA.INVOICE.NUMBER}</p>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-300 mb-8" />

            {/* Client and Invoice Info */}
            <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">BILLED TO</h3>
                    <p className="font-semibold">{INVOICE_DATA.CUSTOMER.NAME}</p>
                    <p className="text-gray-600">{INVOICE_DATA.CUSTOMER.EMAIL}</p>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">INVOICE NUMBER</h3>
                    <p>{INVOICE_DATA.INVOICE.NUMBER}</p>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">DATE OF ISSUE</h3>
                    <p>{INVOICE_DATA.INVOICE.DATE}</p>
                </div>
            </div>

            {/* Status */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">STATUS</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md">
                    {INVOICE_DATA.INVOICE.STATUS}
                </span>
            </div>

            {/* Service Details */}
            <div className="mb-8">
                <div className="grid grid-cols-5 text-sm font-bold text-gray-600 uppercase border-b pb-2">
                    <div className="col-span-4">DESCRIPTION</div>
                    <div className="text-right">PRICE</div>
                </div>

                <div className="py-4 border-b">
                    <div className="grid grid-cols-5">
                        <div className="col-span-4">
                            <p className="font-semibold">{INVOICE_DATA.ORDER.SERVICE_NAME}</p>
                            <p className="text-gray-600 mt-1">Order {INVOICE_DATA.ORDER.ORDER_NUMBER} · {INVOICE_DATA.ORDER.PACKAGE}</p>
                        </div>
                        <div className="text-right font-semibold">
                            {formatRupiah(INVOICE_DATA.ORDER.PRICE)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
                <div className="w-1/2">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span className="font-semibold">{formatRupiah(INVOICE_DATA.ORDER.PRICE)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Discount</span>
                        <span className="font-semibold">{formatRupiah(INVOICE_DATA.ORDER.DISCOUNT)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Processing Fee</span>
                        <span className="font-semibold">{formatRupiah(INVOICE_DATA.ORDER.PROCESSING_FEE)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total</span>
                        <span>{formatRupiah(TOTAL)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-bold mb-4">Payment Details</h3>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={gopay} alt="GoPay" className="h-6 mr-2" />
                        <span className="font-medium">GoPay</span>
                        <span className="text-gray-600 ml-2">(Transaction ID: {INVOICE_DATA.PAYMENT.TRANSACTION_ID})</span>
                    </div>
                    <div className="text-right">
                        {INVOICE_DATA.PAYMENT.DATE}
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