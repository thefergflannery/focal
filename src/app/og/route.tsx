import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const headword = searchParams.get("headword");
    const definition = searchParams.get("definition");

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
            backgroundColor: "#ffffff",
            backgroundImage:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              padding: "48px",
              maxWidth: "800px",
              margin: "0 48px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {headword || "Focloireacht"}
            </div>

            {definition && (
              <div
                style={{
                  fontSize: "24px",
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: "1.4",
                  maxWidth: "600px",
                }}
              >
                {definition}
              </div>
            )}

            <div
              style={{
                fontSize: "18px",
                color: "#9ca3af",
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
              }}
            >
              📚 Irish Language Dictionary
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
