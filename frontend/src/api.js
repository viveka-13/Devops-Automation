const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed with status ${response.status}`);
  }

  return result;
}
