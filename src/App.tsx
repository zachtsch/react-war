// import heroImg from "./assets/hero.png";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
import "./App.css";
// import { CardImage, type Card } from "./Card";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Message = {
  id: number;
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content")
        .order("id");

      if (error) {
        setError(error.message);
      } else {
        setMessages(data);
      }
    }

    loadMessages();
  }, []);

  return (
    <div>
      <h1>Supabase Messages</h1>

      {error && <p>Error: {error}</p>}

      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
// const card: Card = { rank: "A", suit: "S" };

// function App2() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <CardImage card={card} width={120} />
//     </>
//   );
// }
