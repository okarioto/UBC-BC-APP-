import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/Event_Card";
import Header from "../components/Header";
import Socials from "../components/Socials";
import BlackBtn from "../components/Black_Btn";

const apiUrl = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [events, setEvents] = useState([]);
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    if (!loading && user.uid === 0) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    async function getEvents() {
      try {
        const result = await axios.get(`${apiUrl}/events`);
        setEvents(result.data);
      } catch (error) {
        console.log(error);
      }
    }

    getEvents();
  }, []);

  function logOut() {
    localStorage.removeItem("token");
    setUser({ uid: 0, fname: "", lname: "", email: "", isAdmin: false });
    navigate("/");
  }

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-7 mb-7">
        <Header message={"Welcome to UBC-BC"} />
        <div className="flex flex-col w-full mb-5">
          <h3 className="tracking-wider font-bold text-[#636363] text-sm mb-3">
            Upcoming events
          </h3>
          <div className="flex flex-col w-full max-h-[14rem] overflow-scroll">
            {events.map((evnt, idx) => {
              return (
                <EventCard
                  key={evnt.eid}
                  eid={evnt.eid}
                  event_name={evnt.event_name}
                  event_time={evnt.event_time}
                  event_date={evnt.event_date}
                  event_location={evnt.event_location}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col w-full mb-5">
          <h3 className="tracking-wider font-bold text-[#636363] text-sm mb-3">
            Previous events
          </h3>
          <div className="flex flex-col w-full max-h-[10rem] overflow-scroll">
            <EventCard
              eid={1}
              event_name="temp"
              event_time="temp"
              event_date="temp"
              event_location="temp"
            />
          </div>
        </div>

        <div className="flex flex-col w-full items-center">
          <Socials />
          <BlackBtn onClick={logOut} text={"Log Out"} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
