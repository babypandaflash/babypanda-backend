export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  // ganti dengan client_id dan client_secret kamu di .env.local
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI; // https://babypanda-backend.vercel.app/api/auth/discord

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  try {
    // Exchange code → token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      return res.status(500).send("Token exchange failed");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info pakai access token
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error("User fetch failed:", error);
      return res.status(500).send("User fetch failed");
    }

    const userData = await userResponse.json();
    console.log("Discord User Connected:", userData);

    // Redirect balik ke front-end dengan query ?discord=connected
    res.writeHead(302, {
      Location: `https://babypanda.vercel.app/community?discord=connected`
    });
    res.end();

  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Internal server error");
  }
}

