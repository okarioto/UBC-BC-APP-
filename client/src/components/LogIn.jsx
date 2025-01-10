import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_URL;

function LogIn() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const inputEmail = event.target.email.value;
    const inputPassword = event.target.password.value;

    try {
      const result = await axios.post(`${apiUrl}/login`, {
        email: inputEmail,
        user_password: inputPassword,
      });

      localStorage.setItem("token", result.data.token);
      setUser(jwtDecode(result.data.token));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  function logOut() {
    localStorage.removeItem("token");
    setUser({ userID: 0, email: "", isAdmin: false });
  }
  return (
    <div>
      hi
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="email" name="email" />
        <input type="text" placeholder="password" name="password" />
        <button type="submit">Log in</button>
      </form>
      <button onClick={logOut}> log out </button>
    </div>
  );
}

export default LogIn;
