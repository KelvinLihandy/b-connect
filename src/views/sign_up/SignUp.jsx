import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import "./SignUp.css"
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
import { CircularProgress } from '@mui/material'

const SignUp = () => {
	const [showPass, setShowPass] = useState(false)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [hideReq, setHideReq] = useState(false);
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const switchEye = () => {
		setShowPass((showPass) => !showPass)
	}

	const validateEmail = (email) => {
		const rfcEmailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z\-0-9]*[a-zA-Z0-9]:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f])\]))$/;
		if (!rfcEmailRegex.test(email)) return false;
		else return true;
	}

	const validatePassword = (password) => {
		const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!regex.test(password)) {
			return false;
		}
		return true;
	};

	const register = async () => {
		console.log(name);
		console.log(email);
		console.log(password);
		await axios.post(`${authAPI}/register`, {
			name: name,
			email: email,
			password: password
		})
			.then(response => {
				console.log(response.data);
				alert("Success Sign Up");
				navigate('/sign-in', { replace: true });
			})
			.catch(error => {
				console.error('Error register:', error.response);
				setErrorMessage(error.response.data.error)
			});
		setIsLoading(false);
	}

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
					<h1 className='text-3xl md:text-4xl font-extrabold text-[#111111] font-Archivo'>Create an account</h1>
					<p className='mt-2 text-[#666666] font-poppins text-sm md:text-base'>
						Already have an account?{' '}
						<Link to="/sign-in" className='underline hover:text-[#2E5077]'>Log in</Link>
					</p>
					<Link to="/home" className='inline-block mt-2 text-[#2E90EB] text-sm md:text-base font-medium hover:text-[#1d6fb8]'>
						Back to Home
					</Link>
				</div>

				<div className='font-poppins flex flex-col gap-5'>
					<div className='flex flex-col gap-1'>
						<label className='text-[#666666] text-base md:text-lg'>What should we call you?</label>
						<input
							className='form-input bg-white text-base h-12 w-full px-4'
							type='text'
							placeholder='Enter your profile name'
							onChange={(event) => setName(event.target.value)}
						/>
					</div>

					<div className='flex flex-col gap-1'>
						<label className='text-[#666666] text-base md:text-lg'>What's your email?</label>
						<input
							className='form-input bg-white text-base h-12 w-full px-4'
							type='email'
							placeholder='Enter your email address'
							onChange={(event) => setEmail(event.target.value)}
						/>
						{!!email && !validateEmail(email) && (
							<p className='text-red-400 text-sm md:text-base'>Format email tidak valid</p>
						)}
					</div>

					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between items-center'>
							<label className='text-[#666666] text-base md:text-lg'>Create a password</label>
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
							placeholder='Enter your password'
							onChange={(event) => setPassword(event.target.value)}
						/>
						{!!password && !validatePassword(password) && (
							<p className='text-red-400 text-sm md:text-base'>
								Use 8+ characters with upper & lowercase, numbers & symbols (@ $ ! % * ? &)
							</p>
						)}
					</div>

					<label className="text-sm md:text-base text-[#333333]">
						By creating an account, you agree to the{' '}
						<a
							href="/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-[#2E5077]"
						>
							Privacy Policy
						</a>.
					</label>

					<button
						className='mt-1 bg-[#2E5077] text-base md:text-lg text-white font-semibold w-full rounded-full h-12 md:h-14 transition hover:bg-[#25425f] disabled:opacity-70'
						disabled={isLoading || !name.trim() || !validateEmail(email) || !validatePassword(password)}
						onClick={() => {
							setIsLoading(true);
							register();
						}}
					>
						{isLoading ? <CircularProgress color='inherit' size={24} /> : 'Sign Up'}
					</button>

					{errorMessage && (
						<p className='text-red-400 text-sm md:text-base text-center'>{errorMessage}</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default SignUp