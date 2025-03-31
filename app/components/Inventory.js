"use client";
import { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiTrash2, FiEdit, FiRefreshCw, FiArrowRight, FiMoreVertical } from 'react-icons/fi';

export default function Inventory() {
  // Single input for adding a new location
  const [locationInput, setLocationInput] = useState("");

  // A dictionary of item inputs keyed by location
  const [itemInputs, setItemInputs] = useState({});

  // The entire map of { location => { item => quantity } }
  const [locations, setLocations] = useState({});

  const [contextMenu, setContextMenu] = useState(null);
  const [openLocations, setOpenLocations] = useState({});

  // ----------- FETCH THE CURRENT INVENTORY ON MOUNT -----------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/inv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'GET_ALL' })
        });
        const data = await res.json();
        if (data.locations) {
          setLocations(data.locations);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    })();
  }, []);

  // Helper to show the context menu
  const openContextMenu = (e, isItem, locationName, itemName = null) => {
    e.preventDefault();
    e.stopPropagation(); // Stop from toggling location

    setContextMenu({
      itemName: isItem ? itemName : null,
      locationName,
      x: e.clientX,
      y: e.clientY
    });
  };

  // -------------- API CALL HELPERS --------------
  const callAPI = async (action, payload) => {
    try {
      const res = await fetch('/api/inv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      }
      if (data.locations) {
        setLocations(data.locations); // update local state
      }
    } catch (err) {
      console.error("Error calling /api/inv:", err);
    }
  };

  // Add a new location if text is valid and not a duplicate
  const addLocation = async () => {
    await callAPI('ADD_LOCATION', locationInput);
    setLocationInput('');
  };

  // Add an item to a particular location
  const addItem = async (location) => {
    const itemName = (itemInputs[location] || "").trim();
    if (itemName) {
      await callAPI('ADD_ITEM', { location, itemName });
      setItemInputs(prev => ({ ...prev, [location]: '' }));
    }
  };

  // Rename location
  const renameLocation = async (locationName) => {
    const newLocationName = prompt("Enter new name for location:", locationName);
    if (newLocationName && newLocationName.trim()) {
      await callAPI('RENAME_LOCATION', { oldName: locationName, newName: newLocationName });
    }
  };

  // Delete location
  const deleteLocation = async (locationName) => {
    await callAPI('DELETE_LOCATION', { locationName });
    setContextMenu(null);
  };

  // Rename item
  const renameItem = async (locationName, oldItemName) => {
    const newItemName = prompt("Enter new name for item:", oldItemName);
    if (newItemName && newItemName.trim()) {
      await callAPI('RENAME_ITEM', { location: locationName, oldItem: oldItemName, newItem: newItemName });
    }
  };

  // Delete item
  const deleteItem = async (locationName, itemName) => {
    await callAPI('DELETE_ITEM', { location: locationName, item: itemName });
    setContextMenu(null);
  };

  // Increase item quantity by 1
  const increaseItemQuantity = async (locationName, itemName) => {
    // We'll just fetch the item quantity from local state, add 1, then call change qty
    const current = locations[locationName][itemName];
    const newQty = current + 1;
    await callAPI('CHANGE_QTY', { location: locationName, item: itemName, newQty });
  };

  // Decrease item quantity by 1 (min 0)
  const decreaseItemQuantity = async (locationName, itemName) => {
    const current = locations[locationName][itemName];
    const newQty = Math.max(0, current - 1);
    await callAPI('CHANGE_QTY', { location: locationName, item: itemName, newQty });
  };

  // Prompt user for new quantity
  const changeItemQuantity = async (locationName, itemName) => {
    const currentQuantity = locations[locationName][itemName];
    const newQuantityStr = prompt("Enter new quantity for item:", currentQuantity);
    if (newQuantityStr !== null) {
      const newQty = parseInt(newQuantityStr, 10);
      if (!isNaN(newQty) && newQty >= 0) {
        await callAPI('CHANGE_QTY', { location: locationName, item: itemName, newQty });
      } else {
        alert("Invalid quantity");
      }
    }
  };

  // Move an item from one location to another
  const moveItem = async (oldLocation, itemName) => {
    const newLocation = prompt("Enter the new location for this item:");
    if (newLocation) {
      await callAPI('MOVE_ITEM', { oldLocation, itemName, newLocation });
    }
  };

  // Expand/collapse location
  const toggleDropdown = (locationName) => {
    setOpenLocations((prev) => ({
      ...prev,
      [locationName]: !prev[locationName],
    }));
  };

  // Close the context menu when clicking outside
  const handleOverlayClick = () => {
    setContextMenu(null);
  };

  // A simple approach to show menu above if not enough space
  const getMenuPosition = (yPos) => {
    const assumedHeight = 180; // approximate height
    let topPos = yPos;
    if (topPos + assumedHeight > window.innerHeight) {
      topPos -= assumedHeight;
    }
    return topPos;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Inventory</h2>

      {/* FORM to allow Enter to add location */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addLocation();
        }}
        style={{ marginBottom: "10px", display: 'flex', gap: '0.5rem' }}
      >
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
          type="submit"
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
      </form>

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
              {/* LOCATION HEADER (expand/collapse) */}
              <div
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
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{openLocations[location] ? "▲" : "▼"}</span>
                  <span>{location}</span>
                </div>

                {/* 3-dot menu button for location actions */}
                <button
                  onClick={(e) => openContextMenu(e, false, location)}
                  onMouseDown={(e) => e.stopPropagation()} // don't toggle the panel
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
                  {/* FORM for adding an item to this location */}
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
                      // Unique input per location
                      value={itemInputs[location] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setItemInputs((prev) => ({
                          ...prev,
                          [location]: value
                        }));
                      }}
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
              top: getMenuPosition(contextMenu.y),
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
