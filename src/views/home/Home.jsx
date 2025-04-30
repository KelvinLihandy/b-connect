import React, { useState } from 'react'
import logo from '../../assets/logo.svg'
import login_logo from '../../assets/login_logo.svg'
import dropdown_tri from '../../assets/dropdown_tri.svg'
import bg_dots_extended from '../../assets/bg_dots_extended.svg'
import talent_pool from '../../assets/talent_pool.svg'
import efficient_matching from '../../assets/efficient_matching.svg'
import clear_fair_pricing from '../../assets/clear_fair_pricing.svg'
import flexible_support from '../../assets/flexible_support.svg'
import aarav_andeep from '../../assets/aarav_andeep.svg'
import hrithik_tiwarin from '../../assets/hrithik_tiwarin.svg'
import shivam_pranay from '../../assets/shivam_pranay.svg'
import search_symbol from '../../assets/search_symbol_blue_inner.svg'
import trending_symbol from '../../assets/trending_symbol.svg'
import circle from '../../assets/circle.svg';
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
import arrow_circle from '../../assets/arrow_circle.svg'
import computer from '../../assets/computer_stock.svg'
import phone from '../../assets/phone_stock.svg'
import arrow_right from '../../assets/arrow_right.svg'
import mr_pink_hair from '../../assets/mr_pink_hair.svg'
import { Link, useNavigate } from 'react-router-dom'
import Footer from "../../components/footer/Footer";
import CarouselTrending from '../../components/carousel_trending/CarouselTrending'
import ServiceItem from '../../components/service_item/ServiceItem'

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(null);
  //data fetch api
  const [trendingData, setTrendingData] = useState([
    {
      id: 1,
      firstName: "Aarav",
      lastName: "Andeep",
      picture: aarav_andeep,
      rating: 1.3,
      raters: 69,
      role: "UI/UX Designer",
    },
    {
      id: 2,
      firstName: "Hrithik",
      lastName: "Tawarin",
      picture: hrithik_tiwarin,
      rating: 2.3,
      raters: 69,
      role: "Animator 2D",
    },
    {
      id: 3,
      firstName: "Shivam",
      lastName: "Pranay",
      picture: shivam_pranay,
      rating: 3.3,
      raters: 69,
      role: "Data Scientist",
    },
    {
      id: 4,
      firstName: "Aarav",
      lastName: "Andeep",
      picture: aarav_andeep,
      rating: 4.3,
      raters: 69,
      role: "UI/UX Designer",
    },
    {
      id: 5,
      firstName: "Aarav",
      lastName: "Aarav",
      picture: hrithik_tiwarin,
      rating: 5.0,
      raters: 69,
      role: "Animator 2D",
    },
    {
      id: 6,
      firstName: "Aarav",
      lastName: "Aarav",
      picture: shivam_pranay,
      rating: 4.3,
      raters: 69,
      role: "Data Scientist",
    },
    {
      id: 7,
      firstName: "Hrithik",
      lastName: "Hrithik",
      picture: aarav_andeep,
      rating: 4.3,
      raters: 69,
      role: "UI/UX Designer",
    },
    {
      id: 8,
      firstName: "Hrithik",
      lastName: "Hrithik",
      picture: hrithik_tiwarin,
      rating: 4.3,
      raters: 69,
      role: "Animator 2D",
    },
    {
      id: 9,
      firstName: "Hrithik",
      lastName: "Hrithik",
      picture: shivam_pranay,
      rating: 4.3,
      raters: 69,
      role: "Data Scientist",
    },
    {
      id: 9,
      firstName: "asda",
      lastName: "Hrithik",
      picture: shivam_pranay,
      rating: 4.3,
      raters: 69,
      role: "Data Scientist",
    },
  ]);
  const [services, setServices] = useState([
    {
      id: 1,
      image: computer,
      title: "I will design UI UX for mobile app with figma for ios",
      price: 210000,
      rating: 4,
      sold: 360
    },
    {
      id: 2,
      image: phone,
      title: "I will design UI UX forsss mobile app with figma for ios",
      price: 220000,
      rating: 4,
      sold: 360
    },
    {
      id: 3,
      image: computer,
      title: "I will design UI UX for mobile app with figma for ios",
      price: 210000,
      rating: 4,
      sold: 360
    },
    {
      id: 4,
      image: phone,
      title: "I will design UI UX for mobile app with figma for ios",
      price: 210000,
      rating: 4,
      sold: 360
    },
    {
      id: 5,
      image: computer,
      title: "I will design UI UX for mobile app with figma for ios",
      price: 210000,
      rating: 4,
      sold: 360
    },
    {
      id: 6,
      image: phone,
      title: "I will design UI UX for mobile app with figma for ios",
      price: 210000,
      rating: 4,
      sold: 360
    }
  ]);
  const [selectedServiceType, setSelectedServiceType] = useState("Data Scientist");

  console.log(searchQuery)

  return (
    <div>
      <header className="font-poppins fixed top-0 left-0 w-full bg-white/[0.09] z-50 backdrop-blur-xs p-4 flex flex-row justify-between px-25 h-[100px]">
        <img src={logo} />
        <div className='flex flex-row items-center gap-8 text-white text-xl'>

          <p className='flex flex-row items-center gap-2'>Explore <span><img className='self-center' src={dropdown_tri} alt="" /></span></p>
          <Link to="/about-us">About Us</Link>
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
      </header>

      <section className='bg-[#2E5077] h-[950px] text-white flex flex-wrap px-10 relative justify-center'>
        <img className='absolute left-0 top-25 blur-xs'
          src={circle}
          alt="circle"
        />
        <img className='absolute right-0 top-25 rotate-180 blur-xs'
          src={circle}
          alt="circle"
        />
        <img className='absolute left-0 bottom-0'
          src={bg_spike_left}
          alt="bg spike"
        />
        <img className='absolute right-0 bottom-0'
          src={bg_spike_right}
          alt="bg spike"
        />
        <div className='flex flex-col gap-7 font-poppin self-center w-[800px] px-20'>
          <p className='text-8xl font-bold'>
            B-Connect
          </p>
          <p className='text-5xl font-medium'>
            FREELANCING MADE EASY !
          </p>
          <p className='text-[#D5D5D5] text-3xl font-medium'>
            Hire a Person To Help Your Problem.
          </p>
          <p className='text-md text-[#D5D5D5C2] opacity-76 text-wrap'>
            In the ever-evolving landscape of skills and knowledge, the choice between hiring an expert is a pivotal decision.
          </p>
          <div className='flex flex-row text-xl text-black relative'>
            <input className='absolute w-[95%] bg-white h-18 self-center rounded-3xl px-5'
              type="text"
              placeholder='Search to "Find Freelancers, Jobs, or Services"'
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <div className='bg-[#2E90EB] size-23 rounded-full flex items-center justify-center ml-auto z-10'>
              <img src={search_symbol}
                alt="search"
              />
            </div>
          </div>
          <div className='flex flex-col gap-5'>
            <p className='text-xl font-medium'>
              TRENDING SERVICES
            </p>
            <div className='text-lg opacity-80 flex flex-wrap gap-4'>
              <div className='flex flex-row border rounded-full gap-7 py-4 px-6 bg-white/4  w-50 max-w-50'>
                <p className='self-center'>
                  DESIGNER
                </p>
                <img src={trending_symbol}
                  alt="trending"
                />
              </div>
              <div className='flex flex-row border rounded-full gap-7 py-4 px-6 bg-white/4 w-50 max-w-50'>
                <p>
                  DEVELOPER
                </p>
                <img src={trending_symbol}
                  alt="trending" />
              </div>
              <div className='flex flex-row border rounded-full gap-7 py-4 px-6 bg-white/4 w-50 max-w-50'>
                <p>
                  WORDPRESS
                </p>
                <img src={trending_symbol}
                  alt="trending"
                />
              </div>
            </div>
          </div>
        </div>
        <div className='relative w-[800px] h-[950px]'>
          <img className='absolute right-1 top-40'
            src={bg_image_right}
            alt="bg right"
          />
          <img className='absolute right-170 top-45 size-15 rotate-50'
            src={triangle_blunt}
            alt="bg tri"
          />
          <img className='absolute right-20 bottom-25 size-15'
            src={triangle_blunt}
            alt="bg tri"
          />
          <img className='absolute bottom-60 right-165 size-15 rotate-15'
            src={triangle_blunt}
            alt="bg tri"
          />
          <img className='absolute bottom-68 right-172 size-15 rotate-75'
            src={triangle_blunt}
            alt="bg tir"
          />
          <img className='absolute right-145 top-70'
            src={bg_dots_extended}
            alt="bg dots"
          />
          <img className='absolute right-40 bottom-2 h-40'
            src={squiggly}
            alt="bg line"
          />
          <img className='absolute bottom-10 right-100 size-10'
            src={circle_outline}
            alt=""
          />
          <img className='absolute right-13 top-57'
            src={circle_bg_right}
            alt=""
          />
          <img className='absolute right-75 top-40'
            src={trid_designer}
            alt=""
          />
          <img className='absolute right-75 top-115'
            src={fullstack_developer}
            alt=""
          />
          <img className='absolute right-0 top-100'
            src={graphic_designer}
            alt=""
          />
        </div>    
      </section>

      <section className='h-[500px] flex flex-col gap-10 p-8 font-Archivo'>
        <p className='font-poppins text-5xl font-semibold mb-3'>
          Trending&nbsp;
          <span className='text-[#1E88E5]'>
            B-Partner
          </span>
        </p>
        <div className='flex flex-col items-center text-white'>
          <CarouselTrending
            trendingData={trendingData}
          />
        </div>
      </section>

      <section className='h-[500px] relative p-8 font-Archivo text-white bg-gradient-to-b from-[#2D4F76] via-[#217A9D] via-70% to-[#21789B]'>
        <img className='absolute left-0 bottom-0 p-3'
          src={bg_dots_extended}
        />
        <img className='absolute right-0 top-0 p-3'
          src={bg_dots_extended}
        />
        <p className='font-poppins text-5xl font-semibold mb-3'>
          Why Use&nbsp;
          <span className='text-[#1E88E5]'>
            B-Connect?
          </span>
        </p>
        <div className='flex flex-row justify-between mt-7'>
          <div className='w-[15vw] flex flex-col items-center gap-3'>
            <img src={talent_pool}
              alt="talent pool"
            />
            <p className='font-extrabold text-2xl'>
              Binusian Talent Pool
            </p>
            <p className='text-xl text-center'>
              Temukan freelancer berbakat dari komunitas Binus University
              yang terverifikasi dan siap membantu berbagai kebutuhan proyek Anda.
            </p>
          </div>
          <div className='w-[300px] flex flex-col items-center gap-3'>
            <img src={efficient_matching}
              alt="efficient matching"
            />
            <p className='font-extrabold text-2xl'>
              Efficient Matching
            </p>
            <p className='text-xl text-center'>
              Gunakan fitur pencarian dan filter untuk menemukan freelancer yang tepat
              dan selesaikan proyek dengan hasil berkualitas.</p>
          </div>
          <div className='w-[300px] flex flex-col items-center gap-3'>
            <img src={clear_fair_pricing}
              alt="clear face pricing" />
            <p className='font-extrabold text-2xl'>
              Clear & Fair Pricing
            </p>
            <p className='text-xl text-center'>
              Bayar proyek dengan sistem pembayaran yang transparan dan aman.
              Pembayaran hanya dilakukan setelah pekerjaan disetujui.
            </p>
          </div>
          <div className='w-[300px] flex flex-col items-center gap-3'>
            <img src={flexible_support}
              alt="flexible support" />
            <p className='font-extrabold text-2xl'>
              Flexible Support
            </p>
            <p className='text-xl text-center'>
              Tim support kami siap membantu kamu setiap hari untuk memastikan
              pengalaman proyekmu berjalan lancar dan aman.
            </p>
          </div>
        </div>
      </section>

      <section className='p-10 flex flex-col items-center gap-20'>
        <p className='font-Archivo font-bold text-5xl'>
          Explore Our Services
        </p>
        <div className='flex flex-row gap-15 font-inter text-2xl'>
          <div className='flex flex-col'
            onClick={() => setSelectedServiceType("Data Scientist")}
          >
            <div>
              Data Scientist
            </div>
            <div className={`h-1 ${selectedServiceType === "Data Scientist" ? 'bg-black' : 'invisible'}`} />
          </div>
          <div className='flex flex-col'
            onClick={() => setSelectedServiceType("UI/UX")}
          >
            <div>
              UI/UX
            </div>
            <div className={`h-1 ${selectedServiceType === "UI/UX" ? 'bg-black' : 'invisible'}`} />
          </div>
          <div className='flex flex-col'
            onClick={() => setSelectedServiceType("Graphic Design")}
          >
            <div>
              Graphic Design
            </div>
            <div className={`h-1 ${selectedServiceType === "Graphic Design" ? 'bg-black' : 'invisible'}`} />
          </div>
          <div className='flex flex-col'
            onClick={() => setSelectedServiceType("Voice Over")}
          >
            <div>
              Voice Over
            </div>
            <div className={`h-1 ${selectedServiceType === "Voice Over" ? 'bg-black' : 'invisible'}`} />
          </div>
          <div className='flex flex-row gap-5 text-[#2E90EB]'>
            <p className='self-center'>
              View All
            </p>
            <img src={arrow_circle}
              alt="arrow circle"
            />
          </div>
        </div>
        <div className='flex flex-wrap gap-3 justify-center'>
          <div className="w-sm flex flex-row h-70 font-inter bg-[#F3F3F3] relative items-center">
            <div className='flex flex-ro items-center justify-center p-3'>
              <p className='text-wrap font-Archivo font-bold text-3xl self-start pt-3'>
                Our Best Sellers
              </p>
              <img src={mr_pink_hair}
                alt="mr pink hair"
              />
            </div>
            <button className='bg-[#CFD2DA] flex flex-row absolute bottom-20 w-57 left-3 gap-4 justify-center'>
              <p className='font-arvo text-3xl font-bold text-[#565E6D]'>
                Shop Now
              </p>
              <img src={arrow_right}
                alt="arrow right"
              />
            </button>
          </div>
          <ServiceItem
            data={services}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home