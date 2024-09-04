import React, { useState, useEffect, useContext } from "react";
import TaskCard from "./TaskCard";
import CreateCard from "./UserCreateCard";
import MyContext from "./context/UserContext";
import "./App.css";

const TaskPage = () => {
  const [cards, setCards] = useState([]);
  const { setIsLoading } = useContext(MyContext);

  useEffect(() => {
    fetchUser();
  }, []);

  const calculateSecondsBetweenDates = (pastDate, endDate) => {
    const past = new Date(pastDate);
    const current = endDate ? new Date(endDate) : new Date();
    const differenceInMilliseconds = current - past;
    return Math.floor(differenceInMilliseconds / 1000);
  };

  
  const fetchUser = () => {
    setIsLoading(true);
    console.log("-----------------------------------------");
    console.log("Bearer " , localStorage.getItem("token"));
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
  
  

  const handleDescriptionChange = (index, newDescription) => {
    const updatedCards = [...cards];
    updatedCards[index].description = newDescription;
    setCards(updatedCards);
  };

  const clean = () => {
    setCards([]);
    fetchUser();
  };

  return (
    <div className="app">
      <div className="grid">
        {cards.map((card, index) => (
          <TaskCard
            key={card._id}
            index={index}
            task={card}
            onDescriptionChange={handleDescriptionChange}
            fetchUser={clean}
          />
        ))}
        <CreateCard fetchUser={fetchUser} />
      </div>
    </div>
  );
};

export default TaskPage;
