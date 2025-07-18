"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Calendar, Plus } from "lucide-react";

const GoogleCalendarEventCreator = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage("");

    try {
      const eventData = {
        summary: data.summary,
        description: data.description,
        location: data.location,
        start: {
          dateTime: new Date(
            `${data.startDate}T${data.startTime}`
          ).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: data.attendees
          ? data.attendees
              .split(",")
              .map((email: any) => ({ email: email.trim() }))
          : [],
      };

      const response = await fetch(
        "http://localhost:3001/api/calendar/events",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      if (response.ok) {
        setMessage("Event created successfully!");
        reset();
      } else {
        setMessage("Failed to create event");
      }
    } catch (error) {
      setMessage("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold">Create Event</h1>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("summary", { required: "Event title is required" })}
            placeholder="Event title *"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div>
            <input
              type="time"
              {...register("startTime", { required: "Start time is required" })}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div>
            <input
              type="time"
              {...register("endTime", { required: "End time is required" })}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
        </div>

        <textarea
          {...register("description")}
          placeholder="Description (optional)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <input
          {...register("location")}
          placeholder="Location (optional)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <input
          {...register("attendees", {
            pattern: {
              value:
                /^[^\s@]+@[^\s@]+\.[^\s@]+(?:\s*,\s*[^\s@]+@[^\s@]+\.[^\s@]+)*$/,
              message: "Please enter valid email addresses separated by commas",
            },
          })}
          placeholder="Attendees (comma-separated emails)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default GoogleCalendarEventCreator;
