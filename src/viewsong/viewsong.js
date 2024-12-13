import React, { useState, useEffect, forceUpdate } from "react";
import Cookies from "js-cookie";

const ViewSong = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch(apiUrl + "viewsong/", {
      method: "POST",
      body: JSON.stringify({
        songId: Cookies.get("songId"),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          fetch(apiUrl + "getusername/", {
            method: "POST",
            body: JSON.stringify({
              userId: value["userId"],
            }),
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data2) => {
              ratings[data2.username] = {
                comment: value.comment,
                username: data2.username,
                rating: value.stars,
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
  }, []);

  return (
    <>
      <h2>{Cookies.get("song")}</h2>
      {Object.values(ratings).map((value) => (
        <div style={{ display: "flex", gap: 15 }}>
          <h3>{value.username}</h3>
          <h3>{value.rating}</h3>
          <font size="1">{value.comment}</font>
        </div>
      ))}
    </>
  );
};

export default ViewSong;
