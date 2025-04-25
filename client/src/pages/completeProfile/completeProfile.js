// src/pages/completeProfile/completeProfile.js
import React, { useState, useEffect } from "react";
import "./completeProfile.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
    pronouns: "",
    preferences: [],
  });

  const navigate = useNavigate();

  const eventOptions = [
    "Concerts", "Theater", "Comedy", "Film", "Art Exhibits", "Dance",
    "Workshops", "Tech Meetups", "Startup Events", "Fitness", "Yoga",
    "Outdoor Adventures", "Food Festivals", "Cooking Classes", "Book Clubs",
    "Game Nights", "Networking", "Career Fairs", "Hackathons", "Volunteering",
    "Environmental Causes", "LGBTQ+ Events", "Cultural Festivals", "Museum Tours",
    "Poetry Readings", "Photography", "Travel Meetups", "Wellness Retreats",
    "Parenting Events", "Pet Meetups", "Spiritual Gatherings", "Live Podcasts"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (option) => {
    const updated = formData.preferences.includes(option)
      ? formData.preferences.filter((p) => p !== option)
      : [...formData.preferences, option];
    setFormData({ ...formData, preferences: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.preferences.length < 3) {
      alert("Please select at least 3 event preferences.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("No authenticated user found.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        email: user.email
      });
      alert("Profile completed!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>Complete Your Profile</h2>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="birthday" type="date" onChange={handleChange} required />
        <input name="pronouns" placeholder="Pronouns (e.g. they/them)" onChange={handleChange} required />

        <label>Select at least 3 Event Preferences:</label>
        <div className="checkbox-group">
          {eventOptions.map((option, idx) => (
            <label key={idx} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.preferences.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
} // End of component