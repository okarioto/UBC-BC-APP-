import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Socials from "../components/Socials";
import BlackBtn from "../components/Black_Btn";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import EventCardLg from "../components/Event_Card_Lg";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Event() {
  const { eid } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [event, setEvent] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMsg: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user.uid === 0) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventResult, signUpsResult] = await Promise.all([
          axios.get(`${apiUrl}/events`, { params: { eid: eid } }),
          axios.get(`${apiUrl}/sign-ups`, { params: { eid: eid } }),
        ]);

        setEvent(eventResult.data[0]);
        setParticipants(signUpsResult.data);
      } catch (error) {
        setErrorState({ isError: true, errorMsg: "Something went wrong. Please wait a while and try again" });
      }
    }
    fetchData();
  }, [eid]);

  useEffect(() => {
    setIsSignedUp(participants.some((p) => p.uid === user.uid));
  }, [participants, user.uid]);

  async function withdraw() {
    try {
      const result = await axios.delete(`${apiUrl}/sign-ups`, {
        params: { eid: eid, uid: user.uid },
      });
      if (result) {
        setParticipants(participants.filter((p) => p.uid !== user.uid));
        setEvent((prevEvent) => {
          return { ...event, count: prevEvent.count-- };
        });
      } else {
        console.log("delete failed");
      }
    } catch (error) {
      console.log(error);
      setErrorState({isError: true, errorMsg: "Something went wrong while withdrawing. Please try again."})
    }
  }

  async function signup() {
    try {
      const result = await axios.post(`${apiUrl}/sign-ups`, {
        eid: eid,
        uid: user.uid,
      });
      setParticipants([
        { uid: user.uid, eid: eid, fname: user.fname, lname: user.lname },
        ...participants,
      ]);
      setEvent((prevEvent) => {
        return { ...event, count: prevEvent.count++ };
      });
    } catch (error) {
      console.log(error);
            setErrorState({
              isError: true,
              errorMsg:
                "Something went wrong while signing up. Please try again.",
            });

    }
  }

  function goToDashboard() {
    navigate("/dashboard");
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-12 mb-7">
        <Header message="Welcome to UBC-BC" />

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

          <div className="flex justify-center w-full mb-3">
            {isSignedUp && (
              <button
                onClick={withdraw}
                className="bg-gray-300 text-red-600 font-bold rounded-xl h-[3rem] w-[40%] min-w-[10rem] shadow-lg hover:bg-red-600 hover:text-white duration-500"
              >
                Withdraw
              </button>
            )}

            {!isSignedUp && (
              <button
                onClick={signup}
                className="bg-gray-300 text-green-600 font-bold rounded-xl h-[3rem] w-[40%] min-w-[10rem] shadow-lg hover:bg-green-600 hover:text-white duration-500"
              >
                Sign Up
              </button>
            )}
          </div>
          {errorState.isError && (
            <p className="text-[10px] font-light text-[#cc0000] mb-5 text-center">
              {errorState.errorMsg}
            </p>
          )}

          <div className="flex flex-col w-full items-center">
            <Socials />
            <BlackBtn onClick={goToDashboard} text={"Back"} />
          </div>
        </div>
      </div>
    </div>
  );
}
