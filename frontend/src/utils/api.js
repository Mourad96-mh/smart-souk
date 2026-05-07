import { API_URL } from '../config';

const authHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonHeaders = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth ? authHeaders() : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur serveur');
  return data;
};

export const api = {
  get: (path, auth = false) =>
    fetch(`${API_URL}${path}`, { headers: auth ? authHeaders() : {} }).then(handle),

  post: (path, data, auth = false) =>
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: jsonHeaders(auth),
      body: JSON.stringify(data),
    }).then(handle),

  put: (path, data, auth = false) =>
    fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: jsonHeaders(auth),
      body: JSON.stringify(data),
    }).then(handle),

  patch: (path, data, auth = false) =>
    fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: jsonHeaders(auth),
      body: JSON.stringify(data),
    }).then(handle),

  delete: (path, auth = false) =>
    fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: jsonHeaders(auth),
    }).then(handle),

  upload: (formData) =>
    fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    }).then(handle),
};
