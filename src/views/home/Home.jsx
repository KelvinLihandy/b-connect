import React from 'react'
import logo from '../../assets/logo.svg'
import login_logo from '../../assets/login_logo.svg'
import dropdown_tri from '../../assets/dropdown_tri.svg'

import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'


const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="font-poppins fixed top-0 left-0 w-full bg-white/[0.09] z-50 backdrop-blur-xs p-4 flex flex-row justify-between px-25 h-[100px]">
        <img src={logo} />
        <div className='flex flex-row items-center gap-8 text-white text-xl'>
          <p className='flex flex-row items-center gap-2'>Explore <span><img className='self-center' src={dropdown_tri} alt="" /></span></p> {/*ubah ke dropdown*/}
          <Link to="">About Us</Link>
          <button className='flex flex-row border rounded-xl py-4 px-6 gap-2 items-center'
            onClick={() => navigate('/sign-in')}
          >
            Login
            <span>
              <img className='h-5 self-center'
                src={login_logo}
              />
            </span>
          </button>
        </div>
      </nav>

      <header className='bg-[#2E5077] min-h-screen h-screen'>

      </header>
      <header className='bg-white h-screen'>

      </header>

      <Footer />
    </div>
  )
}

export default Home