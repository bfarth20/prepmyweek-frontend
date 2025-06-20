"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function GuestPage() {
  return (
    <>
      <Head>
        <title>
          PrepMyWeek – Simplify Your Weekly Meal Prep & Grocery Shopping
        </title>
        <meta
          name="description"
          content="PrepMyWeek helps you choose recipes, generate grocery lists, and plan your meals around your favorite grocery stores. Sign up to start simplifying your weekly cooking."
        />
        <meta name="robots" content="index, follow" />
        {/* Add Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="PrepMyWeek – Simplify Your Weekly Meal Prep"
        />
        <meta
          property="og:description"
          content="Choose your grocery store, select meals, and generate grocery lists with PrepMyWeek."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/Images/guestView/stores.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-brand text-brand text-center">
          Welcome to PrepMyWeek
        </h1>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold p-2">
            1. Choose Your Grocery Store
          </h2>
          <div className="relative w-full h-64 rounded-lg shadow overflow-hidden">
            <Image
              src="/Images/guestView/stores.png"
              alt="Choose Store"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-700 text-center">
            PrepMyWeek is a recipe and shopping app aimed to simplify your
            weekly grocery runs. Start by picking your preferred grocery store.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold p-2">2. Define Your Prep</h2>
          <div className="relative w-full h-64 rounded-lg shadow overflow-hidden">
            <Image
              src="/Images/guestView/prepSettings.png"
              alt="Meal selections"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-700">
            Pick how many dinners and lunches you would like to shop for, and
            whether you would like your leftover dinner servings to be used as
            lunches the rest of the week.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold p-2">3. Choose Your Meals</h2>
          <div className="relative w-full h-64 rounded-lg shadow overflow-hidden">
            <Image
              src="/Images/guestView/storeRecipes.png"
              alt="An array of recipes offered at selected store"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-700">
            Next, select your favorite meals offered at the store, as you select
            the meals, your counter at the top will fill up, and once filled,
            you can go to view your Prep!
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold p-2">
            4. View your Finalized Prep
          </h2>
          <div className="relative w-full h-64 rounded-lg shadow overflow-hidden">
            <Image
              src="/Images/guestView/myPrep.png"
              alt="A view of your grocery prep"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-700">
            Click on any of your selected recipes to view details, if you like
            your selections hit the Save to CurrentPrep button to keep the
            selections all week long, or go to your grocery list to start
            shopping
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold p-2">
            5. Get Your Grocery List
          </h2>
          <div className="relative w-full h-64 rounded-lg shadow overflow-hidden">
            <Image
              src="/Images/guestView/groceryList.png"
              alt="A grocery list"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-gray-700">
            Groceries are categorized by section of the store for easy shopping.
            If you use the grocery list in current prep, you can also add other
            groceries you need to shop for, or print the grocery list if you
            prefer paper. If you like your Current Prep, you can save it and
            access it under PastPreps on your profile!
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-700 text-center">
              To get started, all you have to do is Sign up!
            </p>
            <Link
              href="/signup"
              className="bg-brand text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Sign Up
            </Link>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-gray-700 text-center">
              Want to explore a sample prep before signing up?
            </p>
            <Link
              href="/teaser-meal-prep"
              className="bg-brand text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Check out this teaser meal prep!
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
