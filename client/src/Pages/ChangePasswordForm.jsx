import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BlackBtn from "../components/Black_Btn";

const apiUrl = import.meta.env.VITE_API_URL;

function ChangePasswordForm() {
  const location = useLocation();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { ableToChangePwd, email } = location.state || {};


  useEffect(() => {
   if (!ableToChangePwd) navigate(-1);
  })

  function goToLogin() {
    navigate("/");
  }

  async function handleSubmit(event) {
    event.preventDefault();

     const user = await axios.get(`${apiUrl}/users`, {
      params: {
       email: email
      }});
    
    setIsError(false);
    setIsSuccess(false);
    const inputPassword = event.target.user_password.value;
    const inputPasswordCheck = event.target.user_password_check.value;

    if (inputPassword !== inputPasswordCheck) {
      setIsError(true);
      setErrorMsg("Passwords don't match");
      return;
    }

    try {
      const result = await axios.patch(`${apiUrl}/users`, {
          uid: user.data[0].uid,
          user_password: inputPassword 
      });
      setIsError(false);
      setIsSuccess(true);
    } catch (error) {
      setIsError(true);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[80%] max-w-[30rem] flex flex-col items-center mt-10">
        <div className="w-full">
          <h2 className="tracking-wider font-bold mb-5 text-gray-600 text-xl">
            Reset your password
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center w-full"
        >
          <div className="flex flex-col items-start w-full mb-3">
            <label
              htmlFor="user_password"
              className="tracking-wide text-gray-500 mb-2"
            >
              New password*
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
          <div className="flex flex-col items-start w-full mb-[3rem]">
            <label
              htmlFor="user_password_check"
              className="tracking-wide text-gray-500 mb-2"
            >
              Confirm Password*
            </label>
            <input
              type="password"
              name="user_password_check"
              id="user_password_check"
              placeholder="Not qwerty"
              required
              className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>
          {!isSuccess && <BlackBtn type="submit" text={`Reset`} />}
          {(isSuccess) && (
            <BlackBtn onClick={goToLogin} text="Go To Login" />
          )}
          {isError && (
            <p className="text-[10px] font-light text-[#cc0000] mt-3 text-center">
              {errorMsg}
            </p>
          )}
          {isSuccess && (
            <p className="text-[10px] font-light text-green-700 mt-3 text-center">
              Success !
            </p>
          )}
        </form>
        <div className="w-32 h-32 mt-6">
          <img src="/logo.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
