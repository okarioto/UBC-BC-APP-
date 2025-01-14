
export default function EventCardSm(props){
return (
  <a
    href={`/event/${props.eid}`}
    className="flex w-full bg-gray-300 opacity-80 rounded-xl justify-center shadow-lg mb-3 hover:opacity-100 duration-300"
  >
    <div className="flex m-2 min-w-[90%] justify-between ">
      <div className="flex flex-col h-full min-h-[2rem] justify-between">
        <h3 className="font-bold text-[12px] text-[#636363]">{props.event_name}</h3>
        <h4 className="font text-[12px] text-[#636363]">{props.event_sign_up_count ? props.event_sign_up_count : 0}/50</h4>
      </div>
      <div className="flex flex-col h-full min-h-[2rem] justify-between items-end">
        <h3 className="font-bold text-[12px] text-[#636363]">{props.event_date}</h3>
        <h4 className="font text-[12px] text-[#636363]">{props.event_time}</h4>
      </div>
    </div>
  </a>
);
}