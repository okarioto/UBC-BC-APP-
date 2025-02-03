import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SignInUserCard(props) {
  const navigate = useNavigate();
  // const [isSignedIn, setIsSignedIn] = useState(false);
  // const [isNotSignedIn, setIsNotSignedIn] = useState(false);

  const [isSignedIn, setIsSignedIn] = useState(() => {
   const saved = localStorage.getItem(`event-${props.eid}-user-${props.uid}-status`);
   return saved ? JSON.parse(saved).isSignedIn : false;
  });
  
  const [isNotSignedIn, setIsNotSignedIn] = useState(() => {
   const saved = localStorage.getItem(`event-${props.eid}-user-${props.uid}-status`);
   return saved ? JSON.parse(saved).isNotSignedIn : false;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
   localStorage.setItem(
    `event-${props.eid}-user-${props.uid}-status`,
    JSON.stringify({ isSignedIn, isNotSignedIn })
  );
  }, [isSignedIn, isNotSignedIn, props.uid, props.eid]);

  // Add cleanup for specific user when unmounting (optional)
  useEffect(() => {
    return () => {
      // Only if you need to clear specific user status
      // localStorage.removeItem(`user-${props.uid}-status`);
    };
  }, [props.uid]);

  function getColorBySkill(level) {
    switch (level) {
      case 1:
        return "text-[#40A6A6]";
      case 2:
        return "text-[#3C7E86]";
      case 3:
        return "text-[#CA939E]";
    }
  }

  function handleUserClick() {
    navigate(`/user-info/${props.uid}`);
  }

  // decide whether to have x be to remove user from event or to signal no sign in
  // async function handleXClick() {
  //  try {
  //   console.log(props.uid);
  //   console.log(props.user_noshow_count + 1);
  //   const result = await axios.patch(`${apiUrl}/users`, {
  //    uid: `${props.uid}`,
  //    noshow_count: `${props.user_noshow_count + 1}`
  //   });
  //   setIsNotSignedIn(true);
  //   setIsSignedIn(false);
  //   console.log(result);
  //  } catch (error) {
  //   console.log(error);
  //  }
  // }

  async function handleXClick() {
   try {
    const result = await axios.delete(`${apiUrl}/sign-ups`, {
      params: { 
        uid: props.uid, 
        eid: props.eid 
      }
    });
    window.location.reload();
    console.log(result);
   } catch (error) {
    console.log(error);
   }
}

  function handleCheckClick() {
   setIsSignedIn(true);
   setIsNotSignedIn(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center p-2 border-b border-gray-200"
    >
      <div
        onClick={handleUserClick}
        className={ `${
         isSignedIn ? 'bg-green-300' 
         : isNotSignedIn ? 'bg-red-300' 
         : 'bg-gray-300'
       }
         flex w-full bg-gray-300 opacity-80 rounded-xl justify-center shadow-lg mb-3 hover:opacity-100 duration-300 cursor-pointer`}
      >
        <div className="flex m-2 min-w-[90%]">
          <div className="flex h-full min-h-[3rem] justify-between items-center w-full">
            {/* Name and No Show Count Container */}
            <div className="flex flex-col">
              <h1
                className={`font-bold text-[18px] ml-3 ${getColorBySkill(
                  props.user_skill_level
                )}`}
              >
                {props.user_name}
              </h1>
              <h4 className="font text-[12px] text-[#636363] ml-3">
                no shows: {props.user_noshow_count}
              </h4>
            </div>

            {/* Buttons Container */}
            <div className="flex gap-4">
              <button
                className="p-1 rounded-lg hover:bg-green-400 duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckClick();
                  // Add your checkmark button logic here
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="#407076"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                className="p-1 rounded-lg hover:bg-red-400 duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleXClick();
                  // Add your X button logic here
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="#407076"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}