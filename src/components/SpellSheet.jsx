import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function SpellSheet() {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [spells, setSpells] = useState([]);
    const [slots, setSlots] = useState({});
    const [editingSlots, setEditingSlots] = useState(false);
    const [tempSlots, setTempSlots] = useState({});
    const [stats, setStats] = useState({});
    const [editingStats, setEditingStats] = useState(false);
    const [tempStats, setTempStats] = useState({});
    const statLabels = {
        spellSaveDC: "Spell Save DC",
        spellAttackBonus: "Spell Attack Bonus",
    };

    const [expandedSpellIndex, setExpandedSpellIndex] = useState(null);
    const [selectedSpellIndex, setSelectedSpellIndex] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;
        const all = JSON.parse(localStorage.getItem("characters_" + user.email)) || [];
        const char = all.find(c => c.id === Number(id));
        if (char) {
            setCharacter(char);
            setSlots(char.slots || {});
            setSpells(char.spells || []);
            setStats(char.stats || {});
        }
    }, [id, user]);

    const saveToLocalStorage = (updatedCharacter) => {
        if (!user) return;
        const all = JSON.parse(localStorage.getItem("characters_" + user.email)) || [];
        const updated = all.map(c => c.id === updatedCharacter.id ? updatedCharacter : c);
        localStorage.setItem("characters_" + user.email, JSON.stringify(updated));
    };


    // Handle change — same as slots logic
    const handleStatsChange = (field, value) => {
        if (value === '') {
            setTempStats(prev => ({ ...prev, [field]: '' }));
        } else {
            // Only allow digits, strip other characters
            const numericValue = value.replace(/\D/g, '');
            setTempStats(prev => ({ ...prev, [field]: numericValue }));
        }
    };

    // Save on button click
    const handleSaveStats = () => {
        // Convert empty strings to 0 before saving
        const normalizedStats = {};
        for (const field in tempStats) {
            normalizedStats[field] = tempStats[field] === '' ? 0 : Number(tempStats[field]);
        }
        setStats(normalizedStats);
        setEditingStats(false);

        // ✅ Fix: save stats correctly in character
        const updatedCharacter = {
            ...character,
            spellSaveDC: normalizedStats.spellSaveDC,
            spellAttackBonus: normalizedStats.spellAttackBonus,
        };

        setCharacter(updatedCharacter);
        saveToLocalStorage(updatedCharacter);
    };


    const handleSlotChange = (level, value) => {
        // Same as you did for slots
        if (value === '') {
            setTempSlots(prev => ({ ...prev, [level]: '' }));
        } else {
            const numericValue = value.replace(/\D/g, '');
            setTempSlots(prev => ({ ...prev, [level]: numericValue }));
        }
    };

    const handleSaveSlots = () => {
        // Convert empty strings to 0 before saving
        const normalizedSlots = {};
        for (const level in tempSlots) {
            normalizedSlots[level] = tempSlots[level] === '' ? 0 : Number(tempSlots[level]);
        }
        setSlots(normalizedSlots);
        setEditingSlots(false);
        const updatedCharacter = { ...character, slots: normalizedSlots };
        setCharacter(updatedCharacter);
        saveToLocalStorage(updatedCharacter);
    };

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addSpell = () => {
        const newSpell = {
            id: generateId(),
            level: '',
            name: '',
            castingTime: '',
            range: '',
            components: '',
            duration: '',
            save: '',
            source: '',
            notes: ''
        };
        const updatedSpells = [...spells, newSpell];
        setSpells(updatedSpells);
        const updatedCharacter = { ...character, spells: updatedSpells };
        setCharacter(updatedCharacter);
        saveToLocalStorage(updatedCharacter);
    };

    const updateSpell = (index, field, value) => {
        const updated = spells.map((spell, i) =>
            i === index ? { ...spell, [field]: value } : spell
        );
        setSpells(updated);
        const updatedCharacter = { ...character, spells: updated };
        setCharacter(updatedCharacter);
        saveToLocalStorage(updatedCharacter);
    };

    const deleteSpell = (index) => {
        const updated = spells.filter((_, i) => i !== index);
        setSpells(updated);
        const updatedCharacter = { ...character, spells: updated };
        setCharacter(updatedCharacter);
        saveToLocalStorage(updatedCharacter);
        if (selectedSpellIndex === index) setSelectedSpellIndex(null);
        if (expandedSpellIndex === index) setExpandedSpellIndex(null);
    };

    const handleDeleteSelected = () => {
        if (selectedSpellIndex !== null) {
            if (window.confirm(`Delete spell "${spells[selectedSpellIndex].name || "Unnamed Spell"}"?`)) {
                deleteSpell(selectedSpellIndex);
            }
        }
    };

    if (!character) return <div className="text-white p-6">Character not found</div>;

    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen space-y-6">
            <center>
                <h1 className="text-3xl mb-1">{character.name} — {character.class} Level {character.level}</h1>
                <h2 className="italic text-gray-400 mb-4">{character.ability}</h2>
            </center>

            {/* STATS EDITABLE SECTION */}
            <div className="border border-pink-500 p-4 rounded space-y-3">
                <div className="flex justify-between font-bold mb-2">
                    {!editingStats && (
                        <span
                            className="underline cursor-pointer text-pink-400"
                            onClick={() => {
                                setTempStats({ ...stats });
                                setEditingStats(true);
                            }}
                        >
                            Click here to enter Spell Save DC and Spell Attack Bonus:
                        </span>
                    )}
                </div>

                {editingStats ? (
                    <div className="bg-gray-800 p-4 rounded space-y-2">
                        <div className="flex items-center space-x-4">
                            <label>Spell Save DC:</label>
                            <input
                                type="number"
                                min="0"
                                value={tempStats.spellSaveDC || ''}
                                onChange={(e) => handleStatsChange('spellSaveDC', e.target.value)}
                                className="bg-gray-700 w-20 p-1 rounded"
                            />
                            <label>Spell Attack Bonus:</label>
                            <input
                                type="number"
                                min="0"
                                value={tempStats.spellAttackBonus || ''}
                                onChange={(e) => handleStatsChange('spellAttackBonus', e.target.value)}
                                className="bg-gray-700 w-20 p-1 rounded"
                            />
                        </div>

                        <button
                            onClick={handleSaveStats}
                            className="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-4 rounded space-y-1">
                        {Object.entries(statLabels).map(([field, label]) => (
                            <p key={field}>
                                {label}: {character[field] ?? 0}
                            </p>
                        ))}
                    </div>

                )}
            </div>

            {/* SPELL SLOTS SECTION */}
            <div className="border border-pink-500 p-4 rounded space-y-3">
                <div className="flex justify-between font-bold mb-2">
                    {!editingSlots && (
                        <span
                            className="underline cursor-pointer text-pink-400"
                            onClick={() => {
                                setTempSlots({ ...slots });
                                setEditingSlots(true);
                            }}
                        >
                            Click here to enter your slots
                        </span>
                    )}
                </div>

                {editingSlots ? (
                    <div className="bg-gray-800 p-4 rounded space-y-2">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <label>Level {i + 1}:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={tempSlots[i + 1] || ''}
                                    onChange={(e) => handleSlotChange(i + 1, e.target.value)}
                                    className="bg-gray-700 w-20 p-1 rounded"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleSaveSlots}
                            className="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-4 rounded space-y-1">
                        {Array.from({ length: 9 }, (_, i) => (
                            <p key={i}>Level {i + 1}: {slots[i + 1] || 0}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* SPELLS LIST */}
            <div>
                <h2 className="text-3xl font-bold mb-4">Spells</h2>
                {spells.length === 0 && <p>No spells added yet.</p>}
                <button
                    onClick={addSpell}
                    className="mb-4 underline text-pink-500"
                >
                    + Add Spell
                </button>

                {spells.map((spell, index) => (
                    <div key={spell.id}
                        className={`mb-4 border border-pink-600 p-4 rounded 
                            ${selectedSpellIndex === index ? "bg-pink-800" : "bg-gray-900"}`}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-bold">{spell.name || "Unnamed Spell"}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedSpellIndex(index);
                                        setExpandedSpellIndex(index);
                                    }}
                                    className="text-sm underline text-pink-400"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                        {expandedSpellIndex === index && (
                            <div className="mt-2 space-y-1 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <label>
                                        Level:
                                        <input
                                            type="number"
                                            min="0"
                                            value={spell.level}
                                            onChange={e => updateSpell(index, "level", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            value={spell.name}
                                            onChange={e => updateSpell(index, "name", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Casting Time:
                                        <input
                                            type="text"
                                            value={spell.castingTime}
                                            onChange={e => updateSpell(index, "castingTime", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Range:
                                        <input
                                            type="text"
                                            value={spell.range}
                                            onChange={e => updateSpell(index, "range", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Components:
                                        <input
                                            type="text"
                                            value={spell.components}
                                            onChange={e => updateSpell(index, "components", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Duration:
                                        <input
                                            type="text"
                                            value={spell.duration}
                                            onChange={e => updateSpell(index, "duration", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Save:
                                        <input
                                            type="text"
                                            value={spell.save}
                                            onChange={e => updateSpell(index, "save", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <label>
                                        Source:
                                        <input
                                            type="text"
                                            value={spell.source}
                                            onChange={e => updateSpell(index, "source", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </label>
                                    <p className="col-span-2">
                                        Notes:
                                        <textarea
                                            value={spell.notes}
                                            onChange={e => updateSpell(index, "notes", e.target.value)}
                                            className="w-full bg-gray-800 rounded px-1"
                                        />
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteSpell(index)}
                                    className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                                >
                                    Delete Spell
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {selectedSpellIndex !== null && (
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white mt-4"
                    >
                        Delete Selected Spell
                    </button>
                )}
            </div>
        </div>
    );
}

export default SpellSheet;
