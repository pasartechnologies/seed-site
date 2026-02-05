import React, { useState, useEffect } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ScheduleComponent = ({ schedule, setSchedule }) => {
  const [localSchedule, setLocalSchedule] = useState([]);

  useEffect(() => {
    // Use provided schedule or initialize with defaults
    if (schedule && schedule.length > 0) {
      setLocalSchedule(schedule);
    } else {
      // Default schedule: Monday to Saturday 9 AM - 5 PM
      const defaultSchedule = DAYS.map((day) => ({
        day,
        isOpen: day !== "Sunday", // All days open except Sunday
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      }));
      setLocalSchedule(defaultSchedule);
      setSchedule(defaultSchedule);
    }
  }, [schedule.length]); // Only re-run if schedule length changes

  const handleToggle = (index) => {
    const updated = [...localSchedule];
    updated[index].isOpen = !updated[index].isOpen;
    setLocalSchedule(updated);
    setSchedule(updated);
  };

  const handleTimeChange = (index, field, type, value) => {
    const updated = [...localSchedule];
    updated[index][field][type] = parseInt(value);
    setLocalSchedule(updated);
    setSchedule(updated);
  };

  // Prevent rendering until schedule is initialized
  if (localSchedule.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule</h3>
      <p className="text-sm text-gray-600">
        Set your availability for each day (Default: Monday-Saturday, 9 AM - 5
        PM)
      </p>

      {localSchedule.map((day, index) => (
        <div key={day.day} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={day.isOpen}
                onChange={() => handleToggle(index)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-lg font-medium text-gray-800">
                {day.day}
              </span>
            </label>
            {day.isOpen && (
              <span className="text-sm text-gray-500">
                {String(day.start.hour).padStart(2, "0")}:
                {String(day.start.minute).padStart(2, "0")} -{" "}
                {String(day.end.hour).padStart(2, "0")}:
                {String(day.end.minute).padStart(2, "0")}
              </span>
            )}
          </div>

          {day.isOpen && (
            <div className="grid grid-cols-2 gap-4 ml-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="flex space-x-2">
                  <select
                    value={day.start.hour}
                    onChange={(e) =>
                      handleTimeChange(index, "start", "hour", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="flex items-center">:</span>
                  <select
                    value={day.start.minute}
                    onChange={(e) =>
                      handleTimeChange(index, "start", "minute", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {[0, 15, 30, 45].map((min) => (
                      <option key={min} value={min}>
                        {String(min).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="flex space-x-2">
                  <select
                    value={day.end.hour}
                    onChange={(e) =>
                      handleTimeChange(index, "end", "hour", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="flex items-center">:</span>
                  <select
                    value={day.end.minute}
                    onChange={(e) =>
                      handleTimeChange(index, "end", "minute", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {[0, 15, 30, 45].map((min) => (
                      <option key={min} value={min}>
                        {String(min).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleComponent;
