import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UserCardSm(props) {
  function getColorBySkill(level) {
    switch (level) {
      case 1:
        return "text-[#40A6A6]";
      case 2:
        return "text-[#3C7E86]";
      case 3:
        return "text-[#CA939E]";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center p-2 border-b border-gray-200"
    >
      <div
        // onClick={}
        className="flex w-full bg-gray-300 opacity-80 rounded-xl justify-center shadow-lg mb-3 hover:opacity-100 duration-300 cursor-pointer"
      >
        <div className="flex m-2 min-w-[90%]">
          {/* Parent div with justify-end to align children to the end */}
          <div className="flex h-full min-h-[3rem] justify-between items-center w-full">
            {/* Name */}
            <h1
              className={`font-bold text-[18px] ml-3 ${getColorBySkill(
                props.user_skill_level
              )}`}
            >
              {props.user_name}
            </h1>
            {/* Signup count */}
            <h4 className="font text-[12px] text-[#636363]">
              no shows: {props.user_noshow_count}
            </h4>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
