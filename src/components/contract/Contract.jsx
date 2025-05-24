import React, { useContext, useEffect, useState } from 'react';
import cancel from "../../assets/icons8-cancel (1).svg"
import contract_done from "../../assets/contract_done.svg"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { contractAPI } from '../../constants/APIRoutes';
import UseSnap from '../../hooks/UseSnap';
import { AuthContext } from '../../contexts/AuthContext';

const Contract = ({ isOpen, onClose, gigId, packages }) => {
  const steps = ["Select", "Payment", "Checkout"];
  const { auth } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState();
  const [finishPay, setFinishPay] = useState(false);
  const [pendingPay, setPendingPay] = useState(false);
  const [failPay, setFailPay] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const { snapEmbed } = UseSnap();
  const navigate = useNavigate();

  const contractModalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.75, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const preventClose = (e) => {
    e.stopPropagation();
  };

  const handleStepClick = (stepNum) => {
    console.log("step", step, "stepnum", stepNum)
    if (step === steps.length) {
      setStep(1);
      return;
    }
    if (stepNum < step || (stepNum === step + 1)) {
      setStep(stepNum);
    } else if (stepNum === step) {
      return
    }
  };

  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    });
  };

  const initiateTransaction = async () => {
    if (!selectedPackage && finishPay) return;
    try {
      // const res = await axios.post(`${contractAPI}/create-transaction`,
      //   {
      //     gigId: gigId,
      //     selectedPackage: selectedPackage
      //   },
      //   { withCredentials: true }
      // )
      // if (res && res.data.status === "success transaction create") {
      //   console.log(res);
      //   snapEmbed(res.data.transaction.snap_token, "snap-container", {
      //     onSuccess: function (result) {
      //       console.log("success", result);
      //       setFinishPay(true);
      //     },
      //     onPending: function (result) {
      //       console.log("pending", result);
      //       setPendingPay(true);
      //     },
      //     onClose: function (result) {
      //       console.log("close", result);
      //       setFailPay(true);
      //     }
      //   })
      // }
      // else {
      //   console.log("error api midtrans", res);
      // }
    } catch (error) {
      console.log("error initiate transaction", error);
    }
  }

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
            finishPay ? null : onClose();
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
                      {!finishPay &&
                        <motion.img
                          src={cancel}
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => {
                            setStep(1);
                            finishPay ? null : onClose();
                          }}
                        />
                      }
                    </div>
                    <div className="p-6 flex flex-col h-200 gap-10">
                      <>
                        {!finishPay && !pendingPay && !failPay &&
                          <div className="w-full px-100 static">
                            <div className="flex flex-col justify-center">
                              <div className="flex justify-between items-center w-full relative">
                                <div className="absolute left-0 right-0 h-1 top-5 flex">
                                  <div className="w-1/2 flex justify-end">
                                    <div className="bg-gray-200 h-1 w-full">
                                      <div
                                        className="h-1 bg-green-500 transition-all duration-300"
                                        style={{ width: step > 1 ? '100%' : '0%' }}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-1/2">
                                    <div className="bg-gray-200 h-1 w-full">
                                      <div
                                        className="h-1 bg-green-500 transition-all duration-300"
                                        style={{ width: step > 2 ? '100%' : '0%' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                {steps.map((label, index) => {
                                  const current = index + 1;
                                  const isActive = current === step;
                                  const isCompleted = current < step;
                                  const isClickable = current <= step;

                                  return (
                                    <div key={index} className="flex flex-col items-center z-10">
                                      <div
                                        className={`flex flex-col items-center z-10 ${isClickable ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
                                        onClick={() => handleStepClick(current)}
                                      >
                                        <div
                                          className={`rounded-full flex items-center justify-center w-11 h-11 mb-2
                                        ${isActive ?
                                              "bg-blue-500 border-2 border-[#2E5077]"
                                              : isCompleted
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                            }
                                      ${isClickable ? "hover:shadow-md transition-shadow" : ""}`}
                                        >
                                          <span
                                            className={
                                              isCompleted || isActive ? "text-white" : "text-gray-600"
                                            }
                                          >
                                            {isCompleted
                                              ? "✓"
                                              : current}
                                          </span>
                                        </div>
                                        <span className={`text-sm w-20 text-center ${isActive ? "text-blue-500 font-bold" : "text-gray-500"}`}>
                                          {label}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        }
                        {step == 1 &&
                          <>
                            <div className='flex flex-col text-center font-Archivo'>
                              <p className='text-3xl font-bold'>Choose The Package</p>
                              <p className=''>Konfirmasi paket mana yang ingin kamu pilih</p>
                            </div>
                            <div className='flex flex-row justify-center gap-30 px-50 h-130'>
                              {packages?.map((pkg) => (
                                <div className='w-1/2 h-full flex flex-col justify-between shadow-2xl rounded-lg shadow-[#0A74F340]/75'>
                                  <div className='bg-[#1E617A] h-3/20 flex items-center justify-center rounded-t-lg'>
                                    <div className='flex border-4 border-white text-white font-bold w-5/10 items-center justify-center text-3xl rounded-lg h-7/10'>
                                      {pkg?.type}
                                    </div>
                                  </div>
                                  <div className='bg-white h-13/20 px-4 py-8 text-xl'>
                                    <div className="flex items-center gap-2">
                                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={32} />
                                      <span>Jumlah Batas Konsep: {pkg?.conceptLimit} Hari</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={32} />
                                      <span>Durasi Pengerjaan: {pkg?.workDuration} Hari</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={32} />
                                      <span>Jumlah Batas Revisi: {pkg?.revisionLimit} Kali</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Check className={`${pkg?.sourceFile ? "text-green-500" : "text-gray-500"} mt-0.5 flex-shrink-0`} size={32} />
                                      <span>Source File</span>
                                    </div>
                                  </div>
                                  <div className='border-t border-gray-300 h-4/20 flex font-bold items-center justify-center rounded-b-lg overflow-hidden'>
                                    <motion.button
                                      className='bg-[#1E617A] h-7/10 w-full mx-10 rounded-full text-white text-2xl'
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
                        }
                        {step == 2 &&
                          <>
                            <div className='flex flex-col text-center font-Archivo'>
                              <p className='text-3xl font-bold'>Checkout Order</p>
                              <p className=''>Periksa ulang pesanan anda</p>
                            </div>
                            <div className='flex flex-row justify-center gap-30 px-50 h-130'>
                              <div className='w-1/2 h-full flex flex-col justify-between shadow-2xl rounded-lg shadow-[#0A74F340]/75'>
                                <div className='bg-[#1E617A] h-3/20 flex items-center justify-center rounded-t-lg'>
                                  <div className='flex border-4 border-white text-white font-bold w-5/10 items-center justify-center text-3xl rounded-lg h-7/10'>
                                    {selectedPackage?.type}
                                  </div>
                                </div>
                                <div className='bg-white h-13/20 px-4 py-8 text-xl'>
                                  <div className="flex items-center gap-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={32} />
                                    <span>Jumlah Batas Konsep: {selectedPackage?.conceptLimit} Hari</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={32} />
                                    <span>Durasi Pengerjaan: {selectedPackage?.workDuration} Hari</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={32} />
                                    <span>Jumlah Batas Revisi: {selectedPackage?.revisionLimit} Kali</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className={`${selectedPackage?.sourceFile ? "text-green-500" : "text-gray-500"} mt-0.5 flex-shrink-0`} size={32} />
                                    <span>Source File</span>
                                  </div>
                                </div>
                                <div className='border-t border-gray-300 h-4/20 flex font-bold items-center justify-center rounded-b-lg overflow-hidden'>
                                  <motion.button
                                    className='bg-[#1E617A] h-7/10 w-full mx-10 rounded-full text-white text-2xl'
                                  >
                                    Rp. {formattedPrice(selectedPackage?.price)}
                                  </motion.button>
                                </div>
                              </div>
                              <div className='w-1/2 h-full flex flex-col  shadow-2xl rounded-lg shadow-[#0A74F340]/75 border p-4 font-Archivo'>
                                <div className='flex flex-col gap-4'>
                                  <div className='flex flex-col'>
                                    <div className='flex flex-row justify-between'>
                                      <p>Jenis Paket</p>
                                      <p className='font-bold'>{selectedPackage?.type}</p>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                      <p>Metode</p>
                                      <p className='font-bold'>Gopay</p>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                      <p>Harga</p>
                                      <p className='font-bold'>Rp. {formattedPrice(selectedPackage?.price)}</p>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                      <p>Pajak</p>
                                      <p className='font-bold'>Rp. {formattedPrice((0.7 / 100) * selectedPackage?.price <= 1 ? "0" : (0.7 / 100) * selectedPackage?.price)}</p>
                                    </div>
                                  </div>
                                  <div className='border-t' />
                                  <div className='flex flex-row font-bold justify-between text-3xl'>
                                    <p>Total</p>
                                    <p className='text-wrap'>Rp. {formattedPrice(selectedPackage?.price + ((0.7 / 100) * selectedPackage?.price <= 1 ? 0 : (0.7 / 100) * selectedPackage?.price))}</p>
                                  </div>
                                  <div className='flex flex-col justify-center mx-5'>
                                    <motion.button
                                      className='bg-[#1E617A] rounded-2xl text-white text-2xl h-15 font-bold'
                                      whileTap={{ scale: 0.95 }}
                                      whileHover={{ scale: 1.025 }}
                                      onClick={() => {
                                        if (!selectedPackage) {
                                          handleStepClick(step - 1);
                                          return;
                                        }
                                        if (auth?.data?.auth.phoneNumber === "") {
                                          setPhoneError("Phone Number is required. Please set first in settings");
                                          return;
                                        }
                                        handleStepClick(step + 1)
                                        initiateTransaction();
                                      }}
                                    >
                                      Place Order
                                    </motion.button>
                                  </div>
                                  <p className='text-red-400 text-base text-wrap text-center'>
                                    {phoneError}
                                  </p>
                                  <p>
                                    Dengan menekan "Place Order", kamu akan melakukan pembelian layanan ini
                                    menggunakan metode pembayaran yang telah dipilih. Pastikan detail pesanan
                                    sudah benar sebelum melanjutkan. Pembayaran bersifat final dan tidak dapat
                                    dibatalkan setelah diproses.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        }
                        <div id="snap-container" className='flex justify-center'>
                        </div>
                        {step === 3 && !finishPay &&
                          <>
                            <div className='flex flex-col items-center font-Archivo justify-between h-full py-20'>
                              <div className='flex flex-col items-center gap-4'>
                                <p className='text-5xl font-bold'>Great! You just Ordered!</p>
                                <p className='font-[#636363]'>Selamat! Pesanan Anda telah berhasil diproses dan akan diteruskan ke B-Partner kami🎊</p>
                              </div>
                              <motion.img
                                className='select-none cursor-pointer grab'
                                src={contract_done}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                draggable={false}
                                onClick={() => { }}//nav ke user history
                              />
                            </div>
                          </>
                        }
                        {step === 3 && !pendingPay &&
                          <>
                            <div className='flex flex-col items-center font-Archivo justify-between h-full py-20'>
                              <div className='flex flex-col items-center gap-4'>
                                <p className='text-5xl font-bold'>pending</p>
                                <p className='font-[#636363]'>Selamat! Pesanan Anda telah berhasil diproses dan akan diteruskan ke B-Partner kami🎊</p>
                              </div>
                              <motion.img
                                className='select-none cursor-pointer grab'
                                src={contract_done}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                draggable={false}
                                onClick={() => { }}//nav ke user history
                              />
                            </div>
                          </>
                        }
                        {step === 3 && failPay &&
                          <>
                            <div className='flex flex-col items-center font-Archivo justify-between h-full py-20'>
                              <div className='flex flex-col items-center gap-4'>
                                <p className='text-5xl font-bold'>fail</p>
                                <p className='font-[#636363]'>Selamat! Pesanan Anda telah berhasil diproses dan akan diteruskan ke B-Partner kami🎊</p>
                              </div>
                              <motion.img
                                className='select-none cursor-pointer grab'
                                src={contract_done}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                draggable={false}
                                onClick={() => { }}//nav ke user history
                              />
                            </div>
                          </>
                        }
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