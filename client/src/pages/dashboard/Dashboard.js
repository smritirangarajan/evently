import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './dashboard.css';

function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const savedEvents = userSnap.data().myEvents || [];
        const calendarEvents = savedEvents.map((event) => {
          const date = new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate);
          return {
            title: event.name,
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
          };
        });
        setEvents(calendarEvents);
      }
    };

    fetchEvents();
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderCalendar = () => {
    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const match = events.find(e => e.day === day && e.month === month && e.year === year);
      calendar.push(
        <div key={day} className={`calendar-day${match ? ' has-event' : ''}`}>
          <div className="day-number">{day}</div>
          {match && <div className="event-label">{match.title}</div>}
        </div>
      );
    }
    return calendar;
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">My Event Calendar</h1>
      <div className="custom-calendar">
        {renderCalendar()}
      </div>
    </div>
  );
}

export default Dashboard;