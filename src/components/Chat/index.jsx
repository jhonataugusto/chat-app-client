import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import "../../style/style.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const myId = uuidv4();
const socket = io("f88f-45-188-91-9.sa.ngrok.io:8080");
//oi tudo bem
socket.on("connect", () => console.log("[IO] Connect => New Connection"));

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (newMessage) =>
      setMessages([...messages, newMessage]);
    socket.on("chat.message", handleNewMessage);
    return () => socket.off("chat.message", handleNewMessage);
  }, [messages]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // fazer o browser não recarregar a página

    if (message.trim()) {
      //se a string for diferente de branca, reseta o estado
      socket.emit("chat.message", {
        id: myId,
        message,
      });
      setMessage("");
    }
  };

  const renderMessages = messages.map((m, index) => (
    <li
      className={`list__item list__item--${m.id === myId ? "mine" : "other"}`}
      key={index}
    >
      <span className={`message message--${m.id === myId ? "mine" : "other"}`}>
        {m.message}
      </span>
    </li>
  ));

  return (
    <main className="container">
      <ul className="list">{renderMessages}</ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          onChange={handleInputChange}
          className="form__field"
          placeholder="Digite uma mensagem aqui..."
          type="text"
          value={message}
        />
        <button className="button" onClick={handleFormSubmit}>
          Enviar
        </button>
      </form>
    </main>
  );
};

export default Chat;
