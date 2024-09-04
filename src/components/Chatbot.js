import React, { useState } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, fromUser: true },
    ]);

    const genAI = new GoogleGenerativeAI(
      "AIzaSyCawzKxqyLlz6jFqYTykNzEvoUVcspQT7Q"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: result.response.text(), fromUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching response from Gemini API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, there was an error processing your request.",
          fromUser: false,
        },
      ]);
    }

    setInput("");
  };

  return (
    <>
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 2000,
          backgroundColor: "#3f51b5",
          color: "white",
          "&:hover": {
            backgroundColor: "#2c387e",
            opacity: 1,
          },
          transition: "background-color 0.3s, opacity 0.3s",
          width: 60,
          height: 60,
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            width: 350,
            height: 500,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
            p: 2,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            className="chatbox"
            sx={{
              overflowY: "auto",
              height: "calc(100% - 60px)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                className="chat-message"
                sx={{
                  alignSelf: message.fromUser ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  backgroundColor: message.fromUser ? "#3f51b5" : "#f0f0f0",
                  color: message.fromUser ? "white" : "black",
                  borderRadius: "16px",
                  padding: "10px",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend();
                }
              }}
              sx={{ mr: 1 }}
            />
            <Button
              className="send-btn"
              variant="contained"
              color="primary"
              onClick={handleSend}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chatbot;
