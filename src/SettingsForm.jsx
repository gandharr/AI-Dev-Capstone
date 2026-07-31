import React, { useState } from 'react';

export default function SettingsForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving:", name, email);
    alert("Saved!");
  };

  return (
    <div className="settings-form">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
