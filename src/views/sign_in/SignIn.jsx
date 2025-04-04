import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Divider } from '../../components/divider/Divider'

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

const SignIn = () => {
	const [showPass, setShowPass] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isChecked, setIsChecked] = useState(false)
	const navigate = useNavigate();

	const handleCheckboxChange = () => {
		setIsChecked(!isChecked);
	}
	const switchEye = () => {
		setShowPass((showPass) => !showPass)
	}

	const login = () => {
		console.log(email);
		console.log(password);
		axios.post(`${authAPI}/login`, {
			email: email,
			password: password
		})
			.then(response => {
				console.log(response.data);
			})
			.catch(error => {
				console.error('Error login:', error.response);
			});
	}

	return (
		<div className='flex flex-col items-center justify-center justify-items-center h-screen'>
			<div className='font-poppins relative text-center gap-4 item-center mt-5 mb-5'>
				<p className='text-3xl font-semibold'>Log in</p>
			</div>

			<div className='flex flex-col text-lg justify-center gap-4 min-w-140 max-w-170'>
				<button className='flex flex-row items-center gap-2 py-3 px-5 rounded-full border border-black justify-center cursor-pointer hover:backdrop-blur-sm hover:opacity-60 transition-all'>
					<img className='h-5 self-center' src={google} alt="" />
					<div>Continue with Google</div>
				</button>
				{/* <button className='flex flex-row items-center gap-2 py-3 px-5 rounded-full border border-black justify-center cursor-pointer hover:backdrop-blur-sm hover:opacity-60 transition-all'>
					<img className='h-5 self-center' src={facebook} alt="" />
					<div>Continue with Facebook</div>
				</button>
				<button className='flex flex-row items-center gap-2 py-3 px-5 rounded-full border border-black justify-center cursor-pointer hover:backdrop-blur-sm hover:opacity-60 transition-all'>
					<img className='h-5 self-center' src={apple} alt="" />
					<div>Continue with Apple</div>
				</button> */}
			</div>

			<Divider
				className="!flex-[0_0_auto] !w-[560px] pt-7 pb-6"
				divClassName="!text-[#111111] !text-xl"
			/>

			{/* Bagian Textbox */}
			<div className='font-poppins inline-flex flex-col gap-4 items-center mb-8'>
				<div className='flex flex-col gap-1'>
					<label className='text-[#666666] text-lg'>
						Email address
					</label>
					<input className='form-input text-base h-12 min-w-140 max-w-170 px-5'
						type='text'
						placeholder=''
						onChange={(event) => setEmail(event.target.value)}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<div className='flex flex-row justify-between min-w-140 max-w-170'>
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
					<input className='form-input text-base h-12 min-w-140 max-w-170 px-5'
						type={showPass ? "text" : "password"}
						placeholder=''
						onChange={(event) => setPassword(event.target.value)}
					>
					</input>
					<Link to="/sign-in/forget">
						<span className='flex w-full text-[#111111] text-base font-normal underline justify-end text-right '>
							Forget your password
						</span>
					</Link>

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

				{/* Button Login */}
				<div className='mt-3 mb-3'>
					<button className='bg-[#111111]/25 text-xl text-white font-bold min-w-140 max-w-170 rounded-4xl min-h-14 transition cursor-pointer hover:text-black hover:opacity-90'
						onClick={() => login()}
					>
						Log in
					</button>
				</div>

				<div className="mt-5 mb-5 flex w-[560px] items-center relative flex-[0_0_auto]">
					<div className="relative flex-1 grow h-0.5 bg-[#66666640]" />
				</div>

				<div className=''>
					<p className='text-[#333333] text-2xl font-medium'>
						Don't have an account?</p>
				</div>
				<button
					className='bg-[#FFFFFF] text-black text-xl font-medium min-w-140 max-w-170 rounded-4xl border border-black min-h-14 transition cursor-pointer hover:bg-gray-100 hover:text-black/50'
					onClick={() => navigate("/sign-up")}>
					Sign Up
				</button>
			</div>

			{/* Background Decor */}
			{/* <img
                className="fixed w-[376px] h-[268.571px] top-[328px] right-0 sm:right-[5%] md:right-[10%] lg:right-[20%]"
                alt=""
                src={bg_right}
            />

            <img
                className="fixed w-[376px] h-[268.571px] top-[328px] left-0 sm:left-[5%] md:left-[10%] lg:left-[20%]"
                alt=""
                src={bg_left}
            />

            <img 
                className='fixed w-[68px] h-[50.216px] top-[42.7px] left-[47.4px]'
                src={bg_dots} alt="" 
            />

<img 
                className='fixed w-[68px] h-[50.216px] bot-[40.7] bottom-[40.7px] right-[50.216px]'
                src={bg_dots} alt="" 
            /> */}
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