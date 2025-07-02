import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About the Designer – PrepMyWeek</title>
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/Images/ProfilePhoto.jpeg"
            alt="Benjamin Farthing"
            width={128}
            height={128}
            className="rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold text-brand mb-2">
            Benjamin Farthing
          </h1>
          <p className="text-gray-600 mb-6">
            Web Developer · Problem Solver · Builder of Things That Work
          </p>

          <div className="text-left space-y-6">
            <section>
              <h2 className="text-xl text-brand font-bold mb-2">About Me</h2>
              <p>
                I&#39;m a full-stack web developer based in Atlanta, Georgia,
                focused on creating clean, practical tools that solve everyday
                problems. I enjoy working across the stack but have a strong
                interest in backend logic, architecture, and data driven
                features.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-brand font-bold mb-2">
                Why I Built PrepMyWeek
              </h2>
              <p>
                I built PrepMyWeek to tackle a real-world frustration: planning
                meals and grocery shopping every week without wasting time or
                food. This app streamlines the meal prep process by combining
                real grocery store data with smart recipe selection, leftovers
                tracking, and automatic list generation. It&#39;s both a
                technical challenge and a personal solution, and I&#39;m proud
                of how it&#39;s turned out.
              </p>
            </section>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-brand font-semibold mb-2">
              Want to know more?
            </p>
            <Link
              href="https://benjaminfarthing.wixsite.com/benjaminfarthingwebs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Go to Portfolio Page &rarr;
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
