This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Inventory LLM

A sleek web app combining:

- **Inventory Management**  
  Keep track of your items across locations in real time.  
- **AI Chatbot Interface**  
  Ask to read or modify your inventory via natural language—behind the scenes it generates the right API calls.

---

### 📸 Demo

![Inventory + Chatbot demo](/screenshots/testing.webp)  
*Example: a basic food inventory on the left, with our chatbot on the right reading your fridge contents and crafting API‑call blocks.*

---

### 📦 Available API Calls

Your assistant can use the following operations to update the inventory:

- **`create(name, amt, loc)`**  
  Create a new item called `name` with quantity `amt` at location `loc`.  
- **`delete(item)`**  
  Remove an existing inventory item.  
- **`move(item, fromLoc, toLoc)`**  
  Move an item from one location to another.  
- **`set(item, amt)`**  
  Override an item’s quantity to `amt`.  
- **`change(item, delta)`**  
  Increase or decrease an item’s quantity by `delta`.  

Whenever the bot proposes changes, it will:

1. Summarize the intended adjustments for the user.  
2. List each API call in `{ … }` notation, parsed into a block by our UI.  
3. Ask you to confirm before applying them by pressing check.  


## Getting Started

Create a **.env.local** file in the root dir and place your nebius key:
```text
NEBIUS_API_KEY=your_key_here
```

Download the required packages
```bash
npm install
```

Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to test the project.
