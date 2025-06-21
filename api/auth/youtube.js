export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI);

  const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");

  const state = "secureRandomState123"; // sebaiknya generate & simpan di cookie/session kalau production

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

  res.redirect(googleAuthUrl);
}
