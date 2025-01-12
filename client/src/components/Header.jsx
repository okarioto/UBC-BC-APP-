import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header(props) {
     const { user} = useContext(AuthContext);
  return (
    <div className="flex flex-col w-full items-center justify-center mb-8">
      <h2 className="tracking-wider font-bold text-[#636363] text-lg">
        Hello, {user.fname + " " + user.lname}
      </h2>
      <h2 className="tracking-wider font-bold text-lg">{props.message}</h2>
    </div>
  );
}
