import { ChangeEvent, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useTheme } from "./Context/ThemeContext";
import { db, auth } from "./firebase";
import { addDoc, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Restaurant {
  name: string;
}

function Donation() {
  const { darkMode } = useTheme();
  const [amount, setAmount] = useState("");
  const [submit, setSubmit] = useState(false);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState("");
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchTotalDonated(user.uid);
        await fetchFavorites(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTotalDonated = async (uid: string) => {
    const snapshot = await getDocs(collection(db, "users", uid, "donations"));
    let sum = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      sum += data.amount || 0;
    });
    setTotal(sum);
  };

  const fetchFavorites = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.favorites)) {
        const favList = data.favorites.map((r: any) => ({ name: r.name }));
        setFavorites(favList);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(inputValue ? `$ ${inputValue}` : "");
  };

  const handlePresetClick = (value: number) => {
    setAmount(`$ ${value}`);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be signed in to donate.");
      return;
    }

    if (!selectedRestaurant) {
      alert("Please select a restaurant to donate to.");
      return;
    }

    const numericAmount = parseFloat(amount.replace("$", "").trim());
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      await addDoc(collection(db, "users", userId, "donations"), {
        amount: numericAmount,
        restaurant: selectedRestaurant,
        timestamp: new Date(),
      });
      setSubmit(true);
      await fetchTotalDonated(userId);
    } catch (err) {
      console.error("❌ Failed to record donation:", err);
    }
  };

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} flex items-center justify-center`}>
      <Navbar />
      <div className="w-full flex items-center justify-center px-4 pt-20 pb-10">
        <div className={`flex flex-col w-full max-w-[800px] ${darkMode ? 'text-white' : 'text-[#1a1a1a]'} items-center`}>
          <h3 className="text-4xl font-bold mb-5">Donations</h3>
          <p className="mb-5">Support one of your favorite restaurants with a donation!</p>

          {favorites.length > 0 ? (
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className={`mb-4 px-4 py-2 rounded border ${darkMode ? 'bg-[#1a1a1a] border-white text-white' : 'bg-white border-[#1a1a1a] text-[#1a1a1a]'}`}
            >
              <option value="">Select a restaurant</option>
              {favorites.map((fav, idx) => (
                <option key={idx} value={fav.name}>
                  {fav.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 mb-4">You haven’t favorited any restaurants yet.</p>
          )}

          <div className="space-x-2.5 mb-5">
            {[1, 5, 10, 20].map((val) => (
              <button
                key={val}
                onClick={() => handlePresetClick(val)}
                className={`${darkMode ? 'bg-[#1a1a1a] border border-white text-white' : 'bg-white border border-[#1a1a1a] text-[#1a1a1a]'} font-semibold rounded-md px-4 py-2 text-center cursor-pointer ${darkMode ? 'hover:bg-white hover:text-[#1a1a1a]' : 'hover:bg-[#1a1a1a] hover:text-white'} transition-colors`}
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
            className={`w-40 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'} py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none ${darkMode ? 'focus:border-white' : 'focus:border-[#1a1a1a]'}`}
          />

          <button
            onClick={handleSubmit}
            className={`${darkMode ? 'bg-[#1a1a1a] border border-white text-white' : 'bg-white border border-[#1a1a1a] text-[#1a1a1a]'} font-semibold rounded-md px-4 py-2 text-center cursor-pointer ${darkMode ? 'hover:bg-white hover:text-[#1a1a1a]' : 'hover:bg-[#1a1a1a] hover:text-white'} transition-colors mb-5`}
          >
            Submit
          </button>

          {submit && <p>Thank you for your donation to {selectedRestaurant}!</p>}
          {total > 0 && (
            <p className="mt-2 text-sm text-green-400">
              You’ve donated a total of ${total.toFixed(2)}. Thank you!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Donation;
