import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import { CardImage, type Card } from "./Card";

const card: Card = { rank: "A", suit: "S" };

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CardImage card={card} width={120} />
    </>
  );
}

export default App;
