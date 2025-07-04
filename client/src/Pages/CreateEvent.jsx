import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import BlackBtn from "../components/Black_Btn";
import Report_Bug from "../components/Report_Bug";
import { time } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;

function CreateEvent() {
  const navigate = useNavigate();
  const [defaultEventsAsk, setdefaultEventsAsk] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function goToAdminDashboard() {
    navigate("/admin-dashboard");
  }

  function getUpcomingDate(targetDay) {
    const today = new Date();
    const currentDay = today.getDay(); // Sunday = 0, ..., Saturday = 6
    const daysToAdd = (targetDay - currentDay + 7) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    // Format the date as YYYY-MM-DD
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(nextDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const nextWednesday = getUpcomingDate(3);
  const nextFriday = getUpcomingDate(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTime = `${formData.time}:00`;
      const result = await axios.post(`${apiUrl}/events`, {
        event_name: formData.name,
        event_location: formData.location,
        event_date: formData.date,
        event_time: formattedTime,
      });
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error creating event:", error);
      // Add error handling here
    }
  };

  const [defaultWedFormData] = useState({
    name: "DROP-IN",
    location: "HARRY OSBORNE",
    date: nextWednesday,
    time: "16:30:00",
  });

  const [defaultFriOneFormData] = useState({
    name: "DROP-IN",
    location: "HARRY OSBORNE",
    date: nextFriday,
    time: "18:30:00",
  });

  const [defaultFriTwoFormData] = useState({
    name: "DROP-IN",
    location: "HARRY OSBORNE",
    date: nextFriday,
    time: "20:45:00",
  });

  function createDefaultEventsCheck() {
    setdefaultEventsAsk(true);
  }

  async function createDefaultEvents() {
    try {
      const result1 = await axios.post(`${apiUrl}/events`, {
        event_name: defaultWedFormData.name,
        event_location: defaultWedFormData.location,
        event_date: defaultWedFormData.date,
        event_time: defaultWedFormData.time,
      });
      const result2 = await axios.post(`${apiUrl}/events`, {
        event_name: defaultFriOneFormData.name,
        event_location: defaultFriOneFormData.location,
        event_date: defaultFriOneFormData.date,
        event_time: defaultFriOneFormData.time,
      });
      const result3 = await axios.post(`${apiUrl}/events`, {
        event_name: defaultFriTwoFormData.name,
        event_location: defaultFriTwoFormData.location,
        event_date: defaultFriTwoFormData.date,
        event_time: defaultFriTwoFormData.time,
      });
      navigate("/admin-dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-12 mb-7 relative">
      <div className="sticky top-0 z-10">
          <Header message="Welcome to Admin" />
        </div>

        <div className="flex flex-col items-center w-full mt-[-1.5rem]">
          <div className="flex flex-col items-start w-full mb-7">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full"
            >
              <div className="flex flex-col items-start w-full mb-7">
                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  Name
                  <input
                    placeholder="Name of event"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>
                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  Location
                  <input
                    placeholder="Location of Event"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>

                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  Date
                  <input
                    placeholder="Date of event"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>

                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  Time
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>
              </div>
              <div className="flex justify-between w-full mb-7 mt-2">
                <button
                  type="submit"
                  className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                >
                  Create
                </button>
                {!defaultEventsAsk && (
                  <button
                    type="button"
                    onClick={createDefaultEventsCheck}
                    className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                  >
                    Create Default Events
                  </button>
                )}

                {defaultEventsAsk && (
                  <button
                    type="button"
                    onClick={createDefaultEvents}
                    className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                  >
                    Yes
                  </button>
                )}
              </div>
              <div className="flex flex-col w-[65%] max-w-[20rem] items-center top-[37rem]">
              {defaultEventsAsk && (
                  <p
                    className="text-[10px] font-light text-green-700 mt-3 text-center"
                  >
                    Are you sure you want to create: {defaultWedFormData.name} at {defaultWedFormData.location} on {defaultWedFormData.date}, {defaultWedFormData.time} and  
                    {" " + defaultFriOneFormData.name} at {defaultFriOneFormData.location} on {defaultFriOneFormData.date}, {defaultFriOneFormData.time} and 
                    {" "+ defaultFriTwoFormData.name} at {defaultFriTwoFormData.location} on {defaultFriTwoFormData.date}, {defaultFriTwoFormData.time}?
                  </p>
                )}
                </div>
              <div className="flex flex-col w-[65%] max-w-[20rem] items-center relative sticky mt-3 z-10">
                <Report_Bug />
                <BlackBtn onClick={goToAdminDashboard} text={"Back"} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
