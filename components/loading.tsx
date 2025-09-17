import React from "react";
import { createPortal } from "react-dom";

type Props = {
  isVisible?: boolean;
};

const LoadingComponent = ({ isVisible = true }: Props) => {
  if (!isVisible) return null;

  // Render loading overlay as a portal to escape stacking context
  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      <style jsx>{`
        .loading-overlay {
          background-color: rgba(51, 51, 51, 0.8);
          z-index: 99999;
          position: fixed;
          opacity: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .loading-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
          width: 96px;
          height: 96px;
          display: block;
        }

        .loading-spinner {
          width: 96px;
          height: 96px;
          position: relative;
        }

        .loading-dot {
          width: 24px;
          height: 24px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          animation: loading-spin 1.2s infinite ease-in-out;
        }

        .loading-dot:nth-child(1) {
          top: 0;
          left: 36px;
          animation-delay: 0s;
        }

        .loading-dot:nth-child(2) {
          top: 9px;
          right: 9px;
          animation-delay: -0.15s;
        }

        .loading-dot:nth-child(3) {
          top: 36px;
          right: 0;
          animation-delay: -0.3s;
        }

        .loading-dot:nth-child(4) {
          bottom: 9px;
          right: 9px;
          animation-delay: -0.45s;
        }

        .loading-dot:nth-child(5) {
          bottom: 0;
          left: 36px;
          animation-delay: -0.6s;
        }

        .loading-dot:nth-child(6) {
          bottom: 9px;
          left: 9px;
          animation-delay: -0.75s;
        }

        .loading-dot:nth-child(7) {
          top: 36px;
          left: 0;
          animation-delay: -0.9s;
        }

        .loading-dot:nth-child(8) {
          top: 9px;
          left: 9px;
          animation-delay: -1.05s;
        }

        @keyframes loading-spin {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="loading-overlay">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default LoadingComponent;
