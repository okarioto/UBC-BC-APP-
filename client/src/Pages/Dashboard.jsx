import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCardSm from "../components/Event_Card_Sm";
import Header from "../components/Header";
import Socials from "../components/Socials";
import BlackBtn from "../components/Black_Btn";

const apiUrl = import.meta.env.VITE_API_URL;

function Dashboard() {
  const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-CA", {
  timeZone: "America/Los_Angeles",
});

// Get PST time (HH:MM:SS)
const formattedTime = currentDate.toLocaleTimeString("en-GB", {
  timeZone: "America/Los_Angeles",
  hour12: false, // Use 24-hour format
});

  const [events, setEvents] = useState({ upComing: [], past: [] });
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMsg: "",
  });
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    !loading && user.uid === 0 && navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    document.title = "UBC-BC - Dashboard";
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
  
  function logOut() {
    localStorage.removeItem("token");
    setUser({ uid: 0, fname: "", lname: "", email: "", isAdmin: false });
    navigate("/");
  }

  const lowerDivStyle = {
    position: 'fixed',
    top: '40rem'
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-7 mb-7">
        <div className="fixed top-[5.5rem]">
        <Header message="Welcome to UBC-BC" />
        </div>
        <div className="flex flex-col w-[75%] max-w-[24rem] fixed top-[13rem]">
          <h3 className="tracking-wider font-bold text-[#636363] text-md mb-3">
            Upcoming events
          </h3>
          <div className="flex flex-col w-full max-h-[12rem] overflow-scroll mb-6">
            {events.upComing.map((evnt) => {
              return (
                <EventCardSm
                  key={evnt.eid}
                  eid={evnt.eid}
                  event_name={evnt.event_name}
                  event_time={evnt.event_time}
                  event_date={evnt.event_date}
                  event_sign_up_count={evnt.count>50 ? 50:evnt.count}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col w-[75%] max-w-[24rem] fixed top-[29.5rem]">
          <h3 className="tracking-wider font-bold text-[#636363] text- mb-3">
            Previous events
          </h3>
          <div className="flex flex-col w-full max-h-[8rem] overflow-scroll">
            {events.past.map((evnt) => {
              return (
                <EventCardSm
                  key={evnt.eid}
                  eid={evnt.eid}
                  event_name={evnt.event_name}
                  event_time={evnt.event_time}
                  event_date={evnt.event_date}
                  event_sign_up_count={evnt.count>50 ? 50 : evnt.count}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col w-[65%] max-w-[20rem] items-center fixed top-[43rem]">
          <Socials />
          {errorState.isError && (
            <p className="text-[10px] font-light text-[#cc0000] mb-5 mt-4 text-center">
              {errorState.errorMsg}
            </p>
          )}
          <BlackBtn onClick={logOut} text={"Log Out"} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
