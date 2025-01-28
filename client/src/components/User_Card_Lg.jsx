export default function UserCardLg(props) {

 function getLevelText(level) {
  switch(level) {
    case 1: return 'Novice';
    case 2: return 'Intermediate';
    case 3: return 'Advanced';
    default: return 'Unknown';
  }
};

 return (
   <div className="flex flex-col items-start w-full mb-7">
     <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2">
       {props.user_name}
     </h2>
     <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2 w-full">
        <div className="flex justify-between items-center w-full">
          <span>
            Admin status:{" "}
            <span className={props.user_isAdmin ? "text-green-600" : "text-red-600"}>
              {props.user_isAdmin ? "True" : "False"}
            </span>
          </span>
          
          <button 
            onClick={() => props.onAdminToggle(props.uid)}
            className="ml-4 px-3 py-1 text-sm text-[#407076] bg-gray-300 rounded-lg  hover:bg-gray-400 duration-300"
          >
            Change
          </button>
        </div>
      </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2 w-full">
        <div className="flex justify-between items-center w-full">
          <span>Level: {getLevelText(props.user_level)}</span>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => props.onLevelMinus(props.uid)}
              className="bg-gray-300 text-[#407076] rounded-lg hover:bg-gray-400 w-[2.25rem] duration-300"
            >
              -
            </button>
            <button
              onClick={() => props.onLevelPlus(props.uid)}
              className="bg-gray-300 text-[#407076] rounded-lg hover:bg-gray-400 w-[2.25rem] duration-300"
            >
              +
            </button>
          </div>
        </div>
      </h2>
     <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2">
       Email: {props.user_email}
     </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2 w-full">
        <div className="flex justify-between items-center w-full">
          <span>
            Verified Status:{" "}
            <span className={props.user_isVerified ? "text-green-600" : "text-red-600"}>
              {props.user_isVerified ? "Verified" : "Pending Verification"}
            </span>
          </span>
          <button 
            onClick={() => props.onVerifyToggle(props.uid)}
            className="ml-4 px-3 py-1 text-sm text-[#407076] bg-gray-300 rounded-lg  hover:bg-gray-400 duration-300"
          >
            Verify
          </button>
        </div>
      </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2 w-full">
        <div className="flex justify-between items-center w-full">
          <span>Total no shows: {props.user_noshow_count}</span>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => props.onNoshowChangeMinus(props.uid)}
              className="bg-gray-300 text-[#407076] rounded-lg hover:bg-gray-400 w-[1.85rem] duration-300"
            >
              -
            </button>
            <button
              onClick={() => props.onNoshowChangePlus(props.uid)}
              className="bg-gray-300 text-[#407076] rounded-lg hover:bg-gray-400 w-[1.85rem] duration-300"
            >
              +
            </button>
          </div>
        </div>
      </h2>
   </div>
 );
}