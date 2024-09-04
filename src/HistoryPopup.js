import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Timer from "./Timer";
import axios from "axios";
import { TbTableExport } from "react-icons/tb";

const HistoryPopup = ({ open, onClose, userId }) => {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    custom: [], // Added for custom range data
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(""); // Start date for custom range
  const [endDate, setEndDate] = useState(""); // End date for custom range
  const [dateError, setDateError] = useState(""); // To store date error message

  useEffect(() => {
    if (open) {
      if (tab!=3)
      fetchHistoryData(tab,false);
    }
  }, [open, tab]);

  const fetchHistoryData = async (selectedTab, IsExport) => {
    if (selectedTab === 3 && (!startDate || !endDate)) {
      setDateError("Both start and end dates are required.");
      return;
    }
  
    if (selectedTab === 3 && new Date(startDate) >= new Date(endDate)) {
      setDateError("End date must be greater than start date.");
      return;
    }
  
    setDateError("");
    setLoading(true);
    let endpoint = "";
  
    switch (selectedTab) {
      case 0:
        endpoint = "/work/today";
        break;
      case 1:
        endpoint = "/work/lastweek";
        break;
      case 2:
        endpoint = "/work/lastmonth";
        break;
      case 3: // Custom Range
        endpoint = `/work/range?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
        break;
      default:
        break;
    }
  
    // Append userId to the endpoint if it's not null
    if (userId) {
      endpoint += endpoint.includes('?') ? `&userId=${encodeURIComponent(userId)}` : `?userId=${encodeURIComponent(userId)}`;
    }
    if (IsExport) {
      endpoint += endpoint.includes('?') ? `&IsExport=true` : `?IsExport=true`;
    }
  
    try {
      
      const response = await axios.get(`https://tracker-server-dev.vercel.app${endpoint}`, {
        responseType: IsExport ? 'blob' : 'json',
      });
      if (IsExport) {

          // Extract filename from Content-Disposition header
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'ExportedData.xlsx'; // Default filename

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match && match[1]) {
      filename = match[1];
    }
  }
        // Create a link to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'WorkHistory.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const data = response.data;
        const updatedHistory = { ...history };
        if (selectedTab === 0) updatedHistory.daily = data;
        else if (selectedTab === 1) updatedHistory.weekly = data;
        else if (selectedTab === 2) updatedHistory.monthly = data;
        else if (selectedTab === 3) updatedHistory.custom = data;
        setHistory(updatedHistory);
      }
    } catch (error) {
      console.error("Error fetching work history:", error);
    } finally {
      setLoading(false);
    }
  };
  

  function calculateSecondsBetweenDates(pastDate, endDate) {
    const past = new Date(pastDate);
    const current = endDate ? new Date(endDate) : new Date();

    const differenceInMilliseconds = current - past;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    return differenceInSeconds;
  }

    const renderHistoryTable = (data) => (
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Work Description
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#fff" }}>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", padding: "16px" }}>
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {entry.user.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {entry.description}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <Timer
                      isRunning={entry.stopTime ? false : true}
                      onTimeUpdate={setTime}
                      initialTime={calculateSecondsBetweenDates(entry?.startTime, entry?.stopTime)}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {new Date(entry.startTime).toLocaleDateString()}{" "}
                    {/* Format date */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          border: "none",
          boxShadow: "none",
          borderRadius: 4,
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Work History
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
      
        <div className="Tab" style={{ display: "flex", flexDirection: "column" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            aria-label="history tabs"
            sx={{
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {["Daily", "Weekly", "Monthly", "Custom Range"].map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  backgroundColor: tab === index ? "#000" : "#f5f5f5",
                  color: tab === index ? "#fff !important" : "#000",
                  borderRadius:
                    index === 0
                      ? "8px 0 0 8px"
                      : index === 3
                      ? "0 8px 8px 0"
                      : "0",
                  "&:hover": {
                    backgroundColor: tab === index ? "#333" : "#e0e0e0",
                  },
                  padding: "10px 20px",
                  minWidth: 0,
                }}
              />
            ))}
          </Tabs>
          <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                }}
                onClick={() => fetchHistoryData(tab, true)}
              >
                Export
              </Button>
          {/* <TbTableExport onClick={() => fetchHistoryData(tab, true)} size={30} /> */}
          </Stack>
          {tab === 3 && (
            <Box sx={{ marginTop: 4, justifyContent: "left", display: "flex", flexDirection: "column" }}>
              <TextField
                label="Start Date"
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ 
                  fontFamily: "Roboto",
                  color: "#fff",
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
                  marginTop: 2
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Date"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ 
                  fontFamily: "Roboto",
                  color: "#fff",
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
                  marginTop: 2
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
              sx={{ marginTop: 2 }}
                variant="contained"
                color="primary"
                onClick={() => fetchHistoryData(tab)}
              >
                Apply
              </Button>
              {dateError && (
                <FormHelperText error sx={{ marginTop: 2 }}>
                  {dateError}
                </FormHelperText>
              )}
            </Box>
          )}

          <Box sx={{ marginTop: 2, maxHeight: 400, overflowY: "auto" }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                {tab === 0 && renderHistoryTable(history.daily)}
                {tab === 1 && renderHistoryTable(history.weekly)}
                {tab === 2 && renderHistoryTable(history.monthly)}
                {tab === 3 && renderHistoryTable(history.custom)}
              </>
            )}
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryPopup;
