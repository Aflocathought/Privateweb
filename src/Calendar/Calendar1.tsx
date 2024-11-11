import { useState } from "react";
import "./App.css";
import Calendar from "react-calendar";

// @ts-ignore
import { Todo } from "../Todo/TodoUpdate";

export const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  // 随机背景

  return (
    <div style={{backgroundColor:"white"}}>
      <div className="calendar">
        <h1 className="text-center">React Calendar</h1>
        <div className="calendar-container">
          {/* @ts-ignore*/}
          <Calendar onChange={setDate} value={date} />
        </div>
        <p className="text-center">
          <span className="bold">Selected Date:</span> {date.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default MyCalendar;
