import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Similarity = ({ setPage }) => {
  const apiUrl = "http://127.0.0.1:8000/";

  const [userRat, setUserRat] = useState([]);
  const [otherRat, setOtherRat] = useState([]);
  const [otherRank, setOtherRank] = useState([]);
  const [simId, setSimId] = useState(0);
  const [simScore, setSimScore] = useState(0);
  const [highUser, setHighUser] = useState("");
  const [highSong, setHighSong] = useState("");

  useEffect(() => {
    fetch(apiUrl + "getratings/", {
      method: "POST",
      body: JSON.stringify({ userId: Cookies.get("userId") }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          userRat[key] = {
            stars: value.stars,
            songId: value.songId,
            userId: value.userId,
          };
        });

        setUserRat({ ...userRat });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    fetch(apiUrl + "getotherratings/", {
      method: "POST",
      body: JSON.stringify({ userId: Cookies.get("userId") }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          otherRat[key] = {
            stars: value.stars,
            songId: value.songId,
            userId: value.userId,
          };
        });

        setOtherRat({ ...otherRat });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    fetch(apiUrl + "getotherusers/", {
      method: "POST",
      body: JSON.stringify({ userId: Cookies.get("userId") }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        Object.values(data).forEach((value) => {
          otherRank[value.userId] = { val: 0, num: 0, tot: 0 };
        });
        setOtherRank({ ...otherRank });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const click = () => {
    Object.entries(otherRank).forEach(([key, value]) => {
      Object.values(otherRat).forEach((value2) => {
        if (key === value2.userId.toString()) {
          Object.values(userRat).forEach((value3) => {
            if (value3.songId === value2.songId) {
              otherRank[key] = {
                val:
                  otherRank[key].val +
                  5 -
                  Math.abs(value3.stars - value2.stars),
                num: otherRank[key].num + 1,
                tot: 0,
              };
              setOtherRank({ ...otherRank });
            }
          });
        }
      });
    });
    tot();
  };

  const tot = () => {
    Object.entries(otherRank).forEach(([key, value]) => {
      otherRank[key] = {
        val: value.val,
        num: value.num,
        tot: value.val / value.num,
      };
      setOtherRank({ ...otherRank });
    });
    mostSimilar();
  };

  const mostSimilar = () => {
    var max = 0;
    var i = 0;
    Object.entries(otherRank).forEach(([key, value]) => {
      if (value.tot >= max) {
        max = value.tot;
        i = key;
      }
    });
    setSimId(i);
    setSimScore(max);
    fetch(apiUrl + "getusername/", {
      method: "POST",
      body: JSON.stringify({ userId: i }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setHighUser(data.username);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    var ii = 0;
    var maxx = 0;
    Object.values(otherRat).forEach((value) => {
      console.log(value);
      console.log(i);
      if (value.userId == i && value.stars >= maxx) {
        ii = value.songId;
        maxx = value.stars;
      }
    });
    fetch(apiUrl + "getsonginfo/", {
      method: "POST",
      body: JSON.stringify({ songId: ii }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setHighSong(data.name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const check = () => {
    console.log(userRat);
    console.log(otherRat);
    console.log(otherRank);
    console.log(simId);
    console.log(simScore);
    console.log(highUser);
    console.log(highSong);
  };

  return (
    <>
      <h2>Similarity</h2>
      <button onClick={click}>Calculate</button>
      {simId > 0 ? (
        <>
          <h2>
            The most similar user is... {highUser} with a similarity score of{" "}
            {Math.trunc(simScore * 20) / 10} out of 10
          </h2>
          <h2>
            Their favorite song is {highSong}, you might want to check it out
          </h2>
        </>
      ) : (
        <>
          <h2>No Score</h2>
        </>
      )}
    </>
  );
};

export default Similarity;
