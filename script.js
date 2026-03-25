// Fetch a random quote from server
async function generateQuote() {
  try {
    const res = await fetch("/api/quote");
    const data = await res.json();
    document.getElementById("quote").innerText = `"${data.text}"`;
  } catch (err) {
    document.getElementById("quote").innerText = "⚠️ Error fetching quote.";
  }
}
