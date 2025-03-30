"use client";
import { useState } from 'react';

export default function TodoList() {
  const [itemInput, setItemInput] = useState('');
  const [locations, setLocations] = useState({});
  const [locationInput, setLocationInput] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [openLocations, setOpenLocations] = useState({});

  // Add a new location if it doesn't already exist
  const addLocation = () => {
    if (locationInput.trim() && !locations[locationInput]) {
      setLocations({ ...locations, [locationInput]: [] });
      setLocationInput("");
    }
  };

  // Delete a location and hide the context menu
  const deleteLocation = (locationName) => {
    setLocations((prev) => {
      const updatedLocations = { ...prev };
      delete updatedLocations[locationName];
      return updatedLocations;
    });
    setContextMenu(null);
  };
//rename the location
  const renameLocation = (oldName) => {
    const newName = prompt("Enter new name for location:", oldName);
    if (newName && newName.trim() && !locations[newName]) {
      setLocations((prev) => {
        const updatedLocations = { ...prev };
        updatedLocations[newName] = updatedLocations[oldName];
        delete updatedLocations[oldName];
        return updatedLocations;
      });
    } else if (newName && locations[newName]) {
      alert("Location name already exists!");
    }
  };

  // Show context menu at mouse position
  const handleContextMenu = (e, locationName) => {
    e.preventDefault();
    setContextMenu({
      locationName,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Add an item to a specific location
  const addItem = (e, location) => {
    e.preventDefault();
    if (itemInput.trim()) {
      setLocations((prev) => ({
        ...prev,
        [location]: [...prev[location], itemInput],
      }));
      setItemInput('');
    }
  };

  // Delete an item from a specific location
  const deleteItem = (location, index) => {
    setLocations((prev) => ({
      ...prev,
      [location]: prev[location].filter((_, i) => i !== index),
    }));
  };

  // Toggle the dropdown for a location
  const toggleDropdown = (locationName) => {
    setOpenLocations((prev) => ({
      ...prev,
      [locationName]: !prev[locationName],
    }));
  };

  return (
    <div style={{ padding: '1rem', height: '100%', position: 'relative' }}>
      <h2>Inventory</h2>
      
      {/* Add location form */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type='text'
          placeholder='Add location...'
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
        <button onClick={addLocation}>Add</button>
      </div>
      
      {/* Display locations */}
      <div style={{ display: "flex", flexDirection: "column", gap: '10px', flexWrap: 'wrap' }}>
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
              }}
            >
              <span>{location}</span>
              <span>{openLocations[location] ? "▲" : "▼"}</span>
            </div>
            {/* Dropdown Content (hidden if closed) */}
            {openLocations[location] && (
              <div style={{ padding: "10px" }}>
                <form onSubmit={(e) => addItem(e, location)}>
                  <input
                    type="text"
                    placeholder="Add item..."
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                  />
                  <button type="submit">Add</button>
                </form>

                {/* List of items in location */}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {locations[location].map((item, index) => (
                    <li 
                      key={index} 
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{item}</span>
                      <button onClick={() => deleteItem(location, index)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Context menu */}
{contextMenu && (
  <div
    style={{
      background: "white",
      border: "1px solid gray",
      padding: "5px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
      zIndex: 1000,
      position: "absolute",
      top: contextMenu.y,
      left: contextMenu.x,
    }}
    onMouseLeave={() => setContextMenu(null)} // Hide context menu on mouse leave
  >
    <button
      onClick={() => deleteLocation(contextMenu.locationName)}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "5px",
        cursor: "pointer",
        marginBottom: "5px", // Adding space between buttons
      }}
    >
      Delete
    </button>
    <button
      onClick={() => renameLocation(contextMenu.locationName)} // Use locationName, not oldName
      style={{
        background: "orange",
        color: "white",
        border: "none",
        padding: "5px",
        cursor: "pointer",
      }}
    >
      Rename
    </button>
  </div>
)}
    </div>
  );
}