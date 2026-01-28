// Contact Manager Application
class ContactManager {
    constructor() {
        this.contacts = this.loadContacts();
        this.filteredContacts = [...this.contacts];
        this.editingContactId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addContact();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchContacts(e.target.value);
        });
    }

    addContact() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !email || !phone) {
            alert('Please fill in all required fields!');
            return;
        }

        const contact = {
            id: Date.now(),
            name,
            email,
            phone,
            address,
            createdAt: new Date().toLocaleDateString()
        };

        this.contacts.push(contact);
        this.filteredContacts = [...this.contacts];
        this.saveContacts();
        this.clearForm();
        this.render();
        this.showNotification('Contact added successfully!');
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.filteredContacts = this.filteredContacts.filter(c => c.id !== id);
            this.saveContacts();
            this.render();
            this.showNotification('Contact deleted successfully!');
        }
    }

    editContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
            this.openEditModal(contact);
        }
    }

    openEditModal(contact) {
        this.editingContactId = contact.id;
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'editModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Contact</h2>
                    <button class="close-btn" onclick="document.getElementById('editModal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="editName">Name</label>
                        <input type="text" id="editName" value="${contact.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" value="${contact.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPhone">Phone</label>
                        <input type="tel" id="editPhone" value="${contact.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="editAddress">Address</label>
                        <input type="text" id="editAddress" value="${contact.address || ''}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="document.getElementById('editModal').remove()">Cancel</button>
                    <button class="btn-save" onclick="contactManager.saveEditedContact()">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    saveEditedContact() {
        const name = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const phone = document.getElementById('editPhone').value.trim();
        const address = document.getElementById('editAddress').value.trim();

        if (!name || !email || !phone) {
            alert('Please fill in all required fields!');
            return;
        }

        const contactIndex = this.contacts.findIndex(c => c.id === this.editingContactId);
        if (contactIndex !== -1) {
            this.contacts[contactIndex] = {
                ...this.contacts[contactIndex],
                name,
                email,
                phone,
                address
            };
            this.filteredContacts = [...this.contacts];
            this.saveContacts();
            this.render();
            this.editingContactId = null;
            document.getElementById('editModal').remove();
            this.showNotification('Contact updated successfully!');
        }
    }

    searchContacts(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredContacts = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(lowerQuery) ||
            contact.email.toLowerCase().includes(lowerQuery) ||
            contact.phone.includes(query)
        );
        this.render();
    }

    render() {
        const contactsList = document.getElementById('contactsList');
        const contactCount = document.getElementById('contactCount');

        contactCount.textContent = this.filteredContacts.length;

        if (this.filteredContacts.length === 0) {
            contactsList.innerHTML = '<p class="empty-message">No contacts found. Try a different search or add a new contact!</p>';
            return;
        }

        contactsList.innerHTML = this.filteredContacts.map(contact => `
            <div class="contact-card">
                <div class="contact-name">${this.escapeHtml(contact.name)}</div>
                <div class="contact-info">
                    <strong>📧 Email:</strong> ${this.escapeHtml(contact.email)}
                </div>
                <div class="contact-info">
                    <strong>📱 Phone:</strong> ${this.escapeHtml(contact.phone)}
                </div>
                ${contact.address ? `
                <div class="contact-info">
                    <strong>📍 Address:</strong> ${this.escapeHtml(contact.address)}
                </div>
                ` : ''}
                <div class="contact-actions">
                    <button class="btn-edit" onclick="contactManager.editContact(${contact.id})">Edit</button>
                    <button class="btn-delete" onclick="contactManager.deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    clearForm() {
        document.getElementById('contactForm').reset();
        document.getElementById('searchInput').value = '';
        this.filteredContacts = [...this.contacts];
    }

    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    loadContacts() {
        const saved = localStorage.getItem('contacts');
        return saved ? JSON.parse(saved) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideIn 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app
let contactManager;
document.addEventListener('DOMContentLoaded', () => {
    contactManager = new ContactManager();
});
