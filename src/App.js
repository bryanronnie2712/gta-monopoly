import "./styles.scss";
import { useEffect, useState } from "react";
import { assetsList } from "../images/assets/index.js";

export default function App() {
  const [tokenPos, setTokenPos] = useState({
    player1: { xPos: 30, yPos: 410 },
    player2: { xPos: 30, yPos: 410 },
    player3: { xPos: 30, yPos: 410 },
    player4: { xPos: 30, yPos: 410 }
  });
  const [playerDetails, setPlayerDetails] = useState([
    { pos: 0, assets: [] },
    { pos: 0, assets: [] },
    { pos: 0, assets: [] },
    { pos: 0, assets: [] }
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [trailCurrentTile, setTrailCurrentTile] = useState(0);
  const [currentTile, setCurrentTile] = useState(
    <div>
      <img
        src={assetsList[trailCurrentTile].src}
        width="100%"
        height="100%"
        alt={assetsList[trailCurrentTile]}
      />
    </div>
  );

  useEffect(() => {
    setCurrentTile(
      <div style={{ margin: "-435px 652px" }}>
        <span>
          {trailCurrentTile}...........player{currentTurn + 1}
        </span>
        <div
          style={{
            transform: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(trailCurrentTile)
              ? ""
              : [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(
                  trailCurrentTile
                )
              ? "rotate(-90deg)"
              : [20, 21, 22, 23, 24, 25, 26, 27, 28, 29].includes(
                  trailCurrentTile
                )
              ? "rotate(180deg)"
              : "rotate(90deg)",
            width: "200px"
          }}
        >
          <img
            src={assetsList[trailCurrentTile].src}
            width="100%"
            height="100%"
            alt={assetsList[trailCurrentTile]}
          />
        </div>
      </div>
    );
  }, [trailCurrentTile, currentTurn]);

  const handleTokenPos = async (playerNumber, diceVal) => {
    const limits = { top: -480, bottom: 350, right: 10, left: -820 };
    const assetPositions = [
      // {x:0, y:0},
      { x: -102, y: 0 },
      { x: -82, y: 0 },
      { x: -84, y: 0 },
      { x: -84, y: 0 },
      { x: -82, y: 0 },
      { x: -84, y: 0 },
      { x: -82, y: 0 },
      { x: -84, y: 0 },
      { x: -82, y: 0 },
      { x: -102, y: 0 },
      { x: 0, y: -102 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -84 },
      { x: 0, y: -102 },
      { x: -846, y: -458 },
      { x: -738, y: -458 },
      { x: -658, y: -458 },
      { x: -574, y: -458 },
      { x: -492, y: -458 },
      { x: -408, y: -458 },
      { x: -324, y: -458 },
      { x: -155, y: -458 },
      { x: -72, y: -458 },
      { x: 30, y: -458 },
      { x: 30, y: -354 },
      { x: 30, y: -275 },
      { x: 30, y: -194 },
      { x: 30, y: -112 },
      { x: 30, y: -27 },
      { x: 30, y: 54 },
      { x: 30, y: 134 },
      { x: 30, y: 212 },
      { x: 30, y: 298 }
    ];

    for (
      let i = playerDetails[playerNumber].pos + 1;
      i <= playerDetails[playerNumber].pos + diceVal;
      i++
    ) {
      await new Promise((resolve) => {
        setTimeout(() => {
          let playerTokenPosition = tokenPos[`player${playerNumber + 1}`];

          console.log(
            "[playerDetails[playerNumber].pos",
            playerDetails[playerNumber].pos
          );
          playerTokenPosition.xPos +=
            assetPositions[playerDetails[playerNumber].pos].x;
          playerTokenPosition.yPos +=
            assetPositions[playerDetails[playerNumber].pos].y;

          setTokenPos({
            ...tokenPos,
            [`player${playerNumber + 1}`]: playerTokenPosition
          });

          setTrailCurrentTile(i % 40);

          resolve();
        }, 300);
      });
    }

    let temp = playerDetails;
    temp[playerNumber] = { pos: (temp[playerNumber].pos + diceVal) % 40 };
    setPlayerDetails(temp);
  };

  // console.log("playerDetails", playerDetails);
  console.log(assetsList.length, currentTurn);

  const rollDice = (playerNumber) => {
    const diceVal = Math.floor(Math.random() * 12);
    handleTokenPos(playerNumber, diceVal);
    console.log("diceVal", diceVal);
    // handleTokenPos(playerNumber, 1); // For testing
  };

  const nextPlayerTurn = () => {
    setCurrentTurn((currentTurn + 1) % 4);
  };

  return (
    <div>
      <div className="container" style={{ height: "1000px", width: "1000px" }}>
        {/* Looping through the assets list imported from index.js -- Reduces 355 lines of code */}
        {assetsList.map((asset) => {
          return (
            <div className={asset.className}>
              <img src={asset.src} width="100%" height="100%" alt={asset.alt} />
            </div>
          );
        })}
      </div>

      <div className="token"></div>

      <div className="token">
        <div
          className="player1Token"
          style={{
            transform: `translate(${tokenPos.player1.xPos}px,${tokenPos.player1.yPos}px)`
          }}
          // onClick={() => handleTokenPos(0)}
        >
          {/* {tokenPos.player1.xPos}px, {tokenPos.player1.yPos}px */}
        </div>
        <div
          className="player2Token"
          // onClick={() => handleTokenPos(1)}
          style={{
            transform: `translate(${tokenPos.player2.xPos}px,${tokenPos.player2.yPos}px)`
          }}
          pos={{ x: tokenPos.player2.xPos, y: tokenPos.player2.yPos }}
        ></div>
        <div
          className="player3Token"
          // onClick={() => handleTokenPos(2)}
          style={{
            transform: `translate(${tokenPos.player3.xPos}px,${tokenPos.player3.yPos}px)`
          }}
          pos={{ x: tokenPos.player3.xPos, y: tokenPos.player3.yPos }}
        ></div>
        <div
          className="player4Token"
          // onClick={() => handleTokenPos(3)}
          style={{
            transform: `translate(${tokenPos.player4.xPos}px,${tokenPos.player4.yPos}px)`
          }}
          pos={{ x: tokenPos.player4.xPos, y: tokenPos.player4.yPos }}
        ></div>
      </div>

      <button
        style={{ position: "absolute", margin: "-475px 485px" }}
        onClick={() => rollDice(currentTurn)}
      >
        Roll
      </button>

      <button
        style={{ position: "absolute", margin: "-475px 545px" }}
        onClick={nextPlayerTurn}
      >
        NextPlayerTurn
      </button>

      {currentTile}
    </div>
  );
}
