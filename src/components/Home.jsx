import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function Home() {
  const [characters, setCharacters] = useState([]);
  const [showAccount, setShowAccount] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const stored = JSON.parse(localStorage.getItem("characters_" + user.email)) || [];
    setCharacters(stored);
  }, [navigate, user]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("characters_" + user.email);
    navigate("/");
  };

  // New: Delete individual character
  const handleDeleteCharacter = (id) => {
    if (!window.confirm("Are you sure you want to delete this character?")) return;
    const updated = characters.filter((c) => c.id !== id);
    setCharacters(updated);
    localStorage.setItem("characters_" + user.email, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8 relative">
      {/* User Account Info */}
      <div className="flex justify-end items-center space-x-2">
        <p>{user?.email}</p>
        <button onClick={() => setShowAccount(!showAccount)} className="text-pink-500 text-2xl">
          <FaUserCircle />
        </button>
      </div>

      {showAccount && (
        <div className="absolute top-16 right-8 bg-pink-500 text-white p-4 rounded shadow-lg space-y-2 w-52">
          <p className="font-bold mb-2">My account:</p>
          <button onClick={handleSignOut} className="underline block w-full text-left">
            Sign Out
          </button>
          <button onClick={handleDeleteAccount} className="underline block w-full text-left">
            Delete Account
          </button>
          <button onClick={() => alert("We securely store your data locally only.")} className="underline block w-full text-left">
            How we store your data
          </button>
        </div>
      )}

      {/* Character List */}
      <h2 className="text-3xl font-bold underline mb-4 text-pink-500">My characters</h2>

      <div className="space-y-2 mb-8">
        {characters.length > 0 ? (
          characters.map((c) => (
            <div key={c.id} className="flex justify-between items-center">
              <button
                className="underline text-left text-lg hover:text-pink-400 flex-grow text-left"
                onClick={() => navigate(`/character/${c.id}`)}
              >
                {c.name} – {c.class} Level {c.level}
              </button>
              <button
                onClick={() => handleDeleteCharacter(c.id)}
                className="ml-4 text-red-500 hover:text-red-700 font-bold"
                title="Delete character"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No characters yet.</p>
        )}
      </div>

      {/* Create New Character */}
      <button
        onClick={() => navigate("/createcharacter")}
        className="underline text-pink-500 text-lg font-bold hover:text-pink-400"
      >
        Create New Character
      </button>
    </div>
  );
}

export default Home;
