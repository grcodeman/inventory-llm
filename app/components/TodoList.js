"use client";
import { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [locations, setLocations] = useState({});
  const [locationInput, setLocationInput] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [openLocations, setOpenLocations] = useState({})

  const addLocation = () => {
    if (locationInput.trim() && !locations[locationInput]){
      setLocations({ ...locations, [locationInput]: []});
      setLocationInput("")
    }
  }
  const deleteLocation = (locationName) => {
    setLocations((prev) => {
      const updatedLocations = { ...prev };
      delete updatedLocations[locationName];
      return updatedLocations;
    });
    setContextMenu(null); //hide menu after deleting
  };
  const handleContextMenu = (e, locationName) => {
    e.preventDefault();
    setContextMenu({
      locationName,
      x: e.clientx,
      y: e.clienty,
    })
  }
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput('');
    }
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const toggleDropdown = (locationName) => {
    setOpenLocations((prev) => ({
      ...prev,
      [locationName]: !prev[locationName],
    }));
  };

  return (
    <div style={{ padding: '1rem', height: '100%' }}>
      <h2>Invetory</h2>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo, index) => (
          <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{todo}</span>
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
      {/*add location form*/}
      <div style={{marginBottom: "10px"}}>
        <input
        type='text'
        placeholder='Add location...'
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        />
        <button onClick={addLocation}>add</button>
      </div>
      {/* Display locations*/}
      <div style={{display: "flex", flexDirection: "column", gap: '10px', flexWrap: 'wrap'}}>
        {Object.keys(locations).map((location) => (
          <div
          key={location}
          onContextMenu={(e) => handleContextMenu(e, location)}
          style={{
            border: "2px solid gray",
            minWidth: "200px",
            cursor: "pointer",
            userSelect: "none",
          }}
          >
            {/* Location Header (expand/collapse) */}
            <div
            onClick={() => toggleDropdown(location)}
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span>{location}</span>
              <span>{openLocations[location] ? "▲" : "▼"}</span>
            </div>
            {/* Dropdown Content (hidden if closed) */}
            {openLocations[location] && (
              <div
              style={{
                padding: "10px",
              }}
              >
                <p>(items will go here)</p>
                </div>
            )}
            </div>
        ))}

      </div>
      {/*context menu */}
      {contextMenu && (
        <div
        style={{
          background: "white",
          border:"1px solid gray",
          padding: "5px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
        >
          <button
          onClick={() => deleteLocation(contextMenu.locationName)}
          style={{
            background: "red",
              color: "white",
              border: "none",
              padding: "5px",
              cursor: "pointer",
          }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
