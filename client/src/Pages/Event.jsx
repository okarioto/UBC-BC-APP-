import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Socials from "../components/Socials";
import BlackBtn from "../components/Black_Btn";

export default function Event() {
  const { eid } = useParams();
  const navigate = useNavigate();

  function goToDashboard() {
    navigate("/dashboard");
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-7 mb-7">
        <Header message="Welcome to UBC-BC" />

        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-start w-full mb-7">
            <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2">
              Drop-In
            </h2>
            <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
              HARRY J. OSBORNE BUILDING
            </h2>
            <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
              01-01-2025
            </h2>
            <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
              16:30:00
            </h2>
            <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
              47/50
            </h2>
          </div>

          <div className="flex flex-col w-full mb-14">
            <h3 className="whitespace-nowrap font-light text-[#636363] text-md mb-2">
              Attendees
            </h3>
            <div className="flex w-full items-end overflow-scroll">
              <p className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4">

                dominic huang
              </p>
              <p className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4">

                dominic huang
              </p>
              <p className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4">

                dominic huang
              </p>
              <p className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4">

                dominic huang
              </p>
              <p className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4">

                dominic huang
              </p>
              <p className="whitespace-nowrap font-bold text-[#636363] text-xs p-1 mb-4">

                dominic huang
              </p>
            </div>
          </div>

          <div className="flex justify-center w-full mb-10">
            <button
              className="bg-gray-300 text-red-600 font-bold rounded-xl h-[3rem] w-[40%] min-w-[10rem] shadow-lg hover:bg-opacity-80 duration-500"
            >
              Withdraw
            </button>
          </div>

          <div className="flex flex-col w-full items-center">
            <Socials />
            <BlackBtn onClick={goToDashboard} text={"Back"} />
          </div>
        </div>
      </div>
    </div>
  );
}
