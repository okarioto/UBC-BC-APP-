import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_URL;

function LogIn() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(event) {
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
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col min-h-1/2 w-[85%] max-w-[30rem] items-center">
        <div className="w-32 h-32">
          <img src="/logo.svg" alt="" />
        </div>
        <h2 className="tracking-tight font-bold text-xl mb-7">
          Log In or Sign Up
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center w-full"
        >
          <input
            type="email"
            placeholder="email"
            name="email"
            className=" bg-gray-200 rounded-xl h-[3rem] w-[75%] mb-7 p-3 shadow-lg duration-[5000s]"
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            className=" bg-gray-200 rounded-xl h-[3rem] w-[75%] mb-7 p-3 shadow-lg duration-[5000s]"
          />
          <button
            type="submit"
            className="bg-black text-white font-bold rounded-xl h-[3rem] w-[75%] shadow-lg hover:bg-opacity-80 duration-500"
          >
            Log in
          </button>
        </form>
        <p className="mb-3 mt-3 text-gray-300">or</p>
        <a
          href="/register"
          className="flex justify-center items-center bg-white text-black font-bold border-2 border-black rounded-xl h-[3rem] w-[75%] hover:bg-gray-300  duration-500"
        >
          <button>Sign Up</button>
        </a>

        {/* <a href="!!!" className="mt-3  text-gray-300">
          {" "}
          forgot password{" "}
        </a> */}
      </div>
    </div>
  );
}

export default LogIn;
