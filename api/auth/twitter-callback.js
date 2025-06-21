export default async function handler(req, res) {
  const code = req.query.code;
  const codeVerifier = getCookie(req, 'twitter_code_verifier');

  if (!code || !codeVerifier) {
    return res.status(400).json({ error: "Missing code or code_verifier" });
  }

  try {
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.TWITTER_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error_description });
    }

    // Contoh: ambil user info pakai token
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    const user = await userResponse.json();

    // Bisa simpan token dan user ke DB di sini
    res.status(200).json({
      tokenData: data,
      userInfo: user,
    });
  } catch (error) {
    console.error("OAuth2 Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Helper: Ambil cookie dari request
function getCookie(req, name) {
  const value = `; ${req.headers.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
