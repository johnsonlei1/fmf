import { ChangeEvent, useState } from "react";
import Navbar from "./components/Navbar";

function Donation() {
  const [amount, setAmount] = useState("");
  const [submit, setSubmit] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
    setAmount(inputValue ? `$ ${inputValue}` : "");
  };

  const handlePresetClick = (value: number) => {
    setAmount(`$ ${value}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Navbar />
      <div className="w-full flex items-center justify-center px-4 pt-20 pb-10">
        <div className="flex flex-col w-full max-w-[800px] text-white items-center">
          <h3 className="text-4xl font-bold mb-5">Donations</h3>
          <p className="mb-5">
            Enjoying the app? Support us with a donation of any amount!
          </p>
          <div className="space-x-2.5 mb-5">
            {[1, 5, 10, 20].map((val) => (
              <button
                key={val}
                onClick={() => handlePresetClick(val)}
                className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors"
              >
                ${val}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="$ Other amount"
            value={amount}
            onChange={handleChange}
            className="w-40 text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
          />
          <button
            onClick={() => setSubmit(true)}
            className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors mb-5"
          >
            Submit
          </button>
          {submit && <p>Thank you for your donation!</p>}
        </div>
      </div>
    </div>
  );
}

export default Donation;
