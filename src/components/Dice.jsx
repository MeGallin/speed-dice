import { useState, useEffect } from 'react';
import './Dice3D.css';

/**
 * 3D Dice Component
 *
 * @param {Object} props
 * @param {number} [props.value=1] - Current value of the dice (1-6)
 * @param {number} [props.size=100] - Size of the dice in pixels
 * @param {string} [props.primaryColor="white"] - Background color of the dice
 * @param {string} [props.dotColor="black"] - Color of the dots on the dice
 * @param {boolean} [props.rolling=false] - Whether the dice is currently rolling
 * @param {Function} [props.onRoll] - Callback function when dice is rolled, receives final value
 */
export default function Dice({
  value = 1,
  size = 100,
  primaryColor = 'white',
  dotColor = 'black',
  rolling = false,
  onRoll,
}) {
  // Use the value prop directly instead of maintaining a separate state
  // This ensures that the dice always shows the value from the parent component
  const [isRolling, setIsRolling] = useState(rolling);

  // Handle rolling animation
  useEffect(() => {
    setIsRolling(rolling);

    if (rolling) {
      // When rolling stops, notify parent that rolling is complete
      const rollDuration = 1000 + Math.random() * 1000;
      const rollTimeout = setTimeout(() => {
        setIsRolling(false);

        // Notify parent that rolling is complete with the current value
        if (onRoll) {
          onRoll(value);
        }
      }, rollDuration);

      return () => {
        clearTimeout(rollTimeout);
      };
    }
  }, [rolling, onRoll, value]);

  const handleClick = () => {
    // We'll disable direct clicking on dice to ensure consistency
    // All dice rolling should be controlled by the parent component
    // This ensures the values and totals stay in sync
    // If you want to re-enable direct clicking, use the parent's value:
    /*
    if (!isRolling && onRoll) {
      setIsRolling(true);
      const rollDuration = 1000 + Math.random() * 1000;
      const rollInterval = setInterval(() => {
        setCurrentValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      const rollTimeout = setTimeout(() => {
        clearInterval(rollInterval);
        setCurrentValue(value);
        setIsRolling(false);
        onRoll(value);
      }, rollDuration);
    }
    */
  };

  // Determine which face to show based on the value prop
  const getFaceTransform = () => {
    switch (value) {
      case 1:
        return 'rotateX(0deg) rotateY(0deg)'; // Front face (1)
      case 2:
        return 'rotateX(0deg) rotateY(-90deg)'; // Right face (2)
      case 3:
        return 'rotateX(-90deg) rotateY(0deg)'; // Top face (3)
      case 4:
        return 'rotateX(90deg) rotateY(0deg)'; // Bottom face (4)
      case 5:
        return 'rotateX(0deg) rotateY(90deg)'; // Left face (5)
      case 6:
        return 'rotateX(180deg) rotateY(0deg)'; // Back face (6)
      default:
        return 'rotateX(0deg) rotateY(0deg)'; // Default to 1
    }
  };

  return (
    <div
      className="dice-container"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: `${size * 3}px`,
        cursor: onRoll ? 'pointer' : 'default',
      }}
      onClick={handleClick}
    >
      <div
        className={`dice ${isRolling ? 'rolling' : ''}`}
        style={{
          transform: isRolling ? '' : getFaceTransform(),
          width: `${size}px`,
          height: `${size}px`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        {/* Face 1 */}
        <div
          className="face face-1"
          style={{
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            transform: `translateZ(${size / 2}px)`,
          }}
        >
          <div
            className="dot center-dot"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
        </div>

        {/* Face 2 */}
        <div
          className="face face-2"
          style={{
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotateY(90deg) translateZ(${size / 2}px)`,
          }}
        >
          <div
            className="dot top-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
        </div>

        {/* Face 3 */}
        <div
          className="face face-3"
          style={{
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotateX(90deg) translateZ(${size / 2}px)`,
          }}
        >
          <div
            className="dot top-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot center-dot"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
        </div>

        {/* Face 4 */}
        <div
          className="face face-4"
          style={{
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
          }}
        >
          <div
            className="dot top-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot top-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
        </div>

        {/* Face 5 */}
        <div
          className="face face-5"
          style={{
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
          }}
        >
          <div
            className="dot top-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot top-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot center-dot"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
        </div>

        {/* Face 6 */}
        <div
          className="face face-6"
          style={{
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotateY(180deg) translateZ(${size / 2}px)`,
          }}
        >
          <div
            className="dot top-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot top-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot middle-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot middle-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-left"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
          <div
            className="dot bottom-right"
            style={{
              backgroundColor: dotColor,
              width: `${size * 0.15}px`,
              height: `${size * 0.15}px`,
            }}
          ></div>
        </div>
      </div>

      <style>{`
        .dice-container {
          display: inline-block;
        }

        .dice {
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(0deg) rotateY(0deg);
        }

        .dice.rolling {
          animation: roll 1.5s ease-out;
        }

        @keyframes roll {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: rotateX(360deg) rotateY(180deg);
          }
          50% {
            transform: rotateX(720deg) rotateY(360deg);
          }
          75% {
            transform: rotateX(1080deg) rotateY(540deg);
          }
          100% {
            transform: rotateX(1440deg) rotateY(720deg);
          }
        }

        .face {
          position: absolute;
          border-radius: 10%;
          box-shadow: inset 0 0 ${size * 0.1}px rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .dot {
          border-radius: 50%;
          box-shadow: inset 0 0 ${size * 0.05}px rgba(0, 0, 0, 0.3);
          position: absolute;
        }

        .center-dot {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .top-left {
          top: ${size * 0.2}px;
          left: ${size * 0.2}px;
        }

        .top-right {
          top: ${size * 0.2}px;
          right: ${size * 0.2}px;
        }

        .middle-left {
          top: 50%;
          left: ${size * 0.2}px;
          transform: translateY(-50%);
        }

        .middle-right {
          top: 50%;
          right: ${size * 0.2}px;
          transform: translateY(-50%);
        }

        .bottom-left {
          bottom: ${size * 0.2}px;
          left: ${size * 0.2}px;
        }

        .bottom-right {
          bottom: ${size * 0.2}px;
          right: ${size * 0.2}px;
        }
      `}</style>
    </div>
  );
}
