# Quote_Generator
Full-stack Quote Generator using Node.js, Express, and XML with features like random quotes, category filtering, search, and real-time statistics.

🚀 Full-Stack Quote Generator

A dynamic full-stack web application that allows users to view, search, and manage quotes using a Node.js backend and XML-based storage.

---

📌 Features

- 🎲 Get a random quote
- 📚 View all quotes
- 🔍 Search quotes by text or author
- 🏷 Filter quotes by category
- ➕ Add new quotes (stored in XML)
- 📊 View statistics (total quotes, top authors, categories)
- 🌐 Fetch quotes from external API

---

🛠 Tech Stack

Frontend

- HTML5
- CSS3
- JavaScript (Vanilla JS)

Backend

- Node.js
- Express.js

Data Handling

- XML (using xml2js parser)

---

📂 Project Structure

Quote_Generator/
│
├── server.js          # Backend server (Node.js + Express)
├── quotes.xml         # XML database
├── public/
│   ├── index.html     # Frontend UI
│   ├── style.css      # Styling
│   └── script.js      # Client-side logic
│
├── package.json
└── README.md

---

⚙️ Installation & Setup

1. Clone the repository

git clone https://github.com/your-username/Quote_Generator.git
cd Quote_Generator

2. Install dependencies

npm install

3. Run the server

node server.js

4. Open in browser

http://localhost:3000

---

🔌 API Endpoints

Method| Endpoint| Description
GET| /api/quotes| Get all quotes
GET| /api/quotes/random| Get random quote
POST| /api/quotes| Add new quote
GET| /api/quotes/category/:category| Filter by category
GET| /api/quotes/search?q=term| Search quotes
GET| /api/stats| Get statistics
GET| /health| Server status

---

📊 Example Features Explained

1. Random Quote

Fetches a random quote from XML data using server-side logic.

2. XML Storage

Quotes are stored and managed in an XML file instead of a database.

3. Search Functionality

Allows searching quotes using keywords in text or author name.

4. Statistics Dashboard

Displays:

- Total quotes
- Category distribution
- Top authors

---

💡 Learning Outcomes

- Understanding REST API design
- Working with XML in Node.js
- Full-stack integration (Frontend + Backend)
- Handling asynchronous operations
- Building interactive UI without frameworks

---

⚠️ Limitations

- No authentication (anyone can add quotes)
- XML is not scalable for large data
- No database used

---

🚀 Future Improvements

- Replace XML with MongoDB
- Add user authentication
- Improve UI with React
- Add edit/delete functionality
- Deploy online (Render / Vercel)

---

👩‍💻 Author

- Nishtha Bhange

---

📜 License

This project is for academic purposes.
