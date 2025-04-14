import { useState, useEffect } from 'react';
import './Dice3D.css';

/**
 * 3D Dice Component
 *
 * @param {Object} props
 * @param {number} [props.value=1] - Current value of the dice (1-6)
 * @param {string} [props.primaryColor="white"] - Background color of the dice
 * @param {string} [props.dotColor="black"] - Color of the dots on the dice
 * @param {boolean} [props.rolling=false] - Whether the dice is currently rolling
 * @param {Function} [props.onRoll] - Callback function when dice is rolled, receives final value
 */
export default function Dice({
  value = 1,
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
      // Removed inline styles related to size
      style={{ cursor: onRoll ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      <div
        className={`dice ${isRolling ? 'rolling' : ''}`}
        style={{
          transform: isRolling ? '' : getFaceTransform(),
          // Removed inline width/height
          transition: 'transform 0.5s ease-out',
          // Pass CSS variables for colors
          '--dice-primary-color': primaryColor,
          '--dice-dot-color': dotColor,
        }}
      >
        {/* Face 1 */}
        <div
          className="face face-1"
          // Removed inline styles related to size and color
        >
          <div
            className="dot center-dot"
            // Removed inline styles related to size and color
          ></div>
        </div>

        {/* Face 2 */}
        <div
          className="face face-2"
          // Removed inline styles related to size and color
        >
          <div
            className="dot top-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-right"
            // Removed inline styles related to size and color
          ></div>
        </div>

        {/* Face 3 */}
        <div
          className="face face-3"
          // Removed inline styles related to size and color
        >
          <div
            className="dot top-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot center-dot"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-right"
            // Removed inline styles related to size and color
          ></div>
        </div>

        {/* Face 4 */}
        <div
          className="face face-4"
          // Removed inline styles related to size and color
        >
          <div
            className="dot top-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot top-right"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-right"
            // Removed inline styles related to size and color
          ></div>
        </div>

        {/* Face 5 */}
        <div
          className="face face-5"
          // Removed inline styles related to size and color
        >
          <div
            className="dot top-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot top-right"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot center-dot"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-right"
            // Removed inline styles related to size and color
          ></div>
        </div>

        {/* Face 6 */}
        <div
          className="face face-6"
          // Removed inline styles related to size and color
        >
          <div
            className="dot top-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot top-right"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot middle-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot middle-right"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-left"
            // Removed inline styles related to size and color
          ></div>
          <div
            className="dot bottom-right"
            // Removed inline styles related to size and color
          ></div>
        </div>
      </div>
      {/* Removed embedded style tag */}
    </div>
  );
}
