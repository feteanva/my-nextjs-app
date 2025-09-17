"use client";

import React, { useState, useEffect } from "react";

interface ErrorToastProps {
  /** The error message to display */
  error: string;
  /** Duration in milliseconds before auto-dismiss (optional, 0 means no auto-dismiss) */
  duration?: number;
  /** Callback function called when the toast is dismissed */
  onDismiss: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  error,
  duration = 0,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDismiss = () => {
    setIsAnimating(false);
    // Wait for animation to complete before calling onDismiss
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300); // Match the transition duration
  };

  // Auto-dismiss after duration (if duration > 0)
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleDismiss]);

  // Show animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 10); // Small delay to trigger animation

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="overlay-container" onClick={handleClick}>
      <div
        id="toast-container"
        className="top-auto bottom-[65px] fixed z-99999 right-0 w-full md:top-[70px] pointer-events-auto"
      >
        <div
          className={`bg-[#ea3f2e] shadow-none text-[1em] leading-[1.47em] py-[5px] px-[20px] md:px-0 pt-[8px] pb-[7px] text-center w-full mx-auto relative overflow-hidden mb-0 rounded-[3px] text-white transition-all duration-300 ease-out transform cursor-pointer ${
            isAnimating ? "opacity-100" : "opacity-0 "
          }`}
          toast-component=""
          onClick={handleClick}
        >
          <div
            role="alertdialog"
            aria-live="polite"
            className=""
            aria-label={error}
            style={{
              wordWrap: "break-word",
            }}
          >
            {error}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;
