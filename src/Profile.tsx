import Navbar from "./components/Navbar";

function Profile() {
  return (
    <div className="w-full h-screen bg-[#1a1a1a] relative">
      <Navbar />
      <div className="h-full flex flex-col justify-center items-center">
        <p className="text-white">this is my profile</p>
      </div>
    </div>
  );
}

export default Profile;
