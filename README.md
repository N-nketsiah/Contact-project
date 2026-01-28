# Contact Manager App

A modern contact management app with a polished React UI and a Spring Boot API.

## Features

✨ **Core Functionality**
- ✅ Add new contacts with name, email, phone, and address
- ✅ View all contacts in an attractive card layout
- ✅ Search contacts by name, email, or phone number
- ✅ Edit existing contacts
- ✅ Delete contacts
- ✅ Sorting (recently updated/added, name A–Z/Z–A)
- ✅ Filters (e.g., “With Address”)
- ✅ Export contacts to CSV

⭐ **Power Features**
- ✅ Favorites & pinned contacts
- ✅ Bulk select + multi-delete
- ✅ Per-contact notes
- ✅ “Last touched” activity tracking

🎨 **User Experience**
- Clean, professional visual design
- Responsive layout (desktop, tablet, mobile)
- Smooth animations and transitions
- Form validation with inline errors
- Success notifications for actions

## Getting Started

### Prerequisites
- Node.js (for the React frontend)
- Java (for the Spring Boot backend)

### Quick Start (Recommended)
See `QUICKSTART.md` for the fastest path to run both frontend and backend.

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

The frontend expects the API at `http://localhost:8080/api/contacts`.

## Project Structure

```
Contact-Project/
├── backend/        # Spring Boot API
├── frontend/       # React + Tailwind UI
└── README.md       # This file
```

## How to Use

### Adding a Contact
1. Fill in the form fields: Name, Email, Phone (required), and Address (optional)
2. Click "Add Contact" button
3. Contact appears in the list below

### Searching Contacts
- Type in the search bar to filter contacts by name, email, or phone
- Results update instantly as you type

### Favorites & Pinned
- Use the star to favorite and the bookmark to pin contacts
- Pinned and favorites float to the top

### Notes & Activity
- Add notes directly on the contact card
- “Last touched” updates when editing, favoriting, pinning, or changing notes

### Bulk Delete
1. Select multiple contacts using the checkboxes
2. Click “Delete Selected”

### Export CSV
- Click “Export CSV” to download the current contact list

### Editing a Contact
1. Click the "Edit" button on any contact card
2. Modify the contact details in the modal
3. Click "Save Changes" to update

### Deleting a Contact
1. Click the "Delete" button on any contact card
2. Confirm the deletion when prompted

## Technical Details

- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: Spring Boot REST API
- **Data**: CRUD API with in-memory/local DB (see `SETUP.md` for configuration)
- **Client metadata**: Notes, favorites, pinned, last-touched stored in LocalStorage

## Features at a Glance

| Feature | Status |
|---------|--------|
| Add Contacts | ✅ |
| View Contacts | ✅ |
| Search/Filter | ✅ |
| Edit Contacts | ✅ |
| Delete Contacts | ✅ |
| Bulk Delete | ✅ |
| Favorites / Pinned | ✅ |
| Notes | ✅ |
| Last Touched | ✅ |
| Export CSV | ✅ |
| Responsive Design | ✅ |
| Form Validation | ✅ |

## License

This project is open source and available under the MIT License.

---

**Created:** January 2026  
**Version:** 2.0.0
