import axios from "axios";

export const handleUserDelete = async (
  fetchUser,
  task,
  setOpen,
  setSnackbarDescription,
  setSeverity
) => {
  try {
    const response = await axios.delete(
      `https://tracker-server-dev.vercel.app/users/delete/${task._id}`
    );
    setSnackbarDescription("User deleted successfully");
    setSeverity("success");
    setOpen(true);
    fetchUser(); // Fetch the updated list of cards
  } catch (error) {
    console.error("Error deleting user:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = "User not found";
          break;
        case 500:
          errorMessage = "Internal Server Error";
          break;
        default:
          errorMessage = "An unknown error occurred";
      }
    } else {
      errorMessage = "Failed to connect to the server";
    }
    setSnackbarDescription(errorMessage);
    setSeverity("error");
    setOpen(true);
  }
};

export const handleStart = async (
  description,
  setDescriptionError,
  setIsRunning,
  task,
  setOpen,
  setSnackbarDescription,
  setSeverity,
  fetchUser
) => {
  if (!description) {
    setDescriptionError(true);
    setOpen(true);
    setSnackbarDescription("Please enter the work description");
    setSeverity("error");
    return;
  }

  try {
    const response = await axios.put(
      `https://tracker-server-dev.vercel.app/users/start/${task._id}`,
      { startTime: Date.now() }
    );
    setIsRunning(true);
    setSnackbarDescription("Task started successfully");
    setSeverity("success");
    setOpen(true);
    fetchUser();
  } catch (error) {
    console.error("Error starting task:", error);
    setSnackbarDescription("Failed to start task");
    setSeverity("error");
    setOpen(true);
  }
};

export const handleComplete = async (
  description,
  setDescriptionError,
  setIsRunning,
  task,
  setOpen,
  setSnackbarDescription,
  setSeverity,
  fetchUser
) => {
  if (!description) {
    setDescriptionError(true);
    setOpen(true);
    setSnackbarDescription("Please enter the work description");
    setSeverity("error");
    return;
  }

  try {
    const response = await axios.put(
      `https://tracker-server-dev.vercel.app/users/complete/${task._id}`,
      { stopTime: Date.now() }
    );
    setIsRunning(false);
    setSnackbarDescription("Task completed successfully");
    setSeverity("success");
    setOpen(true);
    fetchUser();
  } catch (error) {
    console.error("Error completing task:", error);
    setSnackbarDescription("Failed to complete task");
    setSeverity("error");
    setOpen(true);
  }
};

export const updateUser = async (
  event,
  task,
  name,
  setOpen,
  setSnackbarDescription,
  setSeverity,
  setIsEdit,
  fetchUser
) => {
  event.preventDefault();

  try {
    const response = await axios.put(
      `https://tracker-server-dev.vercel.app/users/update/${task._id}`,
      { name }
    );
    setSnackbarDescription("User updated successfully");
    setSeverity("success");
    setOpen(true);
    setIsEdit(false);
    fetchUser();
  } catch (error) {
    console.error("Error updating user:", error);
    setSnackbarDescription("Failed to update user");
    setSeverity("error");
    setOpen(true);
  }
};
