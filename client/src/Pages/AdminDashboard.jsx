import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCardSm from "../components/Event_Card_Sm";
import Header from "../components/Header";
import BlackBtn from "../components/Black_Btn";
import Report_Bug from "../components/Report_Bug";

const apiUrl = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedTime = currentDate.toISOString().split("T")[1].split(".")[0];
  const [events, setEvents] = useState({ upComing: [], past: [] });
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    !loading && user.uid === 0 && navigate("/login");
    !loading && !user.isAdmin && navigate(-1);
  }, [user, loading, navigate]);

  useEffect(() => {
    document.title = "UBC-BC - Admin Dashboard";
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
      }
    }

    fetchEvents();
  }, []);

  function goToDashboard() {
    navigate("/dashboard");
  }
  
  function goToUserLog() {
    navigate("/user-log");
  }

  function goToEventsLog() {
    navigate("/event-log");
  }

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-7 mb-7">
        <Header message="Welcome to Admin" />
        <div className="flex flex-col w-full mb-5">
          <div className="flex justify-between items-center">
          <h3 className="tracking-wider font-bold text-[#636363] text-sm mb-3">
            Upcoming events
          </h3>
          <p className="tracking-wider text-[#407076] font-bold text-xs mb-3">
            Create event
          </p>
          </div>
          <div className="flex flex-col w-full max-h-[20rem] overflow-scroll">
            {events.upComing.map((evnt) => {
              return (
                <EventCardSm
                  key={evnt.eid}
                  eid={evnt.eid}
                  event_name={evnt.event_name}
                  event_time={evnt.event_time}
                  event_date={evnt.event_date}
                  event_sign_up_count={evnt.count}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-between w-full mb-5 mt-3">
          <button onClick={goToUserLog} className="flex justify-center items-center w-full bg-gray-300 opacity-80 rounded-xl shadow-lg mb-3 hover:opacity-100 duration-300 min-w-[8rem] min-h-[8rem] max-w-[12rem] max-h-[12rem] font-bold text-[14px] text-[#636360] mx-1.5">
            users log
          </button>
          <button className="flex justify-center items-center w-full bg-gray-300 opacity-80 rounded-xl shadow-lg mb-3 hover:opacity-100 duration-300 min-w-[8rem] min-h-[8rem] max-w-[12rem] max-h-[12rem] font-bold text-[14px] text-[#636360] mx-1.5"
            onClick={goToEventsLog}
          >
            events log
          </button>
        </div>

        <div className="flex flex-col w-full items-center">
          <Report_Bug />
          <BlackBtn onClick={goToDashboard} text={"Back"} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
