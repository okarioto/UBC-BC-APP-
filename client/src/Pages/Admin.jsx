import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function Admin() {
  const { user } = useContext(AuthContext);
  console.log(user);
  if (user.userID !== 0) {
    if (!user.isAdmin) {
      return <h1>Logged in but not admin </h1>;
    } else {
      return <h1> Logged in and admin </h1>;
    }
  } else {
    return <h1>Not logged in </h1>;
  }
}

export default Admin;
