import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import logo from '../../assets/logo.svg'
import linkedin_ball from '../../assets/linkedin_ball.svg'
import youtube_ball from '../../assets/youtube_ball.svg'
import facebook_ball from '../../assets/facebook_ball.svg'
import twitter_ball from '../../assets/twitter_ball.svg'
import logo_gray from '../../assets/logo_gray.svg'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'

export const Footer = ({ refScrollUp = null, offset = 0 }) => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const socialIconHover = {
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };

  return (
    <footer
      className='bg-[#F8F9FA] min-h-[450px] flex flex-col md:flex-row pt-8 md:pt-13 font-jost relative justify-center overflow-hidden'
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className='max-w-[460px] w-full px-4 md:px-0'
      >
        <motion.div variants={fadeInUp} className='flex flex-row items-center px-5 justify-between'>
          <img src={logo} alt="Logo"></img>
          <p className='font-poppins text-[#404040] opacity-14 font-bold flex flex-row items-center text-3xl md:text-4xl'>
            <span className='text-7xl md:text-9xl self-center'>
              B
            </span>
            -Connect
          </p>
        </motion.div>
        <motion.div variants={fadeInUp} className='w-full h-[1px] bg-black' />
        <motion.p
          variants={fadeInUp}
          className='text-xl md:text-3xl text-center p-2 text-wrap'
        >
          Find the perfect freelancer for your project—fast and easy.
        </motion.p>
      </motion.div>

      {/* Vertical divider for desktop, horizontal for mobile */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className='md:h-full md:w-[1px] w-full h-[1px] bg-black my-4 md:my-0'
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className='flex flex-col min-w-[200px] md:min-w-[360px] w-full md:w-auto'
      >
        <div className='flex flex-col p-5 text-xl md:text-2xl gap-5 md:gap-10'>
          <motion.div variants={fadeInUp}>
            <div onClick={() => navigate("/about-us")} className="hover:text-blue-600 transition-colors duration-300">About</div>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link to='' className="hover:text-blue-600 transition-colors duration-300">FAQ</Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <div onClick={() => navigate("/catalog")} className="hover:text-blue-600 transition-colors duration-300">Services</div>
          </motion.div>
        </div>
        <motion.div variants={fadeInUp} className='w-full h-[1px] bg-black' />
        <motion.p
          variants={fadeInUp}
          className='px-5 py-6 md:py-10 text-base md:text-lg text-[#92989F] font-bold self-center'
        >
          © 2025 B-Connect • Privacy • Terms
        </motion.p>
      </motion.div>

      {/* Vertical divider for desktop, horizontal for mobile */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className='md:h-full md:w-[1px] w-full h-[1px] bg-black my-4 md:my-0'
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className='flex flex-col justify-between px-5 pb-10 w-full md:w-auto'
      >
        <div className='flex flex-col gap-6'>
          <motion.div
            variants={fadeInUp}
            className='text-xl md:text-3xl font-bold flex flex-col gap-4 text-wrap'
          >
            <p>Looking for the right freelancer for your project?</p>
            <p>Let's Find skilled professionals today!</p>
          </motion.div>
          <motion.button
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='border rounded-md max-w-[200px] text-xl md:text-2xl font-bold py-3 hover:bg-blue-600 hover:text-white transition-colors duration-300'
            onClick={() => navigate("/catalog")}
          >
            Click Here 🛠️
          </motion.button>
        </div>
        <motion.div
          variants={fadeInUp}
          className='flex flex-row justify-between mt-8 md:mt-0'
        >
          <div className='flex flex-row gap-4 md:gap-7'>
            <motion.img
              src={linkedin_ball}
              alt="LinkedIn"
              whileHover="hover"
              variants={socialIconHover}
              className="cursor-pointer"
            />
            <motion.img
              src={youtube_ball}
              alt="YouTube"
              whileHover="hover"
              variants={socialIconHover}
              className="cursor-pointer"
            />
            <motion.img
              src={facebook_ball}
              alt="Facebook"
              whileHover="hover"
              variants={socialIconHover}
              className="cursor-pointer"
            />
            <motion.img
              src={twitter_ball}
              alt="Twitter"
              whileHover="hover"
              variants={socialIconHover}
              className="cursor-pointer"
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.1, backgroundColor: '#333' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              window.scrollTo({
                top: refScrollUp.current.offsetTop - { offset },
                behavior: "smooth",
              });
              console.log("scroll", refScrollUp.current);
            }}
            className='bg-black rounded-full aspect-square flex items-center justify-center w-[45px] md:w-[55px] h-auto cursor-pointer z-30'
          >
            <ChevronUp
              color='white'
              size={40}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7, transition: { delay: 0.5, duration: 0.8 } }}
        viewport={{ once: true }}
        className='absolute bottom-0 right-0 max-w-[30%] md:max-w-full'
        src={logo_gray}
        alt=""
      />
    </footer>
  )
}

export default Footer