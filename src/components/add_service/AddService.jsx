import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CancelIcon from "../../assets/addservice-cancel.svg";
import SaveIcon from "../../assets/addservice-save.svg";
import FinishBg from "../../assets/addservice-finishbg.svg";
import addFlow from "../../assets/addservice-addflow.svg";
import Preview from "./Preview";
import axios from "axios";
import { gigAPI } from "../../constants/APIRoutes";
import { CircularProgress } from "@mui/material";

const steps = ["Title", "Attachment", "Description", "Price", "Review", "Finish"];

const DEFAULT_WORKFLOW_COUNT = 3;

const SERVICE_CATEGORIES = [
  "Graphics Design",
  "UI/UX Design",
  "Video Editing",
  "Content Writing",
  "Translation",
  "Photography",
  "Web Development",
];

const PRICE_STEP_LABELS = {
  KONSEP: "Jumlah Batas Konsep",
  REVISI: "Jumlah Batas Revisi",
  WAKTU: "Waktu Pengerjaan",
  SOURCE: "Source File",
  HARGA: "Harga"
};

const PACKAGE_TYPES = {
  BASIC: "Basic",
  ADVANCE: "Advance"
};

const AddService = ({ isOpen, onClose, onCloseAfterSave }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [description, setDescription] = useState("");
  const [workFlows, setWorkFlows] = useState(Array(DEFAULT_WORKFLOW_COUNT).fill(""));
  const [basePrice, setBasePrice] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [basicPackage, setBasicPackage] = useState({
    konsep: null,
    revisi: null,
    waktu: null,
    sourceFile: null,
    harga: null
  });

  const [advancePackage, setAdvancePackage] = useState({
    konsep: null,
    revisi: null,
    waktu: null,
    sourceFile: null,
    harga: null
  });

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setSearchCategory("");
    setShowDropdown(false);
    setSelectedTags([]);
    setErrors({});
    setAttachments([]);
    setDescription("");
    setWorkFlows(Array(DEFAULT_WORKFLOW_COUNT).fill(""));
    setBasePrice("");
    setShowPreview(false);
    setBasicPackage({
      konsep: null,
      revisi: null,
      waktu: null,
      sourceFile: null,
      harga: null
    });
    setAdvancePackage({
      konsep: null,
      revisi: null,
      waktu: null,
      sourceFile: null,
      harga: null
    });
  };

  const handleClose = () => {
    if (step < 6) {
      if (window.confirm("Apa anda yakin ingin menutup? Semua progres akan hilang.")) {
        resetForm();
        onClose();
      }
    };
  }

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

  const validateStep = () => {
    let isValid = true;
    const newErrors = {};

    if (step === 1) {
      if (title.trim() === "") {
        newErrors.title = "Judul tidak boleh kosong";
        isValid = false;
      }

      if (selectedTags.length === 0) {
        newErrors.category = "Silakan pilih minimal satu kategori";
        isValid = false;
      }
    } else if (step === 2) {
      if (attachments.length === 0) {
        newErrors.attachments = "Silakan unggah minimal satu gambar";
        isValid = false;
      }
    } else if (step === 3) {
      if (description.trim().length < 50) {
        newErrors.description = "Deskripsi harus terdiri dari minimal 50 karakter";
        isValid = false;
      }
      workFlows.forEach((flow, index) => {
        if (!flow.trim()) {
          newErrors[`workflow_${index}`] = `Alur kerja ${index + 1} tidak boleh kosong`;
          isValid = false;
        }
      });
    } else if (step === 4) {
      if (basicPackage.konsep === null || basicPackage.konsep === undefined || basicPackage.konsep === '') {
        newErrors.basicKonsep = "Jumlah Batas Konsep tidak boleh kosong";
        isValid = false;
      }
      if (basicPackage.konsep < 1 || basicPackage.konsep === "0") {
        newErrors.basicKonsep = "Jumlah Batas Konsep tidak boleh kurang dari 1";
        isValid = false;
      }
      if (basicPackage.revisi === null || basicPackage.revisi === undefined || basicPackage.revisi === '') {
        newErrors.basicRevisi = "Jumlah Batas Revisi tidak boleh kosong";
        isValid = false;
      }
      if (basicPackage.waktu === null || basicPackage.waktu === undefined || basicPackage.waktu === '') {
        newErrors.basicWaktu = "Waktu Pengerjaan tidak boleh kosong";
        isValid = false;
      }
      if (basicPackage.waktu < 1 || basicPackage.waktu === "0") {
        newErrors.basicKonsep = "Waktu Pengerjaan tidak boleh kurang dari 1 hari";
        isValid = false;
      }
      if (basicPackage.harga === null || basicPackage.harga === undefined || basicPackage.harga === '') {
        newErrors.basicHarga = "Harga tidak boleh kosong";
        isValid = false;
      }
      if (basicPackage.sourceFile !== "true" && basicPackage.sourceFile !== "false") {
        newErrors.basicSourceFile = "File Sumber harus berupa ya atau tidak";
        isValid = false;
      }

      if (advancePackage.konsep === null || advancePackage.konsep === undefined || advancePackage.konsep === '') {
        newErrors.advanceKonsep = "Jumlah Batas Konsep tidak boleh kosong";
        isValid = false;
      }
      if (advancePackage.konsep < 1 || advancePackage.konsep === '0') {
        newErrors.advanceKonsep = "Jumlah Batas Konsep tidak boleh kurang dari 1";
        isValid = false;
      }
      if (advancePackage.revisi === null || advancePackage.revisi === undefined || advancePackage.revisi === '') {
        newErrors.advanceRevisi = "Jumlah Batas Revisi tidak boleh kosong";
        isValid = false;
      }
      if (advancePackage.waktu === null || advancePackage.waktu === undefined || advancePackage.waktu === '') {
        newErrors.advanceWaktu = "Waktu Pengerjaan tidak boleh kosong";
        isValid = false;
      }
      if (advancePackage.waktu < 1 || advancePackage.waktu === '0') {
        newErrors.advanceWaktu = "Waktu Pengerjaan tidak boleh kurang dari 1 hari";
        isValid = false;
      }
      if (advancePackage.harga === null || advancePackage.harga === undefined || advancePackage.harga === '') {
        newErrors.advanceHarga = "Harga tidak boleh kosong";
        isValid = false;
      }
      if (advancePackage.sourceFile !== "true" && advancePackage.sourceFile !== "false") {
        newErrors.advanceSourceFile = "File Sumber harus berupa ya atau tidak";
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
    if (step > 1 && step !== 6) setStep(step - 1);
  };

  const handleTagSelect = (category) => {
    if (!selectedTags.includes(category)) {
      setSelectedTags([...selectedTags, category]);
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

  const filteredCategories = SERVICE_CATEGORIES.filter(
    (category) =>
      category.toLowerCase().includes(searchCategory.toLowerCase()) &&
      !selectedTags.includes(category)
  );

  const handleStepClick = (stepNum) => {
    if (step === 6 || stepNum === 6) {
      return;
    }
    if (stepNum < step || (stepNum === step + 1 && validateStep())) {
      setStep(stepNum);
    } else if (stepNum === step) {

    }
  };

  const handleAttachmentsUpload = (event) => {
    const files = Array.from(event.target.files);
    const validTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = files.filter(file => validTypes.includes(file.type));

    if (filteredFiles.length === 0) {
      setErrors({ ...errors, attachments: "Hanya gambar format JPG dan PNG yang diperbolehkan." });
      return;
    }

    const remainingSlots = 3 - attachments.length;
    if (remainingSlots <= 0) return;
    const allowedFiles = filteredFiles.slice(0, remainingSlots);
    const currentTotalSize = attachments.reduce((sum, att) => sum + att.size, 0);
    const newFiles = [];
    let newTotalSize = currentTotalSize;
    for (const file of allowedFiles) {
      if (newTotalSize + file.size <= 2 * 1024 * 1024) {
        newTotalSize += file.size;
        newFiles.push(file);
      } else {
        break;
      }
    }
    if (newFiles.length === 0) {
      setErrors({ ...errors, attachments: "Ukuran total upload tidak boleh lebih dari 2 MB." });
      return;
    }
    const newAttachments = newFiles.map((file) => {
      const sizeInKB = file.size / 1024;
      const formattedSize = sizeInKB < 1024
        ? `${sizeInKB.toFixed(1)} KB`
        : `${(sizeInKB / 1024).toFixed(1)} MB`;
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
    if (errors.attachments) {
      setErrors({ ...errors, attachments: null });
    }
    event.target.value = '';
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    if (window.confirm("Apakah Anda yakin ingin menyimpan product service ini?")) {
      try {
        const formData = new FormData();
        attachments.forEach(att => {
          formData.append("images", att.file);
        });
        formData.append("name", title);
        formData.append("description", description);
        formData.append("workflow", JSON.stringify(workFlows));
        formData.append("categories", JSON.stringify(selectedTags));
        formData.append("packages", JSON.stringify([
          {
            type: "Basic",
            price: basicPackage.harga,
            workDuration: basicPackage.waktu,
            conceptLimit: basicPackage.konsep,
            revisionLimit: basicPackage.revisi,
            sourceFile: basicPackage.sourceFile,
          },
          {
            type: "Standard",
            price: advancePackage.harga,
            workDuration: advancePackage.waktu,
            conceptLimit: advancePackage.konsep,
            revisionLimit: advancePackage.revisi,
            sourceFile: advancePackage.sourceFile,
          }
        ]));
        const response = await axios.post(`${gigAPI}/create-gig`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
          }
        );
        console.log(response.data)
      }
      catch (error) {
        console.log("error save new gig", error);
      }
      goNext();
    }
    setLoadingSave(false);
  };

  const handleBasicChange = (field, value) => {
    let newValue = value;
    const numberFields = ['konsep', 'revisi', 'waktu', 'harga'];
    if (numberFields.includes(field)) {
      newValue = newValue.replace(/[^0-9]/g, '');
      if (newValue.length > 1 && newValue.startsWith('0')) {
        newValue = newValue.replace(/^0+/, '');
      }
    }
    setBasicPackage({
      ...basicPackage,
      [field]: newValue
    });

    const errorKey = `basic${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };


  const handleAdvanceChange = (field, value) => {
    let newValue = value;
    const numberFields = ['konsep', 'revisi', 'waktu', 'harga'];
    if (numberFields.includes(field)) {
      newValue = newValue.replace(/[^0-9]/g, '');
      if (newValue.length > 1 && newValue.startsWith('0')) {
        newValue = newValue.replace(/^0+/, '');
      }
    }
    setAdvancePackage({
      ...advancePackage,
      [field]: newValue
    });

    const errorKey = `advance${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };

  const handlePriceChange = (packageType, numericValue) => {
    if (packageType === PACKAGE_TYPES.BASIC) {
      handleBasicChange('harga', numericValue);
      if (errors.basicHarga) {
        const updatedErrors = { ...errors };
        delete updatedErrors.basicHarga;
        setErrors(updatedErrors);
      }
    } else {
      handleAdvanceChange('harga', numericValue);
      if (errors.advanceHarga) {
        const updatedErrors = { ...errors };
        delete updatedErrors.advanceHarga;
        setErrors(updatedErrors);
      }
    }
  };

  const handlePreview = () => {
    const previewData = {
      title,
      categories: selectedTags,
      images: attachments,
      description,
      workFlows,
      packages: {
        basic: basicPackage,
        advance: advancePackage
      }
    };
    localStorage.setItem('servicePreviewData', JSON.stringify(previewData));
    setShowPreview(true);
  };

  const handleWorkFlowChange = (index, value) => {
    const newWorkFlows = [...workFlows];
    newWorkFlows[index] = value;
    setWorkFlows(newWorkFlows);

    if (errors[`workflow_${index}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`workflow_${index}`];
      setErrors(updatedErrors);
    }
  };

  const removeWorkFlow = (index) => {
    if (index < DEFAULT_WORKFLOW_COUNT) return;
    const newWorkFlows = [...workFlows];
    newWorkFlows.splice(index, 1);
    setWorkFlows(newWorkFlows);
    const updatedErrors = { ...errors };
    for (let i = index; i < workFlows.length; i++) {
      delete updatedErrors[`workflow_${i}`];
    }
    setErrors(updatedErrors);
  };

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

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-400 flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="flex flex-row items-center justify-between px-4 sm:px-8 h-[68px] bg-[linear-gradient(116deg,_#2E5077_2.68%,_#4DA1A9_102.1%)] flex-shrink-0">
                <h2 className="text-white text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-Archivo">
                  Add Product
                </h2>
                <motion.img
                  onClick={handleClose}
                  src={CancelIcon}
                  disabled={loadingSave}
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer"
                />
              </nav>
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="px-4 sm:px-8 py-6">
                  <div className="flex justify-between items-center relative">
                    {steps.map((label, index) => {
                      const current = index + 1;
                      const isActive = current === step;
                      const isCompleted = current < step;
                      const isClickable = current <= step || current === step + 1;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center relative z-10 w-1/6"
                          onClick={() => handleStepClick(current)}
                          style={{ cursor: isClickable ? "pointer" : "default" }}
                        >
                          <div
                            className={`rounded-full flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 mb-2
                              ${isActive
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
                                `text-sm sm:text-base ${isCompleted || isActive ? "text-white" : "text-gray-600"}`
                              }
                            >
                              {isCompleted
                                ? "✓"
                                : current < 10
                                  ? `0${current}`
                                  : current
                              }
                            </span>
                          </div>
                          <span
                            className={`text-center text-[10px] sm:text-xs ${isActive ? "text-blue-500 font-Archivo font-bold" : "text-gray-500"}`}
                          >
                            {label}
                          </span>
                          {index < steps.length - 1 && (
                            <div className="absolute top-3 sm:top-4 left-1/2 w-full px-1">
                              <div
                                className={`h-0.5 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {step === 1 && (
                  <div className="px-4 sm:px-8 py-4 min-h-[40vh]">
                    <h3 className="text-center font-Archivo text-2xl sm:text-3xl">
                      Title & Category
                    </h3>
                    <p className="text-center font-Archivo text-sm sm:text-base text-[#636363] mb-4">
                      Tambahkan judul dan kategori dari product service kamu
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 px-4 py-4 border border-gray-300 rounded-md">
                      <div className="flex-1 mb-4 md:mb-6">
                        <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.title ? "border-red-500" : "border-gray-400"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Ketik judul disini"
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) {
                              setErrors({ ...errors, title: null });
                            }
                          }}
                        />
                        {errors.title && (
                          <p className="text-red-500 font-inter text-xs sm:text-sm">
                            {errors.title}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 mb-4 md:mb-6">
                        <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                          Category (Maksimal 2)
                        </label>
                        <div className="relative" ref={dropdownRef}>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.category ? "border-red-500" : "border-gray-400"
                              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder={selectedTags.length >= 2 ? "Pilihan Category Sudah Penuh" : "Search Category"}
                            value={searchCategory}
                            disabled={selectedTags.length >= 2}
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
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                                  onClick={() => handleTagSelect(category)}
                                >
                                  {category}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
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
                          <p className="text-red-500 font-inter -translate-y-2 text-xs sm:text-sm">
                            {errors.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="px-4 sm:px-8 py-4">
                    <h3 className="text-center font-Archivo text-2xl sm:text-3xl">Attachment</h3>
                    <p className="text-center font-Archivo text-sm sm:text-base text-[#636363] mb-4">
                      Tambahkan Gambar pada product servicemu
                    </p>
                    <div className="px-4 py-4 border border-gray-300 rounded-md">
                      <div className="mb-6">
                        {attachments.length < 3 ? (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-8 text-center cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              fileInputRef.current.click();
                            }}
                          >
                            <input
                              type="file"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleAttachmentsUpload}
                              accept=".jpg,.png"
                              multiple
                            />
                            <div className="flex flex-col font-inter items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3"
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
                              <p className="text-gray-700 font-medium text-sm sm:text-base">
                                Klik untuk upload gambar
                              </p>
                              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                Hanya mendukung format JPG dan PNG (Maksimal ukuran: 2MB)
                              </p>
                              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                {attachments.length} dari 3 gambar diupload
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-gray-300 rounded-md p-4 sm:p-8 text-center bg-gray-50">
                            <p className="text-gray-700 font-medium text-sm sm:text-base">
                              Batas 3 gambar tercapai
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                              Hapus beberapa gambar untuk upload gambar lain
                            </p>
                          </div>
                        )}
                        {errors.attachments && (
                          <p className="text-red-500 text-xs sm:text-sm mt-2">
                            {errors.attachments}
                          </p>
                        )}
                      </div>
                      {attachments.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {attachments.map((attachment, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={attachment.preview}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-24 sm:h-32 object-cover rounded-md"
                              />
                              <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
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
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{attachment.name}</p>
                                <div className="flex justify-between items-center">
                                  <p className="text-[10px] sm:text-xs text-gray-400">{attachment.formattedSize}</p>
                                  <span className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-gray-100 rounded font-mono">{attachment.extension}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="px-4 sm:px-8 py-4">
                    <h3 className="text-center font-Archivo text-2xl sm:text-3xl">
                      Description
                    </h3>
                    <p className="text-center font-Archivo text-sm sm:text-base text-[#636363] mb-4">
                      Tambahkan Penjelasan Deskripsi tentang product servicemu
                    </p>

                    <div className="px-4 py-4 border border-gray-300 rounded-md">
                      <div className="flex flex-col md:flex-row w-full gap-6">
                        <div className="md:w-1/2">
                          <label className="block font-inter text-sm sm:text-base text-[#424956] mb-3">
                            Work flow (maksimal 7)
                          </label>
                          {workFlows.map((flow, index) => (
                            <div key={index} className="mb-3 relative">
                              <input
                                type="text"
                                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors[`workflow_${index}`] ? "border-red-500" : "border-gray-400"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder={`${index === 0 ? 'Flow 1' : index === 1 ? 'Flow 2' : index === 2 ? 'Flow 3' : `Flow ${index + 1}`}`}
                                value={flow}
                                onChange={(e) => handleWorkFlowChange(index, e.target.value)}
                              />
                              {index >= DEFAULT_WORKFLOW_COUNT && (
                                <button
                                  onClick={() => removeWorkFlow(index)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Remove flow"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                              {errors[`workflow_${index}`] && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">
                                  {errors[`workflow_${index}`]}
                                </p>
                              )}
                            </div>
                          ))}
                          <div className="flex justify-end mt-2">
                            {workFlows.length < 7 &&
                              <button
                                onClick={() => {
                                  setWorkFlows([...workFlows, ""]);
                                }}
                                disabled={workFlows.length > 7}
                                className="flex items-center justify-center p-0 bg-transparent hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                              >
                                <img src={addFlow} alt="Add Flow" className="h-6 w-6" />
                              </button>
                            }
                          </div>
                        </div>
                        <div className="md:w-1/2">
                          <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                            Deskripsi
                          </label>
                          <textarea
                            className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.description ? "border-red-500" : "border-gray-400"
                              } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md min-h-[200px]`}
                            placeholder="Jelaskan produk anda dengan rinci..."
                            value={description}
                            onChange={(e) => {
                              const input = e.target.value;
                              if (input.length <= 800) {
                                setDescription(input);
                              }
                              if (errors.description) {
                                setErrors({ ...errors, description: null });
                              }
                            }}
                          ></textarea>
                          {errors.description && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                              {errors.description}
                            </p>
                          )}
                          <p className={`text-xs sm:text-sm mt-1 ${description.length >= 800 ? "text-red-500" : "text-gray-500"}`}>
                            {description.length}/800 karakter
                            <span className="text-[10px] sm:text-xs ml-1">(minimum 50)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="px-4 sm:px-8 py-4">
                    <h3 className="text-center font-Archivo text-2xl sm:text-3xl">
                      Price and structure
                    </h3>
                    <p className="text-center font-Archivo text-sm sm:text-base text-[#636363] mb-4">
                      Tambahkan harga dan struktur paket product kamu
                    </p>
                    <div className="border border-gray-300 rounded-md overflow-auto"
                      style={{
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                      }}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300">
                          <h3 className="text-center bg-[#1E617A] font-Archivo text-xl sm:text-2xl text-white flex items-center justify-center w-28 sm:w-[115px] h-9 sm:h-[39px] mx-auto rounded-b-lg sm:rounded-b-[14px]">
                            {PACKAGE_TYPES.BASIC}
                          </h3>
                          <div className="p-4">
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.KONSEP}:
                              </label>
                              <input
                                type="number"
                                min={0}
                                className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.basicKonsep ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Klik disini"
                                value={basicPackage.konsep}
                                onClick={() => {
                                  if (basicPackage['konsep'] === null) {
                                    setBasicPackage({
                                      ...basicPackage,
                                      ['konsep']: 0
                                    })
                                  }
                                }}
                                onChange={(e) => {
                                  handleBasicChange('konsep', e.target.value);
                                  if (errors.basicKonsep) {
                                    setErrors({ ...errors, basicKonsep: null });
                                  }
                                }}
                              />
                              {errors.basicKonsep && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.basicKonsep}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.REVISI}:
                              </label>
                              <input
                                type="number"
                                min={0}
                                className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.basicRevisi ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Klik disini"
                                value={basicPackage.revisi}
                                onClick={() => {
                                  if (basicPackage['revisi'] === null) {
                                    setBasicPackage({
                                      ...basicPackage,
                                      ['revisi']: 0
                                    })
                                  }
                                }}
                                onChange={(e) => {
                                  handleBasicChange('revisi', e.target.value);
                                  if (errors.basicRevisi) {
                                    setErrors({ ...errors, basicRevisi: null });
                                  }
                                }}
                              />
                              {errors.basicRevisi && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.basicRevisi}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.WAKTU}:
                              </label>
                              <input
                                type="number"
                                min={0}
                                className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.basicWaktu ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Klik disini"
                                value={basicPackage.waktu}
                                onClick={() => {
                                  if (basicPackage['waktu'] === null) {
                                    setBasicPackage({
                                      ...basicPackage,
                                      ['waktu']: 0
                                    })
                                  }
                                }}
                                onChange={(e) => {
                                  handleBasicChange('waktu', e.target.value);
                                  if (errors.basicWaktu) {
                                    setErrors({ ...errors, basicWaktu: null });
                                  }
                                }}
                              />
                              {errors.basicWaktu && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.basicWaktu}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.SOURCE}:
                              </label>
                              <select
                                className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
                                  ${errors.basicSourceFile ? "border-red-500" : "border-gray-300"} 
                                  ${basicPackage.sourceFile === null ? "text-gray-400" : "text-black"}`
                                }
                                value={basicPackage.sourceFile}
                                onChange={(e) => {
                                  handleBasicChange("sourceFile", e.target.value);
                                  if (errors.basicSourceFile) {
                                    setErrors({ ...errors, basicSourceFile: null });
                                  }
                                }}
                              >
                                {basicPackage.sourceFile == null && <option value="">Klik disini</option>}
                                <option value="true">Ya</option>
                                <option value="false">Tidak</option>
                              </select>
                              {errors.basicSourceFile && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.basicSourceFile}
                                </p>
                              )}
                            </div>
                            <div className="">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.HARGA}
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className={`w-full sm:w-48 px-3 py-2 border text-sm sm:text-base ${errors.basicHarga ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  placeholder="Klik disini"
                                  value={basicPackage.harga}
                                  onClick={() => {
                                    if (basicPackage['harga'] === null) {
                                      setBasicPackage({
                                        ...basicPackage,
                                        ['harga']: 0
                                      })
                                    }
                                  }}
                                  onChange={(e) => {
                                    handlePriceChange(PACKAGE_TYPES.BASIC, e.target.value);
                                    if (errors.basicHarga) {
                                      setErrors({ ...errors, basicHarga: null });
                                    }
                                  }}
                                />
                              </div>
                              {errors.basicHarga && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.basicHarga}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col w-full md:w-1/2">
                          <h3 className="text-center bg-[#1E617A] font-Archivo text-xl sm:text-2xl text-white flex items-center justify-center w-28 sm:w-[115px] h-9 sm:h-[39px] mx-auto rounded-b-lg sm:rounded-b-[14px]">
                            {PACKAGE_TYPES.ADVANCE}
                          </h3>
                          <div className="p-4">
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.KONSEP}:
                              </label>
                              <input
                                type="text"
                                className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.advanceKonsep ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Klik disini"
                                value={advancePackage.konsep}
                                onClick={() => {
                                  if (advancePackage['konsep'] === null) {
                                    setAdvancePackage({
                                      ...advancePackage,
                                      ['konsep']: 0
                                    })
                                  }
                                }}
                                onChange={(e) => {
                                  handleAdvanceChange('konsep', e.target.value);
                                  if (errors.advanceKonsep) {
                                    setErrors({ ...errors, advanceKonsep: null });
                                  }
                                }}
                              />
                              {errors.advanceKonsep && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.advanceKonsep}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.REVISI}:
                              </label>
                              <input
                                type="text"
                                className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.advanceRevisi ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Klik disini"
                                value={advancePackage.revisi}
                                onClick={() => {
                                  if (advancePackage['revisi'] === null) {
                                    setAdvancePackage({
                                      ...advancePackage,
                                      ['revisi']: 0
                                    })
                                  }
                                }}
                                onChange={(e) => {
                                  handleAdvanceChange('revisi', e.target.value);
                                  if (errors.advanceRevisi) {
                                    setErrors({ ...errors, advanceRevisi: null });
                                  }
                                }}
                              />
                              {errors.advanceRevisi && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.advanceRevisi}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.WAKTU}:
                              </label>
                              <input
                                type="text"
                                className={`w-full px-3 py-2 border text-sm sm:text-base ${errors.advanceWaktu ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Klik disini"
                                value={advancePackage.waktu}
                                onClick={() => {
                                  if (advancePackage['waktu'] === null) {
                                    setAdvancePackage({
                                      ...advancePackage,
                                      ['waktu']: 0
                                    })
                                  }
                                }}
                                onChange={(e) => {
                                  handleAdvanceChange('waktu', e.target.value);
                                  if (errors.advanceWaktu) {
                                    setErrors({ ...errors, advanceWaktu: null });
                                  }
                                }}
                              />
                              {errors.advanceWaktu && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.advanceWaktu}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.SOURCE}:
                              </label>
                              <select
                                className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
                                  ${errors.advanceSourceFile ? "border-red-500" : "border-gray-300"} 
                                  ${advancePackage.sourceFile === null ? "text-gray-400" : "text-black"}`
                                }
                                value={advancePackage.sourceFile}
                                onChange={(e) => {
                                  handleAdvanceChange("sourceFile", e.target.value);
                                  if (errors.advanceSourceFile) {
                                    setErrors({ ...errors, advanceSourceFile: null });
                                  }
                                }}
                              >
                                {advancePackage.sourceFile === null && <option value="">Klik disini</option>}
                                <option value="true">Ya</option>
                                <option value="false">Tidak</option>
                              </select>
                              {errors.advanceSourceFile && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.advanceSourceFile}
                                </p>
                              )}
                            </div>
                            <div className="mb-3">
                              <label className="block font-inter text-sm sm:text-base text-[#424956] mb-1">
                                {PRICE_STEP_LABELS.HARGA}
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className={`w-full sm:w-48 px-3 py-2 border text-sm sm:text-base ${errors.advanceHarga ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  placeholder="Klik disini"
                                  value={advancePackage.harga}
                                  onClick={() => {
                                    if (advancePackage['harga'] === null) {
                                      setAdvancePackage({
                                        ...advancePackage,
                                        ['harga']: 0
                                      })
                                    }
                                  }}
                                  onChange={(e) => {
                                    handlePriceChange(PACKAGE_TYPES.ADVANCE, e.target.value);
                                    if (errors.advanceHarga) {
                                      setErrors({ ...errors, advanceHarga: null });
                                    }
                                  }}
                                />
                              </div>
                              {errors.advanceHarga && (
                                <p className="text-red-500 text-xs sm:text-sm mt-0.5">
                                  {errors.advanceHarga}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="px-4 sm:px-8 py-4">
                    <h3 className="text-center font-Archivo text-2xl sm:text-3xl">Review the product</h3>
                    <p className="text-center font-Archivo text-sm sm:text-base text-[#636363] mb-4">
                      Mari periksa semua data yg telah kamu isi sebelumnya
                    </p>
                    <div className="flex justify-center items-center mt-8 px-4 py-4 border border-gray-300 rounded-md">
                      <div className="text-center">
                        <p className="mb-3 font-medium text-gray-800 text-sm sm:text-base">Klik tombol <strong>Preview</strong> untuk<br />cek produk milikmu</p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-3">
                          <button
                            onClick={handlePreview}
                            disabled={loadingSave}
                            className="px-6 py-2 border border-gray-300 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              setLoadingSave(true);
                              handleSave();
                            }}
                            disabled={loadingSave}
                            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center cursor-pointer text-sm sm:text-base"
                          >
                            <img src={SaveIcon} alt="Save" className="h-5 w-5 mr-2" />
                            {loadingSave ?
                              <CircularProgress size={24} color="inherit"/>
                              :
                              "Save"
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="relative px-4 sm:px-8 py-10 sm:py-18 my-5 sm:my-10 overflow-hidden">
                    <div className="relative z-10 text-center py-6 sm:py-12 md:-translate-y-16 lg:-translate-y-32">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Aboard!!</h3>
                      <p className="text-gray-600 text-base sm:text-lg mb-10">
                        Selamat! kamu telah berhasil menambahkan productmu!
                      </p>
                    </div>
                    <img
                      onClick={onCloseAfterSave}
                      src={FinishBg}
                      alt="Background"
                      className="absolute inset-0 w-full h-full mt-4 z-0 opacity-80 object-cover"
                    />
                  </div>
                )}
                {step !== 6 && (
                  <div className={`flex items-center px-4 sm:px-8 pt-2 pb-6 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                    {step > 1 && (
                      <button
                        onClick={goBack}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 shadow-md cursor-pointer text-sm sm:text-base"
                        disabled={loadingSave}
                      >
                        Back
                      </button>
                    )}
                    {step !== 5 && (
                      <button
                        onClick={goNext}
                        className="px-4 py-2 border border-gray-300 rounded-md text-white shadow-md cursor-pointer text-sm sm:text-base"
                        style={{ backgroundColor: "#4DA1A9" }}
                        disabled={loadingSave}
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreview && (
          <Preview
            serviceData={{
              title,
              categories: selectedTags,
              images: attachments,
              description,
              workFlows,
              packages: {
                basic: basicPackage,
                advance: advancePackage
              }
            }}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AddService;