// app/head.tsx
export default function Head() {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "PrepMyWeek",
            url: "https://www.prepmyweek.com",
            logo: "https://www.prepmyweek.com/logo-112x112.png",
          }),
        }}
      />
    </>
  );
}
