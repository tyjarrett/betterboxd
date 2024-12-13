import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Allsongs = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [songs, setSongs] = useState([]);
  const [filteredsongs, setFilteredSongs] = useState([]);
  const [filter, setFilter] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    fetch(apiUrl + "getsongs/")
      .then((response) => response.json())
      .then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          songs[key] = value;
          setSongs({ ...songs });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [update]);

  useEffect(() => {
    all();
  }, [songs]);

  const rateSong = (e) => {
    Cookies.set("song", filteredsongs[e.target.id - 1][1].name);
    Cookies.set("songId", filteredsongs[e.target.id - 1][0]);
    setPage("CreateRatings");
  };

  const all = () => {
    const filtered = Object.entries(songs).filter((song) => true);
    setFilteredSongs(filtered);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    const filtered = Object.entries(songs).filter((song) =>
      song[1].name.includes(e.target.value)
    );
    setFilteredSongs(filtered);
  };

  const handleFilter2 = (e) => {
    setFilter2(e.target.value);
    const filtered = Object.entries(songs).filter((song) =>
      song[1].artist.includes(e.target.value)
    );
    setFilteredSongs(filtered);
  };

  const handleFilter3 = (e) => {
    setFilter3(e.target.value);
    const filtered = Object.entries(songs).filter((song) =>
      song[1].genre.includes(e.target.value)
    );
    setFilteredSongs(filtered);
  };

  const addSong = () => {
    fetch(apiUrl + "addsong/", {
      method: "POST",
      body: JSON.stringify({ name: name, genre: genre, artist: artist }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUpdate(update + 1);
        setName("");
        setGenre("");
        setArtist("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const saveSong = (e) => {
    Cookies.set("songId", filteredsongs[e.target.id - 1][0]);
    fetch(apiUrl + "savesong/", {
      method: "POST",
      body: JSON.stringify({
        userId: Cookies.get("userId"),
        songId: Cookies.get("songId"),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const viewSong = (e) => {
    Cookies.set("songId", filteredsongs[e.target.id - 1][0]);
    Cookies.set("song", filteredsongs[e.target.id - 1][1].name);
    setPage("View");
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => handleFilter(e)}
          placeholder="Search Song"
        ></input>
        <input
          type="text"
          value={filter2}
          onChange={(e) => handleFilter2(e)}
          placeholder="Search Artist"
        ></input>
        <input
          type="text"
          value={filter3}
          onChange={(e) => handleFilter3(e)}
          placeholder="Search Genre"
        ></input>
      </div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Song Name"
        ></input>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="New Song Artist"
        ></input>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="New Song Genre"
        ></input>
        <button onClick={addSong}>Create New Song</button>
      </div>
      {Object.entries(filteredsongs).map(([key, value]) => (
        <div style={{ display: "flex", gap: 15 }}>
          <h3>{value[1].name}</h3>
          <h3>{value[1].artist}</h3>
          <h3>{value[1].genre}</h3>
          <button key={value[0]} id={value[0]} onClick={(e) => rateSong(e)}>
            Rate!
          </button>
          <button
            key={value[0] + "t"}
            id={value[0]}
            onClick={(e) => saveSong(e)}
          >
            Save
          </button>
          <button
            key={value[0] + "v"}
            id={value[0]}
            onClick={(e) => viewSong(e)}
          >
            View
          </button>
        </div>
      ))}
    </>
  );
};

export default Allsongs;
