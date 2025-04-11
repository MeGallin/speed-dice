/**
 * Utility functions for providing feedback effects (vibration, sound, etc.)
 */

/**
 * Trigger device vibration if supported
 * @param {number|number[]} pattern - Vibration pattern in milliseconds
 */
export const vibrate = (pattern) => {
  // Check if vibration API is supported
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Play a sound effect
 * @param {string} soundName - Name of the sound effect to play
 */
export const playSound = (soundName) => {
  // Map of sound names to their file paths
  const soundMap = {
    roll: './sounds/dice-roll.mp3',
    success: './sounds/success.mp3',
    double: './sounds/double.mp3',
    triple: './sounds/triple.mp3',
    sequence: './sounds/sequence.mp3',
  };

  // Get the sound file path
  const soundPath = soundMap[soundName];
  if (!soundPath) return;

  // Create and play audio
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.5; // Set volume to 50%

    // Play the sound
    const playPromise = audio.play();

    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  } catch (error) {
    console.error('Error creating audio:', error);
  }
};

/**
 * Provide feedback for a dice roll
 * @param {string|null} specialRoll - Type of special roll (double, triple, sequence)
 * @param {boolean} enableVibration - Whether vibration is enabled
 * @param {boolean} enableSound - Whether sound is enabled
 */
export const provideFeedback = (
  specialRoll,
  enableVibration = true,
  enableSound = true,
) => {
  // Vibration patterns (in milliseconds)
  const vibrationPatterns = {
    default: [100, 50, 100],
    double: [100, 30, 100, 30, 300],
    triple: [100, 30, 100, 30, 100, 30, 500],
    sequence: [300, 100, 300],
  };

  // Provide vibration feedback if enabled
  if (enableVibration) {
    const pattern = specialRoll
      ? vibrationPatterns[specialRoll]
      : vibrationPatterns.default;
    vibrate(pattern);
  }

  // Provide sound feedback if enabled
  if (enableSound) {
    // Play roll sound first
    playSound('roll');

    // If there's a special roll, play the corresponding sound after a short delay
    if (specialRoll) {
      setTimeout(() => {
        playSound(specialRoll);
      }, 600); // Delay to let the roll sound finish
    }
  }
};

/**
 * Check if the device supports vibration
 * @returns {boolean} - Whether vibration is supported
 */
export const isVibrationSupported = () => {
  return !!navigator.vibrate;
};
