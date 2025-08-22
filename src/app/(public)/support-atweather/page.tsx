export default function SupportAtPage() {
  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 className="text-3xl font-bold mb-6">
        Appalachian Trail Weather Support
      </h1>
      <p>Need help or have questions? We’re here to assist you!</p>
      <p>
        If you need support{" "}
        <a
          href="mailto:prepmyweek.staff@gmail.com"
          className="text-blue-600 underline"
        >
          email us here
        </a>
        .
      </p>
      <p>We aim to respond within 24–48 hours.</p>
      <p>
        Thanks for using Appalachian Trail Weather — stay safe and enjoy your
        hike!
      </p>
      <hr style={{ margin: "2rem 0" }} />
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      <p>
        Appalachian Trail Weather App provides forecasts based on publicly
        available data from the National Weather Service. While we strive for
        accuracy, weather conditions can change rapidly. The developers are not
        responsible for decisions or outcomes based on this information. Always
        use your judgment and take appropriate precautions when planning outdoor
        activities.
      </p>
    </main>
  );
}
