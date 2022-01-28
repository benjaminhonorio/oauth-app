const axios = require("axios");

const askGithubUser = "https://api.github.com/user";

exports.loadUserFromGithub = async (token) => {
  let res = await axios.get(askGithubUser, {
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
