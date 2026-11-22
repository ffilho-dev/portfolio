import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.title}`;

const HIGHLIGHTS = ["Java", "PostgreSQL", "React", "Next.js", "IA"] as const;

export default function OpenGraphImage() {
  const [experienceMetric, ...impactMetrics] = profile.metrics;
  const summaryCopy = experienceMetric
    ? `${experienceMetric.value} em desenvolvimento de software — sistemas corporativos em produção e aplicações web Full Stack.`
    : profile.bio;
  const metricsCopy = (impactMetrics.length > 0 ? impactMetrics : profile.metrics)
    .map((metric) =>
      metric.value === "12 instituições"
        ? "12 instituições públicas"
        : metric.value,
    )
    .join(" | ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          color: "#09090B",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          borderTop: "8px solid #0F4C5C",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E4E4E7",
            paddingBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#09090B",
              letterSpacing: "-0.02em",
            }}
          >
            {profile.handle}
          </span>
          <span
            style={{
              fontSize: 20,
              color: "#52525B",
            }}
          >
            {profile.location}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#09090B",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#0F4C5C",
              lineHeight: 1.2,
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#52525B",
              lineHeight: 1.45,
              maxWidth: "960px",
            }}
          >
            {summaryCopy}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E4E4E7",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {HIGHLIGHTS.map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#09090B",
                  backgroundColor: "#F4F4F5",
                  border: "1px solid #E4E4E7",
                  borderRadius: "6px",
                  padding: "8px 16px",
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <span
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#52525B",
            }}
          >
            {metricsCopy}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
