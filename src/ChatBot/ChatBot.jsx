import React, { useState } from 'react';
import './ChatBot.css';

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let body = {
  "client": {
    "user_id": "some-user-id-4"
  },
  "metadata": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "request_id": "random-id",
  "payload": {
    "content": {
      "text": "Hello@protonmail.com"
    },
    "content_type": "text"
  },
  "provider": {
    "name": "webAdapter"
  }
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chat, setChat] = useState(true);
  const [active, setActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (inputValue.trim()) {
      setMessages([...messages, { title: inputValue, user: true }]);
      setInputValue('');
      
      body.metadata.firstname = "Test";
      const raw = JSON.stringify(body);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      if (!active) {
        setActive(true);
        fetch("https://a4cc-179-49-226-34.ngrok-free.app/api/v1/message", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            const received = result;
            console.log(received);

            // Iterate over the received messages
            const newMessages = received.messages.map((msg) => {
              if (msg && msg.payload && msg.payload.content) {
                const test = msg.payload.content_type === "text" ? msg.payload.content.text : msg.payload.content.title;
                const buttons = msg.payload.content.buttons ? msg.payload.content.buttons[0].content.accepts : [];
                console.log(buttons);
                return { title: test, user: false, botones: buttons };
              }
              return null;
            }).filter(Boolean); // Remove any null values

            // Add the received messages to the state
            setMessages((prevMessages) => [
              ...prevMessages,
              ...newMessages
            ]);

            setActive(false); // Reset the active state after fetching messages
          })
          .catch((error) => {
            console.error(error);
            setActive(false); // Reset the active state in case of an error
          });
      } else {
        console.log("Wait");
      }
    }
  };

  function buttonsPress(option) {
    switch (option) {
      case "a":
        console.log("A");
        break;
      case "b":
        console.log("B");
        break;
      default:
    }
  }

  return (
    <div className="main">
      {chat ? (
        <div className="chat-bot">
          <button className="close-btn" onClick={() => setChat(false)}>✖</button>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.user ? 'right-message' : 'left-message'}`}>
                {message.title}
                {Array.isArray(message.botones) && message.botones.length !== 0 ? message.botones.map((btn, btnIndex) => (
                  <button key={btnIndex} onClick={() => buttonsPress(btn)}>
                    {btn}
                  </button>
                )) : null}
              </div>
            ))}
          </div>
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>
      ) : (
        <div className="open-chat">
          <button className="open-chat-btn" onClick={() => setChat(true)}>
            Open Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
