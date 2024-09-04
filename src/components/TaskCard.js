import React, { useState, useContext } from "react";
import {
  Card as MuiCard,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import Timer from "./Timer";
import HistoryIcon from "@mui/icons-material/History";
import HistoryPopup from "../HistoryPopup";
import MyContext from "../context/UserContext";

const TaskCard = ({ index, task, onDescriptionChange, fetchUser }) => {
  const { setOpen, setSnackbarDescription, setSeverity } =
    useContext(MyContext);
  const [description, setDescription] = useState(task.description || "");
  const [time, setTime] = useState(task.time || 0);
  const [isRunning, setIsRunning] = useState(
    !!task.startTime && !task.stopTime
  );
  const [descriptionError, setDescriptionError] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleStart = () => {
    if (!description.trim()) {
      setDescriptionError(true);
      return;
    }

    setDescriptionError(false);

    setIsRunning(true);
    const newWork = {
      userId: task._id,
      description,
      startTime: new Date().toISOString(),
    };

    fetch("https://tracker-server-dev.vercel.app/work", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWork),
    })
      .then((res) => res.json())
      .then(() => {
        setOpen(true);
        setSnackbarDescription("Work Created successfully");
        setSeverity("success");
        fetchUser();
      });
  };

  const handleHistory = () => {
    setHistoryOpen(true);
    setCurrentUser(task._id);
  };

  const handleComplete = () => {
    if (!description.trim()) {
      setDescriptionError(true);
      return;
    }

    setDescriptionError(false);

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
        if (!res.ok) throw new Error("Failed to update work");
        return res.json();
      })
      .then(() => {
        setSnackbarDescription("Updated successfully");
        setSeverity("success");
        setOpen(true);
        fetchUser();
      })
      .catch((error) => {
        console.error("Error:", error);
        setOpen(true);
        setSnackbarDescription("Failed to update work");
        setSeverity("error");
      });
  };

  return (
    <MuiCard
      sx={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        transition: "transform 0.3s ease-in-out",
        marginBottom: 2,
        "&:hover": {
          transform: "translateY(-10px)",
        },
      }}
    >
      <HistoryPopup
        userId={currentUser}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ marginBottom: 1, fontWeight: "bold", fontFamily: "Roboto" }}
          >
            {task.name || "No Name"}
          </Typography>
          <Stack direction="row" alignItems="center" gap="10px">
            <Timer
              isRunning={isRunning}
              onTimeUpdate={setTime}
              initialTime={time}
            />
            <HistoryIcon onClick={handleHistory} sx={{ cursor: "pointer" }} />
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
          InputLabelProps={{
            className: "MuiInputLabel-outlined",
            style: {
              color: "#555",
              fontFamily: "Roboto",
              fontSize: "0.875rem",
            },
          }}
          InputProps={{
            readOnly: isRunning,
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: 2 }}
        >
          {!isRunning ? (
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
          )}
        </Stack>
      </CardContent>
    </MuiCard>
  );
};

export default TaskCard;
