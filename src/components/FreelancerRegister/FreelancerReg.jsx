import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CTAIcon from "../../assets/CTA_Icon.png";
import NextIcon from "../../assets/Continue_icon.png";

const FreelancerReg = ({ isOpen, onClose }) => {
  // Added welcome screen as step 0, so registration steps start at 1
  const [step, setStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    tags: [],
    description: "",
    studentIdFile: null,
  });

  // Validation errors state
  const [formErrors, setFormErrors] = useState({
    name: "",
    category: "",
    description: "",
    studentIdFile: "",
  });

  // Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // DEVELOPMENT MODE - Remove this in production
  const [devMode, setDevMode] = useState(true);
  const devOnClose = () => console.log("Modal closed (dev mode)");

  // Use devMode values if props aren't provided
  const effectiveIsOpen = isOpen !== undefined ? isOpen : devMode;
  const effectiveOnClose = onClose || devOnClose;

  const steps = ["Welcome", "Form", "Review", "Finish"];

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
    // Skip step 0 in the progress indicator
    if (stepNum === 0) return;

    console.log("step", step, "stepnum", stepNum);
    if (step === steps.length - 1) {
      setStep(1);
      return;
    }
    if (stepNum < step || stepNum === step + 1) {
      setStep(stepNum);
    } else if (stepNum === step) {
      return;
    }
  };

  // Validate the form
  const validateForm = () => {
    const errors = {
      name: "",
      category: "",
      description: "",
      studentIdFile: "",
    };

    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate category
    if (!formData.category.trim()) {
      errors.category = "Category is required";
      isValid = false;
    }

    // Validate description
    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formData.description.trim().length < 20) {
      errors.description = "Description should be at least 20 characters";
      isValid = false;
    }

    // Validate student ID file
    if (!formData.studentIdFile) {
      errors.studentIdFile = "Student ID file is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleContinue = () => {
    if (step === 1) {
      // Set form as submitted to show validation errors
      setFormSubmitted(true);

      // Validate form before proceeding
      if (!validateForm()) {
        return; // Stop if validation fails
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Submit form
      alert("Form submitted!");
      effectiveOnClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (formSubmitted) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        studentIdFile: file,
      });

      // Clear file error
      if (formSubmitted) {
        setFormErrors({
          ...formErrors,
          studentIdFile: "",
        });
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({
        ...formData,
        studentIdFile: file,
      });

      // Clear file error
      if (formSubmitted) {
        setFormErrors({
          ...formErrors,
          studentIdFile: "",
        });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.category.trim() !== "" &&
      formData.description.trim().length >= 20 &&
      formData.studentIdFile !== null
    );
  };

  return (
    <div>
      {/* DEV MODE UI - Remove in production */}
      {isOpen === undefined && (
        <div className="p-4 bg-yellow-100 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
          <span className="font-bold">DEVELOPMENT MODE</span>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={devMode}
              onChange={(e) => setDevMode(e.target.checked)}
              className="form-checkbox h-5 w-5"
            />
            <span>Show Modal</span>
          </label>
        </div>
      )}

      <AnimatePresence mode="wait">
        {effectiveIsOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={effectiveOnClose}
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
                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-3/4 max-h-[90vh]"
                  onClick={preventClose}
                  variants={contractModalVariants}
                >
                  <div className="bg-white">
                    <div>
                      <div className="py-4 px-6 text-center sm:text-left bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)] flex flex-row justify-between w-full items-center select-none">
                        <h3 className="text-2xl text-white font-bold">
                          {step === 0 ? "Became our Freelancer" : "Become Our Freelancer"}
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 cursor-pointer text-white font-bold"
                          onClick={effectiveOnClose}
                        >
                          ✕
                        </motion.button>
                      </div>

                      {/* Welcome screen (Step 0) */}
                      {step === 0 ? (
                        <div className="p-6 flex flex-col items-center justify-center text-center h-[520px]">
                          <h3 className="text-3xl font-bold mb-1">Hey, you just one step</h3>
                          <h3 className="text-3xl font-bold mb-1">ahead became freelancer</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Ayo isi beberapa form ini sebelum kamu menjadi B-Partner kami!
                          </p>

                          <div className="flex justify-center mb-4">
                            <img
                              src={CTAIcon}
                              alt="Freelancer illustration"
                              className="w-64 h-64"
                            />
                          </div>

                          <div className="flex flex-col items-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2"
                              onClick={handleContinue}
                            >
                              <img src={NextIcon} alt="Continue" className="w-16 h-16" />
                            </motion.button>
                            <span className="text-sm text-gray-500">Click to continue</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 flex flex-col min-h-[480px] max-h-[70vh] overflow-y-auto">
                          {/* Progress indicator - only show for steps 1-3 */}
                          <div className="w-full mb-6">
                            <div className="flex justify-between items-center relative">
                              <div className="absolute left-0 right-0 h-1 top-5 bg-gray-200 z-0">
                                <div
                                  className="h-1 bg-blue-500 transition-all duration-300"
                                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                                />
                              </div>

                              <div className="flex flex-col items-center z-10">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    step >= 1
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  01
                                </div>
                                <span className="text-sm">Form</span>
                              </div>

                              <div className="flex flex-col items-center z-10">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    step >= 2
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  02
                                </div>
                                <span className="text-sm">Review</span>
                              </div>

                              <div className="flex flex-col items-center z-10">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    step >= 3
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  03
                                </div>
                                <span className="text-sm">Finish</span>
                              </div>
                            </div>
                          </div>

                          {/* Form Step (Step 1) */}
                          {step === 1 && (
                            <div className="space-y-6">
                              <div className="text-center">
                                <h4 className="text-xl font-bold mb-1">Title & Category</h4>
                                <p className="text-gray-500 text-sm">
                                  Tambahkan judul dan kategori dari product service kamu
                                </p>
                              </div>

                              {/* Form validation alert */}
                              {formSubmitted && Object.values(formErrors).some((err) => err) && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                  <p className="font-bold">Please complete all required fields</p>
                                  <p className="text-sm">
                                    All fields must be filled before continuing
                                  </p>
                                </div>
                              )}

                              <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Your Name: <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      placeholder="Type your Name"
                                      className={`w-full p-2 border ${
                                        formErrors.name ? "border-red-500" : "border-gray-300"
                                      } rounded`}
                                    />
                                    {formErrors.name && (
                                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Category: <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="category"
                                      value={formData.category}
                                      onChange={handleInputChange}
                                      placeholder="Search Category"
                                      className={`w-full p-2 border ${
                                        formErrors.category ? "border-red-500" : "border-gray-300"
                                      } rounded`}
                                    />
                                    {formErrors.category && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formErrors.category}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description: <span className="text-red-500">*</span>
                                  </label>
                                  <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself and the services you offer (min. 20 characters)"
                                    className={`w-full p-2 border ${
                                      formErrors.description ? "border-red-500" : "border-gray-300"
                                    } rounded h-32`}
                                  ></textarea>
                                  {formErrors.description && (
                                    <p className="mt-1 text-sm text-red-500">
                                      {formErrors.description}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Add your student ID Card for validation:{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div
                                    className={`border-2 border-dashed ${
                                      formErrors.studentIdFile
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md p-6 text-center`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                  >
                                    {formData.studentIdFile ? (
                                      <div className="text-sm text-gray-700">
                                        File selected: {formData.studentIdFile.name}
                                      </div>
                                    ) : (
                                      <>
                                        <p className="text-sm text-gray-500 mb-2">
                                          Drag & drop your files here
                                        </p>
                                        <p className="text-sm text-gray-500 mb-2">OR</p>
                                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded px-4 py-2 text-sm">
                                          Browse files
                                          <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                          />
                                        </label>
                                      </>
                                    )}
                                  </div>
                                  {formErrors.studentIdFile && (
                                    <p className="mt-1 text-sm text-red-500">
                                      {formErrors.studentIdFile}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Review Step (Step 2) */}
                          {step === 2 && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-medium text-center">
                                Review Your Information
                              </h4>
                              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <dl className="space-y-4">
                                  <div>
                                    <dt className="font-medium">Name:</dt>
                                    <dd>{formData.name || "Not provided"}</dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium">Category:</dt>
                                    <dd>{formData.category || "Not provided"}</dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium">Tags:</dt>
                                    <dd>
                                      {formData.tags.length > 0
                                        ? formData.tags.join(", ")
                                        : "No tags added"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium">Description:</dt>
                                    <dd className="whitespace-pre-line">
                                      {formData.description || "Not provided"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium">Student ID:</dt>
                                    <dd>
                                      {formData.studentIdFile
                                        ? formData.studentIdFile.name
                                        : "No file uploaded"}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                          )}

                          {/* Finish Step (Step 3) */}
                          {step === 3 && (
                            <div className="space-y-4 text-center">
                              <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-500 text-4xl">✓</span>
                                </div>
                              </div>
                              <h4 className="text-xl font-bold">Registration Complete!</h4>
                              <p className="text-gray-600">
                                Congratulations! You are now registered as a B-Partner freelancer.
                              </p>
                              <p className="text-gray-600">
                                Your profile will be reviewed by our team and will be active soon.
                              </p>
                            </div>
                          )}

                          {/* Navigation buttons */}
                          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                            {step > 0 && step < 3 && (
                              <>
                                <button
                                  onClick={() => step > 0 && setStep(step - 1)}
                                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                >
                                  {step === 1 ? "Back" : "Cancel"}
                                </button>
                                <button
                                  onClick={handleContinue}
                                  className={`px-4 py-2 rounded ${
                                    step === 1 && !isFormValid()
                                      ? "bg-blue-300 cursor-not-allowed"
                                      : "bg-blue-500 hover:bg-blue-600"
                                  } text-white`}
                                >
                                  {step === 2 ? "Submit" : "Save"}
                                </button>
                              </>
                            )}
                            {step === 3 && (
                              <button
                                onClick={effectiveOnClose}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreelancerReg;
