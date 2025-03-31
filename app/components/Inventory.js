"use client";
import { useState } from 'react';
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiEdit,
  FiRefreshCw,
  FiArrowRight,
  FiMoreVertical
} from 'react-icons/fi';

export default function Inventory() {
  const [itemInput, setItemInput] = useState('');
  const [locations, setLocations] = useState({});
  const [locationInput, setLocationInput] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [openLocations, setOpenLocations] = useState({});

  // Helper to show the context menu
  const openContextMenu = (e, isItem, locationName, itemName = null) => {
    e.preventDefault();
    e.stopPropagation(); // Stop from toggling location
    setContextMenu({
      itemName: isItem ? itemName : null,
      locationName,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const addLocation = () => {
    if (locationInput.trim() && !locations[locationInput]) {
      setLocations((prev) => ({ ...prev, [locationInput]: {} }));
      setLocationInput('');
    }
  };

  const deleteLocation = (locationName) => {
    setLocations((prev) => {
      const updatedLocations = { ...prev };
      delete updatedLocations[locationName];
      return updatedLocations;
    });
    setContextMenu(null);
  };

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

  const addItem = (location) => {
    if (itemInput.trim()) {
      setLocations((prev) => ({
        ...prev,
        [location]: {
          ...prev[location],
          [itemInput]: (prev[location][itemInput] || 0) + 1,
        },
      }));
      setItemInput('');
    }
  };

  const renameItem = (locationName, oldItemName) => {
    const newItemName = prompt("Enter new name for item:", oldItemName);
    if (newItemName && newItemName.trim()) {
      if (locations[locationName][newItemName]) {
        alert("An item with that name already exists in this location!");
      } else {
        setLocations((prevLocations) => {
          const updatedLocationItems = { ...prevLocations[locationName] };
          updatedLocationItems[newItemName] = updatedLocationItems[oldItemName];
          delete updatedLocationItems[oldItemName];
          return {
            ...prevLocations,
            [locationName]: updatedLocationItems,
          };
        });
      }
    }
  };

  const deleteItem = (locationName, itemName) => {
    setLocations((prevLocations) => {
      const updatedLocationItems = { ...prevLocations[locationName] };
      delete updatedLocationItems[itemName];
      return {
        ...prevLocations,
        [locationName]: updatedLocationItems,
      };
    });
  };

  const increaseItemQuantity = (locationName, itemName) => {
    setLocations((prevLocations) => ({
      ...prevLocations,
      [locationName]: {
        ...prevLocations[locationName],
        [itemName]: prevLocations[locationName][itemName] + 1,
      },
    }));
  };

  const decreaseItemQuantity = (locationName, itemName) => {
    setLocations((prevLocations) => ({
      ...prevLocations,
      [locationName]: {
        ...prevLocations[locationName],
        [itemName]: Math.max(0, prevLocations[locationName][itemName] - 1),
      },
    }));
  };

  const changeItemQuantity = (locationName, itemName) => {
    const currentQuantity = locations[locationName][itemName];
    const newQuantityStr = prompt("Enter new quantity for item:", currentQuantity);
    if (newQuantityStr !== null) {
      const newQuantity = parseInt(newQuantityStr, 10);
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        setLocations((prevLocations) => ({
          ...prevLocations,
          [locationName]: {
            ...prevLocations[locationName],
            [itemName]: newQuantity,
          },
        }));
      } else {
        alert("Invalid quantity");
      }
    }
  };

  const toggleDropdown = (locationName) => {
    setOpenLocations((prev) => ({
      ...prev,
      [locationName]: !prev[locationName],
    }));
  };

  const moveItem = (oldLocation, itemName) => {
    const newLocation = prompt("Enter the new location for this item:");
    if (newLocation && locations[newLocation]) {
      setLocations((prevLocations) => {
        const updatedLocations = { ...prevLocations };
        const quantity = updatedLocations[oldLocation][itemName];
        // Remove from the old location
        const updatedOldLocation = { ...updatedLocations[oldLocation] };
        delete updatedOldLocation[itemName];
        updatedLocations[oldLocation] = updatedOldLocation;

        // Add to the new location
        const updatedNewLocation = { ...updatedLocations[newLocation] };
        updatedNewLocation[itemName] = (updatedNewLocation[itemName] || 0) + quantity;
        updatedLocations[newLocation] = updatedNewLocation;
        return updatedLocations;
      });
    } else {
      alert("Invalid location name.");
    }
  };

  // Handler to close the context menu when clicking outside of it
  const handleOverlayClick = () => {
    setContextMenu(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Inventory</h2>

      {/* Add location form */}
      <div style={{ marginBottom: "10px", display: 'flex', gap: '0.5rem' }}>
        <input
          type='text'
          placeholder='Add location...'
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          style={{
            flex: 1,
            fontSize: '1rem',
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={addLocation}
          style={{
            fontSize: '1.1rem',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#28a745',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <FiPlus style={{ fontSize: '1.2rem' }} />
          Add
        </button>
      </div>

      {/* Scrollable container for locations */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: "flex", flexDirection: "column", gap: '10px' }}>
          {Object.keys(locations).map((location) => (
            <div
              key={location}
              style={{
                border: "1px solid #ccc",
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: "200px",
                userSelect: "none",
              }}
            >
              {/* LOCATION HEADER */}
              <div
                // The entire header is clickable to toggle
                onClick={() => toggleDropdown(location)}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: '#555',
                  color: '#fff',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',  // <--- entire header is clickable
                }}
              >
                {/* Left side with arrow & location name */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{openLocations[location] ? "▲" : "▼"}</span>
                  <span>{location}</span>
                </div>

                {/* 3-dot menu button for location actions */}
                <button
                  onClick={(e) => openContextMenu(e, false, location)}
                  onMouseDown={(e) => e.stopPropagation()} 
                  // ^ ensures that pressing this button won't toggle dropdown
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '1.2rem',
                  }}
                  title="More actions"
                >
                  <FiMoreVertical />
                </button>
              </div>

              {/* LOCATION DROPDOWN CONTENT */}
              {openLocations[location] && (
                <div style={{ padding: "10px", borderTop: '1px solid #ccc' }}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addItem(location);
                    }}
                    style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
                  >
                    <input
                      type="text"
                      placeholder="Add item..."
                      value={itemInput}
                      onChange={(e) => setItemInput(e.target.value)}
                      style={{
                        flex: 1,
                        fontSize: '1rem',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        fontSize: '1rem',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <FiPlus style={{ fontSize: '1.2rem' }} />
                      Add
                    </button>
                  </form>

                  {/* ITEMS */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {Object.keys(locations[location]).map((item, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{item}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {/* 3-dot menu for item */}
                          <button
                            onClick={(e) => openContextMenu(e, true, location, item)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              color: '#666',
                            }}
                            title="Item actions"
                          >
                            <FiMoreVertical />
                          </button>

                          {/* Decrease / quantity / Increase */}
                          <button
                            onClick={() => decreaseItemQuantity(location, item)}
                            style={{
                              fontSize: '1.1rem',
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <FiMinus />
                          </button>
                          <span style={{ minWidth: '20px', textAlign: 'center' }}>
                            {locations[location][item]}
                          </span>
                          <button
                            onClick={() => increaseItemQuantity(location, item)}
                            style={{
                              fontSize: '1.1rem',
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <FiPlus />
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
      </div>

      {contextMenu && (
        <>
          {/* OVERLAY: clicking it closes the menu */}
          <div
            onClick={handleOverlayClick}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'transparent',
              zIndex: 999,
            }}
          />
          {/* CONTEXT MENU */}
          <div
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: '6px',
              padding: "0.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              zIndex: 1000,
            }}
          >
            {contextMenu.itemName ? (
              /* ITEM MENU */
              <>
                <button
                  title="Delete Item"
                  onClick={() => deleteItem(contextMenu.locationName, contextMenu.itemName)}
                  style={menuButtonStyle("#dc3545")}
                >
                  <FiTrash2 style={{ fontSize: '1.2rem' }} />
                  Delete Item
                </button>
                <button
                  title="Rename Item"
                  onClick={() => renameItem(contextMenu.locationName, contextMenu.itemName)}
                  style={menuButtonStyle("#fd7e14")}
                >
                  <FiEdit style={{ fontSize: '1.2rem' }} />
                  Rename Item
                </button>
                <button
                  title="Change Quantity"
                  onClick={() => changeItemQuantity(contextMenu.locationName, contextMenu.itemName)}
                  style={menuButtonStyle("#28a745")}
                >
                  <FiRefreshCw style={{ fontSize: '1.2rem' }} />
                  Change Qty
                </button>
                <button
                  title="Move"
                  onClick={() => moveItem(contextMenu.locationName, contextMenu.itemName)}
                  style={menuButtonStyle("#007bff")}
                >
                  <FiArrowRight style={{ fontSize: '1.2rem' }} />
                  Move
                </button>
              </>
            ) : (
              /* LOCATION MENU */
              <>
                <button
                  title="Delete Location"
                  onClick={() => deleteLocation(contextMenu.locationName)}
                  style={menuButtonStyle("#dc3545")}
                >
                  <FiTrash2 style={{ fontSize: '1.2rem' }} />
                  Delete Location
                </button>
                <button
                  title="Rename Location"
                  onClick={() => renameLocation(contextMenu.locationName)}
                  style={menuButtonStyle("#fd7e14")}
                >
                  <FiEdit style={{ fontSize: '1.2rem' }} />
                  Rename Location
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Helper style function for context menu buttons
 */
function menuButtonStyle(bgColor) {
  return {
    fontSize: '1rem',
    background: bgColor,
    color: "white",
    border: "none",
    borderRadius: '4px',
    padding: "0.5rem 0.75rem",
    margin: "0.25rem 0",
    cursor: "pointer",
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };
}
