export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
    // Tukarkan authorization code ke access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(500).json({ error: tokenData.error_description });
    }

    // Ambil data user info
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = await userInfoResponse.json();

    // Bisa simpan token dan user info ke DB/session di sini

    res.status(200).json({
      token: tokenData,
      user: userInfo,
    });

  } catch (error) {
    console.error("Google OAuth2 error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
