import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import "./SignUp.css"
import password_hide from "../assets/eye_off.svg"
import password_show from "../assets/eye_on.svg"
import facebook from "../assets/facebook_logo.svg"
import google from "../assets/google_logo.svg"
import apple from "../assets/apple_logo.svg"

const SignUp = () => {
	const [showPass, setShowPass] = useState(false)
	const [name, setName] = useState("")
	const [email,setEmail] = useState("")
	const [password,setPassword] = useState("")//encrypt not implemented
	const switchEye = () => {
		setShowPass((showPass) => !showPass)
	}

	return (
		<div className='justify-items-center'>
			<div className='font-poppins flex flex-col gap-4 items-center'>
				<div className='flex flex-col gap-1 items-center mb-5'>
					<p className='text-2xl font-semibold'>Create an Account</p>
					<p className='text-xs'>Already have an account? <Link to=""><span className='underline'>Log in</span></Link></p>
				</div>

				<div className='flex flex-col gap-1'>
					<label className='text-[#666666] text-sm'>What should we call you?</label>
					<input className='border form-input text-xs min-h-10 max-h-12 min-w-140 max-w-170 px-5' type='text' placeholder='Enter your profile name' onChange={(event) => setName(event.target.value)}></input>
				</div>

				<div className='flex flex-col gap-1'>
					<label className='text-[#666666] text-sm'>What's your email?</label>
					<input className='form-input text-xs min-h-10 max-h-12 min-w-140 max-w-170 px-5' type='text' placeholder='Enter your email address' onChange={(event) => setEmail(event.target.value)}></input>
				</div>

				<div className='flex flex-col gap-1 mb-8'>
					<div className='flex flex-row justify-between min-w-140 max-w-170'>
						<label className='text-[#666666] text-sm'>Create a password</label>
						<div className='flex flex-row gap-2' onClick={switchEye}>
							<img className='h-5 self-center opacity-80' src={showPass ? password_show : password_hide} />
							<p className='text-[#666666] text-sm'>Hide</p>
						</div>
					</div>
					<input className='form-input text-xs min-h-10 max-h-12 min-w-140 max-w-170 px-5' type={showPass ? "text" : "password"} placeholder='Enter your password' onChange={(event) => setPassword(event.target.value)}></input>
					<p className='text-[#666666] text-xs'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
				</div>
			</div>
			<div className='font-poppins flex flex-col justify-start min-w-140 max-w-170 gap-1 mb-8'>
				<label className='text-sm'>By creating an account, you agree to the <Link to=""><span className='underline'>Terms of Use</span></Link> and <Link to=""><span className='underline'>Privacy Policy</span></Link>.</label>
				<button className='bg-[#111111]/25 text-white font-bold min-w-140 max-w-170 rounded-4xl min-h-12 transition hover:text-black' onClick={() => console.log("submit")}>Create an account</button>
			</div>

			<div className='flex flex-col gap-1 font-nunito min-w-140 max-w-170 '>
				<label className='text-[#666666]'>OR Continue with</label>
				<div className='flex flex-row justify-between'>
					<button className='flex flex-row items-center gap-2 py-2 px-5 rounded-full border border-[#000000] min-w-40 justify-center' onClick={() => console.log("facebook")}>
						<img className='h-5 self-center' src={facebook} />
						<div className=''>Facebook</div>
					</button>
					<button className='flex flex-row items-center gap-2 py-2 px-5 rounded-full border border-[#000000] min-w-40 justify-center' onClick={() => console.log("google")}>
						<img className='h-5 self-center' src={google} />
						<p>Google</p>
					</button>
					<button className='flex flex-row items-center gap-2 py-2 px-5 rounded-full border border-[#000000] min-w-40 justify-center' onClick={() => console.log("apple")}>
						<img className='h-5 self-center' src={apple} />
						<p>Apple</p>
					</button>
				</div>
			</div>
		</div>
	)
}

export default SignUp