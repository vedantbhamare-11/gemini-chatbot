import React, { useState } from 'react';
import MyContext from './UserContext';

const MyProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [snackbarDescription, setSnackbarDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MyContext.Provider value={{  open, setOpen,snackbarDescription, setSnackbarDescription, severity, setSeverity, isLoading, setIsLoading }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
