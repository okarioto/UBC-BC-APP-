import { useLocation, useNavigate } from "react-router-dom";

export default function UserCardSm(props) {
  return (
    <div
      // onClick={}
      className="flex w-full bg-gray-300 opacity-80 rounded-xl justify-center shadow-lg mb-3 hover:opacity-100 duration-300 cursor-pointer min-h[20rem]"
    >
      <div className="flex m-2 min-w-[90%]">
        {/* Parent div with justify-end to align children to the end */}
        <div className="flex h-full min-h-[3.5rem] justify-between items-center w-full">
          {/* Name */}
          <h1 className="font-bold text-[18px] text-[#636363] ml-3">
            {props.user_name}
          </h1>
          {/* Signup count */}
          <h4 className="font text-[12px] text-[#636363]">
            no shows: {props.user_noshow_count}
          </h4>
        </div>
      </div>
    </div>
  );
}