import Contact from "../models/contactSchema.js";

export const createContact = async(req, res) => {
    try {
        const {name, email, subject, message} = req.body
        const contact = new Contact({name, email, subject, message})
        await contact.save()
        res.status(201).json({ message: "Thank you for reaching out to us. We will contact you soon."})
    } catch (error) {
        res.status(500).json({ message: "Cannot create the contact. Please try again...", message })
    }
}

export const getContacts = async(req, res) => {
    try {
        const contacts = await Contact.find()
        res.status(200).json({ contacts })
    } catch (error) {
        res.status(500).json({ message: "Cannot get the contacts. Please try again..."})
    }
}

export const deleteContacts = async(req, res) => {
    try {
        const id = req.params.id
        const contact = await Contact.findByIdAndDelete(id)
        if(!contact)
            return res.status(404).json({ message: "Contact does not exist." })
        res.status(200).json({ message: "Contact deleted successfully.", contact })
    } catch (error) {
        res.status(500).json({ message: "Cannot delete the contact. Tru again..." })
    }
}