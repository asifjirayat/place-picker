import { useState, useEffect } from "react";

const ProgressBar = ({ timer, onConfirm }) => {
  const [remainingTime, setRemainingTime] = useState(timer);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 10;

        return newTime <= 0 ? 0 : newTime;
      });
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) onConfirm();
  }, [remainingTime, onConfirm]);

  return <progress value={remainingTime} max={timer} />;
};

export default ProgressBar;
