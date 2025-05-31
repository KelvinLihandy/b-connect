import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { imageShow } from "../../constants/DriveLinkPrefixes";
import { CircularProgress } from '@mui/material'
import { Notebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import default_avatar from '../../assets/default-avatar.png'

const NotificationItem = ({ notification, unreadCount, setUnreadCount }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [read, setRead] = useState(notification.read);
  const navigate = useNavigate();
  const [localRead, setLocalRead] = useState(notification.read);

  useEffect(() => {
    setRead(notification.read);
  }, [notification.read]);


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

  return (
    <motion.div
      whileHover="hover"
      className={`border-b border-gray-400 cursor-pointer bg-white px-4 py-2`}
      onClick={() => {
        socket.emit("view_notification", notification);
        setRead(true);
        socket.once("redirect_notification", (url) => {
          setLocalRead(true);
          navigate(url);
        })
        setUnreadCount(unreadCount - 1);
      }}
    >
      <div className="flex text-black min-h-20">
        {!read && !localRead && (
          <div className="w-1 bg-black"></div>
        )}

        <div className="flex flex-row gap-4 w-full">
          <div className="relative w-12 h-12 min-w-12 self-center">
            <img
              className={`w-full h-full rounded-full object-cover`}
              src={
                !notification.sender.picture || notification.sender.picture === "temp"
                  ? default_avatar
                  : `${imageShow}${notification.sender.picture}`
              }
              alt="chatter"
              onLoad={() => setImageLoaded(false)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = default_avatar;
                setImageLoaded(false)
              }}
            />
          </div>
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-row justify-between gap-3">
              <p className="text-base font-semibold self-start">{notification.sender.name}</p>
              <p className="text-sm text-gray-600">{getRelativeTimeLabel(notification.message.time)}</p>
            </div>
            <p className="text-sm">{notification.message.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
