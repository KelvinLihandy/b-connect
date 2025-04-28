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

const ChangePassword = () => {
  const [showPass, setShowPass] = useState(false)
  const [password, setPassword] = useState("");
  const [passwordComf, setPasswordConf] = useState("");
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
    if (password !== passwordComf) return;
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
          <h1 className='text-4xl font-extrabold text-[#333333] mb-2 font-Archivo'>
            Change Password
          </h1>
          <p className='text-[#333333] font-Archivo text-2xl'>
            {localStorage.getItem("email")}
          </p>
        </div>

        <div className='font-poppins'>
          <div className='flex flex-col gap-2 mb-8'>
            <div className='flex flex-row justify-between'>
              <label className='text-[#666666] text-xl font-medium'>
                New Password
              </label>
              <div className='flex flex-row gap-4 cursor-pointer select-none'
                onClick={switchEye}>
                <img className='h-5 self-center opacity-80'
                  src={showPass ? password_show : password_hide} />
                <p className='text-[#666666] text-xl'>
                  Hide
                </p>
              </div>
            </div>
            <input
              className='w-full px-4 py-3 text-lg border border-[#66666659] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              type={showPass ? "text" : "password"}
              id='password'
              placeholder='New Password'
              onChange={(event) => setPassword(event.target.value)}
            />
            {!validatePassword(password) &&
              <p className='text-red-400 text-base text-wrap'>
                Use 8 or more characters with a mix of upper & lowercase letters, numbers & symbols (@ $ ! % * ? &)
              </p>
            }
          </div>
          <div className='flex flex-col gap-2 mb-8'>
            <div className='flex flex-row justify-between'>
              <label className='text-[#666666] text-xl font-medium'>
                Confirm Password
              </label>
            </div>
            <input
              className='w-full px-4 py-3 text-lg border border-[#66666659] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              type="password"
              id='passwordConf'
              placeholder='Confirmation Password'
              onChange={(event) => setPasswordConf(event.target.value)}
            />
            {!validatePassword(passwordComf) &&
              <p className='text-red-400 text-base text-wrap'>
                Use 8 or more characters with a mix of upper & lowercase letters, numbers & symbols (@ $ ! % * ? &)
              </p>
            }
          </div>
        </div>

        <div className='flex flex-col justify-center gap-5'>
          <button className={`w-3/4 py-3 px-4 border rounded-full self-center h-15 text-lg text-gray-800 font-medium ${!isLoading && 'hover:bg-white'}  mb-4 cursor-pointer`}
            onClick={() => ChangePassword(password, passwordComf)}
            disabled={isLoading}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword