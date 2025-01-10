import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  console.log(user);

  if (user.userID === 0) {
    return <h1>Not logged in </h1>;
  }

  return <h1>Logged IN</h1>;
}

export default Dashboard;
