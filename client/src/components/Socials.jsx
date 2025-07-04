import ig from "../assets/instagram.svg"
import fb from "../assets/facebook.svg"
export default function Socials() {
  return (
    <div className="flex w-[60%] justify-between mb-6">
      <a href="https://www.instagram.com/ubc_bc/" target="blank">
        <img src={ig} alt="" className="w-7" />
      </a>
      <a href="https://www.facebook.com/ubcbc" target="blank">
        <img src={fb} alt="" className="w-7" />
      </a>
    </div>
  );
}
