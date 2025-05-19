// src/pages/signup/signup.js
import React, { useState } from "react";
import "./signup.css";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
    pronouns: "",
    preferences: [],
  });

  const eventOptions = [
    "Concerts", "Theater", "Comedy", "Film", "Art Exhibits", "Dance",
    "Classical Music", "Festivals", "Nightlife", "Sports", "Family",
    "Outdoor Adventures", "Food & Wine", "Cooking", "Fitness", "Yoga",
    "Meditation", "Books & Literature", "Poetry", "Technology", "Startups",
    "Hackathons", "Science & Space", "Environment", "Sustainability",
    "Pet Events", "Photography", "Cultural Events", "Spirituality", "Wellness"
  ];

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const selected = Array.from(selectedOptions).map(opt => opt.value);
      setFormData({ ...formData, preferences: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.preferences.length < 3) {
      alert("Please select at least 3 event preferences.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        birthday: formData.birthday,
        pronouns: formData.pronouns,
        city: "Berkeley",
        preferences: formData.preferences,
        email: formData.email,
      });

      alert("User created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ✅ Backend check using environment variable
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/google-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      const data = await res.json();

      if (data.needsProfileCompletion) {
        alert("Account created. Please complete your profile.");
        navigate("/complete-profile");
      } else {
        alert("You’ve already signed up with Google.");
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="birthday" type="date" onChange={handleChange} required />
        <input name="pronouns" placeholder="Pronouns (e.g. she/her, they/them)" onChange={handleChange} required />

        <label className="select-label">Select at least 3 Event Preferences:</label>
        <div className="checkbox-group">
          {eventOptions.map((option, idx) => (
            <label key={idx} className="checkbox-item">
              <input
                type="checkbox"
                value={option}
                checked={formData.preferences.includes(option)}
                onChange={() => {
                  const selected = formData.preferences.includes(option)
                    ? formData.preferences.filter((pref) => pref !== option)
                    : [...formData.preferences, option];
                  setFormData({ ...formData, preferences: selected });
                }}
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit">Sign Up</button>
        <button type="button" className="google-signup" onClick={handleGoogleSignUp}>
          Sign Up with Google
        </button>
      </form>
    </div>
  );
}
