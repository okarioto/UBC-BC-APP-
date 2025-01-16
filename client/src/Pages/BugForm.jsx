import React, { useState } from 'react';

function BugForm() {
 const [formData, setFormData] = useState({
   name: '',
   email: '',
   description: '',
 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Bug Report Submitted:', formData);
    alert('Thank you for reporting the bug! We will look into it.');
    setFormData({ name: '', email: '', description: '' });
  };

 return (
  <div className="flex justify-center items-center min-h-screen">
      <div className="w-[80%] max-w-[30rem] flex flex-col items-center mt-10">
        <div className="w-full">
         <h1 className="tracking-wider font-bold mb-5 text-gray-600 text-xl">Report a bug</h1>
          <h4 className="tracking-wider font-bold mb-5 text-gray-600">
            Your Info
          </h4>
        </div>

        <form
          className="flex flex-col justify-center items-center w-full"
        >
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
                id="fname"
                placeholder="Joanne"
                required
                className=" bg-gray-200 rounded-xl h-[2rem] w-full p-3 shadow-lg duration-[5000s]"
              />
            </div>

            <div className="flex flex-col items-start w-[45%] mb-3">
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
                placeholder="Doe"
                required
                className="bg-gray-200 rounded-xl h-[2rem] w-full p-3 shadow-lg duration-[5000s]"
              />
            </div>
          </div>

          <div className="flex flex-col items-start w-full mb-3">
            <label htmlFor="email" className="tracking-wide text-gray-500 mb-2">
              Discord tag
            </label>
            <input
              type="text"
              name="text"
              placeholder="rio2453"
              required
              className="bg-gray-200 rounded-xl h-[2rem] w-full p-3 shadow-lg duration-[5000s]"
            />
          </div>

          <div className="w-full mt-5">
          <h4 className="tracking-wider font-bold mb-5 text-gray-600">
            Bug Info
          </h4>
        </div>

          <div className="flex flex-col items-start w-full mb-3">
            <label
              htmlFor="user_password"
              className="tracking-wide text-gray-500 mb-2"
            >
              Page containing the bug
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
          <div className="flex flex-col items-start w-full mb-3">
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
          <div className="flex flex-col justify-start w-full mb-5">
          </div>
        </form>
        <div className="w-32 h-32 mt-4">
          <img src="/logo.svg" alt="" />
        </div>
      </div>
    </div>
);
}

export default BugForm;