import React from 'react';
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin, FiStar, FiBookmark, FiClock } from 'react-icons/fi';

function ContactCard({
  contact,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  isFavorite,
  isPinned,
  note,
  onNoteChange,
  lastTouched,
  selected,
  onSelect,
  style
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const formatTouched = (value) => {
    if (!value) return 'Not touched yet';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not touched yet';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const emailDomain = contact.email?.split('@')[1];

  return (
    <div className="card p-6 animate-rise" style={style}>
      {/* Contact Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(contact.id)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
            aria-label={`Select ${contact.name}`}
          />
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-semibold">
            {getInitials(contact.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
            <p className="text-sm text-slate-500">ID · {contact.id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTogglePin(contact.id)}
              className={`p-2 rounded-xl border ${isPinned ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-400 hover:text-slate-700'}`}
              aria-label={isPinned ? 'Unpin contact' : 'Pin contact'}
            >
              <FiBookmark />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(contact.id)}
              className={`p-2 rounded-xl border ${isFavorite ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'border-slate-200 text-slate-400 hover:text-slate-700'}`}
              aria-label={isFavorite ? 'Unfavorite contact' : 'Favorite contact'}
            >
              <FiStar />
            </button>
          </div>
          {emailDomain && (
            <span className="badge text-[10px] tracking-widest">
              {emailDomain}
            </span>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4 mb-6">
        {/* Email */}
        <div className="flex items-center gap-3">
          <FiMail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Email</p>
            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700 font-medium break-all text-sm">
              {contact.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <FiPhone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Phone</p>
            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              {contact.phone}
            </a>
          </div>
        </div>

        {/* Address */}
        {contact.address && (
          <div className="flex items-start gap-3">
            <FiMapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Address</p>
              <p className="text-slate-900 font-medium text-sm">{contact.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="mb-6 pt-5 border-t border-slate-100">
        <p className="text-xs text-slate-500 mb-1">
          <span className="font-semibold">Created:</span> {formatDate(contact.createdAt)}
        </p>
        {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
          <p className="text-xs text-slate-500">
            <span className="font-semibold">Updated:</span> {formatDate(contact.updatedAt)}
          </p>
        )}
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
          <FiClock className="text-slate-400" />
          <span className="font-semibold">Last touched:</span> {formatTouched(lastTouched)}
        </p>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Notes</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(contact.id, e.target.value)}
          placeholder="Add a quick note, agenda, or relationship context..."
          rows="3"
          className="form-input mt-2 bg-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(contact)}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm transition flex items-center justify-center gap-2"
        >
          <FiEdit2 className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-medium text-sm transition flex items-center justify-center gap-2"
        >
          <FiTrash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}

export default ContactCard;
