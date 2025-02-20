export default function EventCardLg(props) {
  return (
    <div className="flex flex-col items-start w-full mt-[5rem] mb-7">
      <h2 className="tracking-wide font-bold text-[#636363] text-lg mb-2">
        {props.event_name}
      </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
        {props.event_location}
      </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
        {props.event_date}
      </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
        {props.event_time}
      </h2>
      <h2 className="tracking-wide font-bold text-[#636363] text-lg  mb-2">
        {props.event_count ? props.event_count: 0}/50
      </h2>
    </div>
  );
}
