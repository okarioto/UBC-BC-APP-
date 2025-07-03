import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Socials from "../components/Socials";
import BlackBtn from "../components/Black_Btn";
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import EventCardLg from "../components/Event_Card_Lg";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Event() {
  const { eid } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMsg: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.uid === 0)) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventResult, signUpsResult, waitlistResult] = await Promise.all([
          axios.get(`${apiUrl}/events`, { params: { eid } }),
          axios.get(`${apiUrl}/sign-ups`, { params: { eid } }),
          axios.get(`${apiUrl}/waitlist`, { params: { eid } }),
        ]);
        setEvent(eventResult.data[0] || null);
        setParticipants(signUpsResult.data);
        setWaitlist(waitlistResult.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorState({
          isError: true,
          errorMsg: "Failed to load event data. Please try again later.",
        });
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const full = participants.length >= 50;
    setIsFull(full);

    const signedUp = participants.some((p) => p.uid === user?.uid);
    setIsSignedUp(signedUp);

    const waitlistPos = waitlist.findIndex((u) => u.uid === user?.uid) + 1;
    setIsOnWaitlist(waitlistPos > 0);
  }, [participants, waitlist, user?.uid]);

  async function withdraw() {
    try {
      await axios.delete(`${apiUrl}/sign-ups`, {
        params: { eid, uid: user.uid },
      });

      setParticipants((prev) => prev.filter((p) => p.uid !== user.uid));
      setWaitlist((prev) => prev.filter((p) => p.uid !== user.uid));

      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      console.error("Withdraw error:", error);
      setErrorState({
        isError: true,
        errorMsg: "Failed to withdraw. Please try again.",
      });
    }
  }

  async function signup() {
    try {
      const result = await axios.post(`${apiUrl}/sign-ups`, {
        eid,
        uid: user.uid,
      });

      if (result.data.iswaitlist) {
        setWaitlist((prev) => [
          ...prev,
          {
            uid: user.uid,
            eid,
            fname: user.fname,
            lname: user.lname,
          },
        ]);
      } else {
        setParticipants((prev) => [
          {
            uid: user.uid,
            eid,
            fname: user.fname,
            lname: user.lname,
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorState({
        isError: true,
        errorMsg: "Failed to sign up. Please try again.",
      });
    }
  }

  function goToDashboard() {
    navigate("/dashboard");
  }

  if (!event) {
    return <div className="text-center p-8">Loading event...</div>;
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center w-[80%] max-w-[30rem] mt-12 mb-7">
        <div className="fixed top-[5.5rem]">
          <Header message="Welcome to UBC-BC" />
        </div>

        <div className="flex flex-col items-center w-full">
          <EventCardLg
            event_name={event.event_name}
            event_location={event.event_location}
            event_time={event.event_time}
            event_count={participants.length}
            event_date={event.event_date}
          />

          <div className="flex flex-col w-full mb-5">
            <h3 className="whitespace-nowrap font-light text-[#636363] text-md">
              Attendees
            </h3>
            <div className="flex w-full items-end overflow-x-auto h-10 mt-[-.5rem]">
              {participants.map((participant) => (
                <p
                  key={`participant-${participant.uid}`}
                  className="whitespace-nowrap font-bold text-[#636363] text-xs p-1"
                >
                  {`${participant.fname} ${participant.lname}`}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-center w-full mb-[2rem]">
            {(isSignedUp || isOnWaitlist) && (
              <button
                onClick={withdraw}
                className="bg-gray-300 text-red-600 font-bold rounded-xl h-[3rem] w-[40%] min-w-[10rem] shadow-lg hover:bg-red-600 hover:text-white duration-500"
              >
                Withdraw
              </button>
            )}

            {!isFull && !isSignedUp && !errorState.isError && (
              <button
                onClick={signup}
                className="bg-gray-300 text-green-600 font-bold rounded-xl h-[3rem] w-[40%] min-w-[10rem] shadow-lg hover:bg-green-600 hover:text-white duration-500"
              >
                Sign Up
              </button>
            )}
            {errorState.isError && (
              <p className="text-[10px] font-light text-[#cc0000] mb-5 text-center">
                {errorState.errorMsg}
              </p>
            )}
          </div>
          <div>
          {isFull && !errorState.isError && (
            <>
              {!isOnWaitlist && !isSignedUp && (
                <button
                  onClick={signup}
                  className="bg-gray-300 text-green-600 font-bold rounded-xl h-[3rem] w-[40%] min-w-[10rem] shadow-lg hover:bg-green-600 hover:text-white duration-500 mb-5"
                >
                  Join Waitlist
                </button>
              )}
              {isOnWaitlist && (
                <p className="text-[10px] font-light text-green-600 mb-5 text-center">
                  You are in position{" "}
                  {waitlist.findIndex((u) => u.uid === user?.uid) + 1} on the
                  waitlist
                </p>
              )}
            </>
          )}
          </div>
          <div className="flex flex-col w-[65%] max-w-[20rem] items-center fixed top-[43rem]">
            <Socials />
            <BlackBtn onClick={goToDashboard} text="Back" />
          </div>
        </div>
      </div>
    </div>
  );
}
