import { useNavigate } from "react-router-dom";

export default function Report_Bug() {
 const navigate = useNavigate();

 function handleBugClick() {
  navigate("/bug-form");
 }

 return (<p  onClick={handleBugClick} className="font-bold text-[12px] text-[#636363] cursor-pointer">
  Report a bug
  </p>)
}