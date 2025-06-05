import React, { useState, useEffect, useRef, useContext } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmojiPicker from 'emoji-picker-react';
import { socket } from '../../App';
import upload from "../../assets/chat_upload.svg"
import emote from "../../assets/chat_emote.svg"
import send from "../../assets/chat_send.svg"
import sendfrom from "../../assets/chat_uploadFromComp.svg"
import default_avatar from "../../assets/default-avatar.png"
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import logo from '../../assets/logo_in_chat.png'
import { authAPI, chatAPI } from "../../constants/APIRoutes"
import axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext';
import { imageShow } from '../../constants/DriveLinkPrefixes';
import Message from '../../components/message/Message';

const Chat = () => {
  const { roomId } = useParams();
  const { auth } = useContext(AuthContext);
  const [messageInput, setMessageInput] = useState("");
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isEmoteSelectorVisible, setIsEmoteSelectorVisible] = useState(false);
  const emoteSelectorRef = useRef(null);
  const navigate = useNavigate();

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
  const [roomIndex, setRoomIndex] = useState(null);
  const [currentRoomMessageList, setCurrentRoomMessageList] = useState([]);
  const [disableMessaging, setDisableMessaging] = useState(false);
  const chatScrollUp = useRef(null)

  const handleSendMessage = async () => {
    if (messageInput.trim() === "" || disableMessaging) return;
    const newMessage = {
      roomId: roomId,
      senderId: auth?.data?.auth?.id,
      content: messageInput,
      type: "text",
    };
    console.log("text message", newMessage);
    socket.emit("send_message", newMessage);
    setMessageInput("");
  };

  const handleSendFile = async (file) => {
    const isImage = file.type.startsWith("image/");
    const detectedType = isImage ? "image" : "file";
    const newMessage = new FormData();
    newMessage.append("message_file", file);
    newMessage.append("roomId", roomId);
    newMessage.append("senderId", auth?.data?.auth?.id);
    newMessage.append("type", detectedType);
    console.log("file", file);
    console.log("file message", newMessage);
    setMessageInput("uploading...");
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
    setIsUploadVisible(false);
  };

  const joinRoom = (index) => {
    if (auth?.data?.auth?.id && availableRooms[index]) {
      socket.emit("join_room", availableRooms[index]._id);
      const handleSwitchRoom = (url) => {
        navigate(url);
        socket.off("switch_room", handleSwitchRoom);
      };

      socket.on("switch_room", handleSwitchRoom);
    }
  };

  useEffect(() => {
    socket.emit("get_rooms", auth?.data?.auth?.id);
    const handleReceiveRooms = ({ roomList, userList }) => {
      setAvailableRooms(roomList);
      setAvailableUsers(userList);
      const index = roomList.findIndex(room => room._id === roomId);
      setRoomIndex(index);
    };
    socket.on("receive_rooms", handleReceiveRooms);

    return () => {
      socket.off("receive_rooms", handleReceiveRooms);
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      console.log("Emitting message for roomId:", roomId);
      socket.emit("get_room_message", roomId);
    }
  }, [roomId]);

  console.log("available rooms", availableRooms)
  console.log("index", roomIndex);

  useEffect(() => {
    const handleReceiveMessage = (messageList) => {
      console.log("receiving message");
      setCurrentRoomMessageList(messageList);
      setDisableMessaging(false);
      setMessageInput("");
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

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
  console.log(availableUsers);
  let lastRenderedDate = null;

  return (
    <div
      ref={chatScrollUp}
    >
      <Navbar />

      <div className='flex justify-around'>
        <div className='mt-[150px] mb-[50px] h-[800px] w-fit font-inter bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
          <div className="max-w-80 min-w-80">
            <div className="bg-gradient-to-r from-[#2E5077] to-[#4391b0] px-4 py-4">
              <h2 className="font-bold text-white font-Archivo text-2xl">Messages</h2>
            </div>
            <div className="space-y-0 max-h-[740px] overflow-y-auto">
              {Array.isArray(availableUsers) && availableUsers.length > 0 ? (
                availableUsers.map((chat, i) => (
                  <div
                    key={chat?._id}
                    className={`flex items-center space-x-3 p-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 
                    border-b border-gray-100 ${roomIndex === i ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
                    onClick={() => {
                      setRoomIndex(i);
                      joinRoom(i);
                    }}
                  >
                    <div className="w-[60px] h-[60px] relative">
                      <img
                        src={
                          !chat?.picture || chat?.picture === "temp"
                            ? default_avatar
                            : `${imageShow}${chat?.picture}`
                        }
                        alt={chat?.name}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = default_avatar;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className='font-semibold text-gray-800 text-lg truncate'>{chat?.name}</div>
                      <div className='text-sm text-gray-500 truncate'>Click to start conversation</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-20 px-6">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg">
                    Halo, sepertinya kamu belum melakukan percakapan dengan freelancer kami.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex-1 max-w-[1000px] flex flex-col mt-[150px] mb-[50px] h-[800px] font-inter bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
          <div className="bg-gradient-to-r from-[#2E5077] to-[#4391b0] p-6 shadow-lg">
            {availableUsers[roomIndex] &&
              <div className="flex items-center">
                <div className="w-16 h-16 relative">
                  <img
                    src={availableUsers[roomIndex]?.picture == "temp" ?
                      default_avatar
                      :
                      `${imageShow}${availableUsers[roomIndex]?.picture}`}
                    alt={availableUsers[roomIndex]?.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white/20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = default_avatar;
                    }}
                  />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-white text-2xl">{availableUsers[roomIndex]?.name}</div>
                  <div className="text-white/80 text-sm">
                    {
                      availableRooms[roomIndex]?.users[0] === auth?.data?.auth?.id ?
                        (`Last seen: ${getRelativeTimeLabel(availableRooms[roomIndex]?.lastSeen[0])}`)
                        :
                        (`Last seen: ${getRelativeTimeLabel(availableRooms[roomIndex]?.lastSeen[1])}`)
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <ScrollToBottom
            className="flex-1 overflow-y-auto bg-gray-50"
            style={{
              backgroundImage: `url(${logo})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundAttachment: "fixed",
              opacity: 0.95,
            }}
          >
            <div className="flex flex-col gap-2 text-[15px] space-y-4 px-6 py-6">
              {Array.isArray(currentRoomMessageList) && currentRoomMessageList.length === 0 ? (
                <div className="flex justify-center items-center h-full py-32">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <p className="text-gray-400 text-xl max-w-md">
                      Ayo, mulai percakapanmu dengan freelancer yg kamu inginkan segera.
                    </p>
                  </div>
                </div>
              ) : (
                currentRoomMessageList?.map((message, index) => {
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
                      {label && (
                        <div className="flex items-center justify-center my-6">
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-[80px]" />
                          <span className="px-4 text-gray-500 text-sm bg-gray-50 rounded-full py-1 font-medium">{label}</span>
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-[80px]" />
                        </div>
                      )}
                      <Message message={message} roomId={availableRooms[roomIndex]?._id} />
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </ScrollToBottom>

          {availableUsers[roomIndex] &&
            <div className="relative flex items-center p-6 gap-3 bg-white border-t border-gray-200">
              <button
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={toggleUpload}
              >
                <img src={upload} alt="Upload" className="w-6 h-6" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  disabled={disableMessaging}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="w-full py-4 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                />
                <img
                  src={emote}
                  alt="Emote"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={toggleEmoteSelector}
                />
              </div>
              <button
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-200"
                onClick={handleSendMessage}
              >
                <img src={send} alt="Send" className="w-5 h-5 filter brightness-0 invert" />
              </button>

              {isEmoteSelectorVisible && (
                <div
                  ref={emoteSelectorRef}
                  className="absolute bottom-[70px] right-12 bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden"
                  style={{
                    width: "320px",
                    height: "320px",
                  }}
                >
                  <EmojiPicker onEmojiClick={handleEmoteClick} />
                </div>
              )}

              {isUploadVisible && (
                <div
                  className={`absolute bottom-[70px] left-5 rounded-xl shadow-2xl bg-white border border-gray-200 transition-all duration-300 ease-in-out ${isUploadVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <label className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 rounded-xl">
                    <img src={sendfrom} alt="Upload Icon" className="w-5 h-5" />
                    <span className="text-[16px] font-medium text-gray-700">Upload from Computer</span>
                    <input
                      type="file"
                      name="message_file"
                      className="hidden"
                      disabled={disableMessaging}
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          setDisableMessaging(true);
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
        <div className='mt-[150px] mb-[50px] h-fit w-[320px] font-inter bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
          {availableUsers[roomIndex] &&
            <div className="w-full">
              <div className="bg-gradient-to-r from-[#2E5077] to-[#4391b0] px-4 py-4">
                <h2 className="font-bold text-white text-[20px]">About {availableUsers[roomIndex]?.name}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">From</span>
                    <span className="text-gray-800 font-semibold">{availableUsers[roomIndex]?.location === "" ? "Unspecified" : availableUsers[roomIndex]?.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Joined Since</span>
                    <span className="text-gray-800 font-semibold">
                      {availableUsers[roomIndex]?.joinedDate &&
                        new Date(availableUsers[roomIndex].joinedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="font-bold text-gray-800">{availableUsers[roomIndex]?.rating}</span>
                      <span className="text-gray-500">({availableUsers[roomIndex]?.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <Footer refScrollUp={chatScrollUp} />
    </div>
  );
};

export default Chat