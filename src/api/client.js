// src/api/client.js
// Central API client — all fetch calls go through here.

const BASE_URL = "https://mp-2-server.vercel.app/api";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      // future: add auth token here when we have login implemented
      // "Authorization": `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${message}`);
  }

  return res.json();
}

export const apiClient = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: "DELETE" }),
};