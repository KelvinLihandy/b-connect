import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import aboutApp from "../../assets/profile_about_app.svg"
import AccSecurity from "../../assets/profile_account_security.svg"
import ClearCache from "../../assets/profile_clear_cache.svg"
import HelpCenter from "../../assets/profile_help_center.svg"
import Language from "../../assets/profile_languages.svg"
import PaymentAcc from "../../assets/profile_payment_account.svg"
import PersonalData from "../../assets/profile_personal_data.svg"
import Picture from "../../assets/profile_picture.svg"
import PrivacyPolicy from "../../assets/profile_privacy_policy.svg"
import PushNotification from "../../assets/profile_push_notification.svg"
import TermsCondition from "../../assets/profile_terms_condition.svg"
import dropdownArrow from "../../assets/profile_dropdown_arrow.svg"
import downArrow from "../../assets/profile_down_arrow_2.svg"


import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'

// Constants for available languages
const LANGUAGES = [
  // { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' }
];

// Add this at the top with your other constants
const NOTIFICATION_PREFERENCES = [
  { id: 'emailPromo', label: 'Email Notification for promotions' },
  { id: 'pushTransaction', label: 'Push notification for transactions' },
  { id: 'newFeatures', label: 'Notify me of new features' }
];

const ProfileUser = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [activeContent, setActiveContent] = useState('personalData');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [cacheOptions, setCacheOptions] = useState({
    clearImageCache: false,
    clearSessionData: false,
    clearSavedPreferences: false
  });
  const dropdownRef = useRef(null);

  const handleSave = () => {
    // Save changes logic here (send to API)
  };

  const handleUploadPicture = () => {
    console.log("Upload new picture clicked");
    // Tambahkan logika untuk mengunggah gambar
  };

  const handleDeletePicture = () => {
    console.log("Delete picture clicked");
    // Tambahkan logika untuk menghapus gambar
  };

  // Account Security Constants
  const handleChangeAccount = () => {
    console.log("Change account clicked");
    // Tambahkan logika untuk mengganti akun
  };

  const handleDisconnectAccount = () => {
    console.log("Disconnect account clicked");
    // Tambahkan logika untuk memutuskan koneksi akun
  };

  const handleSavePassword = () => {
    console.log("Save password clicked");
    // Tambahkan logika untuk menyimpan password baru
    const passwordData = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    console.log("Password Data:", passwordData);
    // Kirim data ke API atau tambahkan logika lainnya
  };

  const handleLogOut = () => {
    console.log("Log out clicked");
    // Tambahkan logika untuk keluar dari akun
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Push Notification Constants
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailPromo: false,
    pushTransaction: false,
    newFeatures: false
  });

  const handleCheckboxChange = (id) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveNotificationPrefs = () => {
    console.log("Saving notification preferences:", notificationPrefs);
    // Add API call here to save preferences
  };

  // Clear Cache Constants
  const handleCacheOptionChange = (id) => {
    setCacheOptions(prev => ({
      ...prev,
      [id]: !prev[id]
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
      question: 'Bagaimana cara mengubah password saya?',
      answer: 'Anda dapat mengubah password melalui menu Account Security. Masukkan password lama Anda, lalu masukkan password baru dan konfirmasi. Klik tombol Save Changes untuk menyimpan perubahan.'
    },
    {
      question: 'Bagaimana cara menghubungkan GoPay?',
      answer: 'Masuk ke menu Payment Account, lalu klik tombol Tambah Akun GoPay atau Hubungkan Akun. Ikuti instruksi yang diberikan dan pastikan nomor GoPay Anda aktif dan sesuai dengan data akun.'
    },
    {
      question: 'Bagaimana cara menghapus akun?',
      answer: 'Untuk menghapus akun, buka halaman Account Security, lalu scroll ke bawah dan klik tombol Delete Account. Anda akan diminta konfirmasi untuk memastikan tindakan ini. Setelah dihapus, semua data Anda akan dihapus secara permanen dan tidak dapat dikembalikan.'
    }
  ];

  const renderContent = () => {
    switch (activeContent) {
      case 'personalData':
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
                <div className="bg-[#9095A0] p-2 rounded-[20px] mr-4">
                  <img src={Picture} alt="Profile Picture" className="w-[80px] h-[80px]" />
                </div>
                <div className='flex-col gap-3'>
                  <p className='text-[20px] font-Archivo mb-3'>Profile Picture</p>
                  <p className="text-[12px] font-Archivo text-[#565E6D]">PNG, JPEG under 15MB</p>
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
                  <label className="block text-[16px] font-semibold text-[#424956] mb-1">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-semibold text-[#424956] mb-1">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className='border-t border-[#ACACAC] w-full mb-6'></div>

              {/* Contact Email */}
              <div className="mb-6 mr-4">
                <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">Contact email</label>
                <p className="text-sm text-[#565E6D] mb-2">
                  Digunakan untuk identifikasi akun dan keperluan komunikasi.
                </p>
                <p className='text-[#424956] font-semibold text-[16px] mb-1'>Email</p>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
                />
              </div>

              {/* Phone Number */}
              <div className="mb-6 mr-4">
                <label className="block text-[20px] font-Archivo font-normal text-[#171A1F] mb-2">Phone number</label>
                <p className="text-sm text-[#565E6D] mb-2">
                  Pastikan nomor Anda benar agar klien dapat menghubungi Anda dengan mudah.
                </p>
                <p className='text-[#424956] font-semibold text-[16px] mb-1'>Phone Number</p>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+XX-XXX-XXX-XXXX"
                  className="w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
                />
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
      case 'paymentAccount':
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Payment Account</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Real-time information and activities of your prototype.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
            {/* Payment Phone Number */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">Status Akun</label>
              <p className='text-[#424956] font-semibold text-[16px] mb-1'>Terhubung dengan nomor :</p>
              <input
                type="text"
                value={paymentPhoneNumber}
                onChange={(e) => setPaymentPhoneNumber(e.target.value)}
                placeholder="+XX-XXX-XXX-XXXX"
                className="w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm"
              />
            </div>

            {/* Button */}
            <div className=''>
              {/* Change Account Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 mr-10 cursor-pointer"
                onClick={handleChangeAccount}
              >
                Ganti Akun
              </button>
              {/* Disconnect Account Button */}
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                onClick={handleDisconnectAccount}
              >
                Putuskan Koneksi
              </button>
            </div>
          </div>
        );
      case 'accountSecurity':
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Account Security</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Pastikan akun Anda tetap aman dengan mengatur preferensi keamanan di sini.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>
            {/* Change Password */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">Change Password</label>

              {/* Current Password Input */}
              <p className='text-[#424956] font-semibold text-[16px] mb-1'>Current Password :</p>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm mb-3"
              />

              {/* New Password Input */}
              <p className='text-[#424956] font-semibold text-[16px] mb-1'>New Password :</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm mb-3"
              />

              {/* Confirm New Password Input */}
              <p className='text-[#424956] font-semibold text-[16px] mb-1'>Confirm Password :</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-1/2 h-[50px] border border-[#ACACAC] px-3 py-2 text-sm mb-3"
              />
              {/* Save Password Button */}
              <div>
                <button
                  className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                  onClick={handleSavePassword}
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">Manage Account</label>
            {/* Manage Account Button */}
            <div className=''>
              <button
                className="bg-[#565E6D] w-[190px] text-white text-[16px] px-6 py-2 mr-10 cursor-pointer"
                onClick={handleLogOut}
              >
                Log out
              </button>
              <button
                className="bg-[#565E6D]  w-[190px] text-white text-[16px] px-6 py-2 cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>

          </div>
        );
      case 'languages':
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Languages</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Atur bahasa tampilan sesuai dengan preferensi Anda.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Change Language Dropdown */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-2">Change Language</label>
              <p className='text-[#424956] font-semibold text-[16px] mb-1'>Current Language :</p>

              {/* Custom Dropdown */}
              <div className="relative inline-block w-1/2" ref={dropdownRef}>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)

                  }
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
                    className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
      case 'pushNotification':
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Push notification</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Sesuaikan preferensi notifikasi agar tetap mendapatkan informasi penting.
            </p>

            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Notification Preferences */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-4">Notification Preferences</label>

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
                    <label
                      htmlFor={pref.id}
                      className="text-[14px] text-[#444444] cursor-pointer"
                    >
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
      case 'clearCache':
        return (
          <div>
            <h1 className="font-Archivo font-semibold text-[24px] mb-2">Clear Cache</h1>
            <p className="font-inter text-[16px] text-[#565E6D] mb-6">
              Bersihkan data cache agar aplikasi berjalan lebih lancar.
            </p>
            <div className="border-t border-[#ACACAC] w-full mb-6"></div>

            {/* Cache Options */}
            <div className="mb-6 mr-4">
              <label className="block text-[24px] font-Archivo font-normal text-[#171A1F] mb-4">Clear my cache</label>

              {/* Checkbox Group */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="clearImageCache"
                    checked={cacheOptions.clearImageCache}
                    onChange={() => handleCacheOptionChange('clearImageCache')}
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
                    onChange={() => handleCacheOptionChange('clearSessionData')}
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
                    onChange={() => handleCacheOptionChange('clearSavedPreferences')}
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
      case 'helpCenter':
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
                    <h3 className="font-Archivo font-semibold text-[18px]">
                      {item.question}
                    </h3>
                    <img
                      src={downArrow}
                      alt="Expand"
                      className={`w-5 h-5 transition-transform duration-300 ${expandedItem === index ? 'rotate-180' : ''
                        }`}
                    />
                  </div>

                  {/* Content - Expandable */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedItem === index
                    ? 'max-h-96 opacity-100 pb-4'
                    : 'max-h-0 opacity-0'
                    }`}>
                    <p className="text-[16px] text-[#171A1F]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'privacyPolicy':
        return <div>Privacy Policy Content</div>;
      case 'aboutApp':
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
                B-Connect adalah platform digital yang dirancang untuk menghubungkan para freelancer profesional dengan klien secara cepat dan efisien. Aplikasi ini membantu mempertemukan talenta terbaik dengan proyek-proyek yang sesuai, baik dalam bidang teknologi, desain, pemasaran, dan lainnya.
              </p>
            </div>
            <div className="border-t border-[#ACACAC] w-full mb-1 mt-4"></div>
          </div>
        );
      case 'termsConditions':
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
            <h3 className="text-[12px] font-semibold text-[#171A1F] mb-2 font-Archivo">Personal Info</h3>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'personalData' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('personalData')}
            >
              <img src={PersonalData} alt="Personal Data" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'personalData' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                Personal Data
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'paymentAccount' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('paymentAccount')}
            >
              <img src={PaymentAcc} alt="Payment Account" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'paymentAccount' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                Payment Account
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'accountSecurity' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('accountSecurity')}
            >
              <img src={AccSecurity} alt="Account Security" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'accountSecurity' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
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
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'languages' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('languages')}
            >
              <img src={Language} alt="Languages" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'languages' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                Languages
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'pushNotification' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('pushNotification')}
            >
              <img src={PushNotification} alt="Push Notification" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'pushNotification' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                Push Notification
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'clearCache' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('clearCache')}
            >
              <img src={ClearCache} alt="Clear Cache" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'clearCache' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
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
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'helpCenter' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('helpCenter')}
            >
              <img src={HelpCenter} alt="Help Center" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'helpCenter' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                Help Center
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'privacyPolicy' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('privacyPolicy')}
            >
              <img src={PrivacyPolicy} alt="Privacy Policy" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'privacyPolicy' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                Privacy Policy
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'aboutApp' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('aboutApp')}
            >
              <img src={aboutApp} alt="About App" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'aboutApp' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
                  }`}
              >
                About App
              </span>
            </div>
            <div
              className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-200 ${activeContent === 'termsConditions' ? 'bg-[#DFDFDF]' : ''}`}
              onClick={() => setActiveContent('termsConditions')}
            >
              <img src={TermsCondition} alt="Terms & Conditions" className="w-5 h-5 mr-3" />
              <span
                className={`text-[12px] ${activeContent === 'termsConditions' ? 'font-semibold text-[#171A1F]' : 'font-normal text-[#565E6D]'
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