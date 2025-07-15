import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || {};
        const existingUser = users[email];

        if (!existingUser) {
            alert("User not found. Please create an account.");
            return;
        }

        if (existingUser.password !== password) {
            alert("Incorrect password.");
            return;
        }

        // Log the user in
        localStorage.setItem("user", JSON.stringify({ email, keepLoggedIn }));
        navigate("/home");
    };


    const goToCreateUser = () => {
        navigate("/createuser");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold text-pink-500 mb-4"><center>
                Welcome to DnD 5<sup>th</sup> Edition Spell Tracker</center>
            </h1>
            <p className="mb-8 text-center max-w-xl">
                A digital Spell Card webpage to allow you to have all your spells, details, and slots on one page.
                We recommend this be paired with a tool such as DnD Wikidot or Roll 20.
            </p>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-pink-500 underline mb-4 text-center">Log In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <label className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={keepLoggedIn}
                            onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            className="accent-pink-500"
                        />
                        <span>Keep me logged in</span>
                    </label>
                    <br></br>
                    <center>
                        <button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded"
                        >
                            Log In
                        </button></center>
                </form>

                <button
                    onClick={goToCreateUser}
                    className="mt-4 w-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-2 rounded transition"
                ><center>
                        Create New User
                    </center>
                </button>
            </div>
        </div>
    );
}

export default Login;
