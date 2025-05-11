import React, { useState, useEffect, useRef, useContext } from 'react'
import { socket } from '../../App';
import { AuthContext } from '../../contexts/AuthContext';
import { fileDownload, imageShow } from '../../constants/DriveLinkPrefixes';
import file from "../../assets/chat_file.png"

const Message = ({ message, roomId }) => {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageloading] = useState(false);
  const { auth } = useContext(AuthContext);

  const getTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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

  if (isLoading && (message.type === "file" || message.type === "image")) {
    return (
      <div className={`p-4 rounded-lg shadow-md max-w-[45%] ${message.senderId === auth?.data?.auth?.id ? "self-end" : "self-start"
        }`}>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (message.type === "text") {
    return (
      <div
        className={`p-4 rounded-lg shadow-md max-w-[45%] ${message.senderId === auth?.data?.auth?.id ? "self-end" : "self-start"
          }`}
        style={message.senderId === auth?.data?.auth?.id ? {
          backgroundColor: "rgb(255, 255, 255, 0.65)",
        } : {
          backgroundColor: "rgb(0, 0, 0, 1)"
        }}
      >
        <p className={`${message.senderId === auth?.data?.auth?.id ? "text-black" : "text-white"} wrap-break-word`}>
          {message.content}
        </p>
        <div className={`text-right text-xs ${message.senderId === auth?.data?.auth?.id ? "text-gray-600" : "text-gray-200"
          }`}>
          {getTime(message.time)}
        </div>
      </div>
    );
  }

  {
    isImageLoading && message.type === "image" && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (message.type === "image" && !isImageLoading) {
    return (
      <div
        className={`p-2 rounded-lg shadow-md max-w-[45%] ${message.senderId === auth?.data?.auth?.id ? "self-end" : "self-start"
          }`}
        style={message.senderId === auth?.data?.auth?.id ? {
          backgroundColor: "rgb(255, 255, 255, 0.65)",
        } : {
          backgroundColor: "rgb(0, 0, 0, 1)"
        }}
      >
        <a
          href={`${imageShow}${message.content}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`${imageShow}${message.content}`}
            alt="Image"
            className="w-full h-auto rounded-lg object-contain"
            onLoad={() => setIsImageloading(false)}
          />
        </a>
        <div
          className={`text-right text-xs mt-1 ${message.senderId === auth?.data?.auth?.id ? "text-gray-600" : "text-gray-200"
            }`}
        >
          {getTime(message.time)}
        </div>
      </div>
    );
  }

  if (message.type === "file") {
    return (
      <a
        href={`${fileDownload}${message.content}`}
        download={fileData?.fileName}
        className={`p-4 rounded-lg shadow-md max-w-[45%] h-30 bg-white flex items-center justify-between gap-3 ${message.senderId === auth?.data?.auth?.id ? "self-end" : "self-start"
          } no-underline`}
        style={{
          textDecoration: "none",
        }}
      >
        <img src={file} alt="File Icon" className="w-[28px]" />
        <div className="flex-1">
          <p className="font-semibold text-sm break-all">
            {isLoading ? "Loading..." : fileData?.fileName}
          </p>
          <p className="text-sm text-gray-500">
            {isLoading ? "" : fileData?.fileSize}
          </p>
        </div>
        <div className="text-right text-gray-400 text-xs self-end">
          {getTime(message.time)}
        </div>
      </a>
    );
  }
}

export default Message;