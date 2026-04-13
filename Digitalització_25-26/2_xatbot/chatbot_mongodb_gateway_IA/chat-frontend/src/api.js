const API_URL = "http://localhost:3000";

export async function sendMessage(userId, message) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, message }),
  });
  return res.json();
}

export async function getHistory(userId) {
  const res = await fetch(`${API_URL}/history/${userId}`);
  return res.json();
}
