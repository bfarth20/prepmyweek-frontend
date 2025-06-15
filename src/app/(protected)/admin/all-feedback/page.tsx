"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import API_BASE_URL from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

interface Feedback {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AllFeedbackPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await axios.get(`${API_BASE_URL}/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(res.data);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load feedback", type: "error" });
      }
    }

    if (user?.isAdmin) {
      fetchFeedback();
    }
  }, [user, token]);

  async function handleDelete(id: number) {
    try {
      await axios.delete(`${API_BASE_URL}/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
      setToast({ message: "Feedback deleted", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to delete feedback", type: "error" });
    }
  }

  if (loading || !user?.isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All User Feedback</h1>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full bg-white border border-gray-300 shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-100 text-sm font-medium text-left">
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b w-[40%]">Message</th>
              <th className="px-4 py-2 border-b">Submitted</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((f) => (
              <tr key={f.id} className="border-t text-sm hover:bg-gray-50">
                <td className="px-4 py-2">{f.user.name}</td>
                <td className="px-4 py-2">{f.user.email}</td>
                <td className="px-4 py-2">{f.type}</td>
                <td className="px-4 py-2 w-[40%] max-w-lg whitespace-normal break-words">
                  {f.message}
                </td>
                <td className="px-4 py-2">
                  {new Date(f.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(f.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {feedbackList.length === 0 && (
          <p className="mt-4 text-gray-600">No feedback submitted yet.</p>
        )}
      </div>
    </div>
  );
}
