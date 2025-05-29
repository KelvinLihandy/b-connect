import React, { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CTAIcon from "../../assets/CTA_Icon.png";
import NextIcon from "../../assets/Continue_icon.png";
import { RequestedContext } from "../../contexts/RequestedContext";

const FreelancerReg = ({ isOpen, onClose, onCloseAfterSave }) => {
  const { requested } = useContext(RequestedContext);
  const [step, setStep] = useState(0);
  const [selectedName, setSelectedName] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStudentFile, setSelectedStudentFile] = useState(null);
  const fileInputRef = useRef(null);

  const SERVICE_CATEGORIES = [
    "Graphics Design",
    "UI/UX Design",
    "Video Editing",
    "Content Writing",
    "Translation",
    "Photography",
    "Web Development",
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const dropdownRef = useRef(null);

  const [formErrors, setFormErrors] = useState({
    category: "",
    description: "",
    studentIdFile: "",
  });

  // Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Tag input state
  const [tagInput, setTagInput] = useState("");

  const steps = ["Welcome", "Form", "Review", "Finish"];

  // Filter categories based on search and exclude already selected ones
  const filteredCategories = SERVICE_CATEGORIES.filter(
    (category) =>
      category.toLowerCase().includes(searchCategory.toLowerCase()) &&
      !selectedCategories.includes(category)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    if (stepNum === 0) return;
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

  const validateForm = () => {
    const errors = {
      category: "",
      description: "",
      studentIdFile: "",
    };
    let isValid = true;
    if (selectedCategories.length === 0) {
      errors.category = "At least one category is required";
      isValid = false;
    }
    if (!selectedDescription.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (selectedDescription.trim().length < 20) {
      errors.description = "Description should be at least 20 characters";
      isValid = false;
    }
    if (!selectedStudentFile) {
      errors.studentIdFile = "Student ID file is required";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleContinue = () => {
    if (step === 1) {
      setFormSubmitted(true);
      if (!validateForm()) {
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      alert("Form submitted!");
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setSelectedName(value);
    } else if (name === "description") {
      setSelectedDescription(value);
    }

    // Clear error when user types
    if (formSubmitted) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Handle category selection (updated function name)
  const handleTagSelect = (category) => {
    if (selectedCategories.length < 2 && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setSearchCategory("");
    setShowDropdown(false);

    // Clear category error
    if (formSubmitted) {
      setFormErrors({
        ...formErrors,
        category: "",
      });
    }
  };

  const removeCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!selectedCategories.includes(tagInput.trim())) {
        setSelectedCategories([...selectedCategories, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Fixed file upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];

    // Validate file type
    if (!validTypes.includes(file.type)) {
      setFormErrors({ 
        ...formErrors, 
        studentIdFile: "Only JPG and PNG images are allowed." 
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors({ 
        ...formErrors, 
        studentIdFile: "File size must not exceed 2 MB." 
      });
      return;
    }

    // Calculate formatted file size
    const sizeInKB = file.size / 1024;
    const formattedSize = sizeInKB < 1024
      ? `${sizeInKB.toFixed(1)} KB`
      : `${(sizeInKB / 1024).toFixed(1)} MB`;
    const fileExtension = file.name.split('.').pop().toUpperCase();

    // Create file object with preview
    const fileObject = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      formattedSize,
      extension: fileExtension
    };

    setSelectedStudentFile(fileObject);

    // Clear any previous errors
    if (formSubmitted) {
      setFormErrors({
        ...formErrors,
        studentIdFile: "",
      });
    }

    // Reset input value to allow re-uploading the same file
    event.target.value = '';
  };

  // Handle file removal
  const handleFileRemove = () => {
    if (selectedStudentFile && selectedStudentFile.preview) {
      URL.revokeObjectURL(selectedStudentFile.preview);
    }
    setSelectedStudentFile(null);
  };

  // Cleanup URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (selectedStudentFile && selectedStudentFile.preview) {
        URL.revokeObjectURL(selectedStudentFile.preview);
      }
    };
  }, [selectedStudentFile]);

  const isFormValid = () => {
    return (
      selectedCategories.length > 0 &&
      selectedDescription.trim().length >= 20 &&
      selectedStudentFile !== null
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
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
                          onClick={onClose}
                        >
                          ✕
                        </motion.button>
                      </div>

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
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1
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
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2
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
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3
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

                          {step === 1 && (
                            <div className="space-y-6">
                              <div className="text-center">
                                <h4 className="text-xl font-bold mb-1">Complete Your Data</h4>
                                <p className="text-gray-500 text-sm">
                                  Lengkapi data diri kamu yang dibutuhkan untuk menjadi freelancer kami
                                </p>
                              </div>
                              {formSubmitted && Object.values(formErrors).some((err) => err) && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                  <p className="font-bold">Please complete all required fields</p>
                                  <p className="text-sm">
                                    All fields must be filled before continuing
                                  </p>
                                </div>
                              )}

                              <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex-1 mb-6">
                                  <label className="block font-inter text-[16px] text-[#424956] mb-1">
                                    Category (Maksimal 2)
                                  </label>
                                  <div className="relative" ref={dropdownRef}>
                                    <input
                                      type="text"
                                      className={`w-full px-3 py-2 border ${formErrors.category ? "border-red-500" : "border-gray-400"
                                        } focus:outline-none focus:ring-1 focus:ring-black`}
                                      placeholder={selectedCategories.length >= 2 ? "Pilihan Category Sudah Penuh" : "Search Category"}
                                      value={searchCategory}
                                      disabled={selectedCategories.length >= 2}
                                      onChange={(e) => {
                                        setSearchCategory(e.target.value);
                                        setShowDropdown(true);
                                      }}
                                      onFocus={() => setShowDropdown(true)}
                                    />

                                    {showDropdown && filteredCategories.length > 0 && (
                                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {filteredCategories.map((category, index) => (
                                          <div
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleTagSelect(category)}
                                          >
                                            {category}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedCategories.map((cat, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                                      >
                                        {cat}
                                        <button
                                          className="ml-1 text-gray-500 cursor-pointer hover:text-gray-700"
                                          onClick={() => removeCategory(cat)}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                  {formErrors.category && (
                                    <p className="text-red-500 font-inter -translate-y-2 text-sm">
                                      {formErrors.category}
                                    </p>
                                  )}
                                </div>

                                <div className="mb-4">
                                  <label className="block font-inter text-[16px] text-[#424956] mb-1">
                                    Description: <span className="text-red-500">*</span>
                                  </label>
                                  <textarea
                                    name="description"
                                    value={selectedDescription}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself and the services you offer (min. 20 characters)"
                                    className={`w-full p-2 border ${formErrors.description ? "border-red-500" : "border-gray-300"
                                      } rounded h-32`}
                                  ></textarea>
                                  {formErrors.description && (
                                    <p className="mt-1 text-sm text-red-500">
                                      {formErrors.description}
                                    </p>
                                  )}
                                  <p className={`text-sm mt-1 ${selectedDescription.length >= 300 ? "text-red-500" : "text-gray-500"}`}>
                                    {selectedDescription.length}/300 karakter
                                    <span className="text-xs ml-1">(minimum 20)</span>
                                  </p>
                                </div>

                                <div>
                                  <label className="block font-inter text-[16px] text-[#424956] mb-1">
                                    Add your student ID Card for validation:{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  
                                  <div className={`px-4 py-4 border ${formErrors.studentIdFile ? "border-red-500" : "border-gray-300"} rounded-md`}>
                                    <div className="mb-4">
                                      {!selectedStudentFile ? (
                                        <div
                                          className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                          onClick={() => fileInputRef.current?.click()}
                                        >
                                          <input
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept=".jpg,.jpeg,.png"
                                          />
                                          <div className="flex flex-col font-inter items-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-12 w-12 text-gray-400 mb-3"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                              />
                                            </svg>
                                            <p className="text-gray-700 font-medium">
                                              Klik untuk upload gambar
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                              Hanya mendukung format JPG dan PNG (Maksimal ukuran: 2MB)
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="border-2 border-gray-300 rounded-md p-4 text-center bg-gray-50">
                                          <p className="text-gray-700 font-medium mb-2">
                                            File uploaded successfully!
                                          </p>
                                          <p className="text-gray-500 text-sm">
                                            Remove the current file to upload a different one
                                          </p>
                                        </div>
                                      )}
                                      
                                      {formErrors.studentIdFile && (
                                        <p className="mt-2 text-sm text-red-500">
                                          {formErrors.studentIdFile}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {selectedStudentFile && (
                                      <div className="grid grid-cols-1 gap-4">
                                        <div className="relative group">
                                          <img
                                            src={selectedStudentFile.preview}
                                            alt="Student ID"
                                            className="w-full h-48 object-cover rounded-md"
                                          />
                                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
                                            <button
                                              type="button"
                                              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                              onClick={handleFileRemove}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                          <div className="mt-2">
                                            <p className="text-sm text-gray-700 font-medium truncate">
                                              {selectedStudentFile.name}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                              <p className="text-xs text-gray-500">
                                                {selectedStudentFile.formattedSize}
                                              </p>
                                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                                                {selectedStudentFile.extension}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-medium text-center">
                                Review Your Information
                              </h4>
                              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <dl className="space-y-4">
                                  <div>
                                    <dt className="font-medium">Categories:</dt>
                                    <dd>
                                      {selectedCategories.length > 0
                                        ? selectedCategories.join(", ")
                                        : "No categories selected"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium">Description:</dt>
                                    <dd className="whitespace-pre-line">
                                      {selectedDescription || "Not provided"}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="font-medium">Student ID:</dt>
                                    <dd>
                                      {selectedStudentFile
                                        ? selectedStudentFile.name
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
                                  className={`px-4 py-2 rounded ${step === 1 && !isFormValid()
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
                                onClick={onClose}
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
    </>
  );
};

export default FreelancerReg;