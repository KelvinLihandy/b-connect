import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import aboutApp from "../../assets/profile_about_app.svg";
import AccSecurity from "../../assets/profile_account_security.svg";
import ClearCache from "../../assets/profile_clear_cache.svg";
import HelpCenter from "../../assets/profile_help_center.svg";
import Language from "../../assets/profile_languages.svg";
import PaymentAcc from "../../assets/profile_payment_account.svg";
import PersonalData from "../../assets/profile_personal_data.svg";
import Picture from "../../assets/profile_picture.svg";
import PrivacyPolicy from "../../assets/profile_privacy_policy.svg";
import PushNotification from "../../assets/profile_push_notification.svg";
import TermsCondition from "../../assets/profile_terms_condition.svg";
import dropdownArrow from "../../assets/profile_dropdown_arrow.svg";
import downArrow from "../../assets/profile_down_arrow_2.svg";

import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { userAPI } from "../../constants/APIRoutes";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";


// Constants for available languages
const LANGUAGES = [
  // { code: 'en', name: 'English' },
  { code: "id", name: "Bahasa Indonesia" },
];

// Add this at the top with your other constants
const NOTIFICATION_PREFERENCES = [
  { id: "emailPromo", label: "Email Notification for promotions" },
  { id: "pushTransaction", label: "Push notification for transactions" },
  { id: "newFeatures", label: "Notify me of new features" },
];

const ProfileUser = () => {
  // State declarations yang sudah ada
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  
  // Add the missing paymentPhoneNumber state
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState("");
  
  // Tambahkan state untuk file yang diupload dan preview image
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // State untuk error validasi
  const [formErrors, setFormErrors] = useState({
    email: "",
    phoneNumber: "",
  });

  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [activeContent, setActiveContent] = useState("personalData");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cacheOptions, setCacheOptions] = useState({
    clearImageCache: false,
    clearSessionData: false,
    clearSavedPreferences: false,
  });
  const dropdownRef = useRef(null);

  const { auth } = useContext(AuthContext);

  // Add isImageLoading state
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Add a new state to track pending image deletion
  const [isPendingImageDelete, setIsPendingImageDelete] = useState(false);

  // Add error state for payment number validation
  const [paymentNumberError, setPaymentNumberError] = useState("");
  const [isPaymentUpdating, setIsPaymentUpdating] = useState(false);

  // Add state variables for password validation
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate(); // Add this at the top with other hooks
  
  const handleSave = async () => {
    // Reset error state
    setFormErrors({
      email: "",
      phoneNumber: "",
    });
    
    // Validasi email
    if (contactEmail && !validateEmail(contactEmail)) {
      setFormErrors(prev => ({
        ...prev,
        email: "Format email tidak valid"
      }));
      return;
    }
    
    // Validasi nomor telepon
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setFormErrors(prev => ({
        ...prev,
        phoneNumber: "Format nomor telepon tidak valid (format: +628xxx/628xxx/08xxx)"
      }));
      return;
    }
    
    // Cek apakah ada field yang diisi atau jika ada penghapusan gambar yang tertunda
    const isFormEmpty = !firstName && !lastName && !contactEmail && !phoneNumber && !selectedFile && !isPendingImageDelete;
    
    if (isFormEmpty) {
      alert("Mohon isi minimal satu kolom atau lakukan perubahan untuk melakukan update");
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Gabungkan firstName dan lastName menjadi satu string name jika ada
      let fullName = "";
      if (firstName || lastName) {
        fullName = `${firstName} ${lastName}`.trim();
        formData.append('name', fullName);
      }
      
      // Tambahkan email jika diisi
      if (contactEmail) {
        formData.append('email', contactEmail);
      }
      
      // Tambahkan phone number jika diisi
      if (phoneNumber) {
        formData.append('phoneNumber', phoneNumber);
      }
      
      // Properly handle image deletion - use deletePicture parameter as per backend
      if (isPendingImageDelete) {
        formData.append('deletePicture', 'true');
      }
      // Otherwise add file if provided
      else if (selectedFile) {
        formData.append('picture', selectedFile);
      }
      
      // Kirim request ke backend
      const response = await axios.patch(`${userAPI}/update-user-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      // Handle response dari backend
      if (response.data && response.data.user) {
        // Update profile image jika ada
        if (response.data.user.picture) {
          setProfileImage(response.data.user.picture);
        }
        
        // Hapus file preview setelah berhasil upload
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        
        // Reset file state
        setSelectedFile(null);
        setImagePreview(null);
        
        // Reset pending image delete state after successful save
        setIsPendingImageDelete(false);
        
        alert("Profil berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.message.includes('Network Error') || error.response?.status === 0) {
        alert("Terjadi masalah koneksi ke server. Periksa apakah CORS diatur dengan benar di backend.");
      } else {
        alert("Gagal memperbarui profil. Silakan coba lagi.");
      }
    }
  };

  // Fungsi untuk validasi email
  const validateEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
    return email ? emailRegex.test(email) : true; // True jika kosong (optional field)
  };

  // Fungsi untuk validasi nomor telepon
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phone ? phoneRegex.test(phone) : true; // True jika kosong (optional field)
  };

  const handleUploadPicture = () => {
    // Buat elemen input file yang tersembunyi
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png'; // Membatasi hanya untuk JPEG dan PNG
    fileInput.multiple = false;
    fileInput.max = 1;
    
    // Handler ketika file dipilih
    fileInput.onchange = async (e) => {
      if (e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      
      // Validasi tipe file (hanya PNG dan JPEG)
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert("Format file tidak didukung. Harap unggah file dengan format PNG atau JPEG.");
        return;
      }
      
      // Validasi ukuran file (max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 15MB.");
        return;
      }
      
      // Simpan file untuk nanti diupload saat Save Changes
      setSelectedFile(file);
      
      // Buat preview image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    };
    
    // Simulasi klik pada input file untuk membuka dialog pemilihan file
    fileInput.click();
  };

  const handleDeletePicture = () => {
    // Instead of making the API call, just mark the image for deletion
    setIsPendingImageDelete(true);
    
    // Set local preview to default to show user the change
    setImagePreview(null);
    
    // Show temporary message that changes will apply after saving
    alert("Foto profil akan dihapus setelah Anda mengklik Save Changes");
  };

  // Account Security Constants
  const handleChangeAccount = async () => {
    // Reset error state
    setPaymentNumberError("");
    
    // Validate payment number
    if (!paymentPhoneNumber) {
      setPaymentNumberError("Nomor pembayaran harus diisi");
      return;
    }
    
    // Use phone number validation instead of digit-only validation
    if (!validatePhoneNumber(paymentPhoneNumber)) {
      setPaymentNumberError("Format nomor telepon tidak valid (format: +628xxx/628xxx/08xxx)");
      return;
    }
    
    setIsPaymentUpdating(true);
    
    try {
      // Use same approach as handleSave function that's working with axios
      const formData = new FormData();
      formData.append('paymentNumber', paymentPhoneNumber);
      
      // Use axios.post instead of fetch - similar to the handleSave function
      const response = await axios.patch(`${userAPI}/update-payment-number`, {paymentNumber: paymentPhoneNumber}, {
        withCredentials: true
      });
      
      // Handle response in the same style as handleSave
      if (response.data && response.data.user) {
        alert("Nomor pembayaran berhasil diperbarui");
        
        // Update the local state if backend returned updated value
        if (response.data.user.paymentNumber) {
          setPaymentPhoneNumber(response.data.user.paymentNumber);
        }
      }
    } catch (error) {
      console.error("Error updating payment number:", error);
      
      // Use similar error handling as handleSave
      if (error.message.includes('Network Error') || error.response?.status === 0) {
        alert("Terjadi masalah koneksi ke server. Periksa apakah CORS diatur dengan benar di backend.");
      } else if (error.response?.data?.error) {
        setPaymentNumberError(error.response.data.error);
      } else {
        setPaymentNumberError("Gagal memperbarui nomor pembayaran. Silakan coba lagi.");
      }
    } finally {
      setIsPaymentUpdating(false);
    }
  };

  const handleDisconnectAccount = async () => {
    // Ask for confirmation before disconnecting
    if (!window.confirm("Apakah Anda yakin ingin memutuskan koneksi akun pembayaran?")) {
      return;
    }
    
    setIsPaymentUpdating(true);
    
    try {
      // Send empty string as the payment number to disconnect the account
      const response = await axios.patch(`${userAPI}/update-payment-number`, 
        { paymentNumber: "" },  // Send empty string to disconnect
        { withCredentials: true }
      );
      
      // Handle response in the same style as handleChangeAccount
      if (response.data && response.data.user) {
        // Update the local state to empty string
        setPaymentPhoneNumber("");
        alert("Koneksi akun pembayaran telah diputus");
      }
    } catch (error) {
      console.error("Error disconnecting payment account:", error);
      
      if (error.message.includes('Network Error') || error.response?.status === 0) {
        alert("Terjadi masalah koneksi ke server. Periksa apakah CORS diatur dengan benar di backend.");
      } else if (error.response?.data?.error) {
        setPaymentNumberError(error.response.data.error);
      } else {
        setPaymentNumberError("Gagal memutuskan koneksi. Silakan coba lagi.");
      }
    } finally {
      setIsPaymentUpdating(false);
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle new password change and validation
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Validate new password format
    if (value && !validatePassword(value)) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: "Password harus minimal 8 karakter dan memuat huruf, angka, dan simbol (@$!%*?&)"
      }));
    } else {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: ""
      }));
    }
    
    // Check if confirm password matches
    if (confirmPassword && value !== confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: "Password tidak sama"
      }));
    } else if (confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: ""
      }));
    }
  };

  // Handle confirm password change and matching validation
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value !== newPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: "Password tidak sama"
      }));
    } else {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: ""
      }));
    }
  };

  const handleSavePassword = async () => {
    // Reset error states
    let errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    
    // Validate password format based on backend requirements
    // Password must have at least 8 characters, 1 letter, 1 number and 1 special character
    if (!currentPassword) {
      errors.currentPassword = "Password saat ini harus diisi";
    } else if (!validatePassword(currentPassword)) {
      errors.currentPassword = "Format password tidak valid";
    }
    
    if (!newPassword) {
      errors.newPassword = "Password baru harus diisi";
    } else if (!validatePassword(newPassword)) {
      errors.newPassword = "Password harus minimal 8 karakter dan memuat huruf, angka, dan simbol (@$!%*?&)";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Password dan konfirmasi berbeda";
    }
    
    // Update error state
    setPasswordErrors(errors);
    
    // Check if there are any errors
    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) {
      return;
    }
    
    // Start loading state
    setIsChangingPassword(true);
    
    try {   
      // Call API to change password - matching the backend expecting email, password & passwordConf
      const response = await axios.patch(`${userAPI}/change-password-profile`, {
        password: currentPassword,  // Fix: Use currentPassword as the old password
        newPassword: newPassword,             // Fix: renamed from 'password' to avoid duplicate keys
        passwordConf: confirmPassword      // This is correct
      }, {
        withCredentials: true
      });
      
      // Reset form fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Show success message from the response or default
      alert(response.data?.message || "Password berhasil diubah");
      
      // Add delay before logging out to ensure the user sees the success message
      setTimeout(() => {
        alert("Anda akan keluar dan perlu login kembali dengan password baru.");
        handleLogOut(); // Call the logout function after password change
      }, 1000);
      
    } catch (error) {
      console.error("Error changing password:", error);
      
      // Better error handling based on backend responses
      if (error.response?.data?.error) {
        // Handle specific error messages from the backend
        const errorMessage = error.response.data.error;
        
        if (errorMessage.includes("Password lama tidak valid")) {
          setPasswordErrors(prev => ({...prev, currentPassword: errorMessage}));
        } else if (errorMessage.includes("Password baru tidak valid")) {
          setPasswordErrors(prev => ({...prev, newPassword: errorMessage}));
        } else if (errorMessage.includes("Password dan konfimasi berbeda")) {
          setPasswordErrors(prev => ({...prev, confirmPassword: errorMessage}));
        } else {
          // General error alert
          alert(errorMessage);
        }
      } else {
        alert("Gagal mengubah password. Silakan coba lagi.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogOut = () => {
    try {
      // Clear localStorage
      localStorage.clear();  // Remove all items from localStorage
      
      // Clear sessionStorage
      sessionStorage.clear();  // Remove all items from sessionStorage
      
      // Clear cookies (a simple approach that works for most cookies)
      document.cookie.split(';').forEach(cookie => {
        const [name, _] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
      
      // Show success message
      alert("Berhasil logout");
      
      // Redirect to login page
      navigate('/sign-in');
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Terjadi masalah saat logout. Silakan coba lagi.");
    }
  };

  const handleDeleteAccount = () => {
    console.log("Delete account clicked");
    // Tambahkan logika untuk menghapus akun
  };

  // Language Constants
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  
  // Replace useEffect to use fetch instead of axios.get
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${userAPI}/get-user/${auth?.data?.auth.id}`, {
          method: 'GET',
          withCredentials: true,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.user) {
          if (data.user.picture) {
            setProfileImage(data.user.picture);
          }
          
          // Also set payment number if available
          if (data.user.paymentNumber) {
            setPaymentPhoneNumber(data.user.paymentNumber);
          }
          
          // Set name and other fields if available
          if (data.user.name) {
            const nameParts = data.user.name.split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
          }
          
          if (data.user.email) setContactEmail(data.user.email);
          if (data.user.phoneNumber) setPhoneNumber(data.user.phoneNumber);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Push Notification Constants
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailPromo: false,
    pushTransaction: false,
    newFeatures: false,
  });

  const handleCheckboxChange = (id) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveNotificationPrefs = () => {
    console.log("Saving notification preferences:", notificationPrefs);
    // Add API call here to save preferences
  };

  // Clear Cache Constants
  const handleCacheOptionChange = (id) => {
    setCacheOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClearCache = () => {
    console.log("Clearing cache with options:", cacheOptions);
    // Add API call or logic to clear cache
  };

  // Help Center Constants
  const [expandedItem, setExpandedItem] = useState(null);
  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  // Array FAQ
  const FAQ_ITEMS = [
    {
      question: "Bagaimana cara mengubah password saya?",
      answer:
        "Anda dapat mengubah password melalui menu Account Security. Masukkan password lama Anda, lalu masukkan password baru dan konfirmasi. Klik tombol Save Changes untuk menyimpan perubahan.",
    },
    {
      question: "Bagaimana cara menghubungkan GoPay?",
      answer:
        "Masuk ke menu Payment Account, lalu klik tombol Tambah Akun GoPay atau Hubungkan Akun. Ikuti instruksi yang diberikan dan pastikan nomor GoPay Anda aktif dan sesuai dengan data akun.",
    },
    {
      question: "Bagaimana cara menghapus akun?",
      answer:
        "Untuk menghapus akun, buka halaman Account Security, lalu scroll ke bawah dan klik tombol Delete Account. Anda akan diminta konfirmasi untuk memastikan tindakan ini. Setelah dihapus, semua data Anda akan dihapus secara permanen dan tidak dapat dikembalikan.",
    },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case "personalData":
        return (
          <div className="">
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Personal data</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Kelola detail pribadi Anda agar sesuai dengan profil terbaru.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Personal Data Section */}
            <div className="">
              <h2 className="font-Archivo font-semibold text-[20px] mb-4">Personal Data</h2>
              <div className="relative flex items-center mb-6">
                <div className="bg-[#9095A0] rounded-[20px] mr-4">
                  {isImageLoading && (
                    <div className="w-[100px] h-[100px] flex items-center justify-center">
                      <p>Loading...</p>
                    </div>
                  )}
                  {/* Use imageShow prefix for profile image */}
                  <img 
                    src={imagePreview || (profileImage ? `${imageShow}${profileImage}` : Picture)} 
                    alt="Profile Picture" 
                    className="w-[100px] h-[100px] object-cover rounded-[16px]" 
                    onLoad={() => setIsImageLoading(false)}
                    onError={(e) => {
                      console.error("Error loading image");
                      e.target.src = Picture; // Fallback to default picture on error
                      setIsImageLoading(false);
                    }}
                    style={{ display: isImageLoading ? 'none' : 'block' }}
                  />
                </div>
                <div className="flex-col gap-3">
                  <p className="text-[20px] font-Archivo mb-3">Profile Picture</p>
                  <p className="text-[12px] font-Archivo text-[#565E6D] mb-1">PNG, JPEG under 15MB</p>
                </div>
                <div className="absolute right-0 flex">
                  {/* Upload Picture Button */}
                  <button
                    className="bg-[#565E6D] text-[#FFFFFF] text-[14px] font-inter px-6 py-2 mr-2 cursor-pointer"
                    onClick={handleUploadPicture}
                  >
                    Upload new picture
                  </button>
                  {/* Delete Picture Button */}
                  <button
                    className="bg-[#565E6D] text-[#FFFFFF] text-[14px] font-inter px-4 py-2 cursor-pointer"
                    onClick={handleDeletePicture}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[16px] font-semibold text-[#424956] mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-semibold text-[#424956] mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-[#ACACAC] w-full mb-6"></div>

              {/* Contact Email */}
              <div className="mb-6 mr-4">
                <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">
                  Contact email
                </label>
                <p className="text-sm text-[#565E6D] mb-2">
                  Digunakan untuk identifikasi akun dan keperluan komunikasi.
                </p>
                <p className="text-[#424956] font-semibold text-[16px] mb-1">Email</p>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={`w-1/2 h-[50px] border ${formErrors.email ? 'border-red-500' : 'border-[#ACACAC]'} px-3 py-2 text-sm`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-6 mr-4">
                <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">
                  Phone number
                </label>
                <p className="text-sm text-[#565E6D] mb-2">
                  Pastikan nomor Anda benar agar klien dapat menghubungi Anda dengan mudah.
                </p>
                <p className="text-[#424956] font-semibold text-[16px] mb-1">Phone Number</p>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+628XXXXXXXXXX"
                  className={`w-1/2 h-[50px] border ${formErrors.phoneNumber ? 'border-red-500' : 'border-[#ACACAC]'} px-3 py-2 text-sm`}
                />
                {formErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                )}
              </div>

              {/* Save Changes Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        );
      case "paymentAccount":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Payment Account</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Real-time information and activities of your prototype.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
            {/* Payment Phone Number */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">
                Status Akun
              </label>
              <p className="text-[#424956] font-semibold text-[16px] mb-1">
                Terhubung dengan nomor :
              </p>
              <input
                type="text"
                value={paymentPhoneNumber}
                onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                placeholder="+628XXXXXXXXXX"
                className={`w-1/2 h-[50px] border ${paymentNumberError ? 'border-red-500' : 'border-[#ACACAC]'} px-3 py-2 text-sm`}
              />
              {paymentNumberError && (
                <p className="text-red-500 text-sm mt-1">{paymentNumberError}</p>
              )}
            </div>

            {/* Button */}
            <div className="">
              {/* Change Account Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 mr-10 cursor-pointer"
                onClick={handleChangeAccount}
                disabled={isPaymentUpdating}
              >
                {isPaymentUpdating ? 'Memproses...' : 'Ganti Akun'}
              </button>
              {/* Disconnect Account Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                onClick={handleDisconnectAccount}
                disabled={isPaymentUpdating}
              >
                Putuskan Koneksi
              </button>
            </div>
          </div>
        );
      case "accountSecurity":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Account Security</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Pastikan akun Anda tetap aman dengan mengatur preferensi keamanan di sini.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
            {/* Change Password */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">
                Change Password
              </label>

              {/* Current Password Input */}
              <p className="text-[#424956] font-semibold text-[16px] mb-1">Current Password :</p>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className={`w-1/2 h-[50px] border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-[#ACACAC]'} px-3 py-2 text-sm mb-1`}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm mb-3">{passwordErrors.currentPassword}</p>
              )}

              {/* New Password Input */}
              <p className="text-[#424956] font-semibold text-[16px] mb-1 mt-2">New Password :</p>
              <input
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="New Password"
                className={`w-1/2 h-[50px] border ${passwordErrors.newPassword ? 'border-red-500' : 'border-[#ACACAC]'} px-3 py-2 text-sm mb-1`}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mb-3">{passwordErrors.newPassword}</p>
              )}

              {/* Confirm New Password Input */}
              <p className="text-[#424956] font-semibold text-[16px] mb-1 mt-2">Confirm Password :</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                className={`w-1/2 h-[50px] border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-[#ACACAC]'} px-3 py-2 text-sm mb-1`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mb-3">{passwordErrors.confirmPassword}</p>
              )}
              
              {/* Save Password Button */}
              <div className="mt-4">
                <button
                  className={`bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer ${isChangingPassword ? 'opacity-70' : ''}`}
                  onClick={handleSavePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Processing...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">
              Manage Account
            </label>
            {/* Manage Account Button */}
            <div className="">
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 mr-10 cursor-pointer"
                onClick={handleLogOut}
              >
                Log out
              </button>
              {/* <button
                className="bg-[#565E6D]  w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button> */}
            </div>
          </div>
        );
      case "languages":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Languages</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Atur bahasa tampilan sesuai dengan preferensi Anda.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Change Language Dropdown */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">
                Change Language
              </label>
              <p className="text-[#424956] font-semibold text-[16px] mb-1">Current Language :</p>

              {/* Custom Dropdown */}
              <div className="relative inline-block w-1/2" ref={dropdownRef}>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  onClick={handleDropdownClick}
                  onBlur={() => setIsDropdownOpen(false)}
                  className="appearance-none w-full h-[50px] border border-[#ACACAC] px-3 py-2 text-sm pr-10"
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>

                {/* Custom arrow with rotation animation */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <img
                    src={dropdownArrow}
                    alt="Dropdown Arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6">
                <button
                  className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                  onClick={() => console.log("Bahasa diubah menjadi:", selectedLanguage)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case "pushNotification":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Push notification</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Sesuaikan preferensi notifikasi agar tetap mendapatkan informasi penting.
            </p>

            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Notification Preferences */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-4">
                Notification Preferences
              </label>

              {/* Checkbox Group */}
              <div className="w-full">
                {NOTIFICATION_PREFERENCES.map((pref) => (
                  <div key={pref.id} className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id={pref.id}
                      checked={notificationPrefs[pref.id]}
                      onChange={() => handleCheckboxChange(pref.id)}
                      className="w-4 h-4 mr-3 cursor-pointer"
                    />
                    <label htmlFor={pref.id} className="text-[14px] text-[#444444] cursor-pointer">
                      {pref.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer mt-3"
                onClick={handleSaveNotificationPrefs}
              >
                Save Changes
              </button>
            </div>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
          </div>
        );
      case "clearCache":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Clear Cache</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Bersihkan data cache agar aplikasi berjalan lebih lancar.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Cache Options */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-4">
                Clear my cache
              </label>

              {/* Checkbox Group */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="clearImageCache"
                    checked={cacheOptions.clearImageCache}
                    onChange={() => handleCacheOptionChange("clearImageCache")}
                    className="w-4 h-4 mr-3 cursor-pointer"
                  />
                  <label
                    htmlFor="clearImageCache"
                    className="text-[14px] text-[#444444] cursor-pointer"
                  >
                    Clear image cache
                  </label>
                </div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="clearSessionData"
                    checked={cacheOptions.clearSessionData}
                    onChange={() => handleCacheOptionChange("clearSessionData")}
                    className="w-4 h-4 mr-3 cursor-pointer"
                  />
                  <label
                    htmlFor="clearSessionData"
                    className="text-[14px] text-[#444444] cursor-pointer"
                  >
                    Clear session data
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="clearSavedPreferences"
                    checked={cacheOptions.clearSavedPreferences}
                    onChange={() => handleCacheOptionChange("clearSavedPreferences")}
                    className="w-4 h-4 mr-3 cursor-pointer"
                  />
                  <label
                    htmlFor="clearSavedPreferences"
                    className="text-[14px] text-[#444444] cursor-pointer"
                  >
                    Clear saved preferences
                  </label>
                </div>
              </div>

              {/* Clear Cache Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                onClick={handleClearCache}
              >
                Clear cache now
              </button>
            </div>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
          </div>
        );
      case "helpCenter":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Help Center</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Butuh bantuan? Lihat FAQ atau hubungi tim dukungan kami.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-2"></div>

            {/* FAQ Accordion */}
            <div className="mt-2 w-2/3">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="border-b border-black">
                  {/* Header - Clickable */}
                  <div
                    className="flex items-center justify-between py-4 cursor-pointer"
                    onClick={() => toggleItem(index)}
                  >
                    <h3 className="font-Archivo font-semibold text-[18px]">{item.question}</h3>
                    <img
                      src={downArrow}
                      alt="Expand"
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expandedItem === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Content - Expandable */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedItem === index ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-[16px] text-[#171A1F]">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "privacyPolicy":
        return <div>Privacy Policy Content</div>;
      case "aboutApp":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">About App</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Semua informasi penting tentang aplikasi ini tersedia di sini.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-1"></div>

            {/* App Description */}
            <div className="mt-2">
              <p className="text-[18px] leading-relaxed text-[#171A1F]">
                B-Connect adalah platform digital yang dirancang untuk menghubungkan para freelancer
                profesional dengan klien secara cepat dan efisien. Aplikasi ini membantu
                mempertemukan talenta terbaik dengan proyek-proyek yang sesuai, baik dalam bidang
                teknologi, desain, pemasaran, dan lainnya.
              </p>
            </div>
            <div className="border-t border-[#ACACAC] w-full mb-1 mt-4"></div>
          </div>
        );
      case "termsConditions":
        return <div>Terms & Conditions Content</div>;
      default:
        return <div>Select a menu to view content</div>;
    }
  };

  return (
    <div>
      <div className="flex bg-[#eeeeee]">
        <Navbar />
        {/* Sidebar */}
        <div className="flex flex-col mt-[190px] mb-[50px] ml-[60px] mr-[60px] w-fit h-fit font-inter">
          {/* Personal Info Section */}
          <div className="mb-10 bg-[#FFFFFF] w-[276px] h-fit">
            <h3 className="text-[12px] font-semibold text-[#171A1F] mb-2 font-Archivo">
              Personal Info
            </h3>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "personalData" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("personalData")}
            >
              <img src={PersonalData} alt="Personal Data" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "personalData"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Personal Data
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "paymentAccount" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("paymentAccount")}
            >
              <img src={PaymentAcc} alt="Payment Account" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "paymentAccount"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Payment Account
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "accountSecurity" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("accountSecurity")}
            >
              <img src={AccSecurity} alt="Account Security" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "accountSecurity"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Account Security
              </span>
            </div>
          </div>

          {/* General Section */}
          <div className="mb-10 bg-[#FFFFFF] w-[276px] h-fit">
            <h3 className="text-[12px] font-semibold text-[#171A1F] mb-2">General</h3>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "languages" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("languages")}
            >
              <img src={Language} alt="Languages" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "languages"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Languages
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "pushNotification" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("pushNotification")}
            >
              <img src={PushNotification} alt="Push Notification" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "pushNotification"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Push Notification
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "clearCache" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("clearCache")}
            >
              <img src={ClearCache} alt="Clear Cache" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "clearCache"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Clear Cache
              </span>
            </div>
          </div>

          {/* Help Section */}
          <div className="mb-10 bg-[#FFFFFF] w-[276px] h-fit">
            <h3 className="text-[12px] font-semibold text-[#171A1F] mb-2">General</h3>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "helpCenter" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("helpCenter")}
            >
              <img src={HelpCenter} alt="Help Center" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "helpCenter"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Help Center
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "privacyPolicy" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("privacyPolicy")}
            >
              <img src={PrivacyPolicy} alt="Privacy Policy" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "privacyPolicy"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Privacy Policy
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "aboutApp" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("aboutApp")}
            >
              <img src={aboutApp} alt="About App" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "aboutApp"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                About App
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${
                activeContent === "termsConditions" ? "bg-[#DFDFDF]" : ""
              }`}
              onClick={() => setActiveContent("termsConditions")}
            >
              <img src={TermsCondition} alt="Terms & Conditions" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${
                  activeContent === "termsConditions"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                }`}
              >
                Terms & Conditions
              </span>
            </div>
          </div>
        </div>

        <div className="border-r mt-[190px] h-[723px] mb-[110px] border-black"></div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col mt-[180px] mb-[50px] ml-[80px] mr-[200px] w-fit h-fit font-inter">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileUser;