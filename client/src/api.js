const API_URL = 'http://localhost:5000/api';

export const api = async (endpoint, method = 'GET', data, token) => {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  };
  const res = await fetch(`${API_URL}${endpoint}`, opts);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'API error');
  return json;
};