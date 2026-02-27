import React, { useState, useEffect } from 'react';

// --- 1. THE PROFILE COMPONENT ---
const Profile = ({ name, skill, isDark }) => {
  const [likes, setLikes] = useState(0);
  const [userName, setUserName] = useState(name);
  const [userSkill, setUserSkill] = useState(skill);

  const statusColor = likes >= 5 ? '#2ecc71' : '#f1c40f'; 

  return (
    <div style={{ 
      backgroundColor: isDark ? '#2d2d2d' : 'white', 
      padding: '25px', 
      marginBottom: '15px', 
      borderRadius: '12px',
      boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
      borderLeft: `8px solid ${statusColor}`,
      color: isDark ? '#ffffff' : '#2c3e50',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>{userName}</h2>
          <p style={{ margin: '0 0 15px 0', color: isDark ? '#bdc3c7' : '#7f8c8d', fontWeight: 'bold' }}>{userSkill}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <span style={{ fontSize: '1.2rem' }}>{likes} ❤️</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        <input 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', flex: '1', backgroundColor: isDark ? '#444' : '#fff', color: isDark ? '#fff' : '#000' }}
        />
        <input 
          value={userSkill} 
          onChange={(e) => setUserSkill(e.target.value)} 
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', flex: '1', backgroundColor: isDark ? '#444' : '#fff', color: isDark ? '#fff' : '#000' }}
        />
      </div>

      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setLikes(likes + 1)} style={{ cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#3498db', color: 'white' }}>Like</button>
        <button onClick={() => setLikes(0)} style={{ cursor: 'pointer', backgroundColor: isDark ? '#444' : '#ecf0f1', color: isDark ? '#fff' : '#000', border: '1px solid #bdc3c7', padding: '8px 15px', borderRadius: '5px' }}>Reset</button>
      </div>
    </div>
  );
};

// --- 2. THE MAIN APP COMPONENT ---
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('teamList');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Adesola", skill: "Node.js Explorer" },
      { id: 2, name: "Gemini", skill: "React Guide" }
    ];
  });

  const [newName, setNewName] = useState("");
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    localStorage.setItem('teamList', JSON.stringify(people));
  }, [people]); 

  const addPerson = () => {
    if (!newName.trim() || !newSkill.trim()) return;
    setPeople([...people, { id: Date.now(), name: newName, skill: newSkill }]);
    setNewName("");
    setNewSkill("");
  };

  const deletePerson = (id) => setPeople(people.filter(p => p.id !== id));

  // --- CSV EXPORT LOGIC (In the logic area!) ---
  const exportToCSV = () => {
    let csvContent = "ID,Name,Skill\n";
    people.forEach(p => { csvContent += `${p.id},${p.name},${p.skill}\n`; });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "team_members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Adding =" " around the ID tells Excel to treat it as "Text"
csvContent += `="${p.id}",${p.name},${p.skill}\n`;
  };

  const theme = {
    background: darkMode ? '#1a1a1a' : '#f4f7f6',
    card: darkMode ? '#2d2d2d' : 'white',
    text: darkMode ? '#ffffff' : '#2c3e50',
    subText: darkMode ? '#bdc3c7' : '#7f8c8d'
  };
  // This runs every time the search box or the people list changes
const filteredPeople = people.filter(person => 
  person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  person.skill.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '40px 20px', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        
        <button onClick={() => setDarkMode(!darkMode)} style={{ float: 'right', cursor: 'pointer', padding: '10px 20px', borderRadius: '50px', border: 'none', backgroundColor: darkMode ? '#fff' : '#333', color: darkMode ? '#333' : '#fff' }}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <h1 style={{ color: '#e74c3c' }}>Team Manager</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.subText, marginBottom: '20px' }}>
          <span>Current Team Size: <strong>{people.length}</strong></span>
          <button onClick={exportToCSV} style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', border: '1px solid #e74c3c', color: '#e74c3c', background: 'transparent' }}>
            📥 Export CSV
          </button>
        </div>

        {/* NEW MEMBER FORM */}
        <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: theme.text }}>Add New Member</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ddd' }} />
            <input placeholder="Skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ddd' }} />
            <button onClick={addPerson} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Add</button>
          </div>
        </div>

        {/* SEARCH BAR */}
<div style={{ marginBottom: '20px', width: '100%' }}>
  <input 
    type="text"
    placeholder="🔍 Search members by name or skill..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ 
      width: '100%', 
      padding: '12px', 
      borderRadius: '8px', 
      border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
      backgroundColor: darkMode ? '#2d2d2d' : '#fff',
      color: darkMode ? '#fff' : '#333',
      boxSizing: 'border-box'
    }}
  />
</div>

{/* THE LIST (Now using filteredPeople) */}
{filteredPeople.map((person) => (
  <div key={person.id} style={{ marginBottom: '25px' }}>
    <Profile name={person.name} skill={person.skill} isDark={darkMode} />
    <button 
      onClick={() => deletePerson(person.id)} 
      style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}
    >
      🗑️ Remove Member
    </button>
  </div>
))}

{/* Show "Not Found" message only if searching and no results */}
{filteredPeople.length === 0 && searchTerm !== "" && (
  <p style={{ textAlign: 'center', color: theme.subText }}>No members match "{searchTerm}"</p>
)}

        {people.length === 0 && <p style={{ textAlign: 'center', color: theme.subText }}>No members left!</p>}
      </div>
    </div>
  );
}

export default App;