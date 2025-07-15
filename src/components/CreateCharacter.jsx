import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCharacter() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [charClass, setCharClass] = useState("");
    const [level, setLevel] = useState();
    const [ability, setAbility] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userKey = `characters_${user?.email}`;

    const handleSubmit = (e) => {
        e.preventDefault();

        const newChar = {
            id: Date.now(),
            name,
            class: charClass,
            level,
            ability,
            slots: {},
            spells: [],
        };

        const existing = JSON.parse(localStorage.getItem(userKey)) || [];
        localStorage.setItem(userKey, JSON.stringify([...existing, newChar]));
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-8 space-y-6">
            <h1 className="text-3xl text-pink-500 font-bold mb-4">Create New Character</h1>
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={charClass}
                    onChange={(e) => setCharClass(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="number"
                    placeholder="Level"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="text"
                    placeholder="Spellcasting Ability (e.g. Charisma)"
                    value={ability}
                    onChange={(e) => setAbility(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                />

                <div className="flex space-x-4 mt-4">
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded">
                        Save Character
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCharacter;
