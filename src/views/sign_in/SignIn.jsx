import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import "./SignIn.css"
import password_hide from "../../assets/eye_off.svg"
import password_show from "../../assets/eye_on.svg"
// import facebook from "../../assets/facebook_logo.svg"
// import google from "../../assets/google_logo.svg"
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
		<div className='min-h-screen bg-white flex items-center justify-center relative px-4 py-10'>
			<div className='absolute inset-0 -z-10 pointer-events-none select-none'>
				<img
					className='fixed w-12 h-auto sm:w-[68px] sm:h-[50.216px] top-6 left-6 sm:top-[42.7px] sm:left-[47.4px]'
					src={bg_dots}
					alt="decorative"
				/>
				<img
					className='fixed w-12 h-auto sm:w-[68px] sm:h-[50.216px] bottom-6 right-6 sm:bottom-[40.7px] sm:right-[50.216px]'
					src={bg_dots}
					alt="decorative"
				/>
				<img
					className='hidden lg:block fixed bottom-[200px] left-0 sm:left-[2.5%] md:left-[5%] lg:left-[10%] w-80 h-auto opacity-70'
					src={bg_left}
					alt="decorative"
				/>
				<img
					className='hidden lg:block fixed bottom-[200px] right-0 sm:right-[2.5%] md:right-[5%] lg:right-[10%] w-80 h-auto opacity-70'
					src={bg_right}
					alt="decorative"
				/>
			</div>

			<div className='w-full max-w-md md:max-w-xl bg-[#F3F3F3] rounded-2xl p-6 md:p-10 shadow-sm z-10'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl md:text-4xl font-extrabold text-[#111111] font-Archivo'>Sign in</h1>
					<p className='mt-2 text-[#666666] font-poppins'>Welcome back to B-Connect</p>
				</div>

				<div className='font-poppins flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<label className='text-[#666666] text-base md:text-lg'>Email address</label>
						<input
							className='form-input bg-white text-base h-12 w-full px-4'
							type='email'
							onChange={(event) => setEmail(event.target.value)}
						/>
					</div>

					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between items-center'>
							<label className='text-[#666666] text-base md:text-lg'>Password</label>
							<button
								type="button"
								className='flex flex-row gap-2 items-center cursor-pointer select-none text-[#666666]'
								onClick={switchEye}
							>
								<img
									className='h-5 w-auto opacity-80'
									src={showPass ? password_show : password_hide}
									alt="toggle password"
								/>
								<span className='text-base md:text-lg'>{showPass ? 'Hide' : 'Show'}</span>
							</button>
						</div>
						<input
							className='form-input bg-white text-base h-12 w-full px-4'
							type={showPass ? 'text' : 'password'}
							onChange={(event) => setPassword(event.target.value)}
						/>
						<div className='flex justify-between items-center mt-2'>
							<label className="flex items-center gap-3">
								<input
									type="checkbox"
									checked={isChecked}
									onChange={handleCheckboxChange}
									className="w-5 h-5 accent-black border-gray-300 rounded focus:ring-black"
								/>
								<span className="text-[#666666] font-medium text-sm md:text-base">Remember me</span>
							</label>
							<Link to="/sign-in/forget" className='text-sm md:text-base underline text-[#111111] hover:text-[#2E5077]'>
								Forget password
							</Link>
						</div>
					</div>

					<button
						className='mt-2 bg-[#2E5077] text-base md:text-lg text-white font-semibold w-full rounded-full h-12 md:h-14 transition hover:bg-[#25425f] disabled:opacity-70'
						disabled={isLoading}
						onClick={() => {
							setIsLoading(true);
							login();
						}}
					>
						{isLoading ? <CircularProgress color='inherit' size={24} /> : 'Sign In'}
					</button>

					{errorMessage && (
						<p className='text-red-400 text-sm md:text-base text-center'>{errorMessage}</p>
					)}

					<div className='mt-6 pt-6 border-t border-black/10 text-center'>
						<p className='text-[#333333] text-lg md:text-xl font-medium'>Don't have an account?</p>
						<button
							type="button"
							className='mt-3 bg-white text-[#111111] text-base md:text-lg font-semibold w-full rounded-full h-12 md:h-14 border border-black hover:bg-gray-50'
							onClick={() => navigate('/sign-up')}
						>
							Create account
						</button>
						<Link to="/home" className='inline-block mt-3 text-[#2E90EB] text-base font-medium hover:text-[#1d6fb8]'>
							Back to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SignIn