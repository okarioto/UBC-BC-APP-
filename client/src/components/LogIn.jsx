import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function LogIn() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const inputEmail = event.target.email.value;
    const inputPassword = event.target.password.value;

    try {
      const result = await axios.post("http://localhost:3000/login", {
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
