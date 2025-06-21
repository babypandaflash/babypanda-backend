import crypto from 'crypto';

export default function handler(req, res) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.TWITTER_REDIRECT_URI);
  const scope = encodeURIComponent("tweet.read users.read offline.access");

  // Generate code_verifier dan code_challenge
  const codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = base64URLEncode(sha256(codeVerifier));

  // Simpan code_verifier di cookie (bisa di session DB juga)
  res.setHeader('Set-Cookie', `twitter_code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`);

  const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=randomState&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(twitterAuthUrl);
}

// Helper functions
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

function base64URLEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
