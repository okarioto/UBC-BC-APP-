export default function BlackBtn(props) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className="bg-black text-white font-bold rounded-xl h-[3rem] w-full shadow-lg hover:bg-opacity-80 duration-500"
    >
      {props.text}
    </button>
  );
}
