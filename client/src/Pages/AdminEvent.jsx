import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import BlackBtn from "../components/Black_Btn";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import EventCardLg from "../components/Event_Card_Lg";
import Report_Bug from "../components/Report_Bug";
import EventCardInfo from "../components/Event_Card_Info";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminEvent() {
  const location = useLocation(); // Add this
  const { eid } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [event, setEvent] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();
  const [from] = useState(location.state?.from || '/admin-dashboard');
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTime = `${formData.time}:00`;
    try {
      const result = await axios.patch(`${apiUrl}/events`, {
        eid: event.eid,
        event_date: formData.date,
        event_time: formattedTime,
        event_location: formData.location,
        event_name: formData.name,
      });
      setIsEdit(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    console.log(event.eid);
    console.log("Form submitted with:", formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleEventDelete() {
    try {
      const result = await axios.delete(`${apiUrl}/events/${event.eid}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  }

  function back() {
    switch (from) {
      case "/admin-dashboard":
        navigate("/admin-dashboard");
        break;
      case "/event-log":
        navigate("/event-log");
        break;
      default:
        navigate("/admin-dashboard");
    }
  }

  function editback() {
    setIsEdit(false);
  }

  function handleEdit() {
    setIsEdit(true);
  }

  function goToEventSignIn() {
    navigate(`/sign-in/${event.eid}`)
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-12 mb-7">
      <div className="fixed top-[5.5rem]">
          <Header message="Welcome to Admin" />
        </div>


        <div className="flex flex-col items-center w-full">
          {/* from here */}
          {!isEdit && (
            <div className="flex flex-col items-center w-full mt-[-5rem]">
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
                <button onClick={goToEventSignIn}
                className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500">
                  Sign In
                </button>
                <button
                  onClick={handleEdit}
                  className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {/* to here */}
          {isEdit && (
            <EventCardInfo
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleEventDelete={handleEventDelete}
              oldName={event.event_name}
              oldLocation={event.event_location}
            />
          )}
          <div className="flex flex-col w-[65%] max-w-[20rem] items-center fixed top-[45rem]">
            <Report_Bug />
            {isEdit && <BlackBtn onClick={editback} text={"Back"} />}
            {!isEdit && <BlackBtn onClick={back} text={"Back"} />}
          </div>
        </div>
      </div>
    </div>
  );
}
