import React, { useState } from "react";
import "./Dice.css"; // Import your CSS file for styling

const Dice = () => {
  const [rotation, setRotation] = useState(0);

  const rollDice = () => {
    const randomRotation = Math.floor(Math.random() * 360); // Generate a random rotation angle
    setRotation(randomRotation);
  };

  return (
    <div
      className="dice"
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={rollDice}
    >
      {/* Display dice numbers */}
    </div>
  );
};

export default Dice;
