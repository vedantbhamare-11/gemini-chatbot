import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Divider,
} from "@mui/material";
import "./App.css";
import CreateCard from "./UserCreateCard";
import MyContext from "./context/UserContext";
import TaskCard from "./TaskCard";

const App = () => {
    const [cards, setCards] = useState([]);
    const [filter, setFilter] = useState('');
    const { setIsLoading } = useContext(MyContext);
  
    function calculateSecondsBetweenDates(startDate, endDate, pauseTime, totalPausedTime = 0) {
      const past = new Date(startDate);
      const current = endDate ? new Date(endDate) : new Date();
  
      let differenceInMilliseconds = current - past;
  
      // If pauseTime is provided, subtract the duration between current time and pause time
      if (pauseTime) {
          const pauseDuration = current - new Date(pauseTime);
          differenceInMilliseconds -= pauseDuration;
      }
  
      // Subtract totalPausedTime
      differenceInMilliseconds -= totalPausedTime;
  
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
      return differenceInSeconds;
  }
  
  
    function clean() {
      setCards([]);
      fetchUser();
    }

    const fetchUser = () => {
      setIsLoading(true);
      fetch("https://tracker-server-dev.vercel.app/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the token in the header
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCards(
            data.map((user) => ({
              _id: user._id,
              name: user.name,
              task_id: user.lastWork?._id || "",
              description: user.lastWork?.description || "",
              time: user.lastWork?.startTime
                ? calculateSecondsBetweenDates(
                    user.lastWork?.startTime,
                    user.lastWork?.stopTime
                  )
                : 0,
              startTime: user.lastWork?.startTime || null,
              stopTime: user.lastWork?.stopTime || null,
              isPaused: user.lastWork?.isPaused || false,
              isEnabled: user.isEnabled, // Using the isEnabled property
            }))
          );
        })
        .catch((error) => console.error("Error fetching users:", error))
        .finally(() => setIsLoading(false));
    };

    useEffect(() => {
      fetchUser();
    }, []);
  
    const handleDescriptionChange = (index, newDescription) => {
      const updatedCards = [...cards];
      updatedCards[index].description = newDescription;
      setCards(updatedCards);
    };
  
    const handleFilterChange = (e) => {
      setFilter(e.target.value);
    };
  
    // Filter and sort cards
    const sortedCards = cards
      .filter(card => card.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    const enabledUsers = sortedCards.filter(card => card.isEnabled);
    const disabledUsers = sortedCards.filter(card => !card.isEnabled);
  
    return (
      <div className="app">
      <div className="text-field-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <TextField
          id="standard-search"
          type="search"
          variant="standard"
          label="Search..."
          value={filter}
          onChange={handleFilterChange}
          autoFocus
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Roboto',
            width: '70%',
            marginBottom: 5,
            background: '#fff',
            borderRadius: 2,
          }}
        />
      </div>
      <div className="grid">
      {enabledUsers.map((card, index) => (
          <TaskCard
            key={card._id}
            index={index}
            task={card}
            onDescriptionChange={handleDescriptionChange}
            fetchUser={clean}
          />
        ))}
        </div>


        {/* Add a horizontal line if both enabled and disabled users exist */}
        {enabledUsers.length > 0 && disabledUsers.length > 0 && (
          <>
            <Divider style={{ margin: '20px 0', borderColor: "#ccc" }} />
            <br /> {/* Add line break */}
          </>
        )}
      <div className="grid">
        
    
        
    
        {disabledUsers.map((card, index) => (
          <TaskCard
            key={card._id}
            index={index + enabledUsers.length} // Adjust index to avoid key conflicts
            task={card}
            onDescriptionChange={handleDescriptionChange}
            fetchUser={clean}
          />
        ))}
    
        {/* <CreateCard fetchUser={fetchUser} /> */}
      </div>
    </div>
    
    );
  };
  
export default App;
