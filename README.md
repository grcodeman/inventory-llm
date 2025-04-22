This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Inventory LLM
Our web app contains an inventory management tool and an ai chat bot feature that can read and update your inventory.

Here is an example screenshot where the user has a basic food inventory system on the left with a chatbot that is able to reference the users inventory and create api call blocks that we prompt engineered.
![Alt text](/screenshots/testing.webp "Example demo of inventory management being used to track a user's fridge, along with a chatbot example that is able to read the current inventory, as well as create inventory changes through api calls.")

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
