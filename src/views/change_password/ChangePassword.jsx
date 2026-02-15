import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bg_left from "../../assets/bg_image_left.svg"
import bg_right from "../../assets/bg_image_right.svg"
import bg_dots from "../../assets/bg_dots.svg"
import password_hide from "../../assets/eye_off.svg"
import password_show from "../../assets/eye_on.svg"
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { EmailContext } from '../../contexts/EmailContext'
import { CircularProgress } from '@mui/material'

const ChangePassword = () => {
  const [showPass, setShowPass] = useState(false)
  const [password, setPassword] = useState("");
  const [passwordComf, setPasswordConf] = useState("");
  const [differentError, setDifferentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email, setEmail } = useContext(EmailContext);
  const otpToken = localStorage.getItem('otpToken');
  const navigate = useNavigate();

  const switchEye = () => {
    setShowPass((showPass) => !showPass)
  }

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return false;
    }
    return true;
  };

  const ChangePassword = async (password, passwordComf) => {
    if (password !== passwordComf) {
      setDifferentError("Passsword and Konfirmasi harus sama");
      return;
    }
    console.log(email);
    setIsLoading(true);
    await axios.post(`${authAPI}/change-password`, {
      email: email,
      password: password,
      passwordConf: passwordComf
    },
      {
        headers: {
          Authorization: `Bearer ${otpToken}`
        }
      })
      .then(response => {
        console.log(response.data);
        navigate('/sign-in', { replace: true });
        localStorage.removeItem('otpToken');
      })
      .catch(error => {
        console.error('Error change password:', error.response);
      });
    setIsLoading(false);
  }


  return (
    <div className='min-h-screen bg-white flex items-center justify-center relative p-4'>
      <img
        className='fixed w-12 h-auto sm:w-[68px] sm:h-[50.216px] top-6 left-6 sm:top-[42.7px] sm:left-[47.4px]'
        src={bg_dots}
        alt="background dots"
      />
      <img
        className='fixed w-12 h-auto sm:w-[68px] sm:h-[50.216px] bottom-6 right-6 sm:bottom-[40.7px] sm:right-[50.216px]'
        src={bg_dots}
        alt="background dots"
      />
      <img
        className='hidden lg:block fixed bottom-[200px] left-0 sm:left-[2.5%] md:left-[5%] lg:left-[10%] w-64 h-auto sm:size-80'
        src={bg_left}
        alt="background left"
      />
      <img
        className='hidden lg:block fixed bottom-[200px] right-0 sm:right-[2.5%] md:right-[5%] lg:right-[10%] w-64 h-auto sm:size-80'
        src={bg_right}
        alt="background right"
      />

      <div className='w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-8 bg-[#F3F3F3] rounded-lg flex flex-col gap-6 sm:gap-10 justify-around z-10 shadow-lg'>
        <div className='text-center mb-4 sm:mb-8'>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-[#333333] mb-2 font-Archivo'>
            Change Password
          </h1>
          <p className='text-[#333333] font-Archivo text-lg sm:text-2xl break-words'>
            {localStorage.getItem("email")}
          </p>
        </div>

        <div className='font-poppins'>
          <div className='flex flex-col gap-2 mb-6 sm:mb-8'>
            <div className='flex flex-row justify-between items-center'>
              <label className='text-[#666666] text-base sm:text-xl font-medium'>
                New Password
              </label>
              <div className='flex flex-row gap-2 sm:gap-4 cursor-pointer select-none'
                onClick={switchEye}>
                <img className='h-5 self-center opacity-80'
                  src={showPass ? password_show : password_hide} 
                  alt="toggle password visibility"
                />
                <p className='text-[#666666] text-base sm:text-xl'>
                  Hide
                </p>
              </div>
            </div>
            <input
              className='w-full px-4 py-3 text-base sm:text-lg border border-[#66666659] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              type={showPass ? "text" : "password"}
              id='password'
              placeholder='New Password'
              onChange={(event) => setPassword(event.target.value)}
            />
            {!validatePassword(password) && password.length > 0 &&
              <p className='text-red-400 text-xs sm:text-base text-wrap'>
                Use 8 or more characters with a mix of upper & lowercase letters, numbers & symbols (@ $ ! % * ? &)
              </p>
            }
            {differentError &&
              <p className='text-red-400 text-xs sm:text-base text-wrap'>
                {differentError}
              </p>
            }
          </div>
          <div className='flex flex-col gap-2 mb-6 sm:mb-8'>
            <div className='flex flex-row justify-between'>
              <label className='text-[#666666] text-base sm:text-xl font-medium'>
                Confirm Password
              </label>
            </div>
            <input
              className='w-full px-4 py-3 text-base sm:text-lg border border-[#66666659] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              type="password"
              id='passwordConf'
              placeholder='Confirmation Password'
              onChange={(event) => {
                setPasswordConf(event.target.value);
                if (password !== event.target.value) {
                  setDifferentError("Passwords do not match");
                } else {
                  setDifferentError("");
                }
              }}
            />
            {!validatePassword(passwordComf) && passwordComf.length > 0 &&
              <p className='text-red-400 text-xs sm:text-base text-wrap'>
                Use 8 or more characters with a mix of upper & lowercase letters, numbers & symbols (@ $ ! % * ? &)
              </p>
            }
          </div>
        </div>

        <div className='flex flex-col justify-center gap-5'>
          <button className={`w-full sm:w-3/4 py-3 px-4 border rounded-full self-center h-auto sm:h-15 text-lg text-gray-800 font-medium ${!isLoading ? 'hover:bg-white' : 'cursor-not-allowed bg-gray-200'} mb-4 cursor-pointer transition-colors duration-200`}
            onClick={() => ChangePassword(password, passwordComf)}
            disabled={isLoading || !validatePassword(password) || password !== passwordComf}
          >
            {isLoading ?
              <CircularProgress size={24} color='inherit' />
              :
              "Change Password"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword