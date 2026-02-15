import React, { useContext, useEffect, useState } from 'react'
import { Link, replace, useNavigate, useSearchParams } from 'react-router-dom'
import bg_left from "../../assets/bg_image_left.svg"
import bg_right from "../../assets/bg_image_right.svg"
import bg_dots from "../../assets/bg_dots.svg"
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { EmailContext } from '../../contexts/EmailContext'
import { CircularProgress } from '@mui/material'

const InputOTP = () => {
  const [params] = useSearchParams();
  const [OTPinput, setOTPinput] = useState([null, null, null, null, null, null]);
  const [isLoading, setIsLoading] = useState(false);
  const token = params.get("token");
  const navigate = useNavigate();
  const { email, setEmail } = useContext(EmailContext);
  const storedExpiry = localStorage.getItem("otpExpiry");
  const storedInterval = localStorage.getItem("otpInterval");
  const initialTimeOtpLeft = storedExpiry ? Math.max(0, Math.floor((+storedExpiry - Date.now()) / 1000)) : 5 * 60;
  const initialTimeReqLeft = storedInterval ? Math.max(0, Math.floor((+storedInterval - Date.now()) / 1000)) : 10;
  const [errorMessage, setErrorMessage] = useState("");
  const [timeOtpLeft, setTimeOtpLeft] = useState(initialTimeOtpLeft);
  const [timeReqLeft, setTimeReqLeft] = useState(initialTimeReqLeft);

  useEffect(() => {
    if (timeOtpLeft <= 0) {
      localStorage.removeItem("otpExpiry");
      return;
    }
    const timer = setInterval(() => {
      setTimeOtpLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOtpLeft]);

  useEffect(() => {
    if (timeReqLeft <= 0) {
      localStorage.removeItem("otpInterval");
      return;
    }
    const timer = setInterval(() => {
      setTimeReqLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeReqLeft]);

  useEffect(() => {
    const removeStorageItems = () => {
      localStorage.removeItem("otpExpiry");
      localStorage.removeItem("otpInterval");
    };

    window.addEventListener("beforeunload", removeStorageItems);

    return () => {
      window.removeEventListener("beforeunload", removeStorageItems);
      removeStorageItems();
    };
  }, []);

  useEffect(() => {
    if (!storedExpiry) {
      localStorage.setItem("otpExpiry", Date.now() + 5 * 60 * 1000);
    }
    if (!storedInterval) {
      localStorage.setItem("otpInterval", Date.now() + 10 * 1000);
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const resend = async (token) => {
    if (timeReqLeft > 0) return;
    setIsLoading(true);
    await axios.post(`${authAPI}/resend-otp`, {
      token: token,
      email: email
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error resend otp:', error.response);
        setErrorMessage(error.response.data.error);
      });
    setIsLoading(false);
  }

  const verifyOTP = async (token) => {
    const otpParse = parseInt(OTPinput.join(""));
    if (OTPinput.includes(null) || OTPinput.includes("")) {
      console.log(otpParse);
      return;
    }
    setIsLoading(true);
    await axios.post(`${authAPI}/verify-otp`, {
      token: token,
      otp: otpParse
    })
      .then(response => {
        console.log(response.data);
        localStorage.setItem('otpToken', response.data.otp);
        navigate('/sign-in/change-password', { replace: true });
      })
      .catch(error => {
        console.error('Error verify otp:', error.response);
        setErrorMessage(error.response.data.error);
        console.log(otpParse);
      });
    setIsLoading(false);
  }

  return (
    <div className='min-h-screen bg-white flex items-center justify-center relative'>
      <img
        className='fixed w-[68px] h-[50.216px] top-[42.7px] left-[47.4px]'
        src={bg_dots}
      />
      <img
        className='fixed w-[68px] h-[50.216px] bot-[40.7px] bottom-[40.7px] right-[50.216px]'
        src={bg_dots}
      />
      <img
        className='fixed bottom-[200px] left-0 sm:left-[2.5%] md:left-[5%] lg:left-[10%] size-80'
        src={bg_left}
      />
      <img
        className='fixed bottom-[200px] right-0 sm:right-[25.%] md:right-[5%] lg:right-[10%] size-80'
        src={bg_right}
      />

      <div className='w-full mx-4 md:w-2xl max-h-3/4 p-4 md:p-8 bg-[#F3F3F3] rounded-lg flex flex-col gap-8 md:gap-15 justify-around z-10'>
        <div className='text-center'>
          <h1 className='text-2xl md:text-4xl font-extrabold text-[#333333] mb-4 md:mb-6 font-Archivo'>
            Verify Email
          </h1>
          <p className='text-[#333333] font-Archivo text-lg md:text-2xl px-2 md:px-0'>
            We have sent an OTP code to your email {email}
          </p>
          <p className='text-[#333333] font-Archivo text-lg md:text-2xl pt-3'>
            {formatTime(timeOtpLeft)}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-[280px] md:max-w-md gap-2 md:gap-4">
          <div className="w-16 h-16 ">
            <input
              maxLength="1"
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              name=""
              id=""
              onChange={(e) =>
                setOTPinput([
                  e.target.value,
                  OTPinput[1],
                  OTPinput[2],
                  OTPinput[3],
                  OTPinput[4],
                  OTPinput[5],
                ])
              }
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              maxLength="1"
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              name=""
              id=""
              onChange={(e) =>
                setOTPinput([
                  OTPinput[0],
                  e.target.value,
                  OTPinput[2],
                  OTPinput[3],
                  OTPinput[4],
                  OTPinput[5],
                ])
              }
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              maxLength="1"
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              name=""
              id=""
              onChange={(e) =>
                setOTPinput([
                  OTPinput[0],
                  OTPinput[1],
                  e.target.value,
                  OTPinput[3],
                  OTPinput[4],
                  OTPinput[5],
                ])
              }
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              maxLength="1"
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              name=""
              id=""
              onChange={(e) =>
                setOTPinput([
                  OTPinput[0],
                  OTPinput[1],
                  OTPinput[2],
                  e.target.value,
                  OTPinput[4],
                  OTPinput[5],
                ])
              }
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              maxLength="1"
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              name=""
              id=""
              onChange={(e) =>
                setOTPinput([
                  OTPinput[0],
                  OTPinput[1],
                  OTPinput[2],
                  OTPinput[3],
                  e.target.value,
                  OTPinput[5],
                ])
              }
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              maxLength="1"
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              name=""
              id=""
              onChange={(e) =>
                setOTPinput([
                  OTPinput[0],
                  OTPinput[1],
                  OTPinput[2],
                  OTPinput[3],
                  OTPinput[4],
                  e.target.value,
                ])
              }
            />
          </div>
        </div>

        <div className='flex flex-col justify-center gap-5'>
          <button className='w-full md:w-3/4 py-3 px-4 border rounded-full self-center h-12 md:h-15 text-base md:text-lg text-gray-800 font-medium hover:bg-white mb-4 cursor-pointer'
            onClick={() => verifyOTP(token)}
            disabled={isLoading}
          >
            {isLoading ?
              <CircularProgress color='inherit' />
              :
              "Verify"
            }
          </button>
          {
            <p className='text-red-400 text-base text-wrap text-center'>
              {errorMessage}
            </p>
          }
          <div className='text-center flex flex-col gap-2'>
            <p>
              Received no email?&nbsp;
              <span className='underline cursor-pointer'
                onClick={() => resend(token)}
                disabled={isLoading}
              >
                Resend in {timeReqLeft}
              </span>
            </p>
            <Link className='text-base md:text-xl font-poppins text-[#004B90] hover:text-[#0073E6]' to='/sign-in'>
              Back To Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputOTP