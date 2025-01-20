import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import BlackBtn from '../components/Black_Btn';

function BugForm() {
 const [value, setValue] = useState("");
 const navigate = useNavigate();
 const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

function back() {
 navigate("/admin-dashboard");
}

 return (
  <div className="flex justify-center items-center min-h-screen">
      <div className="w-[80%] max-w-[30rem] flex flex-col items-center mt-10">
      <div className="w-full flex justify-between">
         <h1 className="tracking-wider font-bold mb-5 text-gray-600 text-xl">Report a bug</h1>
         <h4 onClick={back} className="tracking-wider font-bold mb-5 text-gray-600">Go back</h4>
         </div>
         <div className="w-full">
          <h4 className="tracking-wider font-bold mb-5 text-gray-600">
            Your Info
          </h4>
        </div>

      <form action="https://formspree.io/f/xwppjpwe" method="POST">
      <div className="flex w-full justify-between">
            <div className="flex flex-col items-start w-[45%] mb-3">
              <label
                htmlFor="fname"
                className="tracking-wide text-gray-500 mb-1"
              >
                First Name*
              </label>
              <input
                type="text"
                name="fname"
                placeholder="Joanne"
                value={user.fname}
                required
                className=" bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
              />
            </div>
            <div className="flex flex-col items-start w-[45%] mb-2">
              <label
                htmlFor="lname"
                className="tracking-wide text-gray-500 mb-1"
              >
                Last Name*
              </label>
              <input
                type="text"
                name="lname"
                id="lname"
                value={user.lname}
                required
                placeholder="Doe"
                className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
              />
            </div>
          </div>
           
          <div className="flex flex-col items-start w-full mb-2">
            <label htmlFor="email" className="tracking-wide text-gray-500 mb-1">
              Discord tag
            </label>
            <input
              type="text"
              name="discord"
              placeholder="rio2453"
              className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>
           
          <div className="w-full mt-5">
          <h4 className="tracking-wider font-bold mb-3 text-gray-600">
            Bug Info
          </h4>
        </div>

        <div className="flex flex-col items-start w-full mb-2">
            <label
              htmlFor   = "user_password"
              className = "tracking-wide text-gray-500 mb-1"
            >
              Page containing the bug
            </label>
          <div className="flex flex-col items-start w-full mb-2">
          <input
        id="dropdown-input"
        list="options"
        name='page'
        value={value}
        onChange={handleChange}
        placeholder="Select or type a page"
        className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
      />
      <datalist id="options">
        <option value="Register page" />
        <option value="Log in page" />
        <option value="User dashboard" />
        <option value="Event info page (user)" />
        <option value="Admin dashboard" />
        <option value="Events log" />
        <option value="Users log" />
        <option value="Event info page (admin)" />
        <option value="Users info page (admin)" />
      </datalist>
          </div>
          </div>

          <div className = "flex flex-col items-start w-full mb-6">
            <label
            >
              Summary of the bug*
            </label>
            <input
              type='text'
              name="bug summary"
              required
              className="bg-gray-200 rounded-xl h-[8rem] w-full px-3 shadow-lg duration-[5000s]"
              style={{paddingBottom: "5.5rem"}}
            />
          </div>
          <div className="flex flex-col w-full justify-between items-center">
          <button type="submit" className='bg-black text-white font-bold rounded-xl h-[3rem] w-[75%] shadow-lg hover:bg-opacity-80 duration-500'>Send</button>
        </div>
       </form>
      </div>
    </div>
);
}

export default BugForm;