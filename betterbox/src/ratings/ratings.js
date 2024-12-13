import React, { useState, useEffect, forceUpdate } from "react";
import Cookies from "js-cookie";

const Ratings = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [ratings, setRatings] = useState([]);
  const [update, setUpdate] = useState(0);
  const [update2, setUpdate2] = useState(0);

  useEffect(() => {
    setRatings([]);
    setUpdate2(update2 + 1);
  }, [update]);

  useEffect(() => {
    getRatings();
  }, [update2]);

  //   useEffect(() => {
  //     setRatings([]);
  //     getRatings();
  //     console.log(update);
  //   }, [update]);

  const getRatings = () => {
    fetch(apiUrl + "getratings/", {
      method: "POST",
      body: JSON.stringify({ userId: Cookies.get("userId") }),
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
  };

  const rateSong = (e) => {
    Cookies.set("song", ratings[e.target.id]["name"]);
    Cookies.set("songId", ratings[e.target.id]["songId"]);
    setPage("CreateRatings");
  };

  const deleteRating = (e) => {
    Cookies.set("songId", ratings[e.target.id]["songId"]);
    fetch(apiUrl + "deleterating/", {
      method: "DELETE",
      body: JSON.stringify({
        userId: Cookies.get("userId"),
        songId: Cookies.get("songId"),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUpdate(update + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <h2 onClick={getRatings}>Ratings</h2>
      {Object.entries(ratings).map(([id, value]) => (
        <div style={{ display: "flex", gap: 15 }}>
          <h3>{value.name}</h3>
          <h3>{value.stars}</h3>
          <font size="1">{value.comment}</font>
          <button key={id + "t"} id={id} onClick={(e) => rateSong(e)}>
            Edit!
          </button>
          <button key={id} id={id} onClick={(e) => deleteRating(e)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

export default Ratings;
