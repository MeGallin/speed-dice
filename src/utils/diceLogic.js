/**
 * Dice Roll Logic for Speed Dice
 *
 * This module contains functions for dice rolling, special pattern detection,
 * and game rule implementation.
 */

/**
 * Generate random dice values
 * @param {number} count - Number of dice to roll (2 or 3)
 * @returns {number[]} - Array of dice values
 */
export const generateDiceValues = (count) => {
  return Array(count)
    .fill(0)
    .map(() => Math.floor(Math.random() * 6) + 1);
};

/**
 * Check if the roll is a double (two dice with the same value)
 * @param {number[]} values - Array of dice values
 * @returns {boolean} - True if the roll is a double
 */
export const isDouble = (values) => {
  // For 2 dice, check if they have the same value
  if (values.length === 2) {
    return values[0] === values[1];
  }

  // For other cases, return false
  return false;
};

/**
 * Check if the roll is a triple (three dice with the same value)
 * @param {number[]} values - Array of dice values
 * @returns {boolean} - True if the roll is a triple
 */
export const isTriple = (values) => {
  if (values.length !== 3) return false;
  return values[0] === values[1] && values[1] === values[2];
};

/**
 * Check if the roll is a sequence
 * @param {number[]} values - Array of dice values
 * @returns {boolean} - True if the roll is a sequence
 */
export const isSequence = (values) => {
  if (values.length !== 3) return false;

  const sorted = [...values].sort((a, b) => a - b);

  // Check for standard sequence (e.g., 1-2-3, 2-3-4, etc.)
  if (sorted[0] + 1 === sorted[1] && sorted[1] + 1 === sorted[2]) {
    return true;
  }

  // Check for special sequences
  const specialSequences = [
    [1, 2, 4], // Special case 1-2-4
    [1, 3, 5], // Special case 1-3-5
    [2, 4, 6], // Special case 2-4-6
  ];

  return specialSequences.some(
    (seq) =>
      seq[0] === sorted[0] && seq[1] === sorted[1] && seq[2] === sorted[2],
  );
};

/**
 * Get the type of special roll
 * @param {number[]} values - Array of dice values
 * @returns {string|null} - Type of special roll ('double', 'triple', 'sequence') or null
 */
export const getSpecialRollType = (values) => {
  console.log('getSpecialRollType called with values:', values);

  // Check for doubles (2 dice with the same value)
  if (values.length === 2) {
    const isDoubleRoll = values[0] === values[1];
    console.log('Checking for double with 2 dice:', isDoubleRoll);
    if (isDoubleRoll) return 'double';
  }

  // Check for triples and sequences (3 dice)
  if (values.length === 3) {
    // Check for triple (all 3 dice with the same value)
    if (values[0] === values[1] && values[1] === values[2]) {
      console.log('Triple detected!');
      return 'triple';
    }

    // Check for sequence
    const isSequenceRoll = isSequence(values);
    console.log('Checking for sequence with 3 dice:', isSequenceRoll);
    if (isSequenceRoll) return 'sequence';
  }

  return null;
};

/**
 * Get the message for a special roll
 * @param {string} rollType - Type of special roll
 * @returns {string} - Message to display
 */
export const getSpecialRollMessage = (rollType) => {
  switch (rollType) {
    case 'double':
      return '🎯 Double! Roll Again!';
    case 'triple':
      return '🔥 Triple Threat! Collect from each player!';
    case 'sequence':
      return '✨ Sequence! Bonus Activated!';
    default:
      return '';
  }
};

/**
 * Get the CSS class for a special roll
 * @param {string} rollType - Type of special roll
 * @returns {string} - CSS class
 */
export const getSpecialRollClass = (rollType) => {
  switch (rollType) {
    case 'double':
      return 'bg-yellow-200 text-yellow-800';
    case 'triple':
      return 'bg-red-200 text-red-800';
    case 'sequence':
      return 'bg-green-200 text-green-800';
    default:
      return '';
  }
};

/**
 * Calculate the total value of dice
 * @param {number[]} values - Array of dice values
 * @returns {number} - Sum of dice values
 */
export const calculateTotal = (values) => {
  console.log('calculateTotal called with values:', values);
  const total = values.reduce((sum, value) => sum + value, 0);
  console.log('calculateTotal result:', total);
  return total;
};

/**
 * Get the next player index
 * @param {number} currentPlayer - Current player index
 * @param {number} totalPlayers - Total number of players
 * @param {string|null} specialRoll - Type of special roll
 * @returns {number} - Next player index
 */
export const getNextPlayer = (currentPlayer, totalPlayers, specialRoll) => {
  // If it's a double, the same player goes again
  if (specialRoll === 'double') {
    return currentPlayer;
  }

  // Otherwise, move to the next player
  return (currentPlayer + 1) % totalPlayers;
};

/**
 * Get the reward for a special roll
 * @param {string} rollType - Type of special roll
 * @returns {number} - Reward amount (in Monopoly money)
 */
export const getSpecialRollReward = (rollType) => {
  switch (rollType) {
    case 'triple':
      // For triples, the reward is the value of the dice × 100
      return 100;
    case 'sequence':
      // For sequences, the reward is a fixed amount
      return 50;
    default:
      return 0;
  }
};
