import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Report_Bug from "../components/Report_Bug";
import BlackBtn from "../components/Black_Btn";
import UserCardSm from "../components/User_card_sm";

const apiUrl = import.meta.env.VITE_API_URL;

function UserLog() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { user, setUser, loading } = useContext(AuthContext);

  useEffect(() => {
    !loading && user.uid === 0 && navigate("/login");
    !loading && !user.isAdmin && navigate(-1);
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await axios.get(`${apiUrl}/users`);
        console.log(result.data);
        setUsers(result.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  }, []);

  function goToAdminDashboard() {
    navigate("/admin-dashboard");
  }

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-[3rem]">
        <Header message="Welcome to Admin" />
        <div className="flex flex-col w-full mb-[2rem]">
          <h3 className="tracking-wider font-bold text-[#636363] text-sm mb-3">
            Users
          </h3>
          {/* this is the place for usercardsm */}
          <div className="flex flex-col w-full max-h-[32rem] overflow-auto">
            {users.map((usr) => {
              return (
                <UserCardSm
                  key={usr.uid}
                  uid={usr.uid}
                  user_name={usr.fname + " " + usr.lname}
                  user_noshow_count={usr.noshow_count}
                  user_skill_level={usr.user_level}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col w-full items-center">
          <Report_Bug />
          <BlackBtn onClick={goToAdminDashboard} text={"Back"} />
        </div>
      </div>
    </div>
  );
}

export default UserLog;
