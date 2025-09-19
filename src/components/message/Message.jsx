import React, { useState, useEffect, useRef, useContext } from 'react'
import { socket } from '../../App';
import { AuthContext } from '../../contexts/AuthContext';
import { fileDownload, imageShow } from '../../constants/DriveLinkPrefixes';
import file from "../../assets/chat_file.png"

const Message = ({ message, roomId }) => {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { auth } = useContext(AuthContext);
  const messageRef = useRef(null);

  const getTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const isOwnMessage = message.senderId === auth?.data?.auth?.id;

  useEffect(() => {
    setIsLoading(true);
    setFileData(null);
    if (message.type === "file") {
      console.log("file message request", message);
      socket.emit("get_file_data", { fileId: message.content, roomId: roomId });
      const handleFileData = (data) => {
        setFileData(data);
        setIsLoading(false);
      };
      socket.on("receive_file_data", handleFileData);

      return () => {
        socket.off("receive_file_data", handleFileData);
      };
    } else {
      setIsLoading(false);
    }
  }, [message.content, message.type, roomId]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log("Loading timeout for:", message.content);
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, message.content]);

  // Animation entrance effect
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.style.opacity = '0';
      messageRef.current.style.transform = 'translateY(10px)';
      
      const timer = setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.style.transition = 'all 0.3s ease-out';
          messageRef.current.style.opacity = '1';
          messageRef.current.style.transform = 'translateY(0)';
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, []);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-t-blue-300 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );

  if (isLoading && (message.type === "file" || message.type === "image")) {
    return (
      <div
        ref={messageRef}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className={`
          relative overflow-hidden rounded-2xl shadow-lg max-w-[80%] sm:max-w-[60%] md:max-w-[45%] min-w-[120px]
          ${isOwnMessage
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            : "bg-white border border-gray-200 text-gray-800"
          }
        `}>
          <LoadingSpinner />
          <div className="px-3 pb-2">
            <span className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "text") {
    return (
      <div
        ref={messageRef}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4 group`}
      >
        <div className={`
          relative overflow-hidden rounded-2xl shadow-lg max-w-[80%] sm:max-w-[60%] md:max-w-[45%] min-w-[80px]
          transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
          ${isOwnMessage
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            : "bg-white border border-gray-200 text-gray-800 hover:border-gray-300"
          }
        `}>
          {/* Message bubble tail */}
          <div className={`
            absolute bottom-0 w-4 h-4 transform rotate-45
            ${isOwnMessage
              ? "bg-blue-600 -right-2"
              : "bg-white border-r border-b border-gray-200 -left-2"
            }
          `}></div>

          <div className="relative z-10 px-3 py-2 sm:px-4 sm:py-3">
            <p className={`
              text-sm leading-relaxed break-words
              ${isOwnMessage ? "text-white" : "text-gray-800"}
            `}>
              {message.content}
            </p>
            <div className={`
              text-right text-xs mt-2 opacity-75
              ${isOwnMessage ? "text-blue-100" : "text-gray-500"}
            `}>
              {getTime(message.time)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "image") {
    return (
      <div
        ref={messageRef}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4 group`}
      >
        <div className={`
          relative overflow-hidden rounded-2xl shadow-lg max-w-[80%] sm:max-w-[70%] md:max-w-[45%] min-w-[150px]
          transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
          ${isOwnMessage
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-white border border-gray-200"
          }
        `}>
          {/* Message bubble tail */}
          <div className={`
            absolute bottom-0 w-4 h-4 transform rotate-45
            ${isOwnMessage
              ? "bg-blue-600 -right-2"
              : "bg-white border-r border-b border-gray-200 -left-2"
            }
          `}></div>

          <div className="relative z-10 p-2">
            <div className="relative overflow-hidden rounded-xl">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
                  <LoadingSpinner />
                </div>
              )}
              
              {imageError ? (
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <div className="text-gray-400 text-2xl mb-2">📷</div>
                    <p className="text-gray-500 text-sm">Image failed to load</p>
                  </div>
                </div>
              ) : (
                <a
                  href={`${imageShow}${message.content}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`${imageShow}${message.content}`}
                    alt="Shared image"
                    className={`
                      w-full h-auto rounded-xl object-cover transition-opacity duration-300
                      ${isImageLoading ? 'opacity-0' : 'opacity-100'}
                      hover:opacity-90
                    `}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                      setIsImageLoading(false);
                      setImageError(true);
                    }}
                  />
                </a>
              )}
            </div>
            
            <div className={`
              text-right text-xs mt-2 px-1
              ${isOwnMessage ? "text-blue-100" : "text-gray-500"}
            `}>
              {getTime(message.time)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "file") {
    return (
      <div
        ref={messageRef}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4 group`}
      >
        <a
          href={`${fileDownload}${message.content}`}
          download={fileData?.fileName}
          className={`
            relative overflow-hidden rounded-2xl shadow-lg max-w-[90%] sm:max-w-[70%] md:max-w-[45%] min-w-[200px]
            transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
            bg-white border border-gray-200 hover:border-gray-300
            no-underline block
          `}
          style={{ textDecoration: "none" }}
        >
          {/* Message bubble tail */}
          <div className="absolute bottom-0 w-4 h-4 transform rotate-45 bg-white border-r border-b border-gray-200 -left-2"></div>

          <div className="relative z-10 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <img src={file} alt="File" className="w-5 h-5 sm:w-6 sm:h-6 filter brightness-0 invert" />
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {isLoading ? "Loading..." : fileData?.fileName || "Unknown file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isLoading ? "Getting file info..." : fileData?.fileSize || "Unknown size"}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="text-right text-xs text-gray-500 mt-3">
              {getTime(message.time)}
            </div>
          </div>
        </a>
      </div>
    );
  }

  return null;
}

export default Message;