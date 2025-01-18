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

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, user: true }]);
      setInputValue('');
      
      body.metadata.firstname = "Test";
      const raw = JSON.stringify(body);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://a4cc-179-49-226-34.ngrok-free.app/api/v1/message", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          const received = result;
          console.log(received);

          // Iterate over the received messages
          const newMessages = received.messages.map((msg) => {
            if (msg && msg.payload && msg.payload.content) {
              return { text: msg.payload.content.text, user: false };
            }
            return null;
          }).filter(Boolean); // Remove any null values

          // Add the received messages to the state
          setMessages((prevMessages) => [
            ...prevMessages,
            ...newMessages
          ]);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="main">
      {chat ? (
        <div className="chat-bot">
          <button className="close-btn" onClick={() => setChat(false)}>✖</button>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.user ? 'right-message' : 'left-message'}`}>
                {message.text}
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
