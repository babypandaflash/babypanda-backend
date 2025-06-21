export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Authorization code not found" });
  }

  try {
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error_description });
    }

    // 👉 Bisa simpan data.access_token di cookie / database di sini
    // atau redirect ke halaman success + token via query param (kurang disarankan)

    // Contoh: ambil user info pakai token
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    const user = await userResponse.json();

    // Bisa simpan ke DB atau session di sini

    return res.status(200).json({
      tokenData: data,
      userInfo: user,
    });
  } catch (error) {
    console.error("OAuth2 Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
