import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "SaaSStarter — The Ultimate Next.js Template";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/**
 * Programmatic OpenGraph image generation.
 * Features a dark gradient, subtle grid pattern, and bold typography.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          backgroundImage: 
            "radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%), " +
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          color: "white",
        }}
      >
        {/* Subtle Glow Effect */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            backgroundColor: "#3b82f6",
            filter: "blur(150px)",
            opacity: 0.15,
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "32px",
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo Icon Placeholder */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            ⚡
          </div>

          <h1
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              margin: 0,
              background: "linear-gradient(to bottom right, #ffffff, #94a3b8)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.05em",
            }}
          >
            SaaSStarter
          </h1>
          
          <p
            style={{
              fontSize: "32px",
              color: "#94a3b8",
              marginTop: "16px",
              fontWeight: "medium",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Build. Ship. Scale. Faster than ever.
          </p>
        </div>

        {/* Bottom Bar Styling */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "#64748b",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>Better Auth</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span>Stripe</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span>Next.js 16</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
