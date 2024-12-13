import React from "react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const Createsrating = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    fetch(apiUrl + "getrating/", {
      method: "POST",
      body: JSON.stringify({
        userId: Cookies.get("userId"),
        songId: Cookies.get("songId"),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["stars"]) {
          setRating(data["stars"]);
          setComment(data["comment"]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const sendReview = () => {
    fetch(apiUrl + "sendrating/", {
      method: "POST",
      body: JSON.stringify({
        userId: Cookies.get("userId"),
        songId: Cookies.get("songId"),
        comment: comment,
        stars: rating,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["stars"]) {
          setRating(data["stars"]);
          setComment(data["comment"]);
        }
        setComment("");
        setRating("");
        setPage("Ratings");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ gap: 200 }}>
      <h2>Create Rating for {Cookies.get("song")}</h2>
      <input
        type="number"
        step="0.1"
        value={rating}
        onChange={(newNumber) => setRating(newNumber.target.value)}
        placeholder="Star Rating"
      ></input>
      <textarea
        rows="4"
        cols="50"
        maxLength={200}
        value={comment}
        onChange={(newComment) => setComment(newComment.target.value)}
        placeholder="Comment"
      ></textarea>
      <button onClick={sendReview}>Enter</button>
    </div>
  );
};

export default Createsrating;
