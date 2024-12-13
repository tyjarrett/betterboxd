import React, { useState } from "react";
import "./logincss.css";
import Cookies from "js-cookie";
import Allsongs from "../songs/allsongs";
import Ratings from "../ratings/ratings";
import Createsrating from "../ratings/createrating";
import SavedPage from "../saved/saved";
import ViewSong from "../viewsong/viewsong";
import UserPage from "../users/users";
import SR from "../SR/SR";
import Similarity from "../similarityscore/similarityscore";

const LandingPage = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [page, setPage] = useState("");

  const apiUrl = "http://127.0.0.1:8000/";

  const Logout = () => {
    setPage("");
    Cookies.remove("userId");
  };

  const changeS = () => {
    setPage("Songs");
  };
  const changeR = () => {
    setPage("Ratings");
  };

  const Saved = () => {
    setPage("Saved");
  };

  const View = () => {
    setPage("View");
  };

  const Users = () => {
    setPage("Users");
  };

  const SRecomendation = () => {
    setPage("SR");
  };

  const SimilarityScore = () => {
    setPage("SS");
  };

  const submitUser = () => {
    fetch(apiUrl + "getuser/", {
      method: "POST",
      body: JSON.stringify({ username: user }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["userId"]) {
          console.log(data["userId"]);
          Cookies.set("userId", data["userId"]);
          setPage("Songs");
        } else {
          console.log("no user found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setUser("");
  };

  const submitNewUser = () => {
    fetch(apiUrl + "createuser/", {
      method: "POST",
      body: JSON.stringify({ username: pass }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setPass("");
  };

  return (
    <>
      {page === "" ? (
        <div className="landingContainer">
          <h2 className="landingText">hello there</h2>
          <div>
            <input
              className="landingInput"
              type="text"
              value={user}
              onChange={(newUser) => setUser(newUser.target.value)}
              placeholder="Enter Username"
            ></input>
            <button onClick={submitUser}>Enter</button>
          </div>
          <div>
            <input
              className="landingInput"
              type="text"
              value={pass}
              onChange={(newPass) => setPass(newPass.target.value)}
              placeholder="Create New User"
            ></input>
            <button onClick={submitNewUser}>Enter</button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <button onClick={changeS}>Songs</button>
            <button onClick={changeR}>MyRatings</button>
            <button onClick={Saved}>Saved</button>
            <button onClick={Users}>Users</button>
            <button onClick={SRecomendation}>Saved Recomendation</button>
            <button onClick={SimilarityScore}>Similarity Score</button>
            <button onClick={Logout}>Logout</button>
          </div>
          {page === "Songs" ? (
            <Allsongs setPage={setPage} />
          ) : page === "Ratings" ? (
            <Ratings setPage={setPage} />
          ) : page === "CreateRatings" ? (
            <Createsrating setPage={setPage} />
          ) : page === "Saved" ? (
            <SavedPage setPage={setPage} />
          ) : page === "View" ? (
            <ViewSong setPage={setPage} />
          ) : page === "Users" ? (
            <UserPage setPage={setPage} />
          ) : page === "SR" ? (
            <SR setPage={setPage} />
          ) : (
            <Similarity setPage={setPage} />
          )}
        </>
      )}
    </>
  );
};

export default LandingPage;
