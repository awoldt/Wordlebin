import type { GetServerSideProps } from "next";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import RowDataInterface from "../interfaces/RowData";
import WordleGrid from "../components/WordleGrid";
import Keybaord from "../components/Keyboard";
import { Container, Button, Alert } from "react-bootstrap";
import DeviceDetector from "device-detector-js";
import deviceData from "../interfaces/DeviceData";
import enableResponsiveLayout from "../scripts/responsiveLayout";
import enableResponsiveKeyboardLayout from "../scripts/repsonsiveKeyboard";
import initializeResponsiveLayout from "../scripts/initializeResponsiveLayout";
import EndGameBannerInterface from "../interfaces/EndGameBanner";
import InitializeCustomGameReponsiveResize from "../scripts/customGameResponsiveResize";
import initializeCustomGameDeviceLayout from "../scripts/initializeCustomGameResponsiveLayout";
import path from "path";
import EndGameBanner from "../components/EndgameBanner";
import Head from "next/head";
import SocialMedia from "../components/SocialMediaBtns";

const UserDevice = new DeviceDetector();

function generateRepsonsiveLayout(userAgent: string) {
  //generate responsive layout numbers before sending to frontend
  const device = UserDevice.parse(userAgent).device;
  if (device!) {
    if (device.type!) {
      if (device.type == "desktop") {
        return "desktop";
      } else if (device.type == "tablet") {
        return "tablet";
      } else if (device.type == "smartphone") {
        return "phone";
      } else {
        return "unknown_device";
      }
    }
  }
}

const Home = ({
  word_to_spell,
  deviceLayout,
  initialRowData,
  defaultGame,
}: {
  word_to_spell: string;
  deviceLayout: deviceData;
  initialRowData: RowDataInterface;
  defaultGame: boolean;
}) => {
  const [rowSpellings, setRowSpellings] =
    useState<RowDataInterface>(initialRowData);

  const alertRef = useRef<HTMLDivElement>(null);

  const [word, setWord] = useState<string>(word_to_spell);

  const [gridDimentions, setGridDimentions] = useState<string[]>([]); //W x H x FontSize
  const [keyboardDimentions, setKeyboardDimentions] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [endGameBanner, setEndGameBanner] = useState<EndGameBannerInterface>();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  //sets the dementions of grid BEFORE rendering child component
  useLayoutEffect(() => {
    const w: number = window.innerWidth;

    if (defaultGame == true) {
      initializeResponsiveLayout(
        String(deviceLayout),
        w,
        setGridDimentions,
        setKeyboardDimentions
      );
      enableResponsiveLayout(gridDimentions, setGridDimentions);
      enableResponsiveKeyboardLayout(keyboardDimentions, setKeyboardDimentions);
    } else {
      InitializeCustomGameReponsiveResize(
        keyboardDimentions,
        setKeyboardDimentions,
        gridDimentions,
        setGridDimentions
      );

      initializeCustomGameDeviceLayout(
        String(deviceLayout),
        w,
        setGridDimentions,
        setKeyboardDimentions
      );
    }
  }, []);

  useEffect(() => {
    //will only run if alertmessage is not empty string
    //prevents infinite loops when changing alert message state below
    if (alertMessage !== "") {
      const t = setTimeout(() => {
        if (alertRef.current!) {
          setAlertMessage("");
        }
      }, 2000);

      return () => {
        clearTimeout(t);
      };
    }
  }, [alertMessage]);

  return (
    <>
      <Head>
        <title>Wordlebin: Unlimited Word Guessing Game</title>
        <meta
          name={"description"}
          content={
            "Play online word guessing game with over 600,000+ words to spell. Create custom word games and share with friends."
          }
        />
        <meta property="og:title" content="Play 5-Word Guessing Game" />
        <meta
          property="og:description"
          content="Play free online guessing game and share custom games with friends. Optimized for all screen sizes."
        />
        <meta property="og:image" content="https://wordlebin.com/favicon.ico" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        <link rel="canonical" href="https://wordlebin.com" />
      </Head>
      <Container fluid>
        <div
          className="text-center"
          style={{ paddingTop: "50px", marginBottom: "25px" }}
        >
          <WordleGrid
            rowData={rowSpellings}
            word={word}
            gridSize={gridDimentions}
          />

          {alertMessage !== "" && (
            <Container>
              <Alert variant={"danger"} ref={alertRef}>
                {alertMessage}
              </Alert>
            </Container>
          )}

          {gameOver == false && (
            <Keybaord
              changeRow={setRowSpellings}
              currentRow={rowSpellings}
              currentWord={word}
              keyboardSize={keyboardDimentions}
              setAlert={setAlertMessage}
              setEndgame={setEndGameBanner}
              gameStart={setGameStarted}
              hasGameStarted={gameStarted}
              endMessage={null}
              gameOver={setGameOver}
            />
          )}

          {endGameBanner! && (
            <EndGameBanner
              endGameBanner={endGameBanner}
              endGameMessage={null}
            />
          )}

          <Button
            style={{
              marginTop: "85px",
              marginBottom: "50px",
            }}
            variant={"danger"}
          >
            <a
              href={"/create"}
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>{" "}
              Create a Game
            </a>
          </Button>

          <div>
            <select
              id="custom_word_length"
              onChange={(e) => {
                if (Number(e.target.value) == 5) {
                  window.location.assign("/");
                } else {
                  window.location.assign("/?wl=" + e.target.value);
                }
              }}
              style={{ marginBottom: "25px", marginRight: "15px" }}
            >
              <option selected>Length of Word</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 (default)</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
            </select>
            {gameStarted == false && (
              <a
                style={{ display: "inline-block", marginLeft: "15px" }}
                href={"/rules"}
              >
                <div style={{ marginBottom: "10px" }}>How to Play</div>
              </a>
            )}
          </div>
          <SocialMedia />
          <span className="text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-brush"
              viewBox="0 0 16 16"
            >
              <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
            </svg>{" "}
            Made by{" "}
            <a
              href="https://awoldt.com/"
              rel="noreferrer"
              target="_blank"
              style={{
                textDecoration: "none",
                fontFamily: "Verdana, sans-serif",
                opacity: ".8",
              }}
            >
              Awoldt
            </a>
          </span>
        </div>
      </Container>
    </>
  );
};

export default Home;

import fs from "fs";

const wordBankPath = path.resolve(__dirname, "../../../fiveletterwords.txt");

async function getFiveLetterWord() {
  const fileData = await new Promise((resolve, reject) => {
    return fs.readFile(wordBankPath, "utf-8", async (err, data) => {
      if (err) {
        return reject(err);
      } else {
        const obj = await JSON.parse(data);

        return resolve(obj[Math.floor(Math.random() * obj.length)]);
      }
    });
  });

  return fileData;
}

async function getCustomLengthWord(length: number) {
  if (length == 3) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../threeletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 4) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../fourletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 5) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../fiveletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 6) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../sixletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 7) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../sevenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 8) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../eightletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 9) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../nineletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 10) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../tenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 11) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../elevenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 12) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../twelveletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 13) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../thirteenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 14) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../fourteenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 15) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../fifteenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  } else if (length == 16) {
    const fileData = await new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, "../../../sixteenletterwords.txt"),
        "utf-8",
        async (err, data) => {
          if (err) {
            return reject(err);
          } else {
            const obj = await JSON.parse(data);

            return resolve(obj[Math.floor(Math.random() * obj.length)]);
          }
        }
      );
    });

    return fileData;
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // GENERATE GAME WITH WORD OTEHR THAN 5 LETTERS
  //CUSTOM LENGTH
  if (
    context.query.wl! &&
    Number(context.query.wl) >= 3 &&
    Number(context.query.wl) <= 16
  ) {
    const r = generateRepsonsiveLayout(
      context.req.rawHeaders[
        context.req.rawHeaders.indexOf(process.env.USER_AGENT!) + 1
      ]
    );

    const lengthOfWord = context.query.wl;
    let spellingsArray = new Array();
    for (let i = 0; i < 6; ++i) {
      spellingsArray.push(new Array(Number(lengthOfWord)).fill(""));
    }

    const customLengthWord = await getCustomLengthWord(
      Number(context.query.wl)
    );

    //need to generate custon rowSpellings state
    const x: RowDataInterface = {
      rowIndex: 0,
      charIndex: 0,
      spellings: spellingsArray,
    };

    return {
      props: {
        word_to_spell: customLengthWord,
        deviceLayout: r,
        initialRowData: x,
        defaultGame: false,
      },
    };
  }
  //GENREATE DEFAULT GAME
  else {
    const r = generateRepsonsiveLayout(
      context.req.rawHeaders[
        context.req.rawHeaders.indexOf(process.env.USER_AGENT!) + 1
      ]
    );

    const wordOK = await getFiveLetterWord();

    //DEFAULT 5 letter word game
    const x: RowDataInterface = {
      rowIndex: 0,
      charIndex: 0,
      spellings: [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ],
    };

    return {
      props: {
        word_to_spell: wordOK,
        deviceLayout: r,
        initialRowData: x,
        defaultGame: true,
      },
    };
  }
};
