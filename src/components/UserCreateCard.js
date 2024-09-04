import React, { useState,useContext } from "react";
import {
  Card as MuiCard,
  CardContent,
  Typography,
  Box,
  Button,
  TextField
} from "@mui/material";
import "./App.css";
import { BsPlusCircle } from "react-icons/bs";
import MyContext from "../context/UserContext";

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";

const CreateCard= ({ fetchUser }) => {
  const {  setOpen, setSnackbarDescription, setSeverity } = useContext(MyContext);
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleIconClick = () => {
    setIsClicked(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCreateClick = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch("https://tracker-server-dev.vercel.app/users/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: inputValue }),
        });

        if (response.ok) {
          // Handle success (e.g., show a success message or reset the input)
          setInputValue(""); // Clear input after success
          setIsClicked(false); // Optionally, reset state
          setOpen(true);
          setSnackbarDescription("User created successfully!");
          setSeverity("success");
          // alert("User created successfully!");
          fetchUser()
        } else {
          // Handle error
          setOpen(true);
          setSnackbarDescription("Failed to create user.");
          setSeverity("error");
          // alert("Failed to create user.");
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error:", error);
        alert("An error occurred.");
      }
    }
  };

  return (
    <MuiCard
      sx={{
        minHeight : "280px",
        height: "90%",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-10px)",
        },
      }}
    >
      {!isClicked ? (
        <CardContent
          sx={{
            height: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <BsPlusCircle onClick={handleIconClick} size={50} color="#c4c4c4" />
          </Box>
        </CardContent>
      ) : (
        <CardContent sx={{ height: "90%", position: "relative" }}>
          <TextField
            variant="outlined"
            value={inputValue}
            size="small"
            onChange={handleInputChange}
            sx={{
            fontWeight: "bold",
            fontFamily: "Roboto",
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                  },
                  "& fieldset": {
                    borderColor: "#ddd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#bbb",
                  },
                },
              }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClick}
            sx={{
            fontFamily: "Roboto",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              padding: "6px 12px",
              fontFamily: "Roboto",
              position: "absolute",
              bottom: 32,
              right: 8,
              "&:hover": {
                backgroundColor: "#333",
              },
              opacity: inputValue.trim() === "" ? 0.5 : 1,
              cursor: inputValue.trim() === "" ? "not-allowed" : "pointer",
            }}
            disabled={inputValue.trim() === ""}
          >
            Create
          </Button>
        </CardContent>
      )}
    </MuiCard>
  );
};

export default CreateCard;
