import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import BlackBtn from "../components/Black_Btn";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import EventCardLg from "../components/Event_Card_Lg";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminEvent() {
  const { eid } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [event, setEvent] = useState([]);
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    !loading && user.uid === 0 && navigate("/login");
    !loading && !user.isAdmin && navigate(-1);
  }, [user, loading, navigate]);

  useEffect(() => {
        document.title = "UBC-BC - Admin Event";
    async function fetchData() {
      try {
        const [eventResult, signUpsResult] = await Promise.all([
          axios.get(`${apiUrl}/events`, { params: { eid: eid } }),
          axios.get(`${apiUrl}/sign-ups`, { params: { eid: eid } }),
        ]);
        setEvent(eventResult.data[0]);
        setParticipants(signUpsResult.data);
      } catch (error) {
        setErrorState({
          isError: true,
          errorMsg: "Something went wrong. Please wait a while and try again",
        });
      }
    }
    fetchData();
  }, [eid]);

  function back() {
    navigate(-1);
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-12 mb-7">
        <Header message="Welcome to Admin" />

        <div className="flex flex-col items-center w-full">
          <EventCardLg
            event_name={event.event_name}
            event_location={event.event_location}
            event_time={event.event_time}
            event_count={event.count}
            event_date={event.event_date}
          />

          <div className="flex flex-col w-full mb-5">
            <h3 className="whitespace-nowrap font-light text-[#636363] text-md mb-2">
              Attendees
            </h3>
            <div className="flex w-full items-end overflow-scroll">
              {participants.map((participant) => {
                return (
                  <p
                    key={participant.uid}
                    className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4"
                  >
                    {participant.fname + " " + participant.lname}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between w-full mb-7 mt-5">
            <button className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500">
              Sign In
            </button>
            <button className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500">
              Edit
            </button>
          </div>

          <div className="flex flex-col w-full items-center mt-5">
            <BlackBtn onClick={back} text={"Back"} />
          </div>
        </div>
      </div>
    </div>
  );
}
