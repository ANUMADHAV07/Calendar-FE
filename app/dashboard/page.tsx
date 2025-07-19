"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../_providers/AuthProvider";
import Link from "next/link";

interface Events {
  id: string;
  name: string;
  title: string;
  description: string;
  date: any;
}

const page = () => {
  const [events, setEvents] = useState<Events[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/calendar/events`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const eventData = await response.json();
        console.log("eventData", eventData);
        setEvents(eventData);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-end">
        <Link
          href="/dashboard/schedule"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Schedule Event
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events found</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Events ({events.length})</h2>

          <div className="grid gap-4">
            {events.map((event, index) => (
              <div
                key={event.id || index}
                className="border rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold">
                  {event.title || event.name || "Untitled Event"}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
