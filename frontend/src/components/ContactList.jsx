import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { contactAPI } from '../services/api';
import ContactForm from './ContactForm';
import ContactCard from './ContactCard';
import SearchBar from './SearchBar';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('updatedDesc');
  const [filterHasAddress, setFilterHasAddress] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [notes, setNotes] = useState({});
  const [lastTouched, setLastTouched] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('contactMeta');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setFavorites(parsed.favorites || []);
      setPinned(parsed.pinned || []);
      setNotes(parsed.notes || {});
      setLastTouched(parsed.lastTouched || {});
    } catch (err) {
      console.warn('Failed to load contact meta:', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'contactMeta',
      JSON.stringify({ favorites, pinned, notes, lastTouched })
    );
  }, [favorites, pinned, notes, lastTouched]);

  useEffect(() => {
    const idSet = new Set(contacts.map((contact) => String(contact.id)));
    setFavorites((prev) => prev.filter((id) => idSet.has(String(id))));
    setPinned((prev) => prev.filter((id) => idSet.has(String(id))));
    setNotes((prev) => {
      const next = {};
      Object.keys(prev).forEach((id) => {
        if (idSet.has(String(id))) next[id] = prev[id];
      });
      return next;
    });
    setLastTouched((prev) => {
      const next = {};
      Object.keys(prev).forEach((id) => {
        if (idSet.has(String(id))) next[id] = prev[id];
      });
      return next;
    });
    setSelectedIds((prev) => prev.filter((id) => idSet.has(String(id))));
  }, [contacts]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactAPI.getAllContacts();
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (err) {
      setError('Failed to load contacts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      try {
        const response = await contactAPI.searchContacts(term);
        setFilteredContacts(response.data);
      } catch (err) {
        setError('Search failed. Please try again.');
      }
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      const response = await contactAPI.createContact(contactData);
      const createdId = response?.data?.id;
      if (createdId) {
        setLastTouched((prev) => ({
          ...prev,
          [String(createdId)]: new Date().toISOString()
        }));
      }
      setSuccess('Contact added successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setShowForm(false);
      await fetchContacts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to add contact.';
      setError(errorMessage);
    }
  };

  const handleUpdateContact = async (contactData) => {
    try {
      const response = await contactAPI.updateContact(editingContact.id, contactData);
      const updatedId = response?.data?.id ?? editingContact?.id;
      if (updatedId) {
        setLastTouched((prev) => ({
          ...prev,
          [String(updatedId)]: new Date().toISOString()
        }));
      }
      setSuccess('Contact updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setEditingContact(null);
      setShowForm(false);
      await fetchContacts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update contact.';
      setError(errorMessage);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactAPI.deleteContact(id);
        const normalizedId = String(id);
        setFavorites((prev) => prev.filter((favId) => String(favId) !== normalizedId));
        setPinned((prev) => prev.filter((pinId) => String(pinId) !== normalizedId));
        setNotes((prev) => {
          const next = { ...prev };
          delete next[normalizedId];
          return next;
        });
        setLastTouched((prev) => {
          const next = { ...prev };
          delete next[normalizedId];
          return next;
        });
        setSelectedIds((prev) => prev.filter((selectedId) => String(selectedId) !== normalizedId));
        setSuccess('Contact deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
        await fetchContacts();
      } catch (err) {
        setError('Failed to delete contact.');
      }
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const toggleFavorite = (id) => {
    const normalizedId = String(id);
    setFavorites((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((favId) => favId !== normalizedId)
        : [normalizedId, ...prev]
    );
    setLastTouched((prev) => ({
      ...prev,
      [normalizedId]: new Date().toISOString()
    }));
  };

  const togglePinned = (id) => {
    const normalizedId = String(id);
    setPinned((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((pinId) => pinId !== normalizedId)
        : [normalizedId, ...prev]
    );
    setLastTouched((prev) => ({
      ...prev,
      [normalizedId]: new Date().toISOString()
    }));
  };

  const handleNoteChange = (id, value) => {
    const normalizedId = String(id);
    setNotes((prev) => ({
      ...prev,
      [normalizedId]: value
    }));
    setLastTouched((prev) => ({
      ...prev,
      [normalizedId]: new Date().toISOString()
    }));
  };

  const toggleSelect = (id) => {
    const normalizedId = String(id);
    setSelectedIds((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((selectedId) => selectedId !== normalizedId)
        : [...prev, normalizedId]
    );
  };

  const handleSelectAll = () => {
    if (displayContacts.length === 0) return;
    const allIds = displayContacts.map((contact) => String(contact.id));
    const isAllSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(isAllSelected ? [] : allIds);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected contacts?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => contactAPI.deleteContact(id)));
      setSuccess(`${selectedIds.length} contacts deleted.`);
      setTimeout(() => setSuccess(null), 3000);
      setSelectedIds([]);
      await fetchContacts();
    } catch (err) {
      setError('Failed to delete selected contacts.');
    }
  };

  const handleExportCSV = () => {
    const rows = displayContacts.map((contact) => ({
      Name: contact.name ?? '',
      Email: contact.email ?? '',
      Phone: contact.phone ?? '',
      Address: contact.address ?? '',
      CreatedAt: contact.createdAt ?? '',
      UpdatedAt: contact.updatedAt ?? ''
    }));

    const headers = Object.keys(rows[0] || {
      Name: '',
      Email: '',
      Phone: '',
      Address: '',
      CreatedAt: '',
      UpdatedAt: ''
    });

    const csvLines = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
          .join(',')
      )
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLatestActivity = () => {
    if (!contacts.length) return null;
    let latest = null;
    contacts.forEach(contact => {
      const raw = contact.updatedAt || contact.createdAt;
      if (!raw) return;
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return;
      if (!latest || date > latest) {
        latest = date;
      }
    });
    return latest;
  };

  const formatShortDate = (date) => {
    if (!date) return '—';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalContacts = contacts.length;
  const uniqueDomains = new Set(
    contacts
      .map(contact => contact.email?.split('@')[1])
      .filter(Boolean)
  ).size;
  const lastActivity = getLatestActivity();

  const pinnedSet = new Set(pinned.map((id) => String(id)));
  const favoriteSet = new Set(favorites.map((id) => String(id)));

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aId = String(a.id);
    const bId = String(b.id);
    const aPinned = pinnedSet.has(aId);
    const bPinned = pinnedSet.has(bId);
    if (aPinned !== bPinned) return aPinned ? -1 : 1;
    const aFav = favoriteSet.has(aId);
    const bFav = favoriteSet.has(bId);
    if (aFav !== bFav) return aFav ? -1 : 1;
    if (sortOption === 'nameAsc') return a.name.localeCompare(b.name);
    if (sortOption === 'nameDesc') return b.name.localeCompare(a.name);
    if (sortOption === 'createdDesc') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

  const displayContacts = sortedContacts.filter(contact =>
    filterHasAddress ? Boolean(contact.address?.trim()) : true
  );

  return (
    <div className="min-h-screen app-shell">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-5 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-slate-900">
                Contact Studio
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                A recruiter-ready CRM interface with smart search, quick edits, and polished
                contact cards designed for clarity and speed.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary px-5 py-3 text-base"
                >
                  <FiPlus /> Add Contact
                </button>
                <button
                  onClick={() => fetchContacts()}
                  className="btn btn-ghost px-5 py-3 text-base"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:max-w-xl">
              <div className="stat-card">
                <span className="stat-label">Total Contacts</span>
                <span className="stat-value">{totalContacts}</span>
                <span className="muted text-sm">Across your CRM</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Email Domains</span>
                <span className="stat-value">{uniqueDomains}</span>
                <span className="muted text-sm">Unique companies</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Last Activity</span>
                <span className="stat-value text-lg">{formatShortDate(lastActivity)}</span>
                <span className="muted text-sm">Latest update</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex justify-between items-center animate-rise">
            <span className="font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 text-2xl font-bold">×</button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-medium animate-rise">
            ✓ {success}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Add Contact Card */}
              <div className="glass-card p-6">
                <h2 className="section-title mb-4">
                  {editingContact ? 'Edit Contact' : 'New Contact'}
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  {editingContact ? 'Update details and keep relationships fresh.' : 'Capture new connections in seconds.'}
                </p>
                {showForm || editingContact ? (
                  <div>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingContact(null);
                      }}
                      className="mb-4 text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      ← Cancel
                    </button>
                    <ContactForm
                      onSubmit={editingContact ? handleUpdateContact : handleAddContact}
                      initialData={editingContact}
                      isEditing={!!editingContact}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full btn btn-primary py-3 text-base font-semibold"
                  >
                    <FiPlus /> Add Contact
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} value={searchTerm} />
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="btn btn-ghost text-sm"
                >
                  {displayContacts.length > 0 && displayContacts.every((contact) => selectedIds.includes(String(contact.id)))
                    ? <FiCheckSquare />
                    : <FiSquare />}
                  {selectedIds.length > 0 ? 'Clear Selection' : 'Select All'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterHasAddress(!filterHasAddress)}
                  className={`btn ${filterHasAddress ? 'btn-primary' : 'btn-ghost'} text-sm`}
                >
                  {filterHasAddress ? '✓ With Address' : 'With Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterHasAddress(false);
                    setSearchTerm('');
                    setFilteredContacts(contacts);
                  }}
                  className="btn btn-ghost text-sm"
                >
                  Clear Filters
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="glass-card px-4 py-2 flex items-center gap-2">
                  <label htmlFor="sort" className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Sort
                  </label>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="updatedDesc">Recently Updated</option>
                    <option value="createdDesc">Recently Added</option>
                    <option value="nameAsc">Name A–Z</option>
                    <option value="nameDesc">Name Z–A</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="btn btn-ghost text-sm"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="mb-6 glass-card px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-rise">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{selectedIds.length}</span> selected
                </p>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="btn btn-danger text-sm"
                >
                  <FiTrash2 /> Delete Selected
                </button>
              </div>
            )}

            {/* Contacts Grid */}
            {loading ? (
              <div className="card p-12 text-center animate-rise">
                <p className="text-slate-500 text-lg">Loading contacts...</p>
              </div>
            ) : displayContacts.length === 0 ? (
              <div className="card p-12 text-center animate-rise">
                <p className="text-slate-600 text-lg mb-2">
                  {searchTerm || filterHasAddress ? '🔍 No contacts match your filters' : '📭 No contacts yet'}
                </p>
                <p className="text-slate-500">
                  {searchTerm || filterHasAddress ? 'Try adjusting your search or filters' : 'Create your first contact to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayContacts.map((contact, index) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={handleEdit}
                    onDelete={handleDeleteContact}
                    onToggleFavorite={toggleFavorite}
                    onTogglePin={togglePinned}
                    isFavorite={favoriteSet.has(String(contact.id))}
                    isPinned={pinnedSet.has(String(contact.id))}
                    note={notes[String(contact.id)] || ''}
                    onNoteChange={handleNoteChange}
                    lastTouched={lastTouched[String(contact.id)]}
                    selected={selectedIds.includes(String(contact.id))}
                    onSelect={toggleSelect}
                    style={{ animationDelay: `${index * 70}ms` }}
                  />
                ))}
              </div>
            )}

            {/* Stats */}
            {!loading && displayContacts.length > 0 && (
              <div className="mt-10 text-center">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{displayContacts.length}</span> of <span className="font-semibold text-slate-900">{contacts.length}</span> contact{contacts.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactList;
