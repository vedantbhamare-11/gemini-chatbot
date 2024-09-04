import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MyContext from "../context/UserContext";


export default function AuthForm({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [team, setTeam] = useState("");

  const { setOpen, setSnackbarDescription, setSeverity, setIsLoading } =
    useContext(MyContext);
  const showSnackbar = (message, severity) => {
    setSnackbarDescription(message);
    setSeverity(severity);
    setOpen(true);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          setIsLoading(true);
          const response = await fetch(
            "https://tracker-server-dev.vercel.app/auth/verifyToken",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            setIsLoading(false);
            setIsAuthenticated(true);
            showSnackbar("Signed in successfully", "success");
          } else {
            setIsLoading(false);
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            showSnackbar("Logout successful", "failure");
          }
        } catch (error) {
          setIsLoading(false);
          showSnackbar("signed in failed", "failure");
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
    };

    checkToken();
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
      ...(isLogin
        ? {}
        : {
            name: event.target.name.value,
            team: team,
            confirmPassword: event.target.confirmPassword.value,
          }),
    };

    const url = isLogin
      ? "https://tracker-server-dev.vercel.app/users/login"
      : "https://tracker-server-dev.vercel.app/users/signup";

    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setIsLoading(false);
        localStorage.setItem("token", result.token);
        setIsAuthenticated(true);
        showSnackbar("Signed in successfully", "success");
      } else {
        setIsLoading(false);
        console.error("Error:", result.message);
        showSnackbar(result.message, "failure");
      }
    } catch (error) {
      setIsLoading(false);
      showSnackbar("signed in failed", "failure");
      console.error("Network error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={styles.paper}>
        <Avatar style={styles.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLogin ? "Sign in" : "Sign up"}
        </Typography>
        <form style={styles.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {!isLogin && (
              <>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="team-label">Team</InputLabel>
                    <Select
                      labelId="team-label"
                      id="team"
                      required
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      label="Choose Team"
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                        },
                      }}
                    >
                      <MenuItem value="2D Animation Team">
                        2D Animation Team
                      </MenuItem>
                      <MenuItem value="3D Team">3D Team</MenuItem>
                      <MenuItem value="AI Tech Team">AI Tech Team</MenuItem>
                      <MenuItem value="Administration">Administration</MenuItem>
                      <MenuItem value="BD & Marketing Team">
                        BD & Marketing Team
                      </MenuItem>
                      <MenuItem value="CGI Team">CGI Team</MenuItem>
                      <MenuItem value="Content Writer Team">
                        Content Writer Team
                      </MenuItem>
                      <MenuItem value="Creative Direction Team">
                        Creative Direction Team
                      </MenuItem>
                      <MenuItem value="Design Team">Design Team</MenuItem>
                      <MenuItem value="HR & Payroll">HR & Payroll</MenuItem>
                      <MenuItem value="Project Management Team">
                        Project Management Team
                      </MenuItem>
                      <MenuItem value="Social Media Team">
                        Social Media Team
                      </MenuItem>
                      <MenuItem value="Team Leaders">Team Leaders</MenuItem>
                      <MenuItem value="UX/UI Team">UX/UI Team</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={styles.submit}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={toggleForm}>
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

// CSS styles remain the same
const styles = {
  body: {
    backgroundColor: "#fff",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 8,
  },
  form: {
    width: "100%",
    marginTop: 24,
  },
  select: {
    "& fieldset": {
      borderColor: "#000", // Default border color
    },
    "&:hover fieldset": {
      borderColor: "#3f51b5", // Border color on hover
    },
  },
  submit: {
    margin: "24px 0 16px",
  },
};
