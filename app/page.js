"use client"
import MyNavbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <MyNavbar />

      <div className="w-full min-h-[500px] flex justify-center items-center">
        <div className="content w-[90%] mx-auto h-full flex justify-center items-center gap-5">
          
          
          <div className="card flex flex-col justify-center items-center w-[250px] h-[250px] bg-gray-400 rounded-xl pt-3 transition-all duration-300 ease-in-out hover:scale-110">
            <h2 className="text-center font-bold text-white">Assistant BOT</h2>
            <button 
              className="mt-4  px-4 py-2 bg-blue-500 text-white   hover:bg-blue-700 transition-colors duration-300 rounded-lg"
              onClick={() => window.location.href = '/assist'}
            >
              Visit
            </button>
          </div>
          <div className="card card flex flex-col justify-center items-center w-[250px] h-[250px] bg-gray-400 rounded-xl pt-3 transition-all duration-300 ease-in-out hover:scale-110">
            <h2 className="text-center font-bold text-white">Memorization BOT</h2>
            <button 
              className="mt-4  px-4 py-2 bg-blue-500 text-white   hover:bg-blue-700 transition-colors duration-300 rounded-lg"
              onClick={() => window.location.href = '/memorize'}
            >
              Visit
            </button>
          </div>
          <div className="card card flex flex-col justify-center items-center w-[250px] h-[250px] bg-gray-400 rounded-xl pt-3 transition-all duration-300 ease-in-out hover:scale-110"></div>
        </div>
      </div>
    </>
  );
}
