export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const scope = encodeURIComponent("identify email");
  const state = "secureRandomState"; // optional: sebaiknya generate & simpan di cookie/session

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;

  res.redirect(discordAuthUrl);
}
