import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'
import cancel from "../../assets/icons8-cancel (1).svg";
import { imageShow } from '../../constants/DriveLinkPrefixes';

const ProofModal = ({
  isOpen,
  onClose,
  onConfirm,
  proofImage,
}) => {

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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-400"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="flex items-center justify-between px-8 h-[68px] bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)]">
              <div className="flex-1" />
              <motion.img
                onClick={onClose}
                src={cancel}
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 cursor-pointer"
                alt="Close"
              />
            </nav>
            <div className="p-8">
              <div className="mb-6 border rounded-lg overflow-hidden">
                {proofImage ? (
                  <img
                    src={`${imageShow}${proofImage}`}
                    alt="Proof"
                    className="w-full max-h-96 object-cover overflow-hidden"
                    onError={() => console.error("Failed to load proof image")}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-500 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📷</div>
                      <p className="text-lg">No image provided</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <motion.button
                  variants={buttonVariants}
                  onClick={onConfirm}
                  className="px-8 py-3 bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  Confirm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProofModal