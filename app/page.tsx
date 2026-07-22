export default function Page() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      background: "#F7F2E7",
      color: "#2E3640",
      fontFamily: "Georgia, serif"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#3B4754" }}>
        psdogdad is getting ready
      </h1>
      <p style={{ fontSize: "1.15rem", maxWidth: "30rem", lineHeight: 1.6 }}>
        We are putting the finishing touches on something special for you and your dog. Please check back soon.
      </p>
      <div style={{ marginTop: "2rem", height: "3px", width: "60px", background: "#C9A24B" }} />
    </main>
  );
}
