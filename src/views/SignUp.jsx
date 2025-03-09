import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import password_hide from "../assets/eye_off.svg"
import password_show from "../assets/eye_on.svg"
import facebook from "../assets/facebook_logo.svg"
import google from "../assets/google_logo.svg"
import apple from "../assets/apple_logo.svg"

const SignUp = () => {
    const [showPass, setShowPass] = useState(false)

    const switchEye = () => {
        setShowPass((showPass) => !showPass)
    }

    return (
        <div className='container'>
            <div className='title'>
                <p className=''>Create an Account</p>
                <p>Already have an account? <Link to="SignUp">Log in</Link></p>
            </div>
            <div className='form'>
                <label>What should we call you?</label>
                <input type='text' placeholder='Enter your profile name'></input>
            </div>
            <div className='form'>
                <label>What's your email?</label>
                <input type='text' placeholder='Enter your email address'></input>
            </div>
            <div className='form'>
                <div>
                    <label>Create a password</label>
                    <div>
                        <img src={showPass ? password_show : password_hide} onClick={switchEye} />
                        <p>hide</p>
                    </div>
                </div>
                <input type={showPass ? "text" : "password"} placeholder='Enter your password'></input>
                <p>Use 8 or more characters with a mix of letters, numbers & symbols</p>
            </div>
            <div className='create-account'>
                <label>By creating an account, you agree to the <Link>Terms of Use</Link> and <Link>Privacy Policy</Link>.</label>
                <button>Create an account</button>
            </div>
            <div className='footer'>
                <label>OR Continue with</label>
                <div>
                    {}
                    <button>
                        <img src={facebook}/>
                        <p>Facebook</p>
                    </button>
                    <button>
                        <img src={google}/>
                        <p>Google</p>
                    </button>
                    <button>
                        <img src={apple}/>
                        <p>Apple</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignUp