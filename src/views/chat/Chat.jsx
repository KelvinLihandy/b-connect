import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import upload from "../../assets/chat_upload.svg"
import emote from "../../assets/chat_emote.svg"
import send from "../../assets/chat_send.svg"

import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import Alex from "../../assets/img_alex-sutejo.svg"
import Salsabila from "../../assets/img_Salsabila.svg"
import AlexLamar from "../../assets/img_Alex-Lamar.svg"
import Nina from "../../assets/img_Nina-Lanae.svg"
import logo from '../../assets/logo_in_chat.png'
import { authAPI } from "../../constants/APIRoutes"
import axios from 'axios'

const USERS = [
    {
        id: 1,
        name: "Alex Sutejo",
        preview: "Alex : Menarik! Boleh tahu ...",
        lastSeen: "1 week ago",
        from: "Indonesia",
        joined: "Mar 2022",
        rating: 4.98,
        ratingCount: 202,
        image: Alex,
        messages: [
            { text: "Hai! perkenalkan saya Alex, terimakasih sudah memilih saya. Bisa kita mulai dari briefnya?", time: "15:41", date: "2025-07-23", sender: "Alex" },
            { text: "Hai Alex, iya Jadi, saya ingin membuat UI/UX untuk ide mobile apps saya.", time: "15:42", date: "2025-07-23", sender: "User" },
            { text: "Menarik! Boleh tahu app-nya tentang apa dan target penggunanya siapa?", time: "15:43", date: "2025-07-24", sender: "Alex" },
        ],
    },
    {
        id: 2,
        name: "Salsabila",
        preview: "Siti : Perfect. Thanks!",
        lastSeen: "2 days ago",
        from: "North Korea",
        joined: "Jan 2050",
        rating: 3.64,
        ratingCount: 24,
        image: Salsabila,
        messages: [
            { text: "Halo! Saya Salsabila, senang bisa bekerja sama dengan Anda. Ada yang ingin didiskusikan dulu sebelum mulai?", time: "10:05", date: "2025-07-20", sender: "Salsabila" },
            { text: "Halo Salsabila! Iya, saya ingin mendesain website portofolio saya.", time: "10:06", date: "2025-07-20", sender: "User" },
            { text: "Bagus sekali! Boleh dijelaskan konsep atau nuansa yang Anda inginkan untuk websitenya?", time: "10:07", date: "2025-07-20", sender: "Salsabila" },
        ],
    },
    {
        id: 3,
        name: "Alex Lamar",
        preview: "Alex : Boleh. Saya mau tahu ...",
        lastSeen: "5 hour ago",
        from: "Prindavan",
        joined: "Sep 1998",
        rating: 4.56,
        ratingCount: 425,
        image: AlexLamar,
        messages: [
        { text: "Hai! Perkenalkan saya Alex Lamar, terima kasih sudah memilih saya. Bisa kita mulai dari briefnya?", time: "15:41", date: "2025-07-23", sender: "Alex" },
        { text: "Hai Alex, iya Jadi, saya ingin membuat UI/UX untuk ide mobile apps saya.", time: "15:42", date: "2025-07-23", sender: "User" },
        { text: "Menarik! Boleh tahu app-nya tentang apa dan target penggunanya siapa?", time: "15:43", date: "2025-07-24", sender: "Alex" },
        ],
    },
    {
        id: 4,
        name: "Nina Lenae",
        preview: "Siti : Terima kasih!",
        lastSeen: "3 day ago",
        from: "Bekasi",
        joined: "Aug 1975",
        rating: 4.28,
        ratingCount: 461,
        image: Nina,
        messages: [
        { text: "Hai, saya Nina Lanae. Terima kasih sudah menghubungi! Apa yang ingin kita bahas pertama?", time: "08:30", date: "2025-07-22", sender: "Nina" },
        { text: "Halo Nina! Saya ingin membuat branding kit untuk usaha kopi saya.", time: "08:31", date: "2025-07-22", sender: "User" },
        { text: "Seru sekali! Boleh share sedikit tentang konsep atau nilai unik dari usaha kopinya?", time: "08:32", date: "2025-07-22", sender: "Nina" },
        ],
    },
];



const Chat = () => {
    const [activeUser, setActiveUser] = useState(USERS[0]);

    const handleUserClick = (user) => {
        setActiveUser(user); 
    };
    return (
        <div className=''>
            <Navbar />

            <div className='flex'>
                {/* Side Bar */}
                <div className='flex mt-[150px] mb-[50px] ml-[20px] mr-[10px] h-[900px] w-fit font-inter'
                    style={{
                        borderRadius: "12px 12px 0px 0px",
                        background: "#F3F3F3",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <div className="">
                        <h2 className="font-bold pl-3 pt-2 mb-1 font-Archivo text-[32px]">Messages</h2>
                        <div className="space-y-0">
                        {USERS.map((chat, i) => (
                            <div
                            key={chat.id}
                            className={`flex items-center space-x-2 p-2 hover:bg-gray-300 cursor-pointer 
                                border-b border-gray-300 ${
                                    activeUser.id === chat.id ? "bg-gray-300" : "bg-[#F3F3F3]"
                                }`}
                            onClick={() => handleUserClick(chat)} 
                            >
                            <div className="w-[65px] h-[65px">
                                <img
                                    src={chat.image}
                                    alt={chat.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <div className='font-semibold text-[20px]'>{chat.name}</div>
                                <div className="text-[15px] font-medium text-[#000000] truncate w-60">{chat.preview}</div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                
                {/* Chat Area */}
                <div className='flex-1 flex flex-col mt-[150px] mb-[50px] ml-[20px] mr-[10px] h-[900px] w-fit font-inter'
                    style={{
                        borderRadius: "12px 12px 0px 0px",
                        background: "#F3F3F3",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    {/* Header Chat */}
                    <div className="flex items-center bg-[#F3F3F3] p-4 mb-2 shadow-md"
                        style={{
                            borderRadius: "12px 12px 0px 0px",
                            background: "#F3F3F3",
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <div className="w-[67px] h-[67px]">
                            <img
                                src={activeUser.image}
                                alt={activeUser.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="ml-4">
                            <div className="font-bold text-[32px]">{activeUser.name}</div>
                            <div className="text-[#00000] text-[16px">Last seen: {activeUser.lastSeen}</div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                    className="flex-1 bg-[#F9F9F9] p-10 pt-1 overflow-y-auto"
                    style={{
                        backgroundImage: `url(${logo})`, 
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                    >
                        {/* Chat Content */}
                        <div className="flex flex-col gap-2 text-[15px] space-y-4">
                            {activeUser.messages.map((message, index) => {
                                const showDate =
                                    index === 0 || message.date !== activeUser.messages[index - 1].date;

                                return (
                                    <React.Fragment key={index}>
                                        {/* Chat Date */}
                                        {showDate && (
                                            <div className="flex items-center justify-center -space-x-1">
                                                <div className="flex-1 h-[1px] max-w-[50px] bg-black"></div>
                                                <span className="px-3 text-gray-500">
                                                    {new Date(message.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <div className="flex-1 h-[1px] max-w-[50px] bg-black"></div>
                                            </div>
                                        )}

                                        {/* Message */}
                                        <div
                                            className={`bg-white/60 p-4 rounded-lg shadow-md w-[45%] ${
                                                message.sender === "User" ? "self-end" : ""
                                            }`}
                                        >
                                            <p>{message.text}</p>
                                            <div className="text-right text-gray-400 text-xs">{message.time}</div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Input Pesan */}
                    <div className="flex items-center p-4 gap-2 bg-[#EBECEC]">
                        <button className="p-2">
                            <img src={upload} alt="Upload" className="w-6 h-6" />
                        </button>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-2 pr-10 bg-white outline-none"
                            />
                            <img
                                src={emote}
                                alt="Emote"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
                            />
                        </div>
                        <button className="p-2">
                            <img src={send} alt="Send" className="w-6 h-6 cursor-pointer" />
                        </button>
                    </div>
                </div>

                {/* About Details */}
                <div className='flex mt-[150px] mb-[50px] ml-[20px] mr-[20px] h-fit w-[308px] font-inter'
                    style={{
                        borderRadius: "12px 12px 0px 0px",
                        background: "#F3F3F3",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <div className="p-4 w-full">
                        <h2 className="font-bold text-[20px] mb-2 border-b pb-2">About {activeUser.name}</h2>
                        <div className="grid grid-cols-2 text-[16px] gap-y-5 p-2">
                            <div className="text-gray-600">From</div>
                            <div className='text-right'>{activeUser.from}</div>
                            <div className="text-gray-600">Joined Since</div>
                            <div className='text-right'>{activeUser.joined}</div>
                            <div className="text-gray-600">Rating</div>
                            <div className="text-right flex items-center justify-end">
                                <span className="text-yellow-400 text-[17px]">★</span>
                                <span className="ml-1 font-bold">{activeUser.rating}</span>
                                <span className="ml-1 text-gray-500">({activeUser.ratingCount})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>        
    );
};

export default Chat