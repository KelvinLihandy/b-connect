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

const SignUp = () => {
	const [showPass, setShowPass] = useState(false)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [hideReq, setHideReq] = useState(false);
	const navigate = useNavigate();

	const switchEye = () => {
		setShowPass((showPass) => !showPass)
	}

	const register = () => {
		console.log(name);
		console.log(email);
		console.log(password);
		axios.post(`${authAPI}/register`, {
			name: name,
			email: email,
			password: password
		})
			.then(response => {
				console.log(response.data);
				navigate('/login', {replace: true});
			})
			.catch(error => {
				console.error('Error register:', error);
			});
	}

	return (
		<div>
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

			<div className='flex flex-col justify-center items-center'>
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
					</div>

					<div className='h-4' />

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
							{password.length < 8 &&
								<p className='text-[#666666] text-base'>
									Use 8 or more characters with a mix of letters, numbers & symbols
								</p>
							}
						</div>
					</div>
				</div>

				<div className='font-poppins flex flex-col justify-start min-w-180 max-w-200 gap-3 mb-8'>
					<label className='text-base'>
						By creating an account, you agree to the
						<span> </span>
						<Link to="">
							<span className='underline'>
								Terms of Use
							</span>
						</Link>
						<span> </span>
						and
						<span> </span>
						<Link to="">
							<span className='underline'>
								Privacy Policy
							</span>
						</Link>
						.
					</label>
					<button className='text-lg bg-[#111111]/25 text-white font-bold rounded-full h-18 transition cursor-pointer hover:text-black hover:opacity-90'
						onClick={() => register()}>
						Create an account
					</button>
				</div>

				<div className='h-10' />

				<div className='flex flex-col gap-1 font-nunito min-w-180 max-w-200 items-center'>
					<label className='text-[#666666] text-2xl'>
						OR Continue with
					</label>
					<div className='flex flex-row justify-between'>
						{/* <button className='flex flex-row items-center gap-2 py-2 px-5 rounded-full border border-[#000000] min-w-40 justify-center hover:backdrop-blur-sm hover:opacity-60 transition-all'
							onClick={() => console.log("facebook")}>
							<img
								className='h-5 self-center'
								src={facebook} />
							<div className=''>Facebook</div>
						</button> */}
						<button className='flex flex-row items-center gap-2 py-2 px-5 rounded-full border border-[#000000] min-w-80 h-15 justify-center hover:backdrop-blur-sm hover:opacity-60 transition-all'
							onClick={() => console.log("google")}>
							<img className='h-auto self-center'
								src={google}
							/>
							<p className='text-xl'>
								Google
							</p>
						</button>
						{/* <button className='flex flex-row items-center gap-2 py-2 px-5 rounded-full border border-[#000000] min-w-40 justify-center hover:backdrop-blur-sm hover:opacity-60 transition-all'
							onClick={() => console.log("apple")}>
							<img
								className='h-5 self-center'
								src={apple} />
							<p>Apple</p>
						</button> */}
					</div>
				</div>
			</div>
		</div >
	)
}

export default SignUp