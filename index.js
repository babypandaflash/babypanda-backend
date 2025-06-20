require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(cors({
  origin: 'https://babypanda-backend.vercel.app'
}));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/api/auth/discord', (req, res) => {
  const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(redirectUrl);
});

app.get('/api/auth/discord/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code provided.");
  }

  try {
    // Tukar code ke access_token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      scope: 'identify'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Ambil data user Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = userResponse.data;

    // Di sini kamu bisa simpan ke database / kirim ke frontend
    res.send(`<h1>Welcome, ${user.username}!</h1><p>Your Discord ID: ${user.id}</p>`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Login error.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
