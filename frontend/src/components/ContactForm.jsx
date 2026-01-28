import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

function ContactForm({ onSubmit, initialData = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[+]?[0-9]{10,}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: ''
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          className={`form-input ${errors.name ? 'input-error' : ''}`}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className={`form-input ${errors.email ? 'input-error' : ''}`}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      {/* Phone Field */}
      <div className="form-group">
        <label htmlFor="phone" className="form-label">Phone *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className={`form-input ${errors.phone ? 'input-error' : ''}`}
        />
        {errors.phone && <p className="error-message">{errors.phone}</p>}
      </div>

      {/* Address Field */}
      <div className="form-group">
        <label htmlFor="address" className="form-label">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address (optional)"
          rows="3"
          className="form-input"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiSave />
        {loading ? 'Saving...' : isEditing ? 'Update Contact' : 'Add Contact'}
      </button>
    </form>
  );
}

export default ContactForm;
