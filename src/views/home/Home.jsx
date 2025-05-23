import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import axios from 'axios'

// Assets
import bg_dots_extended from '../../assets/bg_dots_extended.svg'
import talent_pool from '../../assets/talent_pool.svg'
import efficient_matching from '../../assets/efficient_matching.svg'
import clear_fair_pricing from '../../assets/clear_fair_pricing.svg'
import flexible_support from '../../assets/flexible_support.svg'
import search_symbol from '../../assets/search_symbol_blue_inner.svg'
import trending_symbol from '../../assets/trending_symbol.svg'
import circle from '../../assets/circle.svg'
import bg_spike_left from '../../assets/bg_spike_left.svg'
import bg_spike_right from '../../assets/bg_spike_right.svg'
import circle_outline from '../../assets/circle_outline.svg'
import triangle_blunt from '../../assets/triangle_blunt.svg'
import bg_image_right from '../../assets/bg_image_right.svg'
import squiggly from '../../assets/cut_lines.svg'
import trid_designer from '../../assets/3d_designer.svg'
import fullstack_developer from '../../assets/fullstack_developer.svg'
import graphic_designer from '../../assets/graphic_designer.svg'
import circle_bg_right from '../../assets/circle_bg_right.svg'
import arrow_right from '../../assets/arrow_right.svg'
import mr_pink_hair from '../../assets/mr_pink_hair.svg'

// Components
import Footer from '../../components/footer/Footer'
import CarouselTrending from '../../components/carousel_trending/CarouselTrending'
import GigItem from '../../components/gig_item/GigItem'
import { CircularProgress } from '@mui/material'
// API Routes
import { gigAPI, userAPI } from '../../constants/APIRoutes'
import { AuthContext } from '../../contexts/AuthContext'
import Navbar from '../../components/navbar/Navbar'


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const FeatureCard = ({ image, title, description }) => (
  <motion.div
    className='w-[300px] flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg hover:shadow-blue-400/20 transition-all duration-300'
    whileHover={{ y: -10 }}
  >
    <motion.img
      src={image}
      alt={title}
      className="w-24 h-24 mb-2"
      whileHover={{ rotate: 5, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
    <p className='font-extrabold text-2xl text-white'>{title}</p>
    <p className='text-xl text-center text-white/90'>{description}</p>
  </motion.div>
)

const ServiceTab = ({ title, isSelected, onClick }) => (
  <motion.div
    className='flex flex-col cursor-pointer'
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
  >
    <div className={`text-2xl ${isSelected ? 'text-blue-500 font-bold' : 'text-gray-700'}`}>
      {title}
    </div>
    <motion.div
      className={`h-1 mt-2 ${isSelected ? 'bg-blue-500' : 'invisible'}`}
      initial={{ width: 0 }}
      animate={{ width: isSelected ? '100%' : 0 }}
      transition={{ duration: 0.3 }}
    />
  </motion.div>
)

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingUsers, setTrendingUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [gigs, setGigs] = useState();
  const categoryList = ["Graphics Design", "UI/UX Design", "Video Editing", "Content Writing", "Translation", "Photography", "Web Development"];
  const [currentCategory, setCurrentCategory] = useState(categoryList[0]);
  const servicesSection = useRef(null);
  const [isFetchingGig, setIsFetchingGig] = useState(false);
  const homeScrollUp = useRef(null);
  const [gigCountSorted, setGigCountSorted] = useState([]);

  const TrendingServiceButton = ({ text }) => (
    <motion.div
      className='flex flex-row border justify-between rounded-full gap-1 py-4 px-6 bg-white/10 backdrop-blur-sm w-70 hover:bg-white/20 transition-all duration-200 cursor-pointer'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setCurrentCategory(text);
        servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <p className='self-center font-medium text-lg'>
        {text}
      </p>
      <img src={trending_symbol} alt="trending" className="animate-pulse" />
    </motion.div>
  )

  useEffect(() => {
    const getTrendingUsers = async () => {
      try {
        const response = await axios.post(`${userAPI}/get-trending-users`, {});
        const res = response.data;
        console.log(res)
        setTrendingUsers(res);
      } catch (error) {
        console.error('Error fetching top users:', error.response || error);
      }
    };
    const getCountSorted = async () => {
      try {
        const response = await axios.post(`${gigAPI}/get-gig-count`, {
          categories: categoryList
        });
        const res = response.data.sort((a, b) => b.count - a.count);
        setGigCountSorted(res);
      } catch (error) {
        console.error('Error fetch sorted gig count:', error.response || error);
      }
    }

    getCountSorted();
    getTrendingUsers();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach(
      el => observer.observe(el)
    );

    return () => {
      document.querySelectorAll('.scroll-animate').forEach(
        el => observer.unobserve(el)
      );
    };
  }, []);

  const getGig = async (name, category) => {
    try {
      const response = await axios.post(`${gigAPI}/get-gig`, { name, category });
      const res = response.data.filteredGigs;
      setGigs(res);
      console.log("gig fetched", res);
    } catch (error) {
      console.error('Error fetching gigs:', error.response || error);
    }
    setIsFetchingGig(false);
  }

  const debouncedSearch = useCallback(
    debounce(async (query, category) => {
      if (!query.length) return;
      await getGig(query, category);
      servicesSection.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500),
    []
  );

  const fetchGigs = async () => {
    if (!searchQuery.length) await getGig("", currentCategory);
    else debouncedSearch(searchQuery, currentCategory);
  };

  useEffect(() => {
    fetchGigs();
  }, [debouncedSearch, currentCategory]);

  return (
    <div
      className="font-poppins overflow-x-hidden"
      ref={homeScrollUp}
    >
      <Navbar />

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-[#2E5077] to-[#1d3f63] min-h-[950px] text-white flex flex-wrap px-10 relative justify-center pt-[100px]'>
        <motion.img
          className='absolute left-0 top-25 blur-sm animate-pulse'
          src={circle}
          alt="circle"
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.img
          className='absolute right-0 top-25 rotate-180 blur-sm animate-pulse'
          src={circle}
          alt="circle"
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <img className='absolute left-0 bottom-0 opacity-80' src={bg_spike_left} alt="bg spike" />
        <img className='absolute right-0 bottom-0 opacity-80' src={bg_spike_right} alt="bg spike" />

        <motion.div
          className='flex flex-col gap-7 font-poppins self-center w-[800px] px-20'
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            className='text-8xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent'
            variants={fadeIn}
          >
            B-Connect
          </motion.p>
          <motion.p
            className='text-5xl font-medium'
            variants={fadeIn}
          >
            FREELANCING MADE EASY !
          </motion.p>
          <motion.p
            className='text-[#D5D5D5] text-3xl font-medium'
            variants={fadeIn}
          >
            Hire a Person To Help Your Problem.
          </motion.p>
          <motion.p
            className='text-lg text-[#D5D5D5C2] opacity-80 text-wrap max-w-xl'
            variants={fadeIn}
          >
            In the ever-evolving landscape of skills and knowledge, the choice between hiring an expert is a pivotal decision.
          </motion.p>

          <motion.div
            className='flex flex-row text-xl text-black relative'
            variants={fadeIn}
          >
            <input
              className={`absolute w-[95%] bg-white h-18 self-center rounded-3xl px-5 py-4 transition-all duration-300 shadow-lg ${isSearchFocused ? 'shadow-blue-400' : ''}`}
              type="text"
              placeholder='Search to Find Our Services'
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsFetchingGig(true);
                  fetchGigs();
                }
              }}
            />
            <motion.div
              className='bg-[#2E90EB] size-23 rounded-full flex items-center justify-center ml-auto z-10 cursor-pointer text-white'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => {
                setIsFetchingGig(true);
                fetchGigs();
              }}
            >
              {isFetchingGig ?
                <CircularProgress color='inherit' />
                :
                <img src={search_symbol} alt="search" />
              }
            </motion.div>
          </motion.div>

          <motion.div className='flex flex-col gap-5' variants={fadeIn}>
            <p className='text-xl font-medium'>
              TRENDING SERVICES
            </p>
            <div className='text-lg opacity-80 flex flex-col gap-3'>
              {gigCountSorted.slice(0, 3).map((categ) => (
                <TrendingServiceButton text={categ.category} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Images */}
        <div className='relative w-[800px] h-[950px]'>
          <motion.img
            className='absolute right-1 top-40'
            src={bg_image_right}
            alt="bg right"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.img
            className='absolute right-170 top-45 size-15 rotate-50'
            src={triangle_blunt}
            alt="bg tri"
            animate={{ rotate: [50, 60, 50], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            className='absolute right-20 bottom-25 size-15'
            src={triangle_blunt}
            alt="bg tri"
            animate={{ rotate: [0, 10, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            className='absolute bottom-60 right-165 size-15 rotate-15'
            src={triangle_blunt}
            alt="bg tri"
            animate={{ rotate: [15, 25, 15], scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            className='absolute bottom-68 right-172 size-15 rotate-75'
            src={triangle_blunt}
            alt="bg tir"
            animate={{ rotate: [75, 85, 75] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            className='absolute right-145 top-70'
            src={bg_dots_extended}
            alt="bg dots"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.img
            className='absolute right-40 bottom-2 h-40'
            src={squiggly}
            alt="bg line"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            className='absolute bottom-10 right-100 size-10'
            src={circle_outline}
            alt=""
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.img
            className='absolute right-13 top-57'
            src={circle_bg_right}
            alt=""
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          />
          <motion.img
            className='absolute right-75 top-40'
            src={trid_designer}
            alt=""
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.img
            className='absolute right-75 top-115'
            src={fullstack_developer}
            alt=""
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          <motion.img
            className='absolute right-0 top-100'
            src={graphic_designer}
            alt=""
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
        </div>
      </section>

      {/* Trending Partners Section */}
      <motion.section
        className='min-h-[500px] flex flex-col gap-10 p-8 font-Archivo py-20 scroll-animate'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.p
          className='font-poppins text-5xl font-semibold mb-3'
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Trending&nbsp;
          <span className='text-[#1E88E5] font-bold'>
            B-Partner
          </span>
        </motion.p>
        <div className='flex flex-col items-center text-white'>
          <CarouselTrending data={trendingUsers} />
        </div>
      </motion.section>

      {/* Why Use B-Connect Section */}
      <motion.section
        className='min-h-[600px] relative p-8 font-Archivo text-white bg-gradient-to-b from-[#2D4F76] via-[#217A9D] via-70% to-[#21789B] py-20 overflow-hidden'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.img
          className='absolute left-0 bottom-0 p-6'
          src={bg_dots_extended}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          className='absolute right-0 top-0 p-6'
          src={bg_dots_extended}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.p
          className='font-poppins text-5xl font-semibold mb-10 text-center'
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Use&nbsp;
          <span className='text-[#1E88E5] font-bold'>
            B-Connect?
          </span>
        </motion.p>

        <motion.div
          className='flex flex-row justify-center mt-7 gap-20 flex-wrap'
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeatureCard
            image={talent_pool}
            title="Binusian Talent Pool"
            description="Temukan freelancer berbakat dari komunitas Binus University yang terverifikasi dan siap membantu berbagai kebutuhan proyek Anda."
          />

          <FeatureCard
            image={efficient_matching}
            title="Efficient Matching"
            description="Gunakan fitur pencarian dan filter untuk menemukan freelancer yang tepat dan selesaikan proyek dengan hasil berkualitas."
          />

          <FeatureCard
            image={clear_fair_pricing}
            title="Clear & Fair Pricing"
            description="Bayar proyek dengan sistem pembayaran yang transparan dan aman. Pembayaran hanya dilakukan setelah pekerjaan disetujui."
          />

          <FeatureCard
            image={flexible_support}
            title="Flexible Support"
            description="Tim support kami siap membantu kamu setiap hari untuk memastikan pengalaman proyekmu berjalan lancar dan aman."
          />
        </motion.div>
      </motion.section>

      {/* Explore Services Section */}
      <motion.section ref={servicesSection}
        className='p-10 flex flex-col items-center gap-20 py-24 scroll-animate'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.p
          className='font-Archivo font-bold text-5xl'
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Explore Our Services
        </motion.p>

        <motion.div
          className='flex flex-row gap-15 font-inter text-2xl'
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categoryList.map((category, index) => {
            return (
              <ServiceTab
                key={index}
                title={category}
                isSelected={currentCategory === category}
                onClick={() => setCurrentCategory(category)}
              />
            )
          })}
        </motion.div>

        <motion.div
          className="grid grid-cols-4 grid-rows-2 gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <GigItem data={gigs} home start={0} end={8} starter/>
        </motion.div>
      </motion.section>

      <Footer refScrollUp={homeScrollUp} />
    </div>
  )
}

export default Home