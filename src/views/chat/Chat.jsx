import React, { useState, useEffect, useRef, useContext } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link, useNavigate } from 'react-router-dom'
import EmojiPicker from 'emoji-picker-react';
import { socket } from '../../App';
import upload from "../../assets/chat_upload.svg"
import emote from "../../assets/chat_emote.svg"
import send from "../../assets/chat_send.svg"
import sendfrom from "../../assets/chat_uploadFromComp.svg"
import file from "../../assets/chat_file.png"
import default_avatar from "../../assets/default-avatar.png"
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import Alex from "../../assets/img_alex-sutejo.svg"
import Salsabila from "../../assets/img_Salsabila.svg"
import AlexLamar from "../../assets/img_Alex-Lamar.svg"
import Nina from "../../assets/img_Nina-Lanae.svg"
import logo from '../../assets/logo_in_chat.png'
import { authAPI, chatAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext';
import { imageShow } from '../../constants/DriveLinkPrefixes';
import Message from '../../components/message/Message';

const Chat = () => {
  const { auth } = useContext(AuthContext);
  const [messageInput, setMessageInput] = useState("");
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isEmoteSelectorVisible, setIsEmoteSelectorVisible] = useState(false);
  const emoteSelectorRef = useRef(null);

  const toggleUpload = () => {
    setIsUploadVisible(!isUploadVisible);
  };

  const toggleEmoteSelector = () => {
    setIsEmoteSelectorVisible(!isEmoteSelectorVisible);
  };

  const handleEmoteClick = (emojiObject) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emoteSelectorRef.current &&
        !emoteSelectorRef.current.contains(event.target)
      ) {
        setIsEmoteSelectorVisible(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsEmoteSelectorVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [roomIndex, setRoomIndex] = useState(0);
  const [currentRoomMessageList, setCurrentRoomMessageList] = useState([]);

  const getTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };


  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    const newMessage = {
      roomId: availableRooms[roomIndex]?._id,
      senderId: auth?.data?.auth?.id,
      content: messageInput,
      type: "text",
    };
    console.log("text message", newMessage);
    await socket.emit("send_message", newMessage);
    setMessageInput("");
  };

  const handleSendFile = async (file) => {
    const isImage = file.type.startsWith("image/");
    const detectedType = isImage ? "image" : "file";
    const newMessage = new FormData();
    newMessage.append("message_file", file);
    newMessage.append("roomId", availableRooms[roomIndex]?._id);
    newMessage.append("senderId", auth?.data?.auth?.id);
    newMessage.append("type", detectedType);
    console.log("file", file);
    console.log("file message", newMessage);
    try {
      const response = await axios.post(`${chatAPI}/upload-file-message`,
        newMessage,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("response send file", response.data);
    } catch (error) {
      console.error('Error send message file:', error);
    }
    setMessageInput("");
    setIsUploadVisible(false);
  };

  const joinRoom = (index) => {
    if (auth?.data?.auth?.id && availableRooms[index]) {
      console.log("room", availableRooms[index]);
      socket.emit("join_room", availableRooms[index]._id);
      console.log(currentRoomMessageList);
    };
  }

  useEffect(() => {
    socket.emit("get_rooms", auth?.data?.auth?.id);
    socket.on("receive_rooms", ({ roomList, userList }) => {
      console.log("room", roomList);
      console.log("user", userList);
      setAvailableRooms(roomList);
      setAvailableUsers(userList);
    });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (messageList) => {
      console.log("received list", messageList);
      setCurrentRoomMessageList(messageList);
    });
  }, [socket, roomIndex]);

  const getRelativeDateLabel = (time) => {
    const messageDate = new Date(time);
    const now = new Date();
    const messageMidnight = new Date(messageDate);
    messageMidnight.setHours(0, 0, 0, 0);
    const nowMidnight = new Date(now);
    nowMidnight.setHours(0, 0, 0, 0);
    const diffTime = nowMidnight - messageMidnight;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays === 2) return "2 days ago";
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeTimeLabel = (time) => {
    const messageDate = new Date(time);
    const now = new Date();
    const diffMs = now - messageDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const messageMidnight = new Date(messageDate);
    messageMidnight.setHours(0, 0, 0, 0);
    const nowMidnight = new Date(now);
    nowMidnight.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((nowMidnight - messageMidnight) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      if (diffHours === 0) return "Just now";
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays === 2) return "2 days ago";
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  let lastRenderedDate = null;

  return (
    <div className=''>
      <Navbar />

      <div className='flex'>
        {/* Side Bar */}
        <div className='flex mt-[150px] mb-[50px] ml-[20px] mr-[10px] h-[800px] w-fit font-inter'
          style={{
            borderRadius: "12px 12px 0px 0px",
            background: "#F3F3F3",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="">
            <h2 className="font-bold pl-3 pt-2 mb-1 font-Archivo text-[32px]">Messages</h2>
            <div className="space-y-0">
              {availableUsers.map((chat, i) => (
                <div
                  key={chat._id}
                  className={`flex items-center space-x-2 p-2 hover:bg-gray-300 cursor-pointer 
                                border-b border-gray-300 ${roomIndex === i ? "bg-gray-300" : "bg-[#F3F3F3]"
                    }`}
                  onClick={() => {
                    setRoomIndex(i)
                    joinRoom(i);
                  }}
                >
                  <div className="w-[65px] h-[65px">
                    <img
                      src={chat.picture == "temp" ? default_avatar : `${imageShow}${chat.picture}`}
                      alt={chat.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className='font-semibold text-3xl'>{chat.name}</div>
                    <div className="text-[15px] font-medium text-[#000000] truncate w-60">{"sasdsasdasdasda"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex-1 flex flex-col mt-[150px] mb-[50px] ml-[20px] mr-[10px] h-[800px] w-fit font-inter'
          style={{
            borderRadius: "12px 12px 0px 0px",
            background: "#F3F3F3",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {availableUsers[roomIndex] &&
            <div className="flex items-center bg-[#F3F3F3] p-4 mb-2 shadow-md"
              style={{
                borderRadius: "12px 12px 0px 0px",
                background: "#F3F3F3",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="w-[67px] h-[67px]">
                <img
                  src={availableUsers[roomIndex]?.picture == "temp" ? default_avatar : `${imageShow}${availableUsers[roomIndex]?.picture}`}
                  alt={availableUsers[roomIndex]?.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="ml-4">
                <div className="font-bold text-[32px]">{availableUsers[roomIndex]?.name}</div>
                {
                  availableRooms[roomIndex]?.users[0] === auth?.data?.auth?.id ?
                    (<div className="text-[#00000] text-[16px]">Last seen: {getRelativeTimeLabel(availableRooms[roomIndex]?.lastSeen[0])}</div>)
                    :
                    (<div className="text-[#00000] text-[16px]">Last seen: {getRelativeTimeLabel(availableRooms[roomIndex]?.lastSeen[1])}</div>)
                }
              </div>
            </div>
          }

          {/* Chat Messages */}
          <ScrollToBottom
            className="flex-1 bg-[#F9F9F9] pt-1 overflow-y-auto"
            style={{
              backgroundImage: `url(${logo})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          >
            {/* Chat Content */}
            <div className="flex flex-col gap-2 text-[15px] space-y-4 px-10 py-5">
              {Array.isArray(currentRoomMessageList) && currentRoomMessageList.map((message, index) => {
                const messageDate = new Date(message.time);
                const messageMidnight = new Date(messageDate);
                messageMidnight.setHours(0, 0, 0, 0);

                let showDateLabel = false;

                if (!lastRenderedDate || messageMidnight.getTime() !== lastRenderedDate.getTime()) {
                  showDateLabel = true;
                  lastRenderedDate = messageMidnight;
                }

                const label = showDateLabel ? getRelativeDateLabel(message.time) : null;
                return (
                  <React.Fragment key={index}>
                    {/* Chat Date */}
                    {label && (
                      <div className="flex items-center justify-center -space-x-1">
                        <div className="flex-1 h-[1px] max-w-[50px] bg-black"></div>
                        <span className="px-3 text-gray-500">
                          {label}
                        </span>
                        <div className="flex-1 h-[1px] max-w-[50px] bg-black"></div>
                      </div>
                    )}

                    {/* Message */}
                    <Message message={message} roomId={availableRooms[roomIndex]?._id} />
                  </React.Fragment>
                );
              })}
            </div>
          </ScrollToBottom>

          {/* Input Pesan */}
          {availableUsers[roomIndex] &&
            <div className="relative flex items-center p-4 gap-2 bg-[#EBECEC]">
              <button className="p-2" onClick={toggleUpload}>
                <img src={upload} alt="Upload" className="w-6 h-6 cursor-pointer" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="w-full p-2 pr-10 bg-white outline-none"
                />
                <img
                  src={emote}
                  alt="Emote"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
                  onClick={toggleEmoteSelector} // Tampilkan emote selector
                />
              </div>
              <button className="p-2" onClick={handleSendMessage}>
                <img src={send} alt="Send" className="w-6 h-6 cursor-pointer" />
              </button>

              {/* Emote Selector */}
              {isEmoteSelectorVisible && (
                <div
                  ref={emoteSelectorRef} // Referensi untuk emote selector
                  className="absolute bottom-[220px] right-12 bg-white shadow-lg rounded-lg "
                  style={{
                    width: "300px",
                    height: "300px",
                  }}
                >
                  <EmojiPicker onEmojiClick={handleEmoteClick} />
                </div>
              )}

              {/* Floating Div */}
              {isUploadVisible && (
                <div
                  className={`absolute bottom-[80px] left-5 rounded-[3px] shadow-lg bg-gray-300 transition-all duration-300 ease-in-out ${isUploadVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <label className="flex items-center gap-2 p-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer">
                    <img src={sendfrom} alt="Upload Icon" className="w-5 h-5" />
                    <span className="text-[16px] font-medium">Upload from Computer</span>
                    <input
                      type="file"
                      name="message_file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleSendFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          }
        </div>
        <div className='flex mt-[150px] mb-[50px] ml-[20px] mr-[20px] h-fit w-[308px] font-inter'
          style={{
            borderRadius: "12px 12px 0px 0px",
            background: "#F3F3F3",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {availableUsers[roomIndex] &&
            <div className="p-4 w-full">
              <h2 className="font-bold text-[20px] mb-2 border-b pb-2">About {availableUsers[roomIndex]?.name}</h2>
              <div className="grid grid-cols-2 text-[16px] gap-y-5 p-2">
                <div className="text-gray-600">From</div>
                <div className='text-right'>{availableUsers[roomIndex]?.location}</div>
                <div className="text-gray-600">Joined Since</div>
                <div className="text-right">
                  {availableUsers[roomIndex]?.joinedDate &&
                    new Date(availableUsers[roomIndex].joinedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                </div>
                <div className="text-gray-600">Rating</div>
                <div className="text-right flex items-center justify-end">
                  <span className="text-yellow-400 text-[17px]">★</span>
                  <span className="ml-1 font-bold">{availableUsers[roomIndex]?.rating}</span>
                  <span className="ml-1 text-gray-500">({availableUsers[roomIndex]?.reviews})</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <Footer />
    </div >
  );
};

export default Chat