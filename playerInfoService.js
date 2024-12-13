const express = require("express");
const axios = require("axios");
let dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5002;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use((req, res, next) => {
  console.log("incoming PLAYER request: " + req.method + " " + req.url);
  next();
});

app.get("/getPlayerInfo/:id", async (req, res) => {
  try {
    const getPlayer = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.API_KEY}&steamids=${req.params.id}`,
    );
    const data = getPlayer.data;
    res.send(data.response);
  } catch (err) {
    console.log("errororr: ", err);
    res
      .status(500)
      .send("Error fetching playersss details. Please try again later.");
  }
});

app.get("/getPlayerInfo/:id/friends", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.API_KEY}&steamid=${req.params.id}`,
    );

    const data = response.data;

    res.send(data.friendslist);
  } catch (err) {
    console.log("errororr: ", err);
    res.status(500).send({ err: err.message, params: req.params });
  }
});

app.get("/getPlayerInfo/:id/ownedGames", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.API_KEY}&steamid=${req.params.id}&include_appinfo=true`,
    );

    const data = response.data;

    console.log("OWNED GAMES: ", data);
    res.send(data.response);
  } catch (err) {
    console.log("errororr: ", err);
    res.status(500).send({ err: err.message, params: req.params });
  }
});

app.get("/getPlayerInfo/:id/gameStats/:appid", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${process.env.API_KEY}&appid=${req.params.appid}&steamid=${req.params.id}`,
    );

    const data = (await response.data) || {};

    console.log("GAME STATS: ", data);
    res.send(data);
  } catch (err) {
    console.log("errororr: ", err);
    res.send({});
  }
});

app.get("/getPlayerInfo/:id/recentlyPlayed", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.API_KEY}&steamid=${req.params.id}`,
    );

    const data = response.data;

    res.send(data.response);
  } catch (err) {
    console.log("errororr: ", err);
    res.status(500).send({ err: err.message, params: req.params });
  }
});

app.get("/getPlayerInfo/:id/gameAchievements/:appid", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${req.params.appid}&&key=${process.env.API_KEY}&steamid=${req.params.id}`,
    );

    const data = response.data;
  } catch (err) {
    console.log("errororr: ", err);
    res.status(500).send({ err: err.message, params: req.params });
  }
});

app.listen(port, () => {
  console.log(
    `Player service running on ${process.env.PLAYERS_API_BASE_DOMAIN}`,
  );
});
