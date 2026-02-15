import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import "./SignIn.css"
import password_hide from "../../assets/eye_off.svg"
import password_show from "../../assets/eye_on.svg"
// import facebook from "../../assets/facebook_logo.svg"
import google from "../../assets/google_logo.svg"
// import apple from "../../assets/apple_logo.svg"
import bg_left from "../../assets/bg_image_left.svg"
import bg_right from "../../assets/bg_image_right.svg"
import bg_dots from "../../assets/bg_dots.svg"
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { CircularProgress } from '@mui/material'
import { RememberContext } from '../../contexts/RememberContext'

const SignIn = () => {
	const [showPass, setShowPass] = useState(false)
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const { auth, getAuth } = useContext(AuthContext);
	const { setRemember } = useContext(RememberContext);
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate();

	const handleCheckboxChange = () => {
		setIsChecked(!isChecked);
	}
	const switchEye = () => {
		setShowPass((showPass) => !showPass)
	}

	const login = async () => {
		try {
			const response = await axios.post(`${authAPI}/login`, {
				email: email,
				password: password,
				remember: isChecked
			},
				{ withCredentials: true }
			);
			setRemember(isChecked);
			await getAuth();
			navigate("/catalog");
		} catch (error) {
			console.error('Error login:', error);
			setErrorMessage(error.response.data.error)
		}
		setIsLoading(false);
	};

	return (
		<div className='flex flex-col items-center justify-center justify-items-center h-screen'>
			<div className='font-poppins relative text-center gap-4 item-center mt-5 mb-5 px-4'>
				<p className='text-2xl md:text-3xl font-semibold'>Sign in</p>
			</div>
			<div className='font-poppins inline-flex flex-col gap-4 items-center mb-8 w-full px-4 md:px-0'>
				<div className='flex flex-col gap-1'>
					<label className='text-[#666666] text-lg'>
						Email address
					</label>
					<input className='form-input text-base h-12 w-full md:min-w-140 md:max-w-170 px-5'
						type='text'
						placeholder=''
						onChange={(event) => setEmail(event.target.value)}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<div className='flex flex-row justify-between w-full md:min-w-140 md:max-w-170'>
						<label className='text-[#666666] text-lg'>
							Password
						</label>
						<div className='flex flex-row gap-2 cursor-pointer'
							onClick={switchEye}
						>
							<img className='h-5 self-center opacity-80'
								src={showPass ? password_show : password_hide}
							/>
							<p className='text-[#666666] text-lg'>
								Hide
							</p>
						</div>
					</div>
					<input className='form-input text-base h-12 w-full md:min-w-140 md:max-w-170 px-5'
						type={showPass ? "text" : "password"}
						placeholder=''
						onChange={(event) => setPassword(event.target.value)}
					>
					</input>
					<div className='flex justify-end text-right'>
						<Link to="/sign-in/forget">
							<span className=' text-[#111111] text-base font-normal underline'>
								Forget your password
							</span>
						</Link>
					</div>


					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={isChecked}
							onChange={handleCheckboxChange}
							className="w-5 h-5 accent-black border-gray-300 rounded focus:ring-black"
						/>
						<span className="text-[#666666] font-medium text-base">
							Remember me
						</span>
					</label>
				</div>
				<div className='mt-3 mb-3'>
					<button className='bg-[#111111]/25 text-lg md:text-xl text-white font-bold w-full md:min-w-140 md:max-w-170 rounded-4xl min-h-14 transition cursor-pointer hover:text-black hover:opacity-90'
						onClick={() => {
							setIsLoading(true);
							login()
						}
						}
					>
						{isLoading ?
							<CircularProgress color='inherit' />
							:
							"Sign In"
						}
					</button>
					{
						<p className='text-red-400 text-base text-wrap text-center'>
							{errorMessage}
						</p>
					}
				</div>

				<div className="mt-5 mb-5 flex w-full md:w-[560px] items-center relative flex-[0_0_auto]">
					<div className="relative flex-1 grow h-0.5 bg-[#66666640]" />
				</div>

				<div className=''>
					<p className='text-[#333333] text-2xl font-medium'>
						Don't have an account?</p>
				</div>
				<button
					className='bg-[#FFFFFF] text-black text-lg md:text-xl font-medium w-full md:min-w-140 md:max-w-170 rounded-4xl border border-black min-h-14 transition cursor-pointer hover:bg-gray-100 hover:text-black/50'
					onClick={() => navigate("/sign-up")}>
					Sign Up
				</button>
				<Link to="/home" className='text-blue-500 text-lg font-medium hover:text-blue-800 p-3'>
					Back to Home
				</Link>
			</div>
			<div className='absolute -z-[100] w-screen'>
				<img
					className='fixed w-[300px] h-[200px] top-[250px] left-0 sm:left-[2.5%] md:left-[5%] lg:left-[10%]'
					src={bg_left}
				/>
				<img
					className='fixed w-[300px] h-[200px] top-[75px] right-0 sm:right-[25.%] md:right-[5%] lg:right-[10%]'
					src={bg_right}
				/>
				<img
					className='fixed w-[68px] h-[50.216px] top-[42.7px] left-[47.4px]'
					src={bg_dots}
				/>
				<img
					className='fixed w-[68px] h-[50.216px] bot-[40.7px] bottom-[40.7px] right-[50.216px]'
					src={bg_dots}
				/>
			</div>
		</div>
	)
}

export default SignIn