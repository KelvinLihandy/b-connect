import React from 'react'
import logo from '../../assets/logo.svg'
import linkedin_ball from '../../assets/linkedin_ball.svg'
import youtube_ball from '../../assets/youtube_ball.svg'
import facebook_ball from '../../assets/facebook_ball.svg'
import twitter_ball from '../../assets/twitter_ball.svg'
import arrowhead_up from '../../assets/arrowhead_up.svg'
import logo_gray from '../../assets/logo_gray.svg'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className='bg-[#F8F9FA] h-[450px] flex flex-row pt-13 font-jost pl-25 relative'>
      <div className='max-w-[460px]'>
        <div className='flex flex-row items-center px-5'>
          <img src={logo}></img>
          <p className='font-poppins text-[#404040] opacity-14 font-bold flex flex-row items-center text-4xl'>
            <span className='text-9xl self-center'>
              B
            </span>
            -Connect
          </p>
        </div>
        <div className='w-full h-[1px] bg-black' />
        <p className='text-3xl text-wrap text-center p-2'>
          Find the perfect freelancer for your project—fast and easy.
        </p>
      </div>
      <div className='h-full bg-black w-[1px]' />
      <div className='flex flex-col min-w-[360px]'>
        <div className='flex flex-col p-5 text-2xl gap-10'>
          <Link to=''>About</Link>
          <Link to=''>FAQ</Link>
          <Link to=''>Services</Link>
          <Link to=''>Tournaments</Link>
        </div>
        <div className='w-full h-[1px] bg-black' />
        <p className='px-5 py-10 text-lg text-[#92989F] font-bold self-center'>© 2025 B-Connect • Privacy • Terms</p>
      </div>
      <div className='h-full bg-black w-[1px]' />
      <div className='flex flex-col justify-between px-5 pb-10'>
        <div className='flex flex-col gap-6'>
          <div className='text-3xl font-bold flex flex-col gap-4'>
            <p>Looking for the right freelancer for your project?</p>
            <p>Let's Find skilled professionals today!</p>
          </div>
          <button className='border rounded-md max-w-[50%] text-2xl font-bold py-3'>
            Click Here 🛠️
          </button>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row gap-7'>
            <img src={linkedin_ball} alt="" />
            <img src={youtube_ball} alt="" />
            <img src={facebook_ball} alt="" />
            <img src={twitter_ball} alt="" />
          </div>
          <div className='bg-black rounded-full aspect-square flex items-center justify-center w-[55px] h-auto'>
            <img src={arrowhead_up} />
          </div>
        </div>
      </div>
      <img className='absolute bottom-0 right-0' src={logo_gray} alt="" />
    </footer>
  )
}

export default Footer