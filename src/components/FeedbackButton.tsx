"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Toast } from "./ui/Toast";
import { useAuth } from "@/components/context/AuthContext";
import API_BASE_URL from "@/lib/config";

const FEEDBACK_TYPES = [
  "Bug",
  "FeatureRequest",
  "StoreRequest",
  "Other",
] as const;

export function FeedbackButton() {
  const { token } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [type, setType] = useState<(typeof FEEDBACK_TYPES)[number]>("Bug");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const resetForm = () => {
    setType("Bug");
    setMessage("");
  };

  const closeModal = () => {
    setShowDialog(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setToast({ message: "Please enter a message", type: "error" });
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/feedback`,
        { type, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({
        message:
          "Thank you for the feedback. We will look into this as soon as possible.",
        type: "success",
      });
      closeModal();
    } catch (error) {
      console.error("Feedback submission error:", error);
      setToast({
        message: "Failed to submit feedback. Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Button variant="whiteblock" onClick={() => setShowDialog(true)}>
        Bug? Request? Submit Feedback
      </Button>

      {showDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(128, 128, 128, 0.7)" }}
          onClick={closeModal} // close on clicking outside modal
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // prevent modal close on modal content click
          >
            <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>

            <div className="mb-4">
              <label htmlFor="feedbackType" className="block mb-1 font-medium">
                Type
              </label>
              <select
                id="feedbackType"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as (typeof FEEDBACK_TYPES)[number])
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
              >
                {FEEDBACK_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            <label htmlFor="feedbackMessage" className="block mb-1 font-medium">
              Message
            </label>
            <textarea
              id="feedbackMessage"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-4 border border-gray-300 rounded px-3 py-2 resize-y"
              placeholder="Describe your bug, request, or feedback..."
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!message.trim()}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
