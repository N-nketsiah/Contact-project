package com.contactapp.service;

import com.contactapp.dto.ContactDTO;
import com.contactapp.entity.Contact;
import com.contactapp.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactService {
    
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    // Create a new contact
    public ContactDTO createContact(ContactDTO contactDTO) {
        if (contactRepository.findByEmail(contactDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        Contact contact = new Contact();
        contact.setName(contactDTO.getName());
        contact.setEmail(contactDTO.getEmail());
        contact.setPhone(contactDTO.getPhone());
        contact.setAddress(contactDTO.getAddress());
        
        Contact savedContact = contactRepository.save(contact);
        return convertToDTO(savedContact);
    }
    
    // Get all contacts
    @Transactional(readOnly = true)
    public List<ContactDTO> getAllContacts() {
        return contactRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get contact by ID
    @Transactional(readOnly = true)
    public ContactDTO getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        return convertToDTO(contact);
    }
    
    // Update contact
    public ContactDTO updateContact(Long id, ContactDTO contactDTO) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        
        // Check if email is already taken by another contact
        if (!contact.getEmail().equals(contactDTO.getEmail()) &&
            contactRepository.findByEmail(contactDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        contact.setName(contactDTO.getName());
        contact.setEmail(contactDTO.getEmail());
        contact.setPhone(contactDTO.getPhone());
        contact.setAddress(contactDTO.getAddress());
        
        Contact updatedContact = contactRepository.save(contact);
        return convertToDTO(updatedContact);
    }
    
    // Delete contact
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
    
    // Search contacts
    @Transactional(readOnly = true)
    public List<ContactDTO> searchContacts(String searchTerm) {
        return contactRepository.searchContacts(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Helper method to convert Entity to DTO
    private ContactDTO convertToDTO(Contact contact) {
        return new ContactDTO(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getAddress(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }
}

