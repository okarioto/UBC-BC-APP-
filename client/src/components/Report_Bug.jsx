import { useNavigate } from "react-router-dom";

export default function Report_Bug() {
 const navigate = useNavigate();

 function handleBugClick() {
  navigate("/bug-form");
 }

 return (<a href="/bug-form" onClick={(e) => e.preventDefault() || handleBugClick()} className="font-bold text-[12px] text-[#636363]">
  Report a bug
  </a>)
}