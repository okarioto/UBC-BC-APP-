import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import BlackBtn from "../components/Black_Btn";
import Report_Bug from "../components/Report_Bug";
import SignInUserCard from "../components/SignIn_User_Card";

const apiUrl = import.meta.env.VITE_API_URL;

function SignIn() {

 const { user, loading } = useContext(AuthContext);
 const { eid } = useParams();
 const navigate = useNavigate();
 const [users, setUsers] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [userStatuses, setUserStatuses] = useState({});

 useEffect(() => {
  !loading && user.uid === 0 && navigate("/login");
  !loading && !user.isAdmin && navigate(-1);
}, [user, loading, navigate]);

useEffect(() => {
 document.title = "UBC-BC - Admin Event";
 async function fetchData() {
   try {
    const result = await axios.get(`${apiUrl}/signed-up-users`, { params: { eid: eid } });
    setUsers(result.data);
   } catch (error) {
    console.log(error)
   }
 }
 fetchData();
}, [eid]);

const filteredUsers = users.filter((usr) => {
 const fullName = `${usr.fname} ${usr.lname}`.toLowerCase();
 return fullName.includes(searchQuery.toLowerCase());
});

async function handlePatchUnsigned () {
 // Collect all unsigned user IDs
 const unsignedUserIds = users.filter(user => {
   const status = localStorage.getItem(`event-${eid}-user-${user.uid}-status`);
   return status ? !JSON.parse(status).isSignedIn : false;
 }).map(user => user.uid);
 console.log(unsignedUserIds);

 // Send PATCH request
 try {
   await axios.patch(`${apiUrl}/attendance`, {
     unsignedUserIds
   });
   navigate(`/admin-event/${eid}`)
 } catch (error) {
   console.error("Error updating attendance:", error);
   alert("Error updating attendance");
 }
};

function goToEvent() {
 navigate(`/admin-event/${eid}`);
}


 return (
  <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-between items-center w-[80%] max-w-[30rem] mt-[3rem]">
        <Header message="Welcome to Admin" />
        <div className="flex flex-col w-full mb-[1rem]">
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="tracking-wider font-bold text-[#636363] text-sm">
              Attendees
            </h3>
            <input
              type="text"
              placeholder="Search attendees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm w-[50%] bg-gray-300"
            />
          </div>
          {/* User List */}
          <div className="flex flex-col w-full max-h-[32rem] overflow-auto">
            <AnimatePresence>
              {filteredUsers.map((usr) => {
                return (
                  <SignInUserCard
                    key={usr.uid}
                    uid={usr.uid}
                    eid={eid}
                    user_name={usr.fname + " " + usr.lname}
                    user_noshow_count={usr.noshow_count}
                    user_skill_level={usr.user_level}
                  />
                );
              })}
            </AnimatePresence>
          </div>
          <div className="flex flex-col w-full items-center">
          <button 
        onClick={handlePatchUnsigned}
        className="w-[80%] h-[70%] text-red-600 p-3 rounded-xl mt-3"
      >
        End event
      </button>
          </div>
        </div>
        <div className="flex flex-col w-full items-center">
          <Report_Bug />
          <BlackBtn onClick={goToEvent} text={"Back"} />
        </div>
      </div>
    </div>
 )
}

export default SignIn;