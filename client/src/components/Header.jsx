import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  function goAdminDashboard() {
    user.isAdmin && navigate("/admin-dashboard");
  }
  return (
    <div className="flex flex-col w-full items-center justify-center mb-8">
      <h2
        onClick={goAdminDashboard}
        className={`tracking-wider font-bold text-[#636363] text-lg ${user.isAdmin && 'cursor-pointer'}`}
      >
        Hello, {user.fname + " " + user.lname}
      </h2>
      <h2 className="tracking-wider font-bold text-lg">{props.message}</h2>
    </div>
  );
}
