"use client";

import { useState, useEffect } from "react";

interface WalkthroughPopupProps {
  page: string; // e.g., "dashboard", "store", "summary"
  onDismiss?: () => void; // optional callback when dismissed
}

const walkthroughMessages: Record<string, string> = {
  home: 'Welcome! Start your meal prep by selecting "Start a FreshPrep" You can also add a recipe or go to your CurrentPrep. If you’re tired of seeing these popups and already know how the app works, toggle Walkthrough Mode off from the home page. You can turn it back on any time!',
  stores:
    "Start by choosing your preferred grocery store. Then set how many people you're shopping for, how many lunches and dinners you want to prep, and whether to use dinner leftovers for lunch. If you're not sure, feel free to leave the default settings as they are.",
  storesRecipes:
    "On this page, you can browse and select recipes to add to your weekly plan. Click on any recipe card to explore the details. As you make selections, you’ll see your total servings update automatically. If you’ve set a required number of lunches and dinners, a new button will appear once your goals are met to take you to your completed prep.",
  recipeDetail:
    "This is the recipe detail page. If you’d like to add it to your prep, just tap the button at the bottom. Use the back button to return to the store’s recipe list. If you created this recipe, you’ll also see an option to edit it.",
  finishedPrep:
    "You’ve successfully built your weekly meal plan! If you’re happy with your selections and want to use them throughout the week, make sure to set this as your CurrentPrep. That way, you can come back anytime to view your recipes and grocery list—right from your homepage.",
  grocerylist:
    "Welcome to your grocery list! All ingredients from your selected recipes have been combined and sorted by grocery store section for easy shopping. If you’re using your CurrentPrep, feel free to add extra items like snacks, drinks, or household supplies. Note: If you haven’t set your selections as your CurrentPrep, they won’t be saved for later access.",
  addRecipe:
    "Welcome to the Add Recipe form! Here, you can share any recipe you like. Please fill out all fields, provide clear instructions, and include at least one ingredient. Each ingredient must have a name, quantity, amount, and store section selected for the recipe to be submitted. After submitting, your recipe will be reviewed by our admins. Once approved, it will be available for everyone to enjoy!",
  currentPrep:
    "Congratulations! You’ve successfully saved a CurrentPrep. You can return to this page any time this week to view your selected recipes or access your grocery list. If you love this combo and want to use it again in the future, save it to your PastPreps and give it a fun name like “Walmart Basics” or “Budget Week.”",
};

export default function WalkthroughPopup({
  page,
  onDismiss,
}: WalkthroughPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show popup whenever page changes
    setVisible(true);
  }, [page]);

  const message = walkthroughMessages[page] || "Welcome to PrepMyWeek!";

  if (!visible) return null;

  return (
    <div className="fixed z-[100] max-w-sm w-[90%] left-1/2 -translate-x-1/2 top-4 sm:top-auto sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 bg-white border border-brand rounded-lg shadow-lg p-4">
      <p className="mb-3 text-gray-800">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        className="text-sm text-blue-600 hover:underline"
        aria-label="Dismiss walkthrough popup"
      >
        Got it
      </button>
    </div>
  );
}
