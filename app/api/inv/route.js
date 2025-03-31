// app/api/inv/route.js
import { NextResponse } from 'next/server';

/**
 * This is a simple in-memory store for demonstration.
 * In a real app, you would connect to a database here.
 */
let inMemoryLocations = {};

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case 'GET_ALL':
        // Return the entire locations object as JSON
        return NextResponse.json({ locations: inMemoryLocations });

      case 'ADD_LOCATION': {
        const locName = payload?.trim();
        if (locName && !inMemoryLocations[locName]) {
          inMemoryLocations[locName] = {};
        }
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'DELETE_LOCATION': {
        const { locationName } = payload;
        delete inMemoryLocations[locationName];
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'RENAME_LOCATION': {
        const { oldName, newName } = payload;
        if (newName && newName.trim()) {
          inMemoryLocations[newName] = inMemoryLocations[oldName];
          delete inMemoryLocations[oldName];
        }
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'ADD_ITEM': {
        const { location, itemName } = payload;
        if (itemName && itemName.trim()) {
          const current = inMemoryLocations[location] || {};
          current[itemName] = (current[itemName] || 0) + 1;
          inMemoryLocations[location] = current;
        }
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'DELETE_ITEM': {
        const { location, item } = payload;
        const current = inMemoryLocations[location];
        delete current[item];
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'RENAME_ITEM': {
        const { location, oldItem, newItem } = payload;
        if (inMemoryLocations[location][newItem]) {
          return NextResponse.json({ locations: inMemoryLocations, error: 'Item already exists!' });
        }
        inMemoryLocations[location][newItem] = inMemoryLocations[location][oldItem];
        delete inMemoryLocations[location][oldItem];
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'CHANGE_QTY': {
        const { location, item, newQty } = payload;
        if (newQty >= 0) {
          inMemoryLocations[location][item] = newQty;
        }
        return NextResponse.json({ locations: inMemoryLocations });
      }

      case 'MOVE_ITEM': {
        const { oldLocation, itemName, newLocation } = payload;
        if (!inMemoryLocations[newLocation]) {
          return NextResponse.json({ locations: inMemoryLocations, error: 'Invalid location name.' });
        }
        const qty = inMemoryLocations[oldLocation][itemName];
        delete inMemoryLocations[oldLocation][itemName];

        if (!inMemoryLocations[newLocation][itemName]) {
          inMemoryLocations[newLocation][itemName] = 0;
        }
        inMemoryLocations[newLocation][itemName] += qty;

        return NextResponse.json({ locations: inMemoryLocations });
      }

      default:
        return NextResponse.json({ error: 'Invalid action', locations: inMemoryLocations }, { status: 400 });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}
