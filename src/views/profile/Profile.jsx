import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
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
import { authAPI, userAPI } from "../../constants/APIRoutes";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { RememberContext } from "../../contexts/RememberContext";
import { UserTypeContext } from "../../contexts/UserTypeContext";


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

const Profile = () => {
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
  const [cacheOptions, setCacheOptions] = useState({
    clearImageCache: false,
    clearSessionData: false,
    clearSavedPreferences: false,
  });
  const dropdownRef = useRef(null);
  const { auth, getAuth, setAuth } = useContext(AuthContext);
  const { remember } = useContext(RememberContext);
  const { isFreelancer, setIsFreelancer } = useContext(UserTypeContext)
  const [isPendingImageDelete, setIsPendingImageDelete] = useState(false);
  const [paymentNumberError, setPaymentNumberError] = useState("");
  const [isPaymentUpdating, setIsPaymentUpdating] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [description, setDescription] = useState("");
  const [portoLink, setPortoLink] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();
  const scrollUp = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: scrollUp.current.offsetTop,
      behavior: "smooth",
    });
  }, [activeContent])

  const handleLogOut = async () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });
    await axios.post(`${authAPI}/clear-cookie`,
      {},
      { withCredentials: true }
    )
    setAuth(null);
    setIsFreelancer(false);
    navigate('/home');
  }

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
      console.log(data)
      if (data && data.user) {
        if (data.user.picture) {
          setProfileImage(data.user.picture);
        }
        if (data.user.description) {
          setDescription(data.user.description);
        }
        if (data.user.portofolioUrl) {
          setPortoLink(data.user.portofolioUrl);
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z\-0-9]*[a-zA-Z0-9]:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f])\]))$/;
    return email ? emailRegex.test(email) : true;
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phone ? phoneRegex.test(phone) : true;
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
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

  const handleSavePersonalData = async () => {
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
      if (contactEmail) formData.append('email', contactEmail);
      if (phoneNumber) formData.append('phoneNumber', phoneNumber);
      if (isFreelancer) {
        formData.append('descr', description);
        formData.append('porto', portoLink);
      }
      if (isPendingImageDelete) formData.append('deletePicture', 'true');
      else if (selectedFile) formData.append('picture', selectedFile);
      formData.append('remember', remember);
      const response = await axios.patch(`${userAPI}/update-user-profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
      const res = response.data;
      console.log(response)
      setSelectedFile(null);
      setSaveError("");
      await getAuth();
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      await fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.message.includes('Network Error') || error.response?.status === 0) {
        setSaveError("Terjadi masalah koneksi ke server. Periksa apakah CORS diatur dengan benar di backend.");
      } else {
        setSaveError("Gagal memperbarui profil. Silakan coba lagi.");
      }
    } finally {
      setSaveLoad(false);
    }
  }

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

  const handleChangePassword = async () => {
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
      if (response.data.message === "Password berhasil diubah.") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert("Password berhasil diubah, anda perlu login kembali dengan password baru");
        handleLogOut();
      }
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

  const handleChangePaymentNumber = async () => {
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
      const response = await axios.patch(`${userAPI}/update-payment-number`,
        { paymentNumber: paymentPhoneNumber },
        { withCredentials: true }
      );
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

  const [expandedItem, setExpandedItem] = useState(null);
  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const FAQ_ITEMS = [
    {
      question: "Bagaimana cara mengubah password saya?",
      answer:
        "Anda dapat mengubah password melalui menu Account Security. Masukkan password lama Anda, lalu masukkan password baru dan konfirmasi. Klik tombol Save Changes untuk menyimpan perubahan.",
    },
    {
      question: "Bagaimana cara mengubah akun pembayaran?",
      answer:
        "Masuk ke menu Payment Account, lalu isi form nomor telepon akun. Ikuti instruksi yang diberikan dan pastikan nomor telepon akun Anda aktif dan sesuai dengan data akun.",
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
            <div className="">
              <h2 className="font-Archivo font-semibold text-[20px] mb-4">Personal Data</h2>
              <div className="relative flex items-center mb-6">
                <div className="bg-[#9095A0] rounded-[20px] mr-4">
                  <img
                    src={
                      imagePreview !== null
                        ? imagePreview
                        : !auth?.data?.auth.picture || auth?.data?.auth.picture === "temp"
                          ? Picture
                          : `${imageShow}${auth?.data?.auth.picture}`
                    }
                    alt="Profile Picture"
                    className="w-[100px] h-[100px] object-cover rounded-[16px]"
                    onError={(e) => {
                      console.error("Error loading image", e);
                      e.target.src = Picture;
                    }}
                  />
                </div>
                <div className="flex-col gap-3">
                  <p className="text-[20px] font-Archivo mb-3">Profile Picture</p>
                  <p className="text-[12px] font-Archivo text-[#565E6D] mb-1">PNG, JPEG under 15MB</p>
                </div>
                <div className="absolute right-0 flex">
                  <button
                    className="bg-[#565E6D] text-[#FFFFFF] text-[14px] font-inter px-6 py-2 mr-2 cursor-pointer"
                    onClick={handleUploadPicture}
                  >
                    Upload new picture
                  </button>
                  <button
                    className={`${isPendingImageDelete ? 'bg-red-500' : 'bg-[#565E6D]'} text-[#FFFFFF] text-[14px] font-inter px-4 py-2 cursor-pointer`}
                    onClick={() => {
                      setIsPendingImageDelete(!isPendingImageDelete);
                      setImagePreview(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {imageUploadError && (
                <p className="text-red-500 text-sm mb-3">{imageUploadError}</p>
              )}
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
              <div className="mb-6 mr-4">
                <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">
                  Phone number
                </label>
                <p className="text-sm text-[#565E6D] mb-2">
                  Pastikan nomor Anda benar agar klien dapat menghubungi Anda dengan mudah.
                </p>
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
              {isFreelancer &&
                <>
                  <div className="mb-6 mr-4">
                    <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">
                      About
                    </label>
                    <p className="text-sm text-[#565E6D] mb-2">
                      Jelaskan diri anda
                    </p>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Deskripsi..."
                      className={`w-1/2 h-40 border border-[#ACACAC] px-3 py-2 text-sm resize-none rounded`}
                    />
                  </div>
                  <div className="mb-6 mr-4">
                    <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">
                      Portofolio URL
                    </label>
                    <input
                      type="text"
                      value={portoLink}
                      onChange={(e) => setPortoLink(e.target.value)}
                      placeholder=""
                      className={`w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm`}
                    />
                  </div>
                </>
              }
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer flex text-center justify-center"
                onClick={handleSavePersonalData}
                disabled={saveLoad}
              >
                {saveLoad ?
                  <CircularProgress color="inherit" size={20} />
                  :
                  "Save Changes"
                }
              </button>
              {saveError && (
                <p className="text-red-500 text-sm mb-3">{saveError}</p>
              )}

            </div>
          </div>
        );
      case "paymentAccount":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Payment Account</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Cantumkan nomor telepon akun penerima bayaran kontrak.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
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
            <div className="">
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 mr-10 cursor-pointer"
                onClick={handleChangePaymentNumber}
                disabled={isPaymentUpdating}
              >
                {isPaymentUpdating ? 'Memproses...' : 'Ubah Nomor'}
              </button>
            </div>
          </div>
        );
      case "accountSecurity":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Account Security</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Pastikan akun Anda tetap aman dengan mengatur kata sandi akun di sini.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">
                Change Password
              </label>
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
              <div className="mt-4">
                <button
                  className={`bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer ${isChangingPassword ? 'opacity-70' : ''}`}
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Processing...' : 'Save Changes'}
                </button>
              </div>
            </div>
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
            <div className="mt-2 w-2/3">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="border-b border-black">
                  <div
                    className="flex items-center justify-between py-4 cursor-pointer"
                    onClick={() => toggleItem(index)}
                  >
                    <h3 className="font-Archivo font-semibold text-[18px]">{item.question}</h3>
                    <img
                      src={downArrow}
                      alt="Expand"
                      className={`w-5 h-5 transition-transform duration-300 ${expandedItem === index ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${expandedItem === index ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
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
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Privacy Policy</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            <div className="space-y-6">
              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">1. Informasi yang Kami Kumpulkan</h2>
                <div className="space-y-3 text-[16px] text-[#424956]">
                  <p><strong className="text-[#171A1F]">Informasi Pribadi:</strong> Ketika Anda mendaftar atau menggunakan B-Connect, kami dapat mengumpulkan informasi pribadi seperti nama, alamat email, nomor telepon, lokasi, informasi keterampilan/jasa yang Anda tawarkan, dan informasi pembayaran.</p>
                  <p><strong className="text-[#171A1F]">Data Profil Jasa:</strong> Untuk penyedia jasa, kami mengumpulkan informasi tentang layanan yang ditawarkan, portofolio, tarif, dan ulasan dari klien.</p>
                  <p><strong className="text-[#171A1F]">Data Transaksi:</strong> Informasi tentang pemesanan jasa, komunikasi antara penyedia dan penerima jasa, pembayaran, dan riwayat transaksi.</p>
                  <p><strong className="text-[#171A1F]">Data Penggunaan:</strong> Kami secara otomatis mengumpulkan informasi tentang cara Anda berinteraksi dengan platform B-Connect, termasuk komunikasi, dan aktivitas di aplikasi.</p>
                </div>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">2. Cara Kami Menggunakan Informasi Anda</h2>
                <div className="space-y-3 text-[16px] text-[#424956]">
                  <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                  <div className="ml-4 space-y-2">
                    <p>• Menyediakan dan memelihara platform B-Connect</p>
                    <p>• Memfasilitasi koneksi antara penyedia jasa dan penerima jasa</p>
                    <p>• Memproses transaksi pembayaran dan booking jasa</p>
                    <p>• Menampilkan profil dan layanan penyedia jasa kepada calon klien</p>
                    <p>• Menyediakan sistem ulasan dan rating untuk menjaga kualitas layanan</p>
                    <p>• Mencegah penipuan dan menjaga keamanan platform</p>
                    <p>• Meningkatkan algoritma pencarian jasa</p>
                    <p>• Mematuhi kewajiban hukum dan peraturan yang berlaku</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">3. Berbagi Informasi</h2>
                <div className="space-y-3 text-[16px] text-[#424956]">
                  <p>Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi dalam situasi berikut:</p>
                  <div className="ml-4 space-y-2">
                    <p><strong className="text-[#171A1F]">Antar Pengguna B-Connect:</strong> Profile dan informasi layanan penyedia jasa akan ditampilkan kepada calon klien di platform</p>
                    <p><strong className="text-[#171A1F]">Untuk Transaksi:</strong> Informasi kontak yang diperlukan untuk komunikasi dan penyelesaian jasa antara penyedia dan penerima jasa</p>
                    <p><strong className="text-[#171A1F]">Penyedia Layanan:</strong> Dengan partner pembayaran, layanan pesan, dan penyedia infrastruktur yang membantu mengoperasikan B-Connect</p>
                    <p><strong className="text-[#171A1F]">Kewajiban Hukum:</strong> Ketika diwajibkan oleh hukum atau untuk merespons proses hukum</p>
                    <p><strong className="text-[#171A1F]">Keamanan Platform:</strong> Untuk melindungi hak, properti, keamanan B-Connect dan pengguna dari penipuan atau aktivitas berbahaya</p>
                    <p><strong className="text-[#171A1F]">Perubahan Kepemilikan:</strong> Dalam hubungan dengan merger, akuisisi, atau penjualan aset B-Connect</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">4. Keamanan Data</h2>
                <p className="text-[16px] text-[#424956]">Kami menerapkan langkah-langkah keamanan yang tepat untuk melindungi informasi pribadi Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Ini termasuk enkripsi data, autentikasi berlapis, dan monitoring keamanan. Namun, tidak ada metode transmisi melalui internet yang 100% aman, dan kami tidak dapat menjamin keamanan absolut.</p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">5. Hak Anda</h2>
                <div className="space-y-3 text-[16px] text-[#424956]">
                  <p>Sebagai pengguna B-Connect, Anda memiliki hak untuk:</p>
                  <div className="ml-4 space-y-2">
                    <p>• Mengakses dan memperbarui profil dan informasi pribadi Anda</p>
                    <p>• Memilih keluar dari komunikasi pemasaran dan promosi</p>
                    <p>• Meminta salinan data pribadi yang kami miliki tentang Anda</p>
                    <p>• Menolak pemrosesan data pribadi untuk tujuan tertentu</p>
                    <p>• Melaporkan masalah keamanan atau privasi kepada tim B-Connect</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">6. Cookie dan Pelacakan</h2>
                <p className="text-[16px] text-[#424956]">Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda di B-Connect, termasuk mengingat preferensi pencarian, menyimpan sesi login, dan menganalisis penggunaan platform. Anda dapat mengontrol pengaturan cookie melalui preferensi browser Anda.</p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">7. Privasi Anak</h2>
                <p className="text-[16px] text-[#424956]">B-Connect tidak ditujukan untuk anak-anak di bawah usia 17 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah 17 tahun. Jika Anda mengetahui bahwa anak di bawah umur telah memberikan informasi pribadi kepada kami, silakan hubungi kami untuk menghapus informasi tersebut.</p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">8. Pengguna Internasional</h2>
                <p className="text-[16px] text-[#424956]">Jika Anda mengakses layanan kami dari luar Indonesia, harap dicatat bahwa informasi Anda dapat ditransfer dan diproses di Indonesia, tempat server kami berada.</p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">9. Perubahan Kebijakan</h2>
                <p className="text-[16px] text-[#424956]">Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui tanggal "Terakhir Diperbarui".</p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">10. Hubungi Kami</h2>
                <div className="space-y-3 text-[16px] text-[#424956]">
                  <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:</p>
                  <div className="bg-[#F5F5F5] p-4 rounded-lg mt-3">
                    <p className="mb-1"><strong className="text-[#171A1F]">Email:</strong> bconnect404@gmail.com</p>
                    <p className="mb-1"><strong className="text-[#171A1F]">Telepon:</strong> +62 821-2517-4770</p>
                    <p><strong className="text-[#171A1F]">Alamat:</strong> Jakarta, Indonesia</p>
                  </div>
                </div>
              </section>

              <div className="border-t border-[#ACACAC] w-full pt-4 mt-6">
                <p className="text-[14px] text-[#565E6D]">
                  <strong>Terakhir Diperbarui:</strong> Juni 2025
                </p>
              </div>
            </div>
          </div>
        );
      case "aboutApp":
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">About App</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Semua informasi penting tentang aplikasi ini tersedia di sini.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-1"></div>
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
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Terms and Conditions</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Syarat dan Ketentuan ini mengatur penggunaan Anda atas platform kami.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            <div className="space-y-6">
              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">1. Penggunaan Layanan</h2>
                <p className="text-[16px] text-[#424956]">
                  Dengan menggunakan platform ini, Anda menyetujui untuk mematuhi semua peraturan dan ketentuan yang berlaku. Anda tidak diperbolehkan menggunakan layanan untuk kegiatan yang melanggar hukum atau merugikan pihak lain.
                </p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">2. Hak Kekayaan Intelektual</h2>
                <p className="text-[16px] text-[#424956]">
                  Seluruh konten dalam platform ini termasuk namun tidak terbatas pada teks, grafik, logo, ikon, dan perangkat lunak adalah milik kami dan dilindungi oleh undang-undang hak cipta.
                </p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">3. Tanggung Jawab Pengguna</h2>
                <p className="text-[16px] text-[#424956]">
                  Pengguna bertanggung jawab atas keamanan akun mereka sendiri serta aktivitas yang dilakukan melalui akun tersebut. Harap menjaga kerahasiaan informasi login Anda.
                </p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">4. Pembaruan Ketentuan</h2>
                <p className="text-[16px] text-[#424956]">
                  Kami dapat memperbarui Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan diberlakukan segera setelah dipublikasikan di halaman ini.
                </p>
              </section>

              <section>
                <h2 className="font-Archivo font-semibold text-[20px] mb-4 text-[#171A1F]">5. Kontak</h2>
                <p className="text-[16px] text-[#424956]">
                  Jika Anda memiliki pertanyaan terkait Syarat dan Ketentuan ini, silakan hubungi tim dukungan kami.
                </p>
              </section>
            </div>
          </div>
        );
      default:
        return <div>Select a menu to view content</div>;
    }
  };

  return (
    <div>
      <div className="flex bg-[#eeeeee]" ref={scrollUp}>
        <Navbar />
        <div className="flex flex-col mt-35 mb-[50px] ml-[60px] mr-[60px] w-fit font-inter">
          <div className="sticky top-35 z-10">
            <div className="bg-[#FFFFFF] w-[276px] h-fit mb-5">
              <h3 className="text-lg font-semibold text-[#171A1F] font-Archivo p-3">
                Personal Info
              </h3>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "personalData" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("personalData")}
              >
                <img src={PersonalData} alt="Personal Data" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "personalData"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  Personal Data
                </span>
              </div>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "paymentAccount" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("paymentAccount")}
              >
                <img src={PaymentAcc} alt="Payment Account" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "paymentAccount"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  Payment Account
                </span>
              </div>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "accountSecurity" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("accountSecurity")}
              >
                <img src={AccSecurity} alt="Account Security" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "accountSecurity"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  Account Security
                </span>
              </div>
            </div>
            <div className="bg-[#FFFFFF] w-[276px] h-fit">
              <h3 className="text-lg font-semibold text-[#171A1F] font-Archivo p-3">
                General
              </h3>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "helpCenter" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("helpCenter")}
              >
                <img src={HelpCenter} alt="Help Center" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "helpCenter"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  Help Center
                </span>
              </div>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "privacyPolicy" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("privacyPolicy")}
              >
                <img src={PrivacyPolicy} alt="Privacy Policy" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "privacyPolicy"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  Privacy Policy
                </span>
              </div>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "aboutApp" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("aboutApp")}
              >
                <img src={aboutApp} alt="About App" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "aboutApp"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  About App
                </span>
              </div>
              <div
                className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === "termsConditions" ? "bg-[#DFDFDF]" : ""
                  }`}
                onClick={() => setActiveContent("termsConditions")}
              >
                <img src={TermsCondition} alt="Terms & Conditions" className="w-5 h-5 mr-3" />
                <span
                  className={`text-[12px] ${activeContent === "termsConditions"
                    ? "font-semibold text-[#171A1F]"
                    : "font-normal text-[#565E6D]"
                    }`}
                >
                  Terms & Conditions
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col mt-35 mb-[50px] ml-[80px] mr-[200px] w-fit h-fit font-inter">
          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;