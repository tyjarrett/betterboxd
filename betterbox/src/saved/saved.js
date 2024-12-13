import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const SavedPage = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [songs, setSongs] = useState([]);
  const [update, setUpdate] = useState(0);
  const [update2, setUpdate2] = useState(0);

  useEffect(() => {
    setSongs([]);
    setUpdate2(update2 + 1);
  }, [update]);

  useEffect(() => {
    fetch(apiUrl + "savedsongs/", {
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
              songs[key] = {
                name: data2,
                songId: value.songId,
              };
              setSongs({ ...songs });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [update2]);

  const rateSong = (e) => {
    Cookies.set("song", songs[e.target.id]["name"]);
    Cookies.set("songId", songs[e.target.id]["songId"]);
    setPage("CreateRatings");
  };

  const deleteSave = (e) => {
    Cookies.set("songId", songs[e.target.id]["songId"]);
    fetch(apiUrl + "deletesave/", {
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
      <h2>Saved</h2>
      {Object.entries(songs).map(([id, value]) => (
        <div style={{ display: "flex", gap: 15 }}>
          <h3>{value.name}</h3>
          <h3>{value.stars}</h3>
          <font size="1">{value.comment}</font>
          <button key={id + "t"} id={id} onClick={(e) => rateSong(e)}>
            Rate!
          </button>
          <button key={id} id={id} onClick={(e) => deleteSave(e)}>
            Unsave
          </button>
        </div>
      ))}
    </>
  );
};

export default SavedPage;
