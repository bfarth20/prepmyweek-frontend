"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import API_BASE_URL from "@/lib/config";
import { useAuth } from "@/components/context/AuthContext";
import type { PastPrep } from "@/lib/types";
import axios, { AxiosError } from "axios";

export default function PastPrepsPage() {
  const { token } = useAuth();
  const [pastPreps, setPastPreps] = useState<PastPrep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //if logged out just redirect the user to the login page like all the other pages
    async function fetchPastPreps() {
      if (!token) {
        setError("You must be logged in to view past preps.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/past-preps`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPastPreps(data);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        const message =
          error.response?.data?.error || "Error fetching past preps.";
        setError(message);
        console.error("Axios request failed:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchPastPreps();
  }, [token]);

  if (loading) return <p>Loading past preps...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (pastPreps.length === 0) return <p>No past preps found.</p>;

  return (
    <div className="flex flex-col space-y-3">
      <h1 className="font-brand text-brand text-2xl font-bold">Past Preps</h1>
      {pastPreps.map((prep) => (
        <Button key={prep.id} href={`/past-preps/${prep.id}`}>
          {prep.name}
        </Button>
      ))}
    </div>
  );
}
