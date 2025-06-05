import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import "./SignUp.css"
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
		<div className='flex flex-col justify-center items-center min-h-screen'>
			<div className='absolute -z-[100] w-screen'>
				<img
					className='fixed opacity-70 w-[300px] h-[200px] top-[250px] left-0 sm:left-[2.5%] md:left-[5%] lg:left-[10%]'
					src={bg_left}
				/>
				<img
					className='fixed opacity-70 w-[300px] h-[200px] top-[75px] right-0 sm:right-[25.%] md:right-[5%] lg:right-[10%]'
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

			<div className='py-5 flex flex-col justify-center items-center'>
				<div className='font-poppins flex flex-col gap-4 items-center'>
					<div className='flex flex-col gap-2 items-center mb-5'>
						<p className='text-4xl font-semibold'>
							Create an Account
						</p>
						<p className='text-base'>
							Already have an account?
							<span> </span>
							<Link to="/sign-in" >
								<span className='underline'>
									Log in
								</span>
							</Link>
						</p>
						<Link to="/home" className='text-blue-500 text-base font-medium hover:text-blue-800 p-2'>
							Back to Home
						</Link>
					</div>

					<div className='flex flex-col gap-10 min-w-180 max-w-200'>
						<div className='flex flex-col gap-2'>
							<label className='text-[#666666] text-lg'>
								What should we call you?
							</label>
							<input className='border form-input text-base h-12 px-5'
								type='text'
								placeholder='Enter your profile name'
								onChange={(event) => setName(event.target.value)}
							/>
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-[#666666] text-lg'>
								What's your email?
							</label>
							<input className='form-input text-base h-12 px-5'
								type='text'
								placeholder='Enter your email address'
								onChange={(event) => setEmail(event.target.value)}
							/>
							{!validateEmail(email) &&
								<p className='text-red-400 text-base text-wrap'>
									Format email tidak valid
								</p>
							}
						</div>

						<div className='flex flex-col gap-2 mb-8'>
							<div className='flex flex-row justify-between'>
								<label className='text-[#666666] text-lg'>
									Create a password
								</label>
								<div className='flex flex-row gap-4 cursor-pointer select-none'
									onClick={switchEye}>
									<img className='h-5 self-center opacity-80'
										src={showPass ? password_show : password_hide} />
									<p className='text-[#666666] text-lg'>
										Hide
									</p>
								</div>
							</div>
							<input className='form-input text-base h-12 px-5'
								type={showPass ? "text" : "password"}
								placeholder='Enter your password'
								onChange={(event) => setPassword(event.target.value)}
							/>
							{!validatePassword(password) &&
								<p className='text-red-400 text-base text-wrap'>
									Use 8 or more characters with a mix of upper & lowercase letters, numbers & symbols (@ $ ! % * ? &)
								</p>
							}
						</div>
					</div>
				</div>

				<div className='font-poppins flex flex-col justify-start min-w-180 max-w-200 gap-3 mb-8'>
					<label className="text-base">
						By creating an account, you agree to the
						<span> </span>
						<a
							href="/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
							className="underline"
						>
							Privacy Policy
						</a>.
					</label>
					<button className='text-lg bg-[#111111]/25 text-white font-bold rounded-full h-18 transition cursor-pointer hover:text-black hover:opacity-90'
						onClick={() => {
							setIsLoading(true);
							register()
						}}>
						{isLoading ?
							<CircularProgress color='inherit' />
							:
							"Sign Up"
						}
					</button>
					{
						<p className='text-red-400 text-base text-wrap text-center'>
							{errorMessage}
						</p>
					}
				</div>
			</div>
		</div >
	)
}

export default SignUp