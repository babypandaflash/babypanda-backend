import crypto from 'crypto';

export default function handler(req, res) {
  const query = req.query;
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

  // Verifikasi signature
  const { hash, ...dataCheck } = query;

  if (!hash) {
    return res.status(400).json({ error: "Missing hash parameter" });
  }

  const checkString = Object.keys(dataCheck)
    .sort()
    .map(key => `${key}=${dataCheck[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(telegramToken).digest();
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  if (computedHash !== hash) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  // Jika hash valid, kirim data user
  res.status(200).json({
    success: true,
    user: dataCheck,
  });
}
