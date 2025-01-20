import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recoveryContext } from "../App";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BlackBtn from "../components/Black_Btn";

const apiUrl = import.meta.env.VITE_API_URL;

function Otp() {

 const location = useLocation();
 const { email, otp } = location.state || {};
 const [timerCount, setTimer] = React.useState(60);
 const [disable, setDisable] = useState(true);
 const [otpInput, setOtpInput] = useState(new Array(4).fill(""));
 const inputRefs = useRef([]);
 const navigate = useNavigate();
 let ableToChangePwd = false;
  
  function handleChange(element, index) {
   if (!/^\d*$/.test(element.value)) return;
   const newOtp = [...otpInput];
   newOtp[index] = element.value;
   setOtpInput(newOtp);

   if (element.value && index < inputRefs.current.length - 1) {
    inputRefs.current[index + 1].focus();
  }
  }

  function handleKeyDown(element, index) {
   if (element.key === "Backspace") {
    if (!otpInput[index] && index > 0) {
      // If current input is empty and not the first one, focus the previous input
      inputRefs.current[index - 1].focus();
    } else {
      // Clear the current input value
      const newOtp = [...otpInput];
      newOtp[index] = "";
      setOtpInput(newOtp);
    }
  } else if (element.key === "ArrowLeft" && index > 0) {
    // Move to the previous input on ArrowLeft
    inputRefs.current[index - 1].focus();
  } else if (element.key === "ArrowRight" && index < inputRefs.current.length - 1) {
    // Move to the next input on ArrowRight
    inputRefs.current[index + 1].focus();
  }
  }

  function resendOtp() {
   if (disable) return;
   axios.post(`${apiUrl}/send_recovery_email`, {
    OTP: otp,
    recipient_email: email,})
    .then(() => setDisable(true))
    .then(() => alert(`A new code was succesfully sent to your email!`))
    .then(() => setTimer(60))
    .catch(console.log);
  }

  function verifyOtp() {
   if (parseInt(otpInput.join("")) === otp) {
    navigate("/change-password", {state: {ableToChangePwd: true, email}});
   } else {
    console.log(parseInt(otpInput.join("")), otp, otpInput);
    alert(`The code you have entered is not correct, try again or re-send the link`);
   }
   return;
  }

  function goToLogin() {
   navigate("/");
  }

  React.useEffect(() => {
   let interval = setInterval(() => {
    setTimer((lastTimerCount) => {
     lastTimerCount <= 1 && clearInterval(interval);
     if (lastTimerCount <= 1) setDisable(false);
     if (lastTimerCount <= 0) return lastTimerCount;
     return lastTimerCount - 1; 
    });
   }, 1000);
   return () => clearInterval(interval);
  }, [disable]); 

  return (
   <div className="w-screen min-h-screen flex justify-center items-center">
    <div className="flex flex-col justify-between items-center  w-[80%] max-w-[30rem] mt-7 mb-7">
    <div className="text-center max-w-sm">
     <div className="mb-10 mt-5">
      <h2 className="tracking-wider font-bold text-[#636363] text-2xl mb-3">Verify</h2>
      <p className="text-gray-500 mb-6">Your code was sent to {email}</p>
      </div>
      <div className="flex justify-center space-x-5 mb-7 mt-[2.5rem]">
        <div className="flex justify-center space-x-5 mb-7 mt-[2.5rem]">
  {otpInput.map((value, index) => (
    <input
      key={index}
      type="text"
      maxLength="1"
      value={value}
      onChange={(e) => handleChange(e.target, index)}
      ref={(ref) => (inputRefs.current[index] = ref)} // Assign ref
      onKeyDown={(e) => handleKeyDown(e, index)}
      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#636363] text-xl"
    />
  ))}
</div>
      </div>
      <div className="mt-[4rem]">
       <p onClick={goToLogin} className="mb-3 text-gray-500 mt-5">Back</p>
      <BlackBtn onClick={verifyOtp} text={"Verify"}/>
      <p className="mt-4 text-gray-500 mt-5">
        Didn’t receive code?  
        <a href="#" className="" 
        style={{color: disable? "grey" : "#407076",
                cursor: disable? "none" : "pointer",
                textDecorationLine: disable? "none" : "underline"}}
        onClick={resendOtp}
        >
         {disable? ` Resend code in ${timerCount}s` : ` Resend code`}
         </a>
      </p>
      </div>
    </div>
    </div>
    </div>
  );
}
 
export default Otp;
