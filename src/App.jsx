import React, { useState } from 'react';

// --- 1. THE PROFILE COMPONENT ---
const Profile = (props) => {
  const [likes, setLikes] = useState(0);
  const [userName, setUserName] = useState(props.name);
  const [userSkill, setUserSkill] = useState(props.skill);

  const boxColor = likes >= 5 ? 'lightgreen' : 'yellow';

  return (
    <div style={{ backgroundColor: boxColor, padding: '20px', marginBottom: '10px', borderRadius: '8px' }}>
      <h2>Name: {userName}</h2>
      <p>Skill: {userSkill}</p>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          placeholder="Edit name..."
        />
        <br /><br />
        <input 
          type="text" 
          value={userSkill} 
          onChange={(e) => setUserSkill(e.target.value)} 
          placeholder="Edit skill..."
        />
      </div>

      <button onClick={() => setLikes(likes + 1)}>Like: {likes} ❤️</button>
      <button onClick={() => setLikes(0)} style={{ marginLeft: '10px' }}>Reset 🔄</button>
    </div>
  );
};

// --- 2. THE MAIN APP COMPONENT ---
function App() {
  const [people, setPeople] = useState([
    { id: 1, name: "Adesola", skill: "Node.js Explorer" },
    { id: 2, name: "Gemini", skill: "React Guide" },
    { id: 3, name: "Luna", skill: "CSS Stylist" }
  ]);

  const [newName, setNewName] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const addPerson = () => {
    if (newName.trim() === "" || newSkill.trim() === "") return;
    const newMember = {
      id: Date.now(),
      name: newName,
      skill: newSkill
    };
    setPeople([...people, newMember]);
    setNewName("");
    setNewSkill("");
  };

  const deletePerson = (id) => {
    setPeople(people.filter(person => person.id !== id));
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'red' }}>Team Manager</h1>
      <p>Current Team Size: <strong>{people.length}</strong> members</p>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h3>Add New Member</h3>
        <input 
          placeholder="Name" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <input 
          placeholder="Skill" 
          value={newSkill} 
          onChange={(e) => setNewSkill(e.target.value)} 
          style={{ marginLeft: '10px' }}
        />
        <button 
          onClick={addPerson} 
          style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}
        >
          Add to Team ➕
        </button>
      </div>

      {people.map((person) => (
        <div key={person.id} style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <Profile name={person.name} skill={person.skill} />
          <button 
            onClick={() => deletePerson(person.id)}
            style={{ backgroundColor: 'red', color: 'white', cursor: 'pointer', marginTop: '5px' }}
          >
            Remove Member ❌
          </button>
        </div>
      ))}

      {people.length === 0 && <p>No members left in the team!</p>}
    </div>
  );
} // <--- THIS BRACKET WAS LIKELY MISSING OR MISPLACED

export default App;