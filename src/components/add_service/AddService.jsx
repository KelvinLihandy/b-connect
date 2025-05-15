import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CancelIcon from "../../assets/addservice-cancel.svg";
import SaveIcon from "../../assets/addservice-save.svg";
import FinishBg from "../../assets/addservice-finishbg.svg";

const steps = ["Title", "Attachment", "Description", "Price", "Review", "Finish"];

// Service categories constant
const SERVICE_CATEGORIES = [
  "Graphics Design",
  "UI/UX Design",
  "Video Editing",
  "Content Writing",
  "Translation",
  "Photography",
  "Web Development",
];

const AddService = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});

  // Step 2 - Attachment state
  const [attachments, setAttachments] = useState([]);

  // Step 3 - Description state
  const [description, setDescription] = useState("");

  // Step 4 - Price state
  const [basePrice, setBasePrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("3");

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Validate current step
  const validateStep = () => {
    let isValid = true;
    const newErrors = {};

    if (step === 1) {
      // Validate Title step
      if (title.trim() === "") {
        newErrors.title = "Title cannot be empty";
        isValid = false;
      }

      if (selectedTags.length === 0) {
        newErrors.category = "Please select at least one category";
        isValid = false;
      }
    } else if (step === 2) {
      // Validate Attachment step
      if (attachments.length === 0) {
        newErrors.attachments = "Please upload at least one image";
        isValid = false;
      }
    } else if (step === 3) {
      // Validate Description step
      if (description.trim().length < 50) {
        newErrors.description = "Description must be at least 50 characters long";
        isValid = false;
      }
    } else if (step === 4) {
      // Validate Price step
      if (!basePrice || isNaN(basePrice) || parseFloat(basePrice) <= 0) {
        newErrors.basePrice = "Please enter a valid price";
        isValid = false;
      }
      if (!deliveryTime) {
        newErrors.deliveryTime = "Please select a delivery time";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const goNext = () => {
    if (validateStep()) {
      if (step < steps.length) setStep(step + 1);
    }
  };

  const goBack = () => {
    // Prevent going back when at step 6
    if (step > 1 && step !== 6) setStep(step - 1);
  };

  const handleTagSelect = (category) => {
    if (!selectedTags.includes(category)) {
      setSelectedTags([...selectedTags, category]);
      // Clear category error when a tag is selected
      if (errors.category) {
        setErrors({ ...errors, category: null });
      }
    }
    setSearchCategory("");
    setShowDropdown(false);
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Filter categories based on search input
  const filteredCategories = SERVICE_CATEGORIES.filter(
    (category) =>
      category.toLowerCase().includes(searchCategory.toLowerCase()) &&
      !selectedTags.includes(category)
  );

  // Change step when clicking on step indicator
  const handleStepClick = (stepNum) => {
    // Prevent clicking to step 6 directly and prevent navigation when already at step 6
    if (step === 6 || stepNum === 6) {
      return;
    }

    // Only allow clicking on completed steps or the next available step if validation passes
    if (stepNum < step || (stepNum === step + 1 && validateStep())) {
      setStep(stepNum);
    } else if (stepNum === step) {
      // Already on this step, do nothing
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Check if adding these files would exceed the limit
    if (attachments.length + files.length > 4) {
      setErrors({ ...errors, attachments: "Maximum 4 images allowed" });
      return;
    }
    
    if (files.length > 0) {
      // Create preview URLs for the files
      const newAttachments = files.map((file) => {
        // Format file size
        const sizeInKB = file.size / 1024;
        let formattedSize;
        
        if (sizeInKB < 1024) {
          formattedSize = `${sizeInKB.toFixed(1)} KB`;
        } else {
          const sizeInMB = sizeInKB / 1024;
          formattedSize = `${sizeInMB.toFixed(1)} MB`;
        }
        
        // Get file extension
        const fileExtension = file.name.split('.').pop().toUpperCase();
        
        return {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          formattedSize,
          extension: fileExtension
        };
      });

      setAttachments([...attachments, ...newAttachments]);

      // Clear error if it exists
      if (errors.attachments) {
        setErrors({ ...errors, attachments: null });
      }
    }
  };

  // Remove attachment
  const removeAttachment = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  // Handle save with confirmation
  const handleSave = () => {
    if (window.confirm("Apakah Anda yakin ingin menyimpan product service ini?")) {
      goNext(); // Proceed to next step if confirmed
    }
  };

  // Handle preview functionality buat back-end
  const handlePreview = () => {
    // Buat objek data preview yang berisi semua data produk
    const previewData = {
      title,
      categories: selectedTags,
      images: attachments,
      description,
      basePrice,
      deliveryTime
    };

    // Simpan data ke localStorage untuk diakses di halaman preview
    localStorage.setItem('servicePreviewData', JSON.stringify(previewData));
    
    // Buka halaman preview di tab baru
    window.open('/preview-service', '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-[90%] md:w-[80%] lg:w-[60%] bg-white rounded-xl shadow-md overflow-hidden border border-gray-400">
        {/* Navbar */}
        <nav className="flex flex-row items-center justify-between px-8 h-[68px] bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)]">
          <h2 className="text-white text-[24px] md:text-[28px] lg:text-[32px] font-Archivo">
            Add Product
          </h2>
          <button className="cursor-pointer" onClick={() => navigate(-1)}>
            <img className="w-[40px] h-[40px]" src={CancelIcon} alt="Cancel" />
          </button>
        </nav>

        {/* Stepper */}
        <div className="px-8 py-6">
          <div className="flex justify-between items-center relative">
            {steps.map((label, index) => {
              const current = index + 1;
              const isActive = current === step;
              const isCompleted = current < step;
              const isClickable = current <= step || current === step + 1;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative z-10 w-[20%]"
                  onClick={() => handleStepClick(current)}
                  style={{ cursor: isClickable ? "pointer" : "default" }}
                >
                  {/* Step Circle */}
                  <div
                    className={`rounded-full flex items-center justify-center w-8 h-8 mb-2
                                            ${
                                              isActive
                                                ? "bg-blue-500 border-2 border-[#2E5077]"
                                                : isCompleted
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                            }
                                            ${isClickable ? "hover:shadow-md transition-shadow" : ""}
                                        `}
                  >
                    <span
                      className={
                        isCompleted || isActive ? "text-white" : "text-gray-600"
                      }
                    >
                      {isCompleted
                        ? "✓"
                        : current < 10
                        ? `0${current}`
                        : current}
                    </span>
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-xs ${
                      isActive ? "text-blue-500 font-Archivo font-bold" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>

                  {/* Line (except for the last step) */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-[60%] w-[80%] px-1">
                      <div
                        className={`h-0.5 ${
                          isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Progress Bar */}
            <div className="absolute top-4 h-0.5 bg-gray-200 w-full -z-1">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(step - 1) * 25}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step Content - For Title Step */}
        {step === 1 && (
          <div className="px-8 py-4">
            <h3 className="text-center font-Archivo text-[32px]">
              Title & Category
            </h3>
            <p className="text-center font-Archivo text-[16px] text-[#636363] mb-4">
              Tambahkan judul dan kategori dari product service kamu
            </p>

            <div className="flex flex-col md:flex-row gap-4 px-4 py-4 border border-gray-300 rounded-md">
              <div className="flex-1 mb-6">
                <label className="block font-inter text-[16px] text-[#424956] mb-1">
                  Title here:
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    errors.title ? "border-red-500" : "border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Your Title here"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Clear title error when user types
                    if (errors.title) {
                      setErrors({ ...errors, title: null });
                    }
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 font-inter text-sm">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="flex-1 mb-6">
                <label className="block font-inter text-[16px] text-[#424956] mb-1">
                  Services Category:
                </label>
                <div className="relative" ref={dropdownRef}>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border ${
                      errors.category ? "border-red-500" : "border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Search Category"
                    value={searchCategory}
                    onChange={(e) => {
                      setSearchCategory(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />

                  {/* Dropdown for categories */}
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

                {/* Selected tags/categories */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        className="ml-1 text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-500 font-inter -translate-y-2 text-sm">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step Content - For Attachment Step */}
        {step === 2 && (
          <div className="px-8 py-4">
            <h3 className="text-center font-Archivo text-[32px]">Attachment</h3>
            <p className="text-center font-Archivo text-[16px] text-[#636363] mb-4">
              Tambahkan Gambar pada product servicemu
            </p>

            <div className="px-4 py-4 border border-gray-300 rounded-md">
              <div className="mb-6">
                {attachments.length < 4 ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
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
                        Click to upload or drag images here
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Support for JPG, PNG (Max size: 2MB)
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {attachments.length} of 4 images uploaded
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 rounded-md p-8 text-center bg-gray-50">
                    <p className="text-gray-700 font-medium">
                      Maximum limit of 4 images reached
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Remove some images to upload more
                    </p>
                  </div>
                )}
                {errors.attachments && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.attachments}
                  </p>
                )}
              </div>

              {/* Display uploaded images */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={attachment.preview}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
                        <button
                          className="bg-red-500 text-white rounded-full p-1 cursor-pointer"
                          onClick={() => removeAttachment(index)}
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
                      <div className="mt-1">
                        <p className="text-sm text-gray-500 truncate">{attachment.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400">{attachment.formattedSize}</p>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded font-mono">{attachment.extension}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step Content - For Description Step */}
        {step === 3 && (
          <div className="px-8 py-4">
            <h3 className="text-center font-Archivo text-[32px]">
              Description
            </h3>
            <p className="text-center font-Archivo text-[16px] text-[#636363] mb-4">
                Tambahkan Penjelasan Deskripsi tentang product servicemu
            </p>

            <div className="px-4 py-4 border border-gray-300 rounded-md">
              <div className="mb-6">
                <label className="block font-inter text-[16px] text-[#424956] mb-1">
                  Description:
                </label>
                <textarea
                  className={`w-full px-3 py-2 border ${
                    errors.description ? "border-red-500" : "border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md min-h-[200px]`}
                  placeholder="Describe your service in detail..."
                  value={description}
                  onChange={(e) => {
                    // Membatasi input maksimal 800 karakter
                    const input = e.target.value;
                    if (input.length <= 800) {
                      setDescription(input);
                    }
                    // Clear description error when user types
                    if (errors.description) {
                      setErrors({ ...errors, description: null });
                    }
                  }}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
                <p className={`text-sm mt-1 ${description.length >= 800 ? "text-red-500" : "text-gray-500"}`}>
                  {description.length}/800 characters
                  <span className="text-xs ml-1">(minimum 50)</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content - For Price Step */}
        {step === 4 && (
          <div className="px-8 py-4">
            <h3 className="text-center font-Archivo text-[32px]">
              Price & Delivery
            </h3>
            <p className="text-center font-Archivo text-[16px] text-[#636363] mb-4">
              Tambahkan harga dan estimasi waktu pengerjaan
            </p>

            <div className="px-4 py-4 border border-gray-300 rounded-md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 mb-6">
                  <label className="block font-inter text-[16px] text-[#424956] mb-1">
                    Base Price (Rp):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 pl-8 border ${
                        errors.basePrice ? "border-red-500" : "border-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md`}
                      placeholder="0"
                      value={basePrice}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setBasePrice(value);
                        // Clear price error when user types
                        if (errors.basePrice) {
                          setErrors({ ...errors, basePrice: null });
                        }
                      }}
                    />
                  </div>
                  {errors.basePrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.basePrice}
                    </p>
                  )}
                </div>

                <div className="flex-1 mb-6">
                  <label className="block font-inter text-[16px] text-[#424956] mb-1">
                    Delivery Time (days):
                  </label>
                  <select
                    className={`w-full px-3 py-2 border ${
                      errors.deliveryTime ? "border-red-500" : "border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md`}
                    value={deliveryTime}
                    onChange={(e) => {
                      setDeliveryTime(e.target.value);
                      // Clear delivery time error when user selects
                      if (errors.deliveryTime) {
                        setErrors({ ...errors, deliveryTime: null });
                      }
                    }}
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                    <option value="10">10 days</option>
                    <option value="14">14 days</option>
                    <option value="21">21 days</option>
                    <option value="30">30 days</option>
                  </select>
                  {errors.deliveryTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deliveryTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Content - For Review Step */}
        {step === 5 && (
          <div className="px-8 py-4">
            <h3 className="text-center font-Archivo text-[32px]">Review the product</h3>
            <p className="text-center font-Archivo text-[16px] text-[#636363] mb-4">
              Mari periksa semua data yg telah kamu isi sebelumnya
            </p>

            
            {/* Preview & Save Buttons */}
            <div className="flex justify-center items-center mt-8 px-4 py-4 border border-gray-300 rounded-md">
              <div className="text-center">
                <p className="mb-3 font-medium text-gray-800">Click Preview button to<br />check your product</p>
                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={handlePreview}
                    className="px-6 py-2 border border-gray-300 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center cursor-pointer"
                  >
                    <img src={SaveIcon} alt="Save" className="h-5 w-5 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Default content for step 6 - Finish */}
        {step === 6 && (
          <div className="relative px-8 py-18 my-10 overflow-hidden">
            <div className="relative z-10 text-center py-12 -translate-y-32">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Welcome Aboard!!</h3>
              <p className="text-gray-600 text-lg mb-10">
                Selamat! kamu telah berhasil menambahkan productmu!
              </p>
            </div>
            {/* Background Image */}
            <img 
              src={FinishBg} 
              alt="Background" 
              className="absolute inset-0 w-full h-full mt-4 z-0 opacity-80" 
            />
            
            
          </div>
        )}

        {/* Navigation Buttons */}
        {step !== 6 && (
          <div className="flex justify-between items-center px-8 pt-2 pb-6">
            <button
              onClick={goBack}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 shadow-md cursor-pointer"
              disabled={step === 1}
            >
              Back
            </button>
            {step !== 5 && (
              <button
                onClick={goNext}
                className="px-4 py-2 border border-gray-300 rounded-md text-white shadow-md cursor-pointer"
                style={{ backgroundColor: "#4DA1A9" }}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddService;
