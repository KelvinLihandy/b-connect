import { useEffect, useState } from "react";

const UseSnap = () => {
  const [snap, setSnap] = useState(null);

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const myMidtransClientKey = 'SB-Mid-client-jTywWMkTIvxp4C-v';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    scriptTag.onload = () => {
      setSnap(window.snap)
    }
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

  const snapEmbed = (snap_token, embedId, action) => {
    if (snap) {
      snap.embed(snap_token, {
        embedId,
        onSuccess: function (result) {
          console.log("success", result);
          action.onSuccess(result);
        },
        onPending: function (result) {
          console.log("pending", result);
          action.onPending(result);
        },
        onClose: function (result) {
          action.onClose();
        }
      })
    }
  }

  return { snapEmbed }
}

export default UseSnap;