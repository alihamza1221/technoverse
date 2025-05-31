// Home component placeholder
import { UserDataContext } from "../context/UserContext";
import { useContext } from "react";
function Home() {
  const { user, setUser } = useContext(UserDataContext);

  return (
    <div className="bg-amber-100 text-gray-700 px-5 py-2 border-[1] rounded-xl">
      Home Page user: {user.name} " role: " {user.role}
    </div>
  );
}
export default Home;
