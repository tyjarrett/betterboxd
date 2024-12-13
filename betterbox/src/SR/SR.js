import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const SR = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [songs, setSongs] = useState([]);
  const [rec, setRec] = useState([]);
  const [update, setUpdate] = useState(0);
  const [up, setUp] = useState(0);

  useEffect(() => {
    fetch(apiUrl + "savedsongs/", {
      method: "POST",
      body: JSON.stringify({ userId: Cookies.get("userId") }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          fetch(apiUrl + "getsonginfo/", {
            method: "POST",
            body: JSON.stringify({ songId: value.songId }),
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data2) => {
              songs[key] = {
                artist: data2.artist,
                name: data2.name,
                genre: data2.genre,
              };
              setSongs({ ...songs });
            })
            .then(setUp(up + 1))
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    Object.values(songs).forEach((value) => {
      fetch(apiUrl + "songrec1/", {
        method: "POST",
        body: JSON.stringify({ genre: value.genre, name: value.name }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          Object.values(data).forEach((value) => {
            rec[value.name] = {
              artist: value.artist,
              genre: value.genre,
              name: value.name,
            };
          });
          setRec({ ...rec });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      fetch(apiUrl + "songrec2/", {
        method: "POST",
        body: JSON.stringify({ artist: value.artist, name: value.name }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          Object.values(data).forEach((value) => {
            rec[value.name] = {
              artist: value.artist,
              genre: value.genre,
              name: value.name,
            };
          });
          setRec({ ...rec });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }, [songs]);

  const checkRec = () => {
    Object.values(songs).forEach((value) => {
      setRec((prev) => {
        const newRec = { ...prev };
        delete newRec[value.name];
        return newRec;
      });
    });
  };

  return (
    <>
      <h2>Saved Recomendation</h2>
      <button onClick={checkRec}>Clear Saved</button>
      {Object.values(rec).map((value) => (
        <div style={{ display: "flex", gap: 15 }}>
          <h3>{value.name}</h3>
          <h3>{value.artist}</h3>
          <h3>{value.genre}</h3>
        </div>
      ))}
    </>
  );
};

export default SR;
