import React from "react";
import { useState, useEffect } from "react";

const UserPage = ({ setPage }) => {
  const [user, setUser] = useState("");
  const [ratings, setRatings] = useState([]);
  const [update, setUpdate] = useState(0);

  const apiUrl = "http://127.0.0.1:8000/";

  const submitUser = () => {
    setRatings([]);
    setUpdate(update + 1);
  };

  useEffect(() => {
    fetch(apiUrl + "getuser/", {
      method: "POST",
      body: JSON.stringify({ username: user }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(apiUrl + "getratings/", {
          method: "POST",
          body: JSON.stringify({ userId: data["userId"] }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
              fetch(apiUrl + "getsongname/", {
                method: "POST",
                body: JSON.stringify({ songId: value.songId }),
                headers: { "Content-Type": "application/json" },
              })
                .then((response) => response.json())
                .then((data2) => {
                  ratings[key] = {
                    stars: value.stars,
                    comment: value.comment,
                    name: data2,
                    songId: value.songId,
                  };
                  setRatings({ ...ratings });
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log(ratings);
  }, [update]);

  return (
    <>
      <h2>Users</h2>
      <div>
        <input
          type="text"
          value={user}
          onChange={(newUser) => setUser(newUser.target.value)}
          placeholder="Enter User"
        ></input>
        <button onClick={submitUser}>Enter</button>
      </div>
      {Object.entries(ratings).map(([id, value]) => (
        <div style={{ display: "flex", gap: 15 }}>
          <h3>{value.name}</h3>
          <h3>{value.stars}</h3>
          <font size="1">{value.comment}</font>
        </div>
      ))}
    </>
  );
};

export default UserPage;
