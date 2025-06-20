export default function handler(req, res) {
  const { TWITTER_CLIENT_ID, TWITTER_REDIRECT_URI } = process.env;

  const state = "random_state"; // bisa digenerate dinamis kalau mau
  const codeChallenge = "challenge"; // bisa diisi dari PKCE generator kalau butuh PKCE

  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI)}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=plain`;

  res.redirect(authUrl);
}

