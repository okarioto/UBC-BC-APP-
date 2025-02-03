import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Socials from "../components/Socials";
import BlackBtn from "../components/Black_Btn";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import UserCardLg from "../components/User_Card_Lg";
import Report_Bug from "../components/Report_Bug";

const apiUrl = import.meta.env.VITE_API_URL;

export default function User() {
  const { uid } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [deleteUserAsk, setDeleteUserAsk] = useState(false);
  const [localNotes, setLocalNotes] = useState("");
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMsg: "",
  });
  // const [isFull, setIsFull] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (!loading && user.uid) || (!user.isAdmin === 0 && navigate("/login"));
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(`${apiUrl}/users`, {
          params: { uid: uid },
        });
        setUserInfo(result.data[0]);
      } catch (error) {
        setErrorState({
          isError: true,
          errorMsg:
            "Something went wrong while fetching data. Please wait a while and try again",
        });
      }
    }

    fetchData();
  }, [uid, trigger]);

  useEffect(() => {
    if (userInfo.user_notes !== undefined) {
      setLocalNotes(userInfo.user_notes);
    }
  }, [userInfo.user_notes]);

  function back() {
    navigate(-1);
  }

  async function handleAdminToggle() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        isadmin: `${!userInfo.isadmin}`,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleVerifyToggle() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        isverified: "true",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleNoShowChangeMinus() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        noshow_count: `${userInfo.noshow_count - 1}`,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleNoShowChangePlus() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        noshow_count: `${userInfo.noshow_count + 1}`,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLevelMinus() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        user_level: `${userInfo.user_level <= 1 ? 1 : userInfo.user_level - 1}`,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLevelPlus() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        user_level: `${userInfo.user_level >= 3 ? 3 : userInfo.user_level + 1}`,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSaveNotes() {
    try {
      const result = await axios.patch(`${apiUrl}/users`, {
        uid: uid,
        user_notes: localNotes,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error saving notes:", error);
      setErrorState({
        isError: true,
        errorMsg: "Failed to save notes. Please try again.",
      });
    }
  }

  function handleDeleteUserCheck() {
    setDeleteUserAsk(true);
  }

  async function handleDeleteUser() {
    try {
      const result = await axios.delete(`${apiUrl}/users/${uid}`);
      navigate("/user-log");
    } catch (error) {
      setErrorState({
        isError: true,
        errorMsg:
          "Something went wrong while fetching data. Please wait a while and try again",
      });
    }
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-12 mb-7">
        <Header message="Welcome to Admin" />

        <div className="flex flex-col justify-center items-center w-full">
          <UserCardLg
            user_name={userInfo.fname + " " + userInfo.lname}
            user_email={userInfo.email}
            user_level={userInfo.user_level}
            user_isAdmin={userInfo.isadmin}
            user_isVerified={userInfo.isverified}
            user_noshow_count={userInfo.noshow_count}
            onAdminToggle={handleAdminToggle}
            onVerifyToggle={handleVerifyToggle}
            onNoshowChangeMinus={handleNoShowChangeMinus}
            onNoshowChangePlus={handleNoShowChangePlus}
            onLevelMinus={handleLevelMinus}
            onLevelPlus={handleLevelPlus}
          />
          <div className="flex flex-col w-full mb-5">
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                User Notes
              </label>
              <textarea
                value={localNotes || ""}
                onChange={(e) => setLocalNotes(e.target.value)}
                className="w-full p-2 border rounded-md resize-none bg-gray-200"
                rows="4"
                placeholder="Enter notes about this user..."
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 text-sm text-[#407076] bg-gray-300 rounded-lg  hover:bg-gray-400 duration-300"
                >
                  Save notes
                </button>

                {/* start of delete user check */}
                {!deleteUserAsk && (
                  <button
                    onClick={handleDeleteUserCheck}
                    className="px-3 py-1 text-sm text-red-600 bg-gray-300 rounded-lg  hover:bg-gray-400 duration-300"
                  >
                    Delete user
                  </button>
                )}

                {deleteUserAsk && (
                  <button
                    onClick={handleDeleteUser}
                    className="px-3 py-1 text-sm font-bold text-red-600 bg-gray-300 rounded-lg  hover:bg-gray-400 duration-300"
                  >
                    Yes
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex justify-center w-full mb-3">
            {deleteUserAsk && (
              <p className="text-[10px] font-light text-red-600 mt-3 text-center">
                Are you sure you want to delete this user?
              </p>
            )}
          </div>
          {/* error messages */}

          <div className="flex flex-col w-full items-center">
            <Report_Bug />
            <BlackBtn onClick={back} text={"Back"} />
          </div>
        </div>
      </div>
    </div>
  );
}
