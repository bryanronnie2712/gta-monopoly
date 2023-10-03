import "./styles.scss";
import { useEffect, useState } from "react";
import { assetsList } from "./images/assets/index.js";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const socket = io.connect("https://x6yjll-4000.csb.app");

export default function App() {
  const [room, setRoom] = useState("12345");
  const [tokenPos, setTokenPos] = useState([
    { id: 0, xPos: 0, yPos: 0 }, // player 1
    { id: 1, xPos: 0, yPos: 0 }, // player 2
    { id: 2, xPos: 0, yPos: 0 }, // player 3
    { id: 3, xPos: 0, yPos: 0 }, // player 4
  ]);

  const [playerDetails, setPlayerDetails] = useState([]);

  const [playerMe, setPlayerMe] = useState({
    playerName: "",
    id: Math.floor(Math.random() * 10000),
    room: "",
  });

  const [currentTurn, setCurrentTurn] = useState(0);
  const [trailCurrentTile, setTrailCurrentTile] = useState(0);
  const [optionDetails, setOptionDetails] = useState({
    buy: false,
    sell: true,
    endTurn: false,
  });
  const [currentTile, setCurrentTile] = useState();

  console.log("==> ", playerMe);

  useEffect(() => {
    setCurrentTile(
      <div style={{}}>
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
            src={
              assetsList[trailCurrentTile]
                ? assetsList[trailCurrentTile].src
                : ""
            }
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

    // this wierd-looking function is to move the player token step-by-step to the destination
    for (
      let i = playerDetails[playerNumber].pos + 1;
      i <= playerDetails[playerNumber].pos + diceVal;
      i++
    ) {
      await new Promise((resolve) => {
        setTimeout(() => {
          let playerTokenPosition = tokenPos[playerNumber];

          // playerTokenPosition.xPos +=
          //   assetPositions[playerDetails[playerNumber].pos].x;
          // playerTokenPosition.yPos +=
          //   assetPositions[playerDetails[playerNumber].pos].y;

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
    if (
      assetsList[playerDetails[playerNumber].pos].type == "asset" &&
      !assetsList[playerDetails[playerNumber].pos].ownedBy
    )
      setOptionDetails({ ...optionDetails, buy: true });
  };

  const rollDice = (playerNumber) => {
    const diceVal = Math.floor(Math.random() * 12) + 1;
    handleTokenPos(playerNumber, diceVal);
    // handleTokenPos(playerNumber, 1); // For testing
  };

  const nextPlayerTurn = () => {
    setCurrentTurn((currentTurn + 1) % playerDetails.length);
  };

  console.log("playerDetails --> ", playerDetails);

  const buyAsset = (playerNumber) => {
    assetsList[playerDetails[playerNumber].pos].ownedBy = playerNumber;

    const tempPlayerDetails = [...playerDetails];
    tempPlayerDetails[playerNumber].money -=
      assetsList[playerDetails[playerNumber].pos].cost;
    tempPlayerDetails[playerNumber].assets.push(
      playerDetails[playerNumber].pos,
    );
    console.log("tempPlayerDetails-->", tempPlayerDetails);
    setPlayerDetails(tempPlayerDetails);

    setOptionDetails({ ...optionDetails, buy: false });
  };

  // Socket.io------------------------
  const createRoom = () => {
    socket.emit("createRoom", {
      playerName: playerMe.playerName,
      playerId: playerMe.id,
      playerMe,
    });
  };

  const joinRoom = () => {
    socket.emit("joinRoom", {
      playerName: playerMe.playerName,
      playerId: playerMe.id,
      roomId: playerMe.room,
    });
  };

  useEffect(() => {
    // Create Room
    socket.on("createRoomStatus", (data) => {
      toast.success(`Room ${data.roomId} created!`);
      setPlayerMe({ ...playerMe, playerNumber: data.playerNumber });
      setPlayerDetails(data.updPlayerDetails);
    });

    // Join Room
    socket.on("joinRoomStatus", (data) => {
      toast.success(`Joined ${data.roomId}!`);
      setPlayerMe({ ...playerMe, playerNumber: data.playerNumber });
      setPlayerDetails(data.updPlayerDetails);
    });

    // When a user joins a room -> other players
    socket.on("aNewPlayerHasJoined", (data) => {
      toast.success(`${data.newPlayerName} has joined your game!`);
      setPlayerMe({ ...playerMe, playerNumber: data.playerNumber });
      setPlayerDetails(data.updPlayerDetails);
    });
  }, [socket]);
  // ----------------------

  return (
    <div>
      <ToastContainer />
      {true && (
        <div>
          <h1>Create or Join Game</h1>
          Player Name:
          <input
            required={true}
            onChange={(e) =>
              setPlayerMe({ ...playerMe, playerName: e.target.value })
            }
          ></input>
          Room ID:
          <input
            required={true}
            onChange={(e) => setPlayerMe({ ...playerMe, room: e.target.value })}
          ></input>
          <button onClick={joinRoom}>Join</button>
          <button onClick={createRoom}>Create</button>
        </div>
      )}
      {false && (
        <div className="container">
          {/* Looping through the assets list imported from index.js -- Reduces 355 lines of code */}
          {assetsList.map((asset) => {
            return (
              <div className={asset.className}>
                <img
                  src={asset.src}
                  width="100%"
                  height="100%"
                  alt={asset.alt}
                />
              </div>
            );
          })}

          {/* Player Tokens */}
          {tokenPos.map((tp) => {
            if (tp.id == currentTurn)
              return (
                <div
                  className={`token player${tp.id}Token`}
                  style={{
                    transform: `translate(30rem,${tp.yPos}px)`,
                  }}
                ></div>
              );
          })}
          {/* ------------- */}

          <div className="ao">
            {/* <input
              required={true}
              onChange={(e) =>
                setPlayerMe({ ...playerMe, playerName: e.target.value })
              }
            ></input>
            <button onClick={joinRoom}>joinRoom</button> */}
            <button onClick={() => rollDice(currentTurn)}>Roll</button>
            <button onClick={nextPlayerTurn}>NextPlayerTurn</button>
            {currentTile}
            Total Players - {playerDetails.length} <br />
            Player - Pos - Money - Assets
            <br />
            {playerDetails.map((mp, index) => (
              <>
                Player {mp.id} - {mp.pos} - {mp.money} -{" "}
                {mp.assets.map((a) => (
                  <>a</>
                ))}
                <br />
              </>
            ))}
            {currentTurn == playerMe.playerNumber ? (
              <p style={{ color: "red" }}>
                Current turn -{playerMe.playerName}
              </p>
            ) : (
              <p style={{ color: "blue" }}>
                {playerDetails[currentTurn] != null
                  ? "Current turn -" + playerDetails[currentTurn].playerName
                  : ""}
              </p>
            )}
            {/* {playerDetails.map((pd) => {
            if (pd.id == playerMe.id) return playerMe.playerName;
            else return playerDetails[currentTurn].playerName;
          })} */}
            {optionDetails.buy ? (
              <button onClick={() => buyAsset(currentTurn)}>Buy</button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
}
