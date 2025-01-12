import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlackBtn from "../components/Black_Btn";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function goToLogin() {
    navigate("/");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsError(false);
    setUserExists(false);
    setIsSuccess(false);
    const inputFname = event.target.fname.value;
    const inputLname = event.target.lname.value;
    const inputLevel = event.target.user_level.value;
    const inputEmail = event.target.email.value;
    const inputPassword = event.target.user_password.value;

    try {
      const result = await axios.post(`${apiUrl}/register`, {
        fname: inputFname,
        lname: inputLname,
        user_level: inputLevel,
        email: inputEmail,
        user_password: inputPassword,
      });
      setIsSuccess(true);
    } catch (error) {
      console.log(error.response.data);
      if (error.status === 404) {
        setUserExists(true);
      } else {
        setIsError(true);
        setErrorMsg(error.response.data);
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[80%] max-w-[30rem] flex flex-col items-center mt-10">
        <div className="w-full">
          <h2 className="tracking-wider font-bold mb-5 text-gray-600 text-xl">
            Your Info
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center w-full"
        >
          <div className="flex flex-col items-start w-full mb-5">
            <label htmlFor="fname" className="tracking-wide text-gray-500 mb-1">
              First Name*
            </label>
            <input
              type="text"
              name="fname"
              id="fname"
              placeholder="Joanne"
              required
              className=" bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>

          <div className="flex flex-col items-start w-full mb-3">
            <label htmlFor="lname" className="tracking-wide text-gray-500 mb-2">
              Last Name*
            </label>
            <input
              type="text"
              name="lname"
              id="lname"
              placeholder="Doe"
              required
              className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>

          <div className="flex flex-col items-start w-full mb-3">
            <label htmlFor="email" className="tracking-wide text-gray-500 mb-2">
              Email*
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="example@email.com"
              required
              className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>

          <div className="flex flex-col items-start w-full mb-3">
            <label
              htmlFor="user_password"
              className="tracking-wide text-gray-500 mb-2"
            >
              Password*
            </label>
            <input
              type="password"
              name="user_password"
              id="user_password"
              placeholder="Not qwerty"
              required
              className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>

          <div className="flex flex-col justify-start w-full mb-5">
            <label
              htmlFor="user_level"
              className="tracking-wide text-gray-500 mb-2"
            >
              Skill Level*
            </label>
            <ul
              name="user_level"
              id="user_level"
              className="flex justify-between w-full"
            >
              <li className="w-[30%]">
                <input
                  type="radio"
                  name="user_level"
                  id="user_level_novice"
                  value={1}
                  className="hidden peer"
                />
                <label
                  htmlFor="user_level_novice"
                  className=" bg-gray-200 rounded-lg h-8 min-w-20 flex justify-center items-center shadow-md peer-checked:shadow-inner text-gray-500 peer-checked:text-[#47986b] hover:bg-[#47986b] peer-checked:hover:text-white hover:text-white duration-500"
                >
                  <p className="text-[12px]">Novice</p>
                </label>
              </li>

              <li className="w-[30%]">
                <input
                  type="radio"
                  name="user_level"
                  id="user_level_intermediate"
                  value={2}
                  className="hidden peer"
                />
                <label
                  htmlFor="user_level_intermediate"
                  className=" bg-gray-200 rounded-lg h-8 min-w-20 flex justify-center items-center shadow-md peer-checked:shadow-inner text-gray-500 peer-checked:text-[#4f97c8]  hover:bg-[#4f97c8] peer-checked:hover:text-white  hover:text-white duration-500"
                >
                  <p className="text-[12px]">Intermediate</p>
                </label>
              </li>
              <li className="w-[30%]">
                <input
                  type="radio"
                  name="user_level"
                  id="user_level_advanced"
                  value={3}
                  className="hidden peer"
                />
                <label
                  htmlFor="user_level_advanced"
                  className=" bg-gray-200 rounded-lg h-8 min-w-20 flex justify-center items-center shadow-md peer-checked:shadow-inner text-gray-500 peer-checked:text-[#bf6c97]  hover:bg-[#bf6c97] peer-checked:hover:text-white  hover:text-white duration-500"
                >
                  <p className="text-[12px]">Advanced</p>
                </label>
              </li>
            </ul>
          </div>

          {!userExists && !isSuccess && (
            <BlackBtn type="sumbit" text={isError ? "Try Again" : "Sign Up"} />
          )}
          {(userExists || isSuccess) && (
            <BlackBtn onClick={goToLogin} text="Go To Login" />
          )}
          {isError && (
            <p className="text-[10px] font-light text-[#cc0000] mt-3 text-center">
              {errorMsg}
            </p>
          )}
          {userExists && (
            <p className="text-[10px] font-light text-[#cc0000] mt-3 text-center">
              This email is already associated with an user.
              <a href="mailto:example@email.com" className="underline">
                Forgot password?
              </a>
            </p>
          )}
          {isSuccess && (
            <p className="text-[10px] font-light text-green-700 mt-3 text-center">
              Success !
            </p>
          )}
        </form>
        <div className="w-32 h-32 mt-4">
          <img src="/logo.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
