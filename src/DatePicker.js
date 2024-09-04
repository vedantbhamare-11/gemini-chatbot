// src/DateRangePicker.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = date => {
    setStartDate(date);
  };

  const handleEndDateChange = date => {
    setEndDate(date);
  };

  return (
    <div style={{display : "flex"}}>

      <div>
        <label>
          Start Date:
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select start date"
          />
        </label>
      </div>
      <div>
        <label>
          End Date:
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date"
          />
        </label>
      </div>
      {/* <div>
        <p>
          Selected Range: {startDate ? format(startDate, 'MMMM d, yyyy') : 'Start date not selected'} 
          {startDate && endDate ? ' - ' : ''} 
          {endDate ? format(endDate, 'MMMM d, yyyy') : 'End date not selected'}
        </p>
      </div> */}
    </div>
  );
};

export default DateRangePicker;
