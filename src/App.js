import React, { useRef, useState } from "react";
import Die from "./component/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

import "./App.css";

export default function App() {
  let fastesttime = localStorage.getItem("fastest");
  console.log(fastesttime);
  const [count, setCount] = useState(0);
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [startTime, setTime] = useState(Date.now());
  const [fastest, setfastest] = useState(fastesttime || 0);
  let time = useRef();
  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      let latest = Date.now();
      time.current = Math.floor((latest - startTime) / 1000);
      if (fastest == 0) {
        localStorage.setItem("fastest", time);
      }
      if (time < fastest) {
        setfastest(time);
        console.log("called");
        localStorage.setItem("fastest", time);
      }
    }
  }, [dice]);
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setCount((count) => count + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setCount(0);
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <div className="time-section">
        <span className="floating-watch">
          Time : {tenzies ? time.current : 0} sec{" "}
        </span>
        <span className="floating-timer">Fastest : {fastest} sec </span>
      </div>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <div>No of rolls : {count}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
