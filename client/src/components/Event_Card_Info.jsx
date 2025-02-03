import { useEffect, useState, useContext } from "react";
export default function EventCardInfo({ formData, handleInputChange, handleSubmit, handleEventDelete, oldName, oldLocation }) {

 const [isDelete, setIsDelete] = useState(false);

 function handleEventDeleteCheck() {
  setIsDelete(true);
}

 return (
  <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-start w-full mb-7">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full"
            >
              <div className="flex flex-col items-start w-full mb-7">
                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  New name
                  <input
                    placeholder={oldName}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>
                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  New location
                  <input
                    placeholder={oldLocation}
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>

                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  New date
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>

                <label className="w-full tracking-wide font-bold text-[#636363] text-sm mb-4">
                  New time
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-gray-200 rounded-xl h-[2.5rem] w-full p-3 shadow-lg duration-[5000s]"
                    required
                  />
                </label>
              </div>

              <div className="flex justify-between w-full mb-7 mt-5">
                  <button
                    type="submit"
                    className="bg-gray-300 text-[#407076] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                  >
                    Save
                  </button>
                  {!isDelete && (
                   <button
                   type="button"
                   onClick={handleEventDeleteCheck}
                   className="bg-gray-300 text-[#cc0000] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                 >
                   Delete event
                 </button>
                  )}
                  {isDelete && (
                   <button
                   type="button"
                   onClick={handleEventDelete}
                   className="bg-gray-300 text-[#cc0000] font-bold rounded-xl h-[3rem] w-[40%] min-w-[9rem] shadow-lg hover:bg-[#407076] hover:text-white duration-500"
                 >
                   Yes
                 </button>
                  )}
              </div>
            </form>
            <div className="flex justify-center w-full mb-3">
            {isDelete && (
              <p className="text-[10px] font-light text-red-600 mt-3 text-center">
                Are you sure you want to delete this Event?
              </p>
            )}
          </div>
            </div>
        </div>
 )
}