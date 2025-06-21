export default async function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    // Tukar authorization code jadi access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // (Opsional) Ambil user info dari access token
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    console.log("Connected user:", userData);

    // Setelah sukses → redirect ke front-end kamu dengan param
    return res.redirect("https://your-frontend-domain.com/community?discord=connected");

  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).json({ error: "OAuth process failed" });
  }
}

