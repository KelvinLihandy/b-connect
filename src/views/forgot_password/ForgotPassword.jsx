import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bg_left from "../../assets/bg_image_left.svg"
import bg_right from "../../assets/bg_image_right.svg"
import bg_dots from "../../assets/bg_dots.svg"
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { EmailContext } from '../../contexts/EmailContext'

const ForgotPassword = () => {
  const { email, setEmail } = useContext(EmailContext);
  const [emailMessage, setEmailMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(email)) {
      setEmailMessage("Not a valid email format")
      return;
    }
    else {
      setIsLoading(true);
      await axios.post(`${authAPI}/send-otp`, {
        email: email
      })
        .then(response => {
          console.log(response.data);
          navigate(response.data.redirectUrl, { replace: true }); //go to InputOTP.jsx
        })
        .catch(error => {
          console.error('Error send otp:', error.response);
        });
      setIsLoading(false);
    }
    console.log("send = ", email);
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

      <div className='w-2xl max-h-3/4 p-8 bg-[#F3F3F3] rounded-lg flex flex-col gap-10 justify-around z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-extrabold text-[#333333] mb-6 font-Archivo'>
            Forget your password?
          </h1>
          <p className='text-[#333333] font-Archivo text-2xl'>
            Please enter the email address you'd like your password to be reset
          </p>
        </div>

        <div className='mb-8 font-poppins text-[#666666] '>
          <label className='block text-xl font-medium mb-1'
            htmlFor='email' >
            Enter Email Address
          </label>
          <input
            className='w-full px-4 py-3 text-lg border border-[#66666659] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            type='email'
            id='email'
            placeholder='emailAddress@gmail.com'
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className='text-red-400'>
            {emailMessage}
          </label>
        </div>
        <div className='flex flex-col justify-center gap-5'>
          <button className={`w-3/4 py-3 px-4 border rounded-full self-center h-15 text-lg text-gray-800 font-medium ${!isLoading && 'hover:bg-white'}  mb-4 cursor-pointer`}
            onClick={() => sendOTP(email)}
            disabled={isLoading}
          >
            Request reset OTP
          </button>
          <div className='text-center'>
            <Link className='text-xl font-poppins text-[#004B90] hover:text-[#0073E6]' to='/sign-in'>
              Back To Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword