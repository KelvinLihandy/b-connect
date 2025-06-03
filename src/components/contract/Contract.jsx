import React, { useContext, useEffect, useState } from "react";
import cancel from "../../assets/icons8-cancel (1).svg";
import contract_done from "../../assets/Contract_done.svg";
import contract_pending from "../../assets/newsletter.svg";
import contract_fail from "../../assets/asking-question.svg";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { contractAPI } from "../../constants/APIRoutes";
import { AuthContext } from "../../contexts/AuthContext";
import { DisabledGigsContext } from "../../contexts/DisabledGigsContext";

const Contract = ({ isOpen, onClose, gigId, packages, setDisable }) => {
  const steps = ["Select", "Payment", "Confirm"];
  const { auth } = useContext(AuthContext);
  const { getDisabledGigs } = useContext(DisabledGigsContext);  
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState();
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [finishPay, setFinishPay] = useState(false);
  const [pendingPay, setPendingPay] = useState(false);  
  const [failPay, setFailPay] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [showProgress, setShowProgress] = useState(true);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);  const [paymentProofError, setPaymentProofError] = useState("");
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const navigate = useNavigate();

  const contractModalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.75, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const preventClose = (e) => {
    e.stopPropagation();
  };

  const handleStepClick = (stepNum) => {
    console.log("step", step, "stepnum", stepNum);
    if (step === steps.length) {
      setStep(1);
      setShowProgress(true);
      return;
    }
    if (stepNum < step || stepNum === step + 1) {
      setStep(stepNum);
    } else if (stepNum === step) {
      return;
    }
  };
  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    });
  };

  // Payment proof file handling functions
  const handlePaymentProofUpload = (event) => {
    const file = event.target.files[0];
    setPaymentProofError("");

    if (!file) return;

    // Validate file type (PNG/JPG only)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setPaymentProofError("Please select a PNG or JPG image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setPaymentProofError("File size must be less than 5MB");
      return;
    }

    setPaymentProofFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPaymentProofPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removePaymentProof = () => {
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    setPaymentProofError("");
  };  const handleSubmitPaymentProof = async () => {
    if (!paymentProofFile) {
      setPaymentProofError("Please select a payment proof image");
      return;
    }

    if (!currentTransactionId) {
      setPaymentProofError("No transaction ID available. Please try creating the order again.");
      return;
    }

    setIsUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append("paymentProof", paymentProofFile);
      formData.append("orderId", currentTransactionId);
      formData.append("gigId", gigId);
      formData.append("packageType", selectedPackage?.type);
      formData.append("amount", selectedPackage?.price);

      const response = await axios.post(`${contractAPI}/upload-payment-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if (response.data.status === "success") {
        console.log("Payment proof uploaded successfully:", response.data);
        alert("Payment proof uploaded successfully! Your order is now being processed.");
        
        // Navigate to user profile or order history
        navigate(`/user-profile/${auth?.data?.auth?.id}`);
        onClose();
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
      
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload payment proof. Please try again.";
      setPaymentProofError(errorMessage);
    } finally {
      setIsUploadingProof(false);
    }
  };
  // Function to create transaction when user clicks "Place Order"
  const handleCreateTransaction = async () => {
    if (!selectedPackage) {
      handleStepClick(step - 1);
      return;
    }
    
    if (auth?.data?.auth.phoneNumber === "") {
      setPhoneError("Phone Number is required. Please set first in settings");
      return;
    }

    setIsCreatingTransaction(true);
    setPhoneError(""); // Clear any previous errors

    try {
      const response = await axios.post(`${contractAPI}/create-transaction`, {
        gigId: gigId,
        selectedPackage: selectedPackage
      }, { 
        withCredentials: true 
      });

      if (response.data.status === "success transaction create") {
        console.log("Transaction created:", response.data);
        setCurrentTransactionId(response.data.transaction.orderId);
        handleStepClick(step + 1);
        getDisabledGigs();
      } else {
        throw new Error(response.data.message || "Failed to create transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      setPhoneError("Failed to create transaction. Please try again.");
    } finally {
      setIsCreatingTransaction(false);
    }
  };
  
  // useEffect(() => {
  //   const midtransScriptUrl = 'https://app.midtrans.com/snap/snap.js';

  //   let scriptTag = document.createElement('script');
  //   scriptTag.src = midtransScriptUrl;
  //   // const myMidtransClientKey = 'SB-Mid-client-jTywWMkTIvxp4C-v';
  //   const myMidtransClientKey = 'Mid-client-NsyRetKg6B6JB-qU';
  //   scriptTag.setAttribute('data-client-key', myMidtransClientKey);

  //   document.body.appendChild(scriptTag);

  //   return () => {
  //     document.body.removeChild(scriptTag);
  //   }
  // }, []);

  // Cleanup effect for payment proof preview
  useEffect(() => {
    return () => {
      if (paymentProofPreview && paymentProofPreview.startsWith('blob:')) {
        URL.revokeObjectURL(paymentProofPreview);
      }
    };
  }, [paymentProofPreview]);

  // const initiateTransaction = async () => {
  //   if (!selectedPackage && finishPay) return;
  //   try {
  //     const res = await axios.post(`${contractAPI}/create-transaction`,
  //       {
  //         gigId: gigId,
  //         selectedPackage: selectedPackage
  //       },
  //       { withCredentials: true }
  //     )
  //     if (res && res.data.status === "success transaction create") {
  //       console.log(res);
  //       window.snap.pay(res.data.transaction.snap_token, {
  //         onSuccess: function (result) {
  //           console.log("success", result);
  //           setFinishPay(true);
  //           setShowProgress(false)
  //         },
  //         onPending: function (result) {
  //           console.log("pending", result);
  //           setPendingPay(true);
  //           setShowProgress(false)
  //         },
  //         onClose: function (result) {
  //           console.log("close", result);
  //           setFailPay(true);
  //           setShowProgress(false)
  //         }
  //       })
  //     }
  //     else {
  //       console.log("error api midtrans", res);
  //     }
  //   } catch (error) {
  //     console.log("error initiate transaction", error);
  //   }
  //   getDisabledGigs();
  // };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setStep(1);
            onClose();
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="fixed inset-0 bg-gray-500 transition-opacity"
            aria-hidden="true"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          <div className="fixed inset-0 z-10 w-screen h-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <motion.div
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg min-w-3/4 min-h-3/4 max-h-3/4"
                onClick={preventClose}
                variants={contractModalVariants}
              >
                <div className="bg-white">
                  <div>
                    <div className="py-4 px-6 text-center sm:text-left bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)] flex flex-row justify-between w-full items-center select-none">
                      <h3 className="text-2xl text-white font-bold">Contract Page</h3>
                      {!finishPay && (
                        <motion.img
                          src={cancel}
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => {
                            setStep(1);
                            onClose();
                          }}
                        />
                      )}
                    </div>
                    <div className="p-6 flex flex-col h-200 gap-5">
                      <>
                        {showProgress &&
                          <div className="w-full px-100 static">
                            <div className="flex flex-col justify-center">
                              <div className="grid grid-cols-3 items-center relative">
                                <div className="absolute left-[15%] right-[15%] h-1 top-5 bg-gray-200 z-0">
                                  <div
                                    className="h-1 bg-blue-500 transition-all duration-300"
                                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                                  />
                                </div>
                                {steps.map((label, index) => {
                                  const current = index + 1;
                                  const isActive = current === step;
                                  const isCompleted = current < step;
                                  const isClickable = current <= step;

                                  return (
                                    <div className="flex-1 flex flex-col items-center z-10 text-center" key={index}>
                                      <div
                                        className={`flex flex-col items-center ${isClickable
                                          ? "cursor-pointer"
                                          : "cursor-default pointer-events-none"
                                          }`}
                                        onClick={() => handleStepClick(current)}
                                      >
                                        <div
                                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                                            ${isActive
                                              ? "bg-blue-500 border-2 border-[#2E5077]"
                                              : isCompleted
                                                ? "bg-blue-500"
                                                : "bg-gray-200"}
                                            ${isClickable ? "hover:shadow-md transition-shadow cursor-pointer" : "cursor-default pointer-events-none"}`}
                                          onClick={() => isClickable && handleStepClick(current)}
                                        >
                                          <span
                                            className={
                                              isCompleted || isActive
                                                ? "text-white"
                                                : "text-gray-600"
                                            }
                                          >
                                            {isCompleted ? "✓" : current}
                                          </span>
                                        </div>

                                      </div>
                                      <span className="text-sm">{label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        }
                        {step == 1 && (
                          <>
                            <div className="flex flex-col text-center font-Archivo mt-5">
                              <p className="text-3xl font-bold">Choose The Package</p>
                              <p className="">Konfirmasi paket mana yang ingin kamu pilih</p>
                            </div>
                            <div className="flex flex-row justify-center gap-30 px-50 h-130">
                              {packages?.map((pkg) => (
                                <div className="w-1/2 h-full flex flex-col justify-between shadow-2xl rounded-lg shadow-[#0A74F340]/75">
                                  <div className="bg-[#1E617A] h-3/20 flex items-center justify-center rounded-t-lg">
                                    <div className="flex border-4 border-white text-white font-bold w-5/10 items-center justify-center text-3xl rounded-lg h-7/10">
                                      {pkg?.type}
                                    </div>
                                  </div>
                                  <div className="bg-white h-13/20 px-4 py-8 text-xl">
                                    <div className="flex items-center gap-2">
                                      <Check
                                        className="text-green-500 mt-0.5 flex-shrink-0"
                                        size={32}
                                      />
                                      <span>Jumlah Batas Konsep: {pkg?.conceptLimit} Hari</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Check
                                        className="text-green-500 mt-0.5 flex-shrink-0"
                                        size={32}
                                      />
                                      <span>Durasi Pengerjaan: {pkg?.workDuration} Hari</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Check
                                        className="text-green-500 mt-0.5 flex-shrink-0"
                                        size={32}
                                      />
                                      <span>Jumlah Batas Revisi: {pkg?.revisionLimit} Kali</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Check
                                        className={`${pkg?.sourceFile ? "text-green-500" : "text-gray-500"
                                          } mt-0.5 flex-shrink-0`}
                                        size={32}
                                      />
                                      <span>Source File</span>
                                    </div>
                                  </div>
                                  <div className="border-t border-gray-300 h-4/20 flex font-bold items-center justify-center rounded-b-lg overflow-hidden">
                                    <motion.button
                                      className="bg-[#1E617A] h-7/10 w-full mx-10 rounded-full text-white text-2xl"
                                      whileTap={{ scale: 0.95 }}
                                      whileHover={{ scale: 1.025 }}
                                      onClick={() => {
                                        setSelectedPackage(pkg);
                                        handleStepClick(step + 1);
                                      }}
                                    >
                                      Rp. {formattedPrice(pkg?.price)}
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {step == 2 && (
                          <>
                            <div className="flex flex-col text-center font-Archivo mt-5">
                              <p className="text-3xl font-bold">Checkout Order</p>
                              <p className="">Periksa ulang pesanan anda</p>
                            </div>
                            <div className="flex flex-row justify-center gap-30 px-50 h-130">
                              <div className="w-1/2 h-full flex flex-col justify-between shadow-2xl rounded-lg shadow-[#0A74F340]/75">
                                <div className="bg-[#1E617A] h-3/20 flex items-center justify-center rounded-t-lg">
                                  <div className="flex border-4 border-white text-white font-bold w-5/10 items-center justify-center text-3xl rounded-lg h-7/10">
                                    {selectedPackage?.type}
                                  </div>
                                </div>
                                <div className="bg-white h-13/20 px-4 py-8 text-xl">
                                  <div className="flex items-center gap-2">
                                    <Check
                                      className="text-green-500 mt-0.5 flex-shrink-0"
                                      size={32}
                                    />
                                    <span>
                                      Jumlah Batas Konsep: {selectedPackage?.conceptLimit} Hari
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check
                                      className="text-green-500 mt-0.5 flex-shrink-0"
                                      size={32}
                                    />
                                    <span>
                                      Durasi Pengerjaan: {selectedPackage?.workDuration} Hari
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check
                                      className="text-green-500 mt-0.5 flex-shrink-0"
                                      size={32}
                                    />
                                    <span>
                                      Jumlah Batas Revisi: {selectedPackage?.revisionLimit} Kali
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check
                                      className={`${selectedPackage?.sourceFile
                                        ? "text-green-500"
                                        : "text-gray-500"
                                        } mt-0.5 flex-shrink-0`}
                                      size={32}
                                    />
                                    <span>Source File</span>
                                  </div>
                                </div>
                                <div className="border-t border-gray-300 h-4/20 flex font-bold items-center justify-center rounded-b-lg overflow-hidden">
                                  <motion.button className="bg-[#1E617A] h-7/10 w-full mx-10 rounded-full text-white text-2xl">
                                    Rp. {formattedPrice(selectedPackage?.price)}
                                  </motion.button>
                                </div>
                              </div>
                              <div className="w-1/2 h-full flex flex-col  shadow-2xl rounded-lg shadow-[#0A74F340]/75 border p-4 font-Archivo">
                                <div className="flex flex-col gap-4">
                                  <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                      <p>Jenis Paket</p>
                                      <p className="font-bold">{selectedPackage?.type}</p>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                      <p>Metode</p>
                                      <p className="font-bold">Bank Transfer</p>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                      <p>Harga</p>
                                      <p className="font-bold">
                                        Rp. {formattedPrice(selectedPackage?.price)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="border-t" />
                                  <div className="flex flex-row font-bold justify-between text-3xl">
                                    <p>Total</p>
                                    <p className="text-wrap">
                                      Rp. {selectedPackage?.price}
                                    </p>
                                  </div>                                  <div className="flex flex-col justify-center mx-5">
                                    <motion.button
                                      className={`rounded-2xl text-2xl h-15 font-bold transition-colors ${
                                        isCreatingTransaction 
                                          ? "bg-gray-400 cursor-not-allowed" 
                                          : "bg-[#1E617A] hover:bg-[#2a5d7a]"
                                      } text-white`}
                                      whileTap={!isCreatingTransaction ? { scale: 0.95 } : {}}
                                      whileHover={!isCreatingTransaction ? { scale: 1.025 } : {}}
                                      onClick={() => {
                                        if (!isCreatingTransaction) {
                                          handleCreateTransaction();
                                        }
                                      }}
                                      disabled={isCreatingTransaction}
                                    >
                                      {isCreatingTransaction ? (
                                        <div className="flex items-center justify-center gap-2">
                                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          Creating Order...
                                        </div>
                                      ) : (
                                        "Place Order"
                                      )}
                                    </motion.button>
                                  </div>
                                  <p className="text-red-400 text-base text-wrap text-center">
                                    {phoneError}
                                  </p>
                                  <p>
                                    Dengan menekan "Place Order", kamu akan melakukan pembelian
                                    layanan ini menggunakan metode pembayaran yang telah dipilih.
                                    Pastikan detail pesanan sudah benar sebelum melanjutkan.
                                    Pembayaran bersifat final dan tidak dapat dibatalkan setelah
                                    diproses.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {/* <div id="snap-container" className='flex justify-center'>
                        </div> */}
                        {/* {step === 3 && finishPay &&
                          <>
                            <div className="flex flex-col items-center font-Archivo justify-between h-full py-20">
                              <div className="flex flex-col items-center gap-4">
                                <p className="text-5xl font-bold">Great! You just Ordered!</p>
                                <p className="font-[#636363]">
                                  Selamat! Pesanan Anda telah berhasil diproses dan akan diteruskan
                                  ke B-Partner kami🎊
                                </p>
                              </div>
                              <motion.img
                                className="select-none cursor-pointer grab w-100 h-100"
                                src={contract_done}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                draggable={false}
                                onClick={() => {navigate(`/user-profile/${auth?.data?.auth?.id}`)}} //nav ke user history
                              />
                            </div>
                          </>
                        }
                        {step === 3 && pendingPay &&
                          <>
                            <div className='flex flex-col items-center font-Archivo justify-between h-full py-20'>
                              <div className='flex flex-col items-center gap-4'>
                                <p className='text-5xl font-bold'>Thanks! Your Order is Pending</p>
                                <p className='font-[#636363]'>
                                  Terima kasih! Kami sedang menunggu konfirmasi dari pihak penyedia pembayaran. Pesanan Anda akan segera diteruskan ke B-Partner kami 🎉
                                </p>
                              </div>
                              <motion.img
                                className='select-none cursor-pointer grab w-100 h-100'
                                src={contract_pending}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                draggable={false}
                                onClick={() => {navigate(`/user-profile/${auth?.data?.auth?.id}`)}}//nav ke user history
                              />
                            </div>
                          </>
                        }
                        {step === 3 && failPay &&
                          <>
                            <div className='flex flex-col items-center font-Archivo justify-between h-full py-20'>
                              <div className='flex flex-col items-center gap-4'>
                                <p className='text-5xl font-bold'>Something Went Wrong</p>
                                <p className='font-[#636363]'>
                                  Ups, ada kendala saat memproses pembayaranmu. Yuk, coba lagi!
                                </p>
                              </div>
                              <motion.img
                                className='select-none cursor-pointer grab w-100 h-100'
                                src={contract_fail}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                draggable={false}
                                onClick={() => { navigate("/catalog") }}
                              />
                            </div>
                          </>                        
                          } */}
                        {step === 3 && (
                          <>
                            <div className="flex flex-col text-center font-Archivo mt-5">
                              <p className="text-3xl font-bold">Confirm your payment</p>
                              <p className="">Add your payment proof to continue processing your order</p>
                            </div>                            
                            <div className="flex flex-col justify-center gap-6 px-8 h-130">
                              {/* File Upload Section with Drag & Drop */}
                              <div 
                                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                                  paymentProofError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                                }}
                                onDragLeave={(e) => {
                                  e.preventDefault();
                                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                                  const files = e.dataTransfer.files;
                                  if (files.length > 0) {
                                    const file = files[0];
                                    // Create a fake event object to pass to handlePaymentProofUpload
                                    const fakeEvent = { target: { files: [file] } };
                                    handlePaymentProofUpload(fakeEvent);
                                  }
                                }}
                              >
                                <div className="text-center">   
                                  {!paymentProofPreview ? (
                                    <div className="space-y-4">
                                      <div className="border border-gray-300 rounded-lg p-8 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                           onClick={() => document.getElementById('paymentProofInput').click()}>
                                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-600 mb-2">Drag & drop an image here</p>
                                        <p className="text-sm text-gray-500">or click to browse files</p>
                                        <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                                      </div>
                                      <input
                                        id="paymentProofInput"
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handlePaymentProofUpload}
                                        className="hidden"
                                      />
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="relative inline-block">
                                        <img
                                          src={paymentProofPreview}
                                          alt="Payment proof preview"
                                          className="max-w-sm max-h-64 rounded-lg shadow-lg border border-gray-200"
                                        />
                                        <button
                                          onClick={removePaymentProof}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                          ×
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-center gap-2 text-green-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-medium">Payment proof ready for upload</p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setPaymentProofFile(null);
                                          setPaymentProofPreview(null);
                                          setPaymentProofError("");
                                        }}
                                        className="text-blue-600 text-sm underline hover:text-blue-800 transition-colors"
                                      >
                                        Change image
                                      </button>
                                    </div>
                                  )}

                                  {paymentProofError && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <p className="text-sm text-red-600 font-medium">{paymentProofError}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-between gap-4 mt-6">
                                <motion.button
                                  className="bg-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleStepClick(step - 1)}
                                  disabled={isUploadingProof}
                                >
                                  Back to Payment
                                </motion.button>
                                <motion.button
                                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                                    paymentProofFile && !isUploadingProof
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                                  whileHover={paymentProofFile && !isUploadingProof ? { scale: 1.02 } : {}}
                                  whileTap={paymentProofFile && !isUploadingProof ? { scale: 0.98 } : {}}
                                  onClick={handleSubmitPaymentProof}
                                  disabled={!paymentProofFile || isUploadingProof}
                                >
                                  {isUploadingProof ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      Uploading...
                                    </div>
                                  ) : (
                                    "Confirm Payment"
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Contract;
