import React, { useState, useContext } from "react";
import { Container, ThemeProvider, Box } from "@mui/material";
import TaskCard from "./TaskPage";
import HistoryPopup from "./HistoryPopup";
import Navbar from "./Navbar";
import theme from "./theme";
import "./App.css";
import MyProvider from "./context/UserProvider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MyContext from "./context/UserContext";
import Loader from "./components/Loader";
import SignUp from "./components/SignUpSide";
import Chatbot from "./components/Chatbot";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";

const App = () => {
  const [tasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : Array(6).fill({ name: "", description: "", time: 0 });
  });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  return (
    <MyProvider>
      <AppContent
        tasks={tasks}
        historyOpen={historyOpen}
        setHistoryOpen={setHistoryOpen}
        isAuth={isAuth}
        setIsAuth={setIsAuth}
      />
    </MyProvider>
  );
};
const AppContent = ({
  tasks,
  historyOpen,
  setHistoryOpen,
  isAuth,
  setIsAuth,
}) => {
  const { open, setOpen, snackbarDescription, severity, isLoading } =
    useContext(MyContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading && <Loader />}
      {!isAuth && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "2%",
            borderRadius: "8px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
            minWidth: "300px",
          }}
        >
          <SignUp
            onSignUp={() => setIsAuth(true)}
            isAuthenticated={isAuth}
            setIsAuthenticated={setIsAuth}
          />
        </Box>
      )}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100%",
          filter: !isAuth ? "blur(8px)" : "none",
          pointerEvents: !isAuth ? "none" : "auto",
        }}
      >
        <Navbar
          onHistoryClick={() => setHistoryOpen(true)}
          setIsAuthenticated={setIsAuth}
        />
        <Container className="container">
          {isAuth && <TaskCard tasks={tasks} />}
          <HistoryPopup
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />
        </Container>
      </Box>
      <Chatbot />
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: "64px" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: "100%",
            bgcolor: severity === "success" ? "black" : "#ad1f10",
            color: severity === "success" ? "white" : undefined,
          }}
        >
          {snackbarDescription}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
