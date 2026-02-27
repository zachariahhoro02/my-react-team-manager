import React, { useState, useEffect } from 'react';

/** * SECTION 1: THE PROFILE COMPONENT
 * This is a 'Child' component. It creates the individual cards for each person.
 */
const Profile = ({ name, skill, isDark }) => {
  // Local state for 'Likes' - stays within this card only
  const [likes, setLikes] = useState(0);
  
  // State for editing - initialized with the props sent from the Parent (App)
  const [userName, setUserName] = useState(name);
  const [userSkill, setUserSkill] = useState(skill);

  // Logic: Change color from Yellow to Green if they get 5 or more likes
  const statusColor = likes >= 5 ? '#2ecc71' : '#f1c40f'; 

  return (
    <div style={{ 
      backgroundColor: isDark ? '#2d2d2d' : 'white', 
      padding: '25px', 
      marginBottom: '15px', 
      borderRadius: '12px',
      boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
      borderLeft: `8px solid ${statusColor}`, // The dynamic "popularity" border
      color: isDark ? '#ffffff' : '#2c3e50',
      transition: 'all 0.3s ease'
    }}>
      {/* Name and Like Count Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>{userName}</h2>
          <p style={{ margin: '0 0 15px 0', color: isDark ? '#bdc3c7' : '#7f8c8d', fontWeight: 'bold' }}>{userSkill}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <span style={{ fontSize: '1.2rem' }}>{likes} ❤️</span>
        </div>
      </div>
      
      {/* Input Fields for live editing name/skill */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        <input 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', flex: '1 1 120px', backgroundColor: isDark ? '#444' : '#fff', color: isDark ? '#fff' : '#000' }}
        />
        <input 
          value={userSkill} 
          onChange={(e) => setUserSkill(e.target.value)} 
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', flex: '1 1 120px', backgroundColor: isDark ? '#444' : '#fff', color: isDark ? '#fff' : '#000' }}
        />
      </div>

      {/* Like and Reset Buttons */}
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setLikes(likes + 1)} style={{ cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#3498db', color: 'white' }}>Like</button>
        <button onClick={() => setLikes(0)} style={{ cursor: 'pointer', backgroundColor: isDark ? '#444' : '#ecf0f1', color: isDark ? '#fff' : '#000', border: '1px solid #bdc3c7', padding: '8px 15px', borderRadius: '5px' }}>Reset</button>
      </div>
    </div>
  );
};

/**
 * SECTION 2: THE MAIN APP COMPONENT
 * This is the 'Parent'. It manages the list of people and global settings like Dark Mode.
 */
export default function App() {
  // STATE: Tracking UI settings and Search
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // STATE: Tracking values for the "Add New Member" form
  const [newName, setNewName] = useState("");
  const [newSkill, setNewSkill] = useState("");
  
  // STATE: The Master List. It initializes by checking Browser LocalStorage.
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('teamList');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Adesola", skill: "Node.js Explorer" },
      { id: 2, name: "Gemini", skill: "React Guide" }
    ];
  });

  // SIDE EFFECT: Every time the 'people' list changes, save it to LocalStorage automatically.
  useEffect(() => {
    localStorage.setItem('teamList', JSON.stringify(people));
  }, [people]); 

  // FUNCTION: Adds a new object to the 'people' array
  const addPerson = () => {
    if (!newName.trim() || !newSkill.trim()) return; // Stop if inputs are empty
    setPeople([...people, { id: Date.now(), name: newName, skill: newSkill }]); // Add new member with unique ID
    setNewName(""); // Clear form inputs
    setNewSkill("");
  };

  // FUNCTION: Removes a person from the list by filtering out their ID
  const deletePerson = (id) => setPeople(people.filter(p => p.id !== id));

  // FUNCTION: Converts the current list into a downloadable file for Excel
  const exportToCSV = () => {
    let csvContent = "ID,Name,Skill\n";
    people.forEach(p => { 
      csvContent += `="${p.id}",${p.name},${p.skill}\n`; // Add each person as a row
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "team_members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the hidden link
  };

  // THEME OBJECT: Defines colors based on Dark Mode status
  const theme = {
    background: darkMode ? '#1a1a1a' : '#f4f7f6',
    card: darkMode ? '#2d2d2d' : 'white',
    text: darkMode ? '#ffffff' : '#2c3e50',
    subText: darkMode ? '#bdc3c7' : '#7f8c8d'
  };

  // DERIVED STATE: Filters the list of people based on what the user types in Search
  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * SECTION 3: THE RENDER (JSX)
   * This is where the actual HTML structure is built.
   */
  return (
    <div style={{ 
      backgroundColor: theme.background, 
      minHeight: '100vh', 
      padding: '20px 5%', 
      fontFamily: 'sans-serif',
      transition: 'all 0.3s ease',
      color: theme.text,
      display: 'flex',
      justifyContent: 'center' // Centers the whole app on large screens
    }}>
      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        
        {/* Header Section */}
        <button onClick={() => setDarkMode(!darkMode)} style={{ float: 'right', cursor: 'pointer', padding: '10px 20px', borderRadius: '50px', border: 'none', backgroundColor: darkMode ? '#fff' : '#333', color: darkMode ? '#333' : '#fff' }}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <h1 style={{ color: '#e74c3c' }}>Team Manager</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.subText, marginBottom: '20px' }}>
          <span>Team Size: <strong>{people.length}</strong></span>
          <button onClick={exportToCSV} style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', border: '1px solid #e74c3c', color: '#e74c3c', background: 'transparent' }}>
            📥 Export CSV
          </button>
        </div>

        {/* Input Form: Uses flex-wrap for responsiveness */}
        <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ padding: '12px', flex: '1 1 200px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: darkMode ? '#444' : '#fff', color: darkMode ? '#fff' : '#000' }} />
          <input placeholder="Skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} style={{ padding: '12px', flex: '1 1 200px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: darkMode ? '#444' : '#fff', color: darkMode ? '#fff' : '#000' }} />
          <button onClick={addPerson} style={{ flex: '1 1 100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Add Member</button> 
        </div>

        {/* Search Input Area */}
        <div style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="🔍 Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${darkMode ? '#444' : '#ddd'}`, backgroundColor: darkMode ? '#2d2d2d' : '#fff', color: darkMode ? '#fff' : '#333', boxSizing: 'border-box' }} />
        </div>

        {/* The Map Loop: Renders the filtered results */}
        {filteredPeople.map((person) => (
          <div key={person.id} style={{ marginBottom: '25px' }}>
            <Profile name={person.name} skill={person.skill} isDark={darkMode} />
            <button onClick={() => deletePerson(person.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Remove Member</button>
          </div>
        ))}

        {/* Empty State Message */}
        {filteredPeople.length === 0 && <p style={{ textAlign: 'center', color: theme.subText }}>No members found.</p>}
      </div>
    </div>
  );
}