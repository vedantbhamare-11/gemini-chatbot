import React, { useState, useContext, useRef } from "react";
import {
  Card as MuiCard,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import Timer from "./Timer";
import "./App.css";
import HistoryPopup from "./HistoryPopup";
import MyContext from "./context/UserContext";
import CardMenu from "./components/cardMenu";
import axios from "axios";
import { MdPause } from "react-icons/md";
import { IoPlay } from "react-icons/io5";

const TaskCard = ({ index, task, onDescriptionChange, fetchUser }) => {
  // console.log(task.isEnabled);
  const { setOpen, setSnackbarDescription, setSeverity } =
    useContext(MyContext);
  const [description, setDescription] = useState(task.description || "");
  const [isPaused, setIsPaused] = useState(task.isPaused);
  const [time, setTime] = useState(task.time || 0);
  const [isRunning, setIsRunning] = useState(
    !!task.startTime && !task.stopTime
  );
  const [descriptionError, setDescriptionError] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const nameFieldRef = useRef(null);
  const [name, setName] = useState(task.name || "");

  const showSnackbar = (message, severity) => {
    setSnackbarDescription(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handlePause = async () => {
    debugger;
    if (!task.task_id) return;
    setIsPaused(true);
    try {
      const response = await fetch(
        `https://tracker-server-dev.vercel.app/work/pause-work/${task.task_id}`,
        {
          method: "PUT", // Assuming you are using a PUT request
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        showSnackbar("Error pausing work", "failure");
        throw new Error(errorText);
      }

      const updatedWork = await response.json();
      console.log("Work paused:", updatedWork);
      showSnackbar("Work paused successfully", "success");
      // Handle UI update here
    } catch (error) {
      console.error("Error pausing work:", error);
      showSnackbar("Error pausing work", "failure");
    }
  };

  const handleResume = async () => {
    if (!task.task_id) return;
    setIsPaused(false);
    try {
      const response = await fetch(
        `https://tracker-server-dev.vercel.app/work/play-work/${task.task_id}`,
        {
          method: "PUT", // Assuming you are using a PUT request
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        showSnackbar("Error resuming work", "failure");
        throw new Error(errorText);
      }

      const updatedWork = await response.json();
      console.log("Work resumed:", updatedWork);
      showSnackbar("Work resumed successfully", "success");
      // Handle UI update here
    } catch (error) {
      showSnackbar("Error resuming work", "failure");
      console.error("Error resuming work:", error);
    }
  };

  const handleStart = () => {
    if (!description.trim()) {
      setDescriptionError(true);
      return; // Stop further execution if the description is empty
    }

    setDescriptionError(false); // Clear the error if validation passes

    setIsRunning(true);
    const newWork = {
      userId: task._id,
      description: description || "",
      startTime: new Date().toISOString(),
    };

    fetch("https://tracker-server-dev.vercel.app/work", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWork),
    }).then((res) => {
      res.json();
      showSnackbar("Work Created successfully", "success");
      fetchUser(); // Fetch the updated list of cards
    });
  };

  const updateUser = async (event) => {
    event.preventDefault(); // Prevents default form submission behavior

    // Ensure task._id and name are provided
    if (!task._id || !name) {
      showSnackbar("User ID and name are required", "failure");
      return;
    }

    try {
      // Adjust the URL to include the full address of the backend server
      const response = await fetch(
        `https://tracker-server-dev.vercel.app/users/update/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ name }), // Send the updated name in the request body
        }
      );

      // Parse the JSON response from the server
      const result = await response.json();

      if (response.ok) {
        showSnackbar("User updated successfully", "success");
        setIsEdit(false);
        fetchUser();
      } else {
        showSnackbar(result.message, "failure");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showSnackbar(
        "An unexpected error occurred. Please try again later.",
        "failure"
      );
    }
  };

  const handleHistory = () => {
    setHistoryOpen(true);
    setCurrentUser(task._id);
  };

  const handleUserDelete = async () => {
    try {
      const response = await axios.delete(
        `https://tracker-server-dev.vercel.app/users/delete/${task._id}`
      );
      showSnackbar("User deleted successfully", "success");
      fetchUser(); // Fetch the updated list of cards
    } catch (error) {
      console.error("Error deleting user:", error);
      let errorMessage;
      // Provide more detailed feedback based on error status
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid user ID.";
            break;
          case 404:
            errorMessage = "User not found.";
            break;
          default:
            errorMessage =
              "An unexpected error occurred. Please try again later.";
        }
      } else {
        errorMessage =
          "Failed to delete user. Please check your network connection.";
      }
      showSnackbar(errorMessage, "failure");
    }
  };

  const handleNameChange = () => {
    setIsEdit(true);
    if (nameFieldRef.current) {
      nameFieldRef.current.focus();
    }
  };

  const handleComplete = () => {
    if (!description.trim()) {
      setDescriptionError(true);
      return; // Stop further execution if the description is empty
    }

    setDescriptionError(false); // Clear the error if validation passes

    setIsRunning(false);
    const updatedWork = {
      ...task,
      stopTime: new Date().toISOString(),
    };

    fetch(`https://tracker-server-dev.vercel.app/work/${updatedWork.task_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWork),
    })
      .then((res) => {
        if (!res.ok) {
          // Handle the error if the response status is not OK
          throw new Error("Failed to update work");
        }
        return res.json(); // Parse the JSON from the response
      })
      .then((data) => {
        showSnackbar("Work updated successfully", "success");
        fetchUser(); // Fetch the updated list of cards
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error:", error);
        showSnackbar("Failed to update work", "failure");
      });
  };

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <MuiCard
      sx={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        transition: "transform 0.3s ease-in-out",
        marginBottom: 2,
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          // transform: "translateY(-10px)",
        },
      }}
    >
      <HistoryPopup
        userId={currentUser}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Stack direction="row" alignItems="center"> */}

          {isEdit ? (
            <TextField
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              inputRef={nameFieldRef}
              variant="outlined"
              autoFocus
              size="small"
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
          ) : (
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                fontWeight: "bold",
                fontFamily: "Roboto",
              }}
            >
              {task.name || "No Name"}
            </Typography>
          )}
          {/* </Stack> */}
          <Stack
  direction="row"
  alignItems="center"
  gap="10px"
  display={isEdit ? "none" : "flex"}
>
  {task.isEnabled && isRunning && (
    !isPaused ? (
      <MdPause onClick={handlePause} />
    ) : (
      <IoPlay onClick={handleResume} />
    )
  )}
  <Timer
    isRunning={!isPaused}
    onTimeUpdate={setTime}
    initialTime={time}
  />
  <CardMenu
    handleHistory={handleHistory}
    handleNameChange={handleNameChange}
    handleUserDelete={handleUserDelete}
    isEnabled={task.isEnabled}
  />
  {/* <HistoryIcon onClick={handleHistory} sx={{ cursor: "pointer" }} /> */}
</Stack>
        </Stack>

        <TextField
          label="Work Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onDescriptionChange(index, e.target.value);
          }}
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          margin="normal"
          error={descriptionError}
          helperText={descriptionError ? "Work Description is required" : ""}
          sx={{
            visibility: !isEdit ? "visible" : "hidden",
            backgroundColor: "#fff",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
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
          InputLabelProps={{
            className: "MuiInputLabel-outlined",
            style: {
              color: "#555",
              fontFamily: "Roboto",
              fontSize: "0.875rem",
            },
          }}
          InputProps={{
            readOnly: !task.isEnabled,
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: 2 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontFamily: "Roboto",
              fontWeight: 700,
            }}
          ></Typography>
          {task.isEnabled &&
            (isEdit ? (
              <Button
                variant="contained"
                color="primary"
                onClick={updateUser}
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: 2,
                  textTransform: "none",
                  padding: "6px 12px",
                  fontFamily: "Roboto",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                Update
              </Button>
            ) : !isRunning ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStart}
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: 2,
                  textTransform: "none",
                  padding: "6px 12px",
                  fontFamily: "Roboto",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                Start
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleComplete}
                sx={{
                  backgroundColor: "#555",
                  color: "#fff",
                  borderRadius: 2,
                  textTransform: "none",
                  padding: "6px 12px",
                  fontFamily: "Roboto",
                  "&:hover": {
                    backgroundColor: "#777",
                  },
                }}
              >
                Complete
              </Button>
            ))}
        </Stack>
      </CardContent>
    </MuiCard>
  );
};

export default TaskCard;
