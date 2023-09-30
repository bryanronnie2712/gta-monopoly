import "./styles.scss";
import { useEffect, useState } from "react";
import { assetsList } from "./images/assets/index.js";
import io from "socket.io-client";

const socket = io.connect("https://x6yjll-4000.csb.app");

export default function App() {
  const [room, setRoom] = useState("12345");
  const [tokenPos, setTokenPos] = useState([
    { id: 0, xPos: 30, yPos: 410 }, // player 1
    { id: 1, xPos: 30, yPos: 410 }, // player 2
    { id: 2, xPos: 30, yPos: 410 }, // player 3
    { id: 3, xPos: 30, yPos: 410 }, // player 4
  ]);

  const [playerDetails, setPlayerDetails] = useState([
    { pos: 0, assets: [], money: 1500, active: false },
    { pos: 0, assets: [], money: 1500, active: false },
    { pos: 0, assets: [], money: 1500, active: false },
    { pos: 0, assets: [], money: 1500, active: false },
  ]);

  const [currentTurn, setCurrentTurn] = useState(0);
  const [trailCurrentTile, setTrailCurrentTile] = useState(0);
  const [optionDetails, setOptionDetails] = useState({
    buy: false,
    sell: true,
    endTurn: false,
  });
  const [currentTile, setCurrentTile] = useState(
    <div>
      <img
        src={assetsList[trailCurrentTile].src}
        width="100%"
        height="100%"
        alt={assetsList[trailCurrentTile]}
      />
    </div>,
  );

  useEffect(() => {
    setCurrentTile(
      <div style={{ margin: "-435px 652px" }}>
        <span>
          {trailCurrentTile}...........player{currentTurn + 1}
        </span>
        <div
          style={{
            transform: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(
              trailCurrentTile,
            )
              ? ""
              : [11, 12, 13, 14, 15, 16, 17, 18, 19].includes(trailCurrentTile)
              ? "rotate(-90deg)"
              : [20, 21, 22, 23, 24, 25, 26, 27, 28, 29].includes(
                  trailCurrentTile,
                )
              ? "rotate(180deg)"
              : "rotate(90deg)",
            width: "200px",
          }}
        >
          <img
            src={assetsList[trailCurrentTile].src}
            width="100%"
            height="100%"
            alt={assetsList[trailCurrentTile]}
          />
        </div>
      </div>,
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
      { x: 30, y: 298 },
    ];

    // this wierd-looking function is to move the player token step-by-step to the destination
    for (
      let i = playerDetails[playerNumber].pos + 1;
      i <= playerDetails[playerNumber].pos + diceVal;
      i++
    ) {
      await new Promise((resolve) => {
        setTimeout(() => {
          let playerTokenPosition = tokenPos[playerNumber];

          playerTokenPosition.xPos +=
            assetPositions[playerDetails[playerNumber].pos].x;
          playerTokenPosition.yPos +=
            assetPositions[playerDetails[playerNumber].pos].y;

          let tempTokenPos = [...tokenPos];
          tempTokenPos[playerNumber] = playerTokenPosition;
          setTokenPos(tempTokenPos);

          setTrailCurrentTile(i % 40);

          resolve();
        }, 300);
      });
    }

    // Update the current player's new position
    let temp = playerDetails;
    temp[playerNumber].pos = (temp[playerNumber].pos + diceVal) % 40;
    setPlayerDetails(temp);

    // Display options like buy, upgrade properties, bla bla
    displayOptions(playerNumber);

    // switch to next player, if the current player clicks 'End turn'
    if (optionDetails.endTurn) {
      nextPlayerTurn();
    }
  };

  const displayOptions = (playerNumber) => {
    if (assetsList[playerDetails[playerNumber].pos].type == "asset")
      setOptionDetails({ ...optionDetails, buy: true });
  };

  const rollDice = (playerNumber) => {
    const diceVal = Math.floor(Math.random() * 12) + 1;
    handleTokenPos(playerNumber, diceVal);
    // handleTokenPos(playerNumber, 1); // For testing
  };

  const nextPlayerTurn = () => {
    setCurrentTurn((currentTurn + 1) % 4);
  };

  console.log("playerDetails --> ", playerDetails);

  const buyAsset = (playerNumber) => {
    assetsList[playerDetails[playerNumber].pos].ownedBy = playerNumber;

    const tempPlayerDetails = { ...playerDetails };
    tempPlayerDetails[playerNumber].money -=
      assetsList[playerDetails[playerNumber].pos].cost;
    tempPlayerDetails[playerNumber].assets.push(
      playerDetails[playerNumber].pos,
    );
    setPlayerDetails(tempPlayerDetails);

    setOptionDetails({ ...optionDetails, buy: false });
  };

  // Socket.io------------------------
  const sendMessage = () => {
    socket.emit("send_msg", { playerDetails });
  };

  const updatePlayerDetailsSocket = () => {
    socket.emit("send_msg", { playerDetails });
  };

  const joinRoom = () => {
    socket.emit("join_room", room);
  };

  useEffect(() => {
    socket.on("recieve", (playerDetailsFromSocket) => {
      setPlayerDetails(playerDetailsFromSocket);
    });
  }, [socket]);
  // ----------------------

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

      {/* Player Tokens */}
      <div className="token">
        {tokenPos.map((tp) => {
          if (tp.id == currentTurn)
            return (
              <div
                className={`player${tp.id}Token`}
                style={{
                  transform: `translate(${tp.xPos}px,${tp.yPos}px)`,
                }}
              ></div>
            );
        })}
      </div>
      {/* ------------- */}

      <div
        style={{
          display: "flex",
          position: "absolute",
          margin: "-475px 485px",
        }}
      >
        <button onClick={joinRoom}>joinRoom</button>

        <button onClick={sendMessage}>Test Socket</button>

        <button onClick={() => rollDice(currentTurn)}>Roll</button>

        <button onClick={nextPlayerTurn}>NextPlayerTurn</button>

        {optionDetails.buy ? (
          <button onClick={() => buyAsset(currentTurn)}>Buy</button>
        ) : (
          ""
        )}
      </div>
      {currentTile}
    </div>
  );
}
