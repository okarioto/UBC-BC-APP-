import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user);

  function logOut() {
    localStorage.removeItem("token");
    setUser({ userID: 0, email: "", isAdmin: false });
    navigate("/");
  }

  if (user.userID === 0) {
    return <h1>Not logged in </h1>;
  }

  return (
    <>
      <h1>Logged IN</h1>
      <button onClick={logOut} className="border border-black">
        {" "}
        log out{" "}
      </button>
    </>
  );
}

export default Dashboard;
