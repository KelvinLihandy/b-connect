import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import aboutApp from "../../assets/profile_about_app.svg";
import AccSecurity from "../../assets/profile_account_security.svg";
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
import { RememberContext } from "../../contexts/RememberContext";

// Constants for available languages
const LANGUAGES = [
  { code: "id", name: "Bahasa Indonesia" },
  { code: "en", name: "English" },
];

// Notification preferences
const NOTIFICATION_PREFERENCES = [
  { id: "emailPromo", label: "Email Notification for promotions" },
  { id: "pushTransaction", label: "Push notification for transactions" },
  { id: "newFeatures", label: "Notify me of new features" },
];

const ProfileUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [saveLoad, setSaveLoad] = useState(false);
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadError, setImageUploadError] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    phoneNumber: "",
  });
  const [saveError, setSaveError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [activeContent, setActiveContent] = useState("personalData");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { auth, getAuth } = useContext(AuthContext);
  const { remember } = useContext(RememberContext);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPendingImageDelete, setIsPendingImageDelete] = useState(false);
  const [paymentNumberError, setPaymentNumberError] = useState("");
  const [isPaymentUpdating, setIsPaymentUpdating] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  // Push Notification state
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailPromo: false,
    pushTransaction: false,
    newFeatures: false,
  });

  // Help Center state
  const [expandedItem, setExpandedItem] = useState(null);

  // All your existing functions remain the same...
  const handleSave = async () => {
    setFormErrors({
      email: "",
      phoneNumber: "",
    });
    if (contactEmail && !validateEmail(contactEmail)) {
      setFormErrors(prev => ({
        ...prev,
        email: "Format email tidak valid"
      }));
      return;
    }
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setFormErrors(prev => ({
        ...prev,
        phoneNumber: "Format nomor telepon tidak valid (format: +628xxx/628xxx/08xxx)"
      }));
      return;
    }
    const isFormEmpty = !firstName && !lastName && !contactEmail && !phoneNumber && !selectedFile && !isPendingImageDelete;
    if (isFormEmpty) {
      return;
    }
    try {
      setSaveLoad(true);
      const formData = new FormData();
      let fullName = "";
      if (firstName || lastName) {
        fullName = `${firstName} ${lastName}`.trim();
        formData.append('name', fullName);
      }
      if (contactEmail) {
        formData.append('email', contactEmail);
      }
      if (phoneNumber) {
        formData.append('phoneNumber', phoneNumber);
      }
      if (isPendingImageDelete) {
        formData.append('deletePicture', 'true');
      }
      else if (selectedFile) {
        formData.append('picture', selectedFile);
      }
      formData.append('remember', remember);
      const response = await axios.patch(`${userAPI}/update-user-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      if (response.data && response.data.user) {
        if (response.data.user.picture) {
          setProfileImage(response.data.user.picture);
        }
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setSelectedFile(null);
        setImagePreview(null);
        setIsPendingImageDelete(false);
        setSaveError("");
        await getAuth();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.message.includes('Network Error') || error.response?.status === 0) {
        setSaveError("Terjadi masalah koneksi ke server. Periksa apakah CORS diatur dengan benar di backend.");
      } else {
        setSaveError("Gagal memperbarui profil. Silakan coba lagi.");
      }
    } 
    setSaveLoad(false);
    window.location.reload();
  };

  const validateEmail = (email) => {
    const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z\-0-9]*[a-zA-Z0-9]:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f])\]))$/;
    return email ? emailRegex.test(email) : true;
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phone ? phoneRegex.test(phone) : true;
  };

  const handleUploadPicture = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.multiple = false;
    fileInput.max = 1;
    fileInput.onchange = async (e) => {
      if (e.target.files.length === 0) return;
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setImageUploadError("Format file tidak didukung. Harap unggah file dengan format PNG atau JPEG.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setImageUploadError("Ukuran file terlalu besar. Maksimal 15MB.");
        return;
      }
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setIsPendingImageDelete(false);
    };
    fileInput.click();
  };

  const handleDeletePicture = () => {
    setIsPendingImageDelete(true);
    setImagePreview(null);
  };

  const handleChangeAccount = async () => {
    setPaymentNumberError("");
    if (!paymentPhoneNumber) {
      setPaymentNumberError("Nomor pembayaran harus diisi");
      return;
    }
    if (!validatePhoneNumber(paymentPhoneNumber)) {
      setPaymentNumberError("Format nomor telepon tidak valid (format: +628xxx/628xxx/08xxx)");
      return;
    }
    setIsPaymentUpdating(true);
    try {
      const response = await axios.patch(`${userAPI}/update-payment-number`, { paymentNumber: paymentPhoneNumber }, {
        withCredentials: true
      });
      if (response.data && response.data.user) {
        alert("Nomor pembayaran berhasil diperbarui");
        if (response.data.user.paymentNumber) {
          setPaymentPhoneNumber(response.data.user.paymentNumber);
        }
      }
    } catch (error) {
      console.error("Error updating payment number:", error);
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
    if (!window.confirm("Apakah Anda yakin ingin memutuskan koneksi akun pembayaran?")) {
      return;
    }
    setIsPaymentUpdating(true);
    try {
      const response = await axios.patch(`${userAPI}/update-payment-number`,
        { paymentNumber: "" },
        { withCredentials: true }
      );
      if (response.data && response.data.user) {
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

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
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
    let errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
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
    setPasswordErrors(errors);
    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) {
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await axios.patch(`${userAPI}/change-password-profile`, {
        password: currentPassword,
        newPassword: newPassword,
        passwordConf: confirmPassword
      }, {
        withCredentials: true
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert(response.data?.message || "Password berhasil diubah");
      setTimeout(() => {
        alert("Anda akan keluar dan perlu login kembali dengan password baru.");
        handleLogOut();
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes("Password lama tidak valid")) {
          setPasswordErrors(prev => ({ ...prev, currentPassword: errorMessage }));
        } else if (errorMessage.includes("Password baru tidak valid")) {
          setPasswordErrors(prev => ({ ...prev, newPassword: errorMessage }));
        } else if (errorMessage.includes("Password dan konfimasi berbeda")) {
          setPasswordErrors(prev => ({ ...prev, confirmPassword: errorMessage }));
        } else {
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
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach(cookie => {
        const [name, _] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
      alert("Berhasil logout");
      navigate('/sign-in');
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Terjadi masalah saat logout. Silakan coba lagi.");
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCheckboxChange = (id) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveNotificationPrefs = () => {
    console.log("Saving notification preferences:", notificationPrefs);
    alert("Preferensi notifikasi berhasil disimpan!");
  };

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleBackToProfile = () => {
    if (auth?.data?.auth?.id) {
      navigate(`/user-profile/${auth.data.auth.id}`);
    } else {
      navigate('/dashboard'); // fallback route
    }
  };

  // FAQ Items
  const FAQ_ITEMS = [
    {
      question: "Bagaimana cara mengubah password saya?",
      answer: "Anda dapat mengubah password melalui menu Account Security. Masukkan password lama Anda, lalu masukkan password baru dan konfirmasi. Klik tombol Save Changes untuk menyimpan perubahan.",
    },
    {
      question: "Bagaimana cara menghubungkan GoPay?",
      answer: "Masuk ke menu Payment Account, lalu klik tombol Tambah Akun GoPay atau Hubungkan Akun. Ikuti instruksi yang diberikan dan pastikan nomor GoPay Anda aktif dan sesuai dengan data akun.",
    },
    {
      question: "Bagaimana cara menghapus akun?",
      answer: "Untuk menghapus akun, buka halaman Account Security, lalu scroll ke bawah dan klik tombol Delete Account. Anda akan diminta konfirmasi untuk memastikan tindakan ini. Setelah dihapus, semua data Anda akan dihapus secara permanen dan tidak dapat dikembalikan.",
    },
  ];

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${userAPI}/get-user/${auth?.data?.auth.id}`, {
          method: 'POST',
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
          if (data.user.paymentNumber) {
            setPaymentPhoneNumber(data.user.paymentNumber);
          }
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

  const renderContent = () => {
    switch (activeContent) {
      case "personalData":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Personal Data</h1>
              <p className="font-inter text-lg text-gray-600">
                Kelola detail pribadi Anda agar sesuai dengan profil terbaru.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>

            <div className="space-y-8">
              <div>
                <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Profile Picture</h2>
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="relative mr-6">
                      {isImageLoading && (
                        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                          <CircularProgress color="inherit" size={24} />
                        </div>
                      )}
                      <img
                        src={
                          isPendingImageDelete
                            ? Picture
                            : imagePreview || (profileImage ? `${imageShow}${profileImage}` : Picture)
                        }
                        alt="Profile Picture"
                        className="w-24 h-24 object-cover rounded-full shadow-md"
                        onLoad={() => setIsImageLoading(false)}
                        onError={(e) => {
                          console.error("Error loading image", e);
                          e.target.src = Picture;
                          setIsImageLoading(false);
                        }}
                        style={{ display: isImageLoading ? 'none' : 'block' }}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800 mb-1">Profile Picture</p>
                      <p className="text-sm text-gray-500">PNG, JPEG under 15MB</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                      onClick={handleUploadPicture}
                    >
                      Upload New
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                      onClick={handleDeletePicture}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {imageUploadError && (
                  <p className="text-red-500 text-sm mt-3 bg-red-50 p-3 rounded-lg">{imageUploadError}</p>
                )}
              </div>

              <div>
                <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full h-12 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 text-sm rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full h-12 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 text-sm rounded-lg transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Contact Email
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Digunakan untuk identifikasi akun dan keperluan komunikasi.
                    </p>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="example@email.com"
                      className={`w-full max-w-md h-12 border ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} focus:ring-2 px-4 py-3 text-sm rounded-lg transition-all duration-200`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Phone Number
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Pastikan nomor Anda benar agar klien dapat menghubungi Anda dengan mudah.
                    </p>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+628XXXXXXXXXX"
                      className={`w-full max-w-md h-12 border ${formErrors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} focus:ring-2 px-4 py-3 text-sm rounded-lg transition-all duration-200`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[200px] shadow-lg"
                    onClick={handleSave}
                    disabled={saveLoad}
                  >
                    {saveLoad ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  {saveError && (
                    <p className="text-red-500 text-sm mt-3 bg-red-50 p-3 rounded-lg">{saveError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case "paymentAccount":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Payment Account</h1>
              <p className="font-inter text-lg text-gray-600">
                Kelola akun pembayaran Anda untuk transaksi yang lebih mudah.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Account Status</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Connected Phone Number
                    </label>
                    <input
                      type="text"
                      value={paymentPhoneNumber}
                      onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                      placeholder="+628XXXXXXXXXX"
                      className={`w-full max-w-md h-12 border ${paymentNumberError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} focus:ring-2 px-4 py-3 text-sm rounded-lg transition-all duration-200 bg-white`}
                    />
                    {paymentNumberError && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{paymentNumberError}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
                      onClick={handleChangeAccount}
                      disabled={isPaymentUpdating}
                    >
                      {isPaymentUpdating ? 'Processing...' : 'Change Account'}
                    </button>
                    <button
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
                      onClick={handleDisconnectAccount}
                      disabled={isPaymentUpdating}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "accountSecurity":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Account Security</h1>
              <p className="font-inter text-lg text-gray-600">
                Pastikan akun Anda tetap aman dengan mengatur preferensi keamanan di sini.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Change Password</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className={`w-full max-w-md h-12 border ${passwordErrors.currentPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} focus:ring-2 px-4 py-3 text-sm rounded-lg transition-all duration-200 bg-white`}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      placeholder="Enter new password"
                      className={`w-full max-w-md h-12 border ${passwordErrors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} focus:ring-2 px-4 py-3 text-sm rounded-lg transition-all duration-200 bg-white`}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Confirm new password"
                      className={`w-full max-w-md h-12 border ${passwordErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} focus:ring-2 px-4 py-3 text-sm rounded-lg transition-all duration-200 bg-white`}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    className={`bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg ${isChangingPassword ? 'opacity-70' : ''}`}
                    onClick={handleSavePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Processing...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 w-full"></div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Manage Account</h2>
                <div className="flex space-x-4">
                  <button
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "languages":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Languages</h1>
              <p className="font-inter text-lg text-gray-600">
                Atur bahasa tampilan sesuai dengan preferensi Anda.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
              <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Change Language</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Language</label>
                <div className="relative inline-block w-full max-w-md" ref={dropdownRef}>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    onClick={handleDropdownClick}
                    onBlur={() => setIsDropdownOpen(false)}
                    className="appearance-none w-full h-12 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 text-sm rounded-lg pr-10 bg-white transition-all duration-200"
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <img
                      src={dropdownArrow}
                      alt="Dropdown Arrow"
                      className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg"
                    onClick={() => {
                      console.log("Bahasa diubah menjadi:", selectedLanguage);
                      alert("Bahasa berhasil diubah!");
                    }}
                    disabled={saveLoad}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "pushNotification":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Push Notifications</h1>
              <p className="font-inter text-lg text-gray-600">
                Sesuaikan preferensi notifikasi agar tetap mendapatkan informasi penting.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl">
              <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4 mb-8">
                {NOTIFICATION_PREFERENCES.map((pref) => (
                  <div key={pref.id} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                    <input
                      type="checkbox"
                      id={pref.id}
                      checked={notificationPrefs[pref.id]}
                      onChange={() => handleCheckboxChange(pref.id)}
                      className="w-5 h-5 mr-4 cursor-pointer text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor={pref.id} className="text-base text-gray-700 cursor-pointer font-medium">
                      {pref.label}
                    </label>
                  </div>
                ))}
              </div>
              
              <button
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-sm font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg"
                onClick={handleSaveNotificationPrefs}
              >
                Save Changes
              </button>
            </div>
          </div>
        );
      
      case "helpCenter":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Help Center</h1>
              <p className="font-inter text-lg text-gray-600">
                Butuh bantuan? Lihat FAQ atau hubungi tim dukungan kami.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleItem(index)}
                  >
                    <h3 className="font-Archivo font-semibold text-lg text-gray-800">{item.question}</h3>
                    <img
                      src={downArrow}
                      alt="Expand"
                      className={`w-5 h-5 transition-transform duration-300 ${expandedItem === index ? "rotate-180" : ""}`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${expandedItem === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="p-6 pt-0 bg-gray-50">
                      <p className="text-base text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "privacyPolicy":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Privacy Policy</h1>
              <p className="font-inter text-lg text-gray-600">
                Kebijakan privasi dan perlindungan data pengguna B-Connect.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="prose max-w-none space-y-6 text-gray-700">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">1. Informasi yang Kami Kumpulkan</h2>
                <p className="text-base leading-relaxed">
                  Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti nama, alamat email, 
                  nomor telepon, dan informasi profil lainnya. Kami juga mengumpulkan informasi tentang penggunaan layanan 
                  kami secara otomatis melalui cookies dan teknologi pelacakan serupa.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">2. Cara Kami Menggunakan Informasi</h2>
                <p className="text-base leading-relaxed mb-4">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Menyediakan dan meningkatkan layanan kami</li>
                  <li>Memproses transaksi dan pembayaran</li>
                  <li>Berkomunikasi dengan Anda tentang layanan kami</li>
                  <li>Mengirimkan notifikasi dan pembaruan penting</li>
                  <li>Melindungi keamanan dan integritas platform</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">3. Berbagi Informasi</h2>
                <p className="text-base leading-relaxed">
                  Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga kecuali 
                  dalam situasi tertentu seperti untuk memproses pembayaran, mematuhi hukum yang berlaku, atau 
                  melindungi hak dan keamanan pengguna lain.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">4. Keamanan Data</h2>
                <p className="text-base leading-relaxed">
                  Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi 
                  informasi pribadi Anda dari akses yang tidak sah, penggunaan, pengungkapan, atau penghancuran.
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">5. Hak Anda</h2>
                <p className="text-base leading-relaxed mb-4">
                  Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Mengakses dan memperbarui informasi pribadi Anda</li>
                  <li>Meminta penghapusan data pribadi Anda</li>
                  <li>Membatasi pemrosesan data pribadi Anda</li>
                  <li>Memperoleh salinan data pribadi Anda</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">6. Kontak</h2>
                <p className="text-base leading-relaxed">
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak-hak Anda, 
                  silakan hubungi kami melalui email support@b-connect.com atau melalui formulir kontak di aplikasi.
                </p>
              </div>
            </div>
          </div>
        );
      
      case "aboutApp":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">About App</h1>
              <p className="font-inter text-lg text-gray-600">
                Semua informasi penting tentang aplikasi B-Connect tersedia di sini.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-2xl text-gray-800 mb-4">Tentang B-Connect</h2>
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  B-Connect adalah platform digital yang dirancang untuk menghubungkan para freelancer
                  profesional dengan klien secara cepat dan efisien. Aplikasi ini membantu
                  mempertemukan talenta terbaik dengan proyek-proyek yang sesuai, baik dalam bidang
                  teknologi, desain, pemasaran, dan lainnya.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">🎯 Misi Kami</h3>
                  <p className="text-base leading-relaxed text-gray-700">
                    Memudahkan kolaborasi antara freelancer dan klien dengan menyediakan platform yang 
                    aman, efisien, dan mudah digunakan untuk semua jenis proyek digital.
                  </p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">🌟 Visi Kami</h3>
                  <p className="text-base leading-relaxed text-gray-700">
                    Menjadi platform freelancing terdepan di Indonesia yang menghubungkan talenta 
                    terbaik dengan peluang kerja yang berkualitas.
                  </p>
                </div>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl">
                <h3 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">✨ Fitur Utama</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-base text-gray-700">
                    <li>• Pencarian proyek yang disesuaikan</li>
                    <li>• Sistem pembayaran yang aman</li>
                    <li>• Chat dan komunikasi real-time</li>
                    <li>• Portfolio dan rating freelancer</li>
                  </ul>
                  <ul className="space-y-2 text-base text-gray-700">
                    <li>• Manajemen proyek terintegrasi</li>
                    <li>• Sistem dispute resolution</li>
                    <li>• Mobile-friendly interface</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-teal-50 p-6 rounded-xl">
                <h3 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">📊 Statistik Platform</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">10K+</div>
                    <div className="text-sm text-gray-600">Active Freelancers</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">5K+</div>
                    <div className="text-sm text-gray-600">Completed Projects</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                    <div className="text-sm text-gray-600">User Rating</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">📞 Hubungi Kami</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-base text-gray-700 mb-2"><strong>Email:</strong> support@b-connect.com</p>
                    <p className="text-base text-gray-700 mb-2"><strong>Phone:</strong> +62 21 1234 5678</p>
                    <p className="text-base text-gray-700"><strong>Address:</strong> Jakarta, Indonesia</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-700 mb-2"><strong>Version:</strong> 2.1.0</p>
                    <p className="text-base text-gray-700 mb-2"><strong>Last Update:</strong> May 2025</p>
                    <p className="text-base text-gray-700"><strong>License:</strong> Proprietary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "termsConditions":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="font-Archivo font-bold text-3xl text-gray-800 mb-3">Terms & Conditions</h1>
              <p className="font-inter text-lg text-gray-600">
                Syarat dan ketentuan penggunaan platform B-Connect.
              </p>
            </div>
            
            <div className="border-t border-gray-200 w-full mb-8"></div>
            
            <div className="prose max-w-none space-y-6 text-gray-700">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">1. Penerimaan Syarat</h2>
                <p className="text-base leading-relaxed">
                  Dengan mengakses dan menggunakan platform B-Connect, Anda setuju untuk terikat oleh syarat dan 
                  ketentuan ini. Jika Anda tidak setuju dengan syarat ini, harap tidak menggunakan layanan kami.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">2. Registrasi dan Akun</h2>
                <p className="text-base leading-relaxed mb-4">
                  Untuk menggunakan layanan kami, Anda harus:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Berusia minimal 18 tahun atau memiliki izin dari wali</li>
                  <li>Memberikan informasi yang akurat dan lengkap</li>
                  <li>Menjaga kerahasiaan password dan informasi akun</li>
                  <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">3. Layanan Platform</h2>
                <p className="text-base leading-relaxed mb-4">
                  B-Connect menyediakan platform untuk menghubungkan freelancer dengan klien. Kami tidak:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Menjamin kualitas pekerjaan dari freelancer</li>
                  <li>Bertanggung jawab atas sengketa antara pengguna</li>
                  <li>Memverifikasi identitas atau kualifikasi semua pengguna</li>
                  <li>Terlibat langsung dalam proses negosiasi kontrak</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">4. Pembayaran dan Biaya</h2>
                <p className="text-base leading-relaxed mb-4">
                  Ketentuan pembayaran:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Platform mengenakan fee 5% dari setiap transaksi</li>
                  <li>Pembayaran diproses melalui gateway yang aman</li>
                  <li>Freelancer menerima pembayaran setelah klien approve</li>
                  <li>Refund hanya diberikan sesuai kebijakan yang berlaku</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">5. Kode Etik dan Larangan</h2>
                <p className="text-base leading-relaxed mb-4">
                  Pengguna dilarang untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base">
                  <li>Menyebarkan konten yang melanggar hukum atau tidak pantas</li>
                  <li>Melakukan tindakan penipuan atau menyesatkan</li>
                  <li>Menggunakan platform untuk kegiatan ilegal</li>
                  <li>Mengakses sistem secara tidak sah</li>
                  <li>Menghindari pembayaran fee platform</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">6. Hak Kekayaan Intelektual</h2>
                <p className="text-base leading-relaxed">
                  Semua materi yang ditampilkan di platform B-Connect, termasuk logo, desain, teks, dan 
                  perangkat lunak, adalah milik B-Connect atau pemberi lisensi. Pengguna tidak diizinkan 
                  untuk menyalin, memodifikasi, atau mendistribusikan materi tersebut tanpa izin tertulis.
                </p>
              </div>
              
              <div className="bg-teal-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">7. Penghentian Layanan</h2>
                <p className="text-base leading-relaxed">
                  B-Connect berhak untuk menangguhkan atau mengakhiri akun pengguna yang melanggar syarat 
                  dan ketentuan ini. Pengguna juga dapat mengakhiri akun mereka kapan saja dengan 
                  menghubungi layanan pelanggan kami.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="font-Archivo font-semibold text-xl text-gray-800 mb-4">8. Perubahan Syarat</h2>
                <p className="text-base leading-relaxed">
                  B-Connect berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan 
                  diberitahukan kepada pengguna melalui email atau notifikasi di platform. Penggunaan 
                  berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap syarat yang baru.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Profile Settings</h2>
            <p className="text-gray-600">Select a menu from the sidebar to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-8">
        <Navbar />
      </div>
      
      {/* Back Button */}
      <div className="px-8 pt-35">
        <button
          onClick={handleBackToProfile}
          className="flex items-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Profile</span>
        </button>
      </div>
      
      <div className="flex pt-16 pb-20 px-8">
        {/* Unified Sidebar */}
        <div className="flex flex-col w-80 mr-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Personal Info Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                Personal Info
              </h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "personalData" 
                      ? "bg-blue-100 border-l-4 border-blue-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("personalData")}
                >
                  <img src={PersonalData} alt="Personal Data" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "personalData"
                        ? "text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    Personal Data
                  </span>
                </div>
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "paymentAccount" 
                      ? "bg-green-100 border-l-4 border-green-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("paymentAccount")}
                >
                  <img src={PaymentAcc} alt="Payment Account" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "paymentAccount"
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    Payment Account
                  </span>
                </div>
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "accountSecurity" 
                      ? "bg-orange-100 border-l-4 border-orange-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("accountSecurity")}
                >
                  <img src={AccSecurity} alt="Account Security" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "accountSecurity"
                        ? "text-orange-700"
                        : "text-gray-600"
                    }`}
                  >
                    Account Security
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-8"></div>

            {/* General Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">General</h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "languages" 
                      ? "bg-purple-100 border-l-4 border-purple-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("languages")}
                >
                  <img src={Language} alt="Languages" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "languages"
                        ? "text-purple-700"
                        : "text-gray-600"
                    }`}
                  >
                    Languages
                  </span>
                </div>
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "pushNotification" 
                      ? "bg-teal-100 border-l-4 border-teal-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("pushNotification")}
                >
                  <img src={PushNotification} alt="Push Notification" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "pushNotification"
                        ? "text-teal-700"
                        : "text-gray-600"
                    }`}
                  >
                    Push Notification
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-8"></div>

            {/* Help Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Help & Support</h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "helpCenter" 
                      ? "bg-indigo-100 border-l-4 border-indigo-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("helpCenter")}
                >
                  <img src={HelpCenter} alt="Help Center" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "helpCenter"
                        ? "text-indigo-700"
                        : "text-gray-600"
                    }`}
                  >
                    Help Center
                  </span>
                </div>
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "privacyPolicy" 
                      ? "bg-pink-100 border-l-4 border-pink-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("privacyPolicy")}
                >
                  <img src={PrivacyPolicy} alt="Privacy Policy" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "privacyPolicy"
                        ? "text-pink-700"
                        : "text-gray-600"
                    }`}
                  >
                    Privacy Policy
                  </span>
                </div>
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "aboutApp" 
                      ? "bg-cyan-100 border-l-4 border-cyan-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("aboutApp")}
                >
                  <img src={aboutApp} alt="About App" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "aboutApp"
                        ? "text-cyan-700"
                        : "text-gray-600"
                    }`}
                  >
                    About App
                  </span>
                </div>
                <div
                  className={`flex items-center py-3 px-4 cursor-pointer rounded-xl transition-all duration-200 ${
                    activeContent === "termsConditions" 
                      ? "bg-rose-100 border-l-4 border-rose-500" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveContent("termsConditions")}
                >
                  <img src={TermsCondition} alt="Terms & Conditions" className="w-5 h-5 mr-4" />
                  <span
                    className={`text-sm font-medium ${
                      activeContent === "termsConditions"
                        ? "text-rose-700"
                        : "text-gray-600"
                    }`}
                  >
                    Terms & Conditions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
      
      <div className="px-8">
        <Footer />
      </div>
    </div>
  );
};

export default ProfileUser;