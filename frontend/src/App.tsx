import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full h-screen bg-[#1a1a1a] relative">
      {/* Navbar absolutely positioned at the top */}
      <Navbar />
      {/* Main content centered */}
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="flex flex-col w-full max-w-[450px] text-white items-center">
          <h3 className="text-4xl font-bold mb-10">Are You Hungry?</h3>

          {/* Input field */}
          <div className="w-full flex flex-col mb-6">
            <input
              type="text"
              placeholder="Search for a city..."
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
            />
          </div>

          {/* Search button */}
          <div className="w-full flex flex-col mb-4">
            <button className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
