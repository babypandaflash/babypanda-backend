export default function Home() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI);
  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`;

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Join Our Community</h1>
      <a href={oauthUrl} style={{ padding: "12px 24px", background: "#5865F2", color: "white", borderRadius: "8px", textDecoration: "none" }}>
        Connect Discord
      </a>
    </div>
  );
}
