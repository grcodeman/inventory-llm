"use client";
import { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [itemInput, setItemInput] = useState('');
  const [locations, setLocations] = useState({});
  const [locationInput, setLocationInput] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [openLocations, setOpenLocations] = useState({});

  const addLocation = () => {
    if (locationInput.trim() && !locations[locationInput]) {
      setLocations({ ...locations, [locationInput]: {} });
      setLocationInput("");
    }
  };

  const deleteLocation = (locationName) => {
    setLocations((prev) => {
      const updatedLocations = { ...prev };
      delete updatedLocations[locationName];
      return updatedLocations;
    });
    setContextMenu(null); // hide menu after deleting
  };

  // Rename location function
  const renameLocation = (locationName) => {
    const newLocationName = prompt("Enter new name for location:", locationName);
    if (newLocationName && newLocationName.trim()) {
      setLocations((prev) => {
        const updatedLocations = { ...prev };
        updatedLocations[newLocationName] = updatedLocations[locationName];
        delete updatedLocations[locationName];
        return updatedLocations;
      });
    }
  };

  // Add item function
  const addItem = (location) => {
    if (itemInput.trim()) {
      setLocations((prev) => ({
        ...prev,
        [location]: {
          ...prev[location],
          [itemInput]: (prev[location][itemInput] || 0) + 1, // Add 1 or initialize to 1
        },
      }));
      setItemInput('');
    }
  };

  // Handle context menu for items
  const handleItemContextMenu = (e, locationName, itemName) => {
    e.preventDefault();
    setContextMenu({
      locationName,
      itemName,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Handle context menu for location (only for the name)
  const handleLocationContextMenu = (e, locationName) => {
    e.preventDefault();
    setContextMenu({
      locationName,
      itemName: null, // No item name, as it's for the location itself
      x: e.clientX,
      y: e.clientY,
    });
  };
  //rename item function
  const renameItem = (locationName, oldItemName) => {
    const newItemName = prompt("Enter new name for item:", oldItemName);
    
    if (newItemName && newItemName.trim()) {
      // Check if the new item name already exists in the same location
      if (locations[locationName][newItemName]) {
        alert("An item with that name already exists in this location!");
      } else {
        setLocations((prevLocations) => {
          const updatedLocationItems = { ...prevLocations[locationName] };
          updatedLocationItems[newItemName] = updatedLocationItems[oldItemName];
          delete updatedLocationItems[oldItemName];
          return {
            ...prevLocations,
            [locationName]: updatedLocationItems, // Update the location with new items
          };
        });
      }
    }
  };

  // Delete item function
  const deleteItem = (locationName, itemName) => {
    setLocations((prevLocations) => {
      const updatedLocationItems = { ...prevLocations[locationName] };
      delete updatedLocationItems[itemName]; // Remove item from location
      return {
        ...prevLocations,
        [locationName]: updatedLocationItems, // Update the location
      };
    });
  };

  // Increase item quantity
  const increaseItemQuantity = (locationName, itemName) => {
    setLocations((prevLocations) => ({
      ...prevLocations,
      [locationName]: {
        ...prevLocations[locationName],
        [itemName]: prevLocations[locationName][itemName] + 1,
      },
    }));
  };

  // Decrease item quantity (minimum 0)
  const decreaseItemQuantity = (locationName, itemName) => {
    setLocations((prevLocations) => ({
      ...prevLocations,
      [locationName]: {
        ...prevLocations[locationName],
        [itemName]: Math.max(0, prevLocations[locationName][itemName] - 1),
      },
    }));
  };

  const toggleDropdown = (locationName) => {
    setOpenLocations((prev) => ({
      ...prev,
      [locationName]: !prev[locationName],
    }));
  };

  return (
    <div style={{ padding: '1rem', height: '100%' }}>
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
              onContextMenu={(e) => handleLocationContextMenu(e, location)} // Right-click on location name
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
                <form onSubmit={(e) => { e.preventDefault(); addItem(location); }}>
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
                  {Object.keys(locations[location]).map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                      onContextMenu={(e) => handleItemContextMenu(e, location, item)} // Right-click on item name
                    >
                      <span>{item}</span>
                      <div>
                        <button
                          onClick={() => decreaseItemQuantity(location, item)}
                          style={{ marginRight: "5px" }}
                        >
                          -
                        </button>
                        <span>{locations[location][item]}</span>
                        <button
                          onClick={() => increaseItemQuantity(location, item)}
                          style={{ marginLeft: "5px" }}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Context menu for location or item */}
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
          onMouseLeave={() => setContextMenu(null)}
        >
          {contextMenu.itemName ? (
            <>
              <button
                onClick={() => deleteItem(contextMenu.locationName, contextMenu.itemName)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                Delete Item
              </button>
              <button
                onClick={() => renameItem(contextMenu.locationName, contextMenu.itemName)}
                style={{
                  background: "orange",
                  color: "white",
                  border: "none",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                Rename Item
              </button>
            </>
          ) : (
            <>
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
                Delete Location
              </button>
              <button
                onClick={() => renameLocation(contextMenu.locationName)}
                style={{
                  background: "orange",
                  color: "white",
                  border: "none",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                Rename Location
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
