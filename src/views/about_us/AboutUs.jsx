import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import bell from "../../assets/bell_icon.svg"
import heart from "../../assets/heart_icon.svg"
import message from "../../assets/message_icon.svg"
import people from "../../assets/people_icon.svg"
import order from "../../assets/order_icon.svg"
import search from "../../assets/search_btn.svg"
import Footer from '../../components/footer/Footer'
import logo from '../../assets/logo.svg'
import downarrow from "../../assets/down_arrow.svg"
import diagram from "../../assets/diagram.png"
import about_us_image from "../../assets/about_us_img.svg"
import cantfind from "../../assets/yuppies_managing.svg"
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import Navbar from '../../components/navbar/Navbar'

const AboutUs = () => {
    const [expandedItems, setExpandedItems] = useState([]);

    const toggleExpand = (index) => {
        if (expandedItems.includes(index)) {
            setExpandedItems(expandedItems.filter((item) => item !== index));
        } else {
            setExpandedItems([...expandedItems, index]);
        }
    };

    return (
        <div>
            <Navbar/>

            <div className="block font-Archivo text-[#171A1F] mx-20 my-40">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-1/2">
                        <h1 className="text-[64px] font-bold mb-8">About Us</h1>
                    </div>
                    
                    <div className="lg:block lg:w-[2000px]">
                        <div className="relative">
                            <img 
                                src={about_us_image} 
                                alt="About Us" 
                                className="w-full h-auto rounded-xl mb-4"
                            />
                        </div>
                        
                        <div className="text-3xl grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 gap-6 md:gap-6 md:flex-row">
                            <p className="leading-relaxed">
                                Kami menyediakan platform yang menghubungkan pelaku bisnis dan startup teknologi dengan freelancer berkualitas. Melalui B-Connect, Anda dapat menemukan talenta terbaik untuk menyelesaikan proyek Anda secara efisien dan terpercaya.
                            </p>
                            <p className="leading-relaxed">
                                Kami percaya bahwa kolaborasi yang tepat dapat mempercepat pertumbuhan bisnis. Dengan dukungan sistem yang aman dan tim yang berpengalaman, kami hadir untuk membantu Anda mencapai tujuan dengan lebih cepat.
                            </p>
                        </div>
                    </div>
                </div>   

                <div className="relative bg-[#F3F3F3] w-full h-auto rounded-[12px] my-15">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 h-full justify-center items-center">
                        <div>
                            <img src={diagram} alt="diagram" />
                        </div>
                        <div>
                            <h1 className="text-[64px] font-normal pb-2">Our Values</h1>
                            <p className="text-[30px] font-normal">
                                Bersama B-Connect, Anda mendapatkan lebih dari sekadar platform — Anda mendapatkan mitra terpercaya dalam menyelesaikan pekerjaan dan membangun koneksi yang bermakna.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='flex relative flex-col md:flex-row gap-10 py-10 h-full'>
                    <div className='w-[550px] '>
                        <h1 className='text-[64px] font-bold pb-2'>Why Us?</h1>
                        <p className='text-[30px]'>
                        kami membangun B-Connect sebagai solusi nyata untuk menghubungkan kebutuhan dan keahlian. Kami tahu betapa berharganya waktu, kualitas, dan kepercayaan
                        </p>
                        <p className='text-[30px]'>—</p>
                        <p className='text-[30px]'>dan kami hadir untuk menjawabnya.</p>
                    </div>

                    {/* Bagiam expandable */}
                    <div className="relative w-full flex flex-col gap-2 top-20 p-5">
                        {/* Elemen 1 */}
                        <div className="flex relative cursor-pointer" onClick={() => toggleExpand(1)}>
                            <p className='text-[40px] font-semibold'>Apa itu B-Connect?</p>
                            <div className="ml-auto">
                                <img 
                                    src={downarrow} 
                                    alt="Expand" 
                                    className={`absolute right-0 transition-transform duration-500 ${
                                        expandedItems.includes(1) ? '-rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedItems.includes(1) ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                            }`}
                        >
                            <p className='text-[30px]'>
                                B-Connect adalah platform yang menghubungkan mahasiswa dan alumni Binus University dengan klien atau project owner yang membutuhkan jasa freelance. Tujuannya adalah menciptakan ekosistem kerja profesional di lingkungan Binus, sekaligus membuka peluang kolaborasi dan pengalaman kerja nyata.
                            </p>
                        </div>
                        <div
                            className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                                expandedItems.includes(1) ? 'h-[2px]' : 'h-[1px]'
                            }`}
                        ></div>

                        {/* Elemen 2 */}
                        <div className="flex relative cursor-pointer" onClick={() => toggleExpand(2)}>
                            <p className='text-[40px] font-semibold'>Bagaimana cara mencari freelancer di B-Connect?</p>
                            <div className="ml-auto">
                                <img 
                                    src={downarrow} 
                                    alt="Expand" 
                                    className={`absolute right-0 transition-transform duration-500 ${
                                        expandedItems.includes(2) ? '-rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedItems.includes(2) ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                            }`}
                        >
                            <p className='text-[30px]'>
                                Anda bisa mencari freelancer sesuai kebutuhan proyek melalui sistem pencarian kami yang intuitif, cepat, dan tepat. Cukup masukkan kategori atau skill yang dibutuhkan, dan B-Connect akan menampilkan freelancer berkualitas dari komunitas Binus.
                            </p>
                        </div>
                        <div
                            className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                                expandedItems.includes(2) ? 'h-[2px]' : 'h-[1px]'
                            }`}
                        ></div>

                        {/* Elemen 3 */}
                        <div className="flex relative cursor-pointer" onClick={() => toggleExpand(3)}>
                            <p className='text-[40px] font-semibold'>Apakah sistem pembayaran di B-Connect aman?</p>
                            <div className="ml-auto">
                                <img 
                                    src={downarrow} 
                                    alt="Expand" 
                                    className={`absolute right-0 transition-transform duration-500 ${
                                        expandedItems.includes(3) ? '-rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedItems.includes(3) ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                            }`}
                        >
                            <p className='text-[30px]'>
                                B-Connect adalah platform yang menghubungkan mahasiswa dan alumni Binus University dengan klien atau project owner yang membutuhkan jasa freelance. Tujuannya adalah menciptakan ekosistem kerja profesional di lingkungan Binus, sekaligus membuka peluang kolaborasi dan pengalaman kerja nyata.
                            </p>
                        </div>
                        <div
                            className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                                expandedItems.includes(3) ? 'h-[2px]' : 'h-[1px]'
                            }`}
                        ></div>

                        {/* Elemen 4 */}
                        <div className="flex relative cursor-pointer" onClick={() => toggleExpand(4)}>
                            <p className='text-[40px] font-semibold'>Bagaimana B-Connect menjamin kualitas hasil kerja?</p>
                            <div className="ml-auto">
                                <img 
                                    src={downarrow} 
                                    alt="Expand" 
                                    className={`absolute right-0 transition-transform duration-500 ${
                                        expandedItems.includes(4) ? '-rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedItems.includes(4) ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                            }`}
                        >
                            <p className='text-[30px]'>
                                B-Connect adalah platform yang menghubungkan mahasiswa dan alumni Binus University dengan klien atau project owner yang membutuhkan jasa freelance. Tujuannya adalah menciptakan ekosistem kerja profesional di lingkungan Binus, sekaligus membuka peluang kolaborasi dan pengalaman kerja nyata.
                            </p>
                        </div>
                        <div
                            className={`transition-[height] duration-500 ease-in-out bg-black w-full ${
                                expandedItems.includes(4) ? 'h-[2px]' : 'h-[1px]'
                            }`}
                        ></div>
                    </div>
                </div>

                {expandedItems.length === 4 && (
                    <div className='relative bg-[#F3F3F3] max-w-fit mx-auto h-auto my-30 px-10'>
                        <div className='flex flex-col md:flex-row gap-10 justify-center items-center'>
                            <div>
                                <p className='text-[40px] font-semibold'>Can't find your answer?</p>
                                <p className='text-[30px] w-[450px]'>
                                    Tenang, tim B-Connect siap membantu kamu! Hubungi kami langsung jika kamu tidak menemukan jawaban yang kamu cari.
                                </p>
                                {/* Belom di konekin tombolnya */}
                                <button className='relative flex bg-[#565E6D] text-[#FFFFFF] text-[20px] max-w-fit h-[26px] p-6 mt-2 justify-center items-center text-center cursor-pointer'
                                onClick={() => navigate("/contact-us")}>
                                    Contact Us
                                </button>
                            </div>
                            <div>
                                <img src={cantfind} alt="cant_find_img?" className="mx-auto" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>        
    );
};

export default AboutUs