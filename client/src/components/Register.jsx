import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
  async function handleSubmit(event) {
    event.preventDefault();
    console.log("hi");
    const inputFname = event.target.fname.value;
    const inputLname = event.target.lname.value;
    const inputLevel = event.target.user_level.value;
    const inputEmail = event.target.email.value;
    const inputPassword = event.target.user_password.value;
    console.log(inputFname, inputLname, inputLevel, inputEmail, inputPassword);

    try {
      const result = await axios.post(`${apiUrl}/register`, {
        fname: inputFname,
        lname: inputLname,
        user_level: inputLevel,
        email: inputEmail,
        user_password: inputPassword,
      });
      console.log("success! : ", result.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <label htmlFor="fname">First Name:</label>
        <input
          type="text"
          name="fname"
          id="fname"
          placeholder="Dom"
          className="input-box"
        />
        <label htmlFor="lname">Last Name:</label>
        <input
          type="text"
          name="lname"
          id="lname"
          placeholder="Oka"
          className="input-box"
        />
        <label htmlFor="user_level">Level:</label>
        <input
          type="number"
          name="user_level"
          id="user_level"
          min={1}
          max={3}
          placeholder="1 - 3"
          className="input-box"
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="example@email.com"
          className="input-box"
        />
        <label htmlFor="user_password">Password:</label>
        <input
          type="password"
          name="user_password"
          id="user_password"
          placeholder="Password"
          className="input-box"
        />
        <button type="submit">Register !</button>
      </form>
    </div>
  );
}
