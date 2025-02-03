import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventCardSm from "../components/Event_Card_Sm";
import Header from "../components/Header";
import Report_Bug from "../components/Report_Bug";
import BlackBtn from "../components/Black_Btn";
import { AnimatePresence, motion } from "framer-motion";
import { format, parse } from "date-fns";

const apiUrl = import.meta.env.VITE_API_URL;

function EventLog() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedTime = currentDate.toISOString().split("T")[1].split(".")[0];
  const [events, setEvents] = useState({ upComing: [], past: [] });
  const [searchUpcoming, setSearchUpcoming] = useState("");
  const [searchPast, setSearchPast] = useState("");
  const [showDatePickerUpcoming, setShowDatePickerUpcoming] = useState(false);
  const [selectedDateUpcoming, setSelectedDateUpcoming] = useState(null);
  const [showDatePickerPast, setShowDatePickerPast] = useState(false);
  const [selectedDatePast, setSelectedDatePast] = useState(null);
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMsg: "",
  });
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    !loading && user.uid === 0 && navigate("/login");
    !user.isadmin || navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await axios.get(`${apiUrl}/events/upcoming-and-past`, {
          params: {
            event_date: formattedDate,
            event_time: formattedTime,
          },
        });
        setEvents({ upComing: result.data[0], past: result.data[1] });
      } catch (error) {
        console.log(error);
        setErrorState({
          isError: true,
          errorMsg: "Something went wrong. Please try again later.",
        });
      }
    }

    fetchEvents();
  }, []);

  function goToAdminDashboard() {
    navigate("/admin-dashboard");
  }

  function parseEventDate(dateString) {
    return parse(dateString, "MMMM dd, yyyy", new Date());
  }

  const filteredUpcoming = events.upComing.filter((evnt) => {
    const matchesSearch = evnt.event_name
      .toLowerCase()
      .includes(searchUpcoming.toLowerCase());

    if (selectedDateUpcoming) {
      const formattedSelectedDate = format(
        selectedDateUpcoming,
        "MMMM dd, yyyy"
      );
      return matchesSearch && evnt.event_date === formattedSelectedDate;
    }
    return matchesSearch;
  });

  const filteredPast = events.past.filter((evnt) => {
    const matchesSearch = evnt.event_name
      .toLowerCase()
      .includes(searchPast.toLowerCase());

    if (selectedDatePast) {
      const formattedSelectedDate = format(selectedDatePast, "MMMM dd, yyyy");
      return matchesSearch && evnt.event_date === formattedSelectedDate;
    }
    return matchesSearch;
  });

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-7 mb-7">
        <Header message="Welcome to Admin" />
        <div className="flex flex-col w-full mb-5">
          <h3 className="tracking-wider font-bold text-[#636363] text-sm mb-3">
            Upcoming events
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Search"
              value={searchUpcoming}
              onChange={(e) => setSearchUpcoming(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm w-[50%] bg-gray-200"
            />
            <button
              onClick={() => setShowDatePickerUpcoming(!showDatePickerUpcoming)}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              {showDatePickerUpcoming ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          {showDatePickerUpcoming && (
            <div className="relative z-10 mb-3">
              <DatePicker
                selected={selectedDateUpcoming}
                onChange={(date) => {
                  setSelectedDateUpcoming(date);
                  setShowDatePickerUpcoming(false);
                }}
                dateFormat="MMMM dd, yyyy"
                inline
              />
            </div>
          )}
          <div className="flex flex-col w-full max-h-[12rem] overflow-scroll">
            <AnimatePresence mode="sync">
              {filteredUpcoming.map((evnt) => (
                <motion.div
                  key={evnt.eid}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCardSm {...evnt} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {selectedDateUpcoming && (
            <div className="mb-2">
              <button
                onClick={() => setSelectedDateUpcoming(null)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear date filter
              </button>
            </div>
          )}
        </div>

        {/* Past Events Section */}
        <div className="flex flex-col w-full mb-5">
          <h3 className="tracking-wider font-bold text-[#636363] text-sm mb-3">
            Previous events
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Search"
              value={searchPast}
              onChange={(e) => setSearchPast(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm w-[50%] bg-gray-200"
            />
            <button
              onClick={() => setShowDatePickerPast(!showDatePickerPast)}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              {showDatePickerPast ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          {showDatePickerPast && (
            <div className="relative z-10 mb-3">
              <DatePicker
                selected={selectedDateUpcoming}
                onChange={(date) => {
                  setSelectedDatePast(date);
                  setShowDatePickerPast(false);
                }}
                dateFormat="MMMM dd, yyyy"
                inline
              />
            </div>
          )}
          <div className="flex flex-col w-full max-h-[8rem] overflow-scroll">
            <AnimatePresence mode="sync">
              {filteredPast.map((evnt) => (
                <motion.div
                  key={evnt.eid}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCardSm 
                  key={evnt.eid}
                  eid={evnt.eid}
                  event_name={evnt.event_name}
                  event_time={evnt.event_time}
                  event_date={evnt.event_date}
                  event_sign_up_count={evnt.count} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {selectedDatePast && (
            <div className="mb-2">
              <button
                onClick={() => setSelectedDatePast(null)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear date filter
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col w-full items-center">
          <Report_Bug />
          {errorState.isError && (
            <p className="text-[10px] font-light text-[#cc0000] mb-5 mt-4 text-center">
              {errorState.errorMsg}
            </p>
          )}
          <BlackBtn onClick={goToAdminDashboard} text={"Back"} />
        </div>
      </div>
    </div>
  );
}

export default EventLog;
