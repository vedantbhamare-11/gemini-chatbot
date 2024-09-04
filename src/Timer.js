import React, { useState, useEffect } from "react";

const Timer = ({ isRunning, onTimeUpdate, initialTime = 0, isFixedTime = 0 , visibility}) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (!isFixedTime) {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      } else if (!isRunning && time !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    } else {
      setTime(isFixedTime);
    }
  }, [isRunning, time, isFixedTime]);

  useEffect(() => {
    onTimeUpdate(time);
  }, [time, onTimeUpdate]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };

  return <span style={{visibility:visibility}}>{formatTime(time)}</span>;
};

export default Timer;

// const Timer = ({ isRunning, onTimeUpdate, initialTime = 0, isFixedTime = 0 }) => {
//   const [time, setTime] = useState(initialTime);

//   useEffect(() => {
//     if (!isFixedTime) {
//       let interval;
//       if (isRunning) {
//         interval = setInterval(() => {
//           setTime((prevTime) => prevTime + 1);
//         }, 1000);
//       } else if (!isRunning && time !== 0) {
//         clearInterval(interval);
//       }
//       return () => clearInterval(interval);
//     } else {
//       setTime(isFixedTime);
//     }
//   }, [isRunning, time, isFixedTime]);

//   useEffect(() => {
//     onTimeUpdate(time);
//   }, [time, onTimeUpdate]);

//   const formatTime = (seconds) => {
//     const days = Math.floor(seconds / (24 * 3600));
//     const hours = Math.floor((seconds % (24 * 3600)) / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;

//     let result = [];

//     if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
//     if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
//     if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
//     if (secs > 0 || result.length === 0) result.push(`${secs} second${secs > 1 ? 's' : ''}`);

//     return result.join(' ');
//   };

//   return <span>{formatTime(time)}</span>;
// };

// export default Timer;
