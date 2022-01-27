const cors = require("cors");
const axios = require("axios");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send({});
});

app.post("/authenticate", async (req, res) => {
  const code = req.body.code;
  try {
    const r1 = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.OAUTH_REDIRECT_URL,
      },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = r1.data.access_token;

    const loadUserFromGithub = async (token) => {
      let res = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: "token " + token,
        },
      });
      const user = {
        github: res.data.login,
        name: res.data.name,
        public_repos: res.data.public_repos,
        avatar_url: res.data.avatar_url,
        followers: res.data.followers,
        following: res.data.following,
      };
      return user;
    };
    const user = await loadUserFromGithub(accessToken);
    res.json(user);
  } catch (e) {
    res.json({ error: e.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
