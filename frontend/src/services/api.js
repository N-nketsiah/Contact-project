import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/contacts';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const contactAPI = {
  // Get all contacts
  getAllContacts: () => api.get(''),
  
  // Get contact by ID
  getContactById: (id) => api.get(`/${id}`),
  
  // Create new contact
  createContact: (contactData) => api.post('', contactData),
  
  // Update contact
  updateContact: (id, contactData) => api.put(`/${id}`, contactData),
  
  // Delete contact
  deleteContact: (id) => api.delete(`/${id}`),
  
  // Search contacts
  searchContacts: (searchTerm) => api.get('/search', { params: { q: searchTerm } })
};

export default api;
