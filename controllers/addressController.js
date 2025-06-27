import Address from "../models/AddressSchema.js";

export const createAddress = async(req, res) => {
    try {
        const {userID} = req.body
        if(!req.user._id.equals(userID))
            return res.status(401).json({ message: "Not Authorized." })
        const address = new Address(req.body)
        await address.save()
        res.status(201).json({ message: "Address created successfully.", address })
    } catch (error) {
        res.status(500).json({ message: "Cannot create this address." })
    }
}

export const getAddresses = async(req, res) => {
    try {
        const id = req.params.id
        if(!req.user._id.equals(id))
            return res.status(401).json({ message: "Not Authorized." })
        const addresses = await Address.find({userID: id})
        const homeAddress = addresses.find((address) => address.addressType === "Home")
        const officeAddress = addresses.find((address) => address.addressType === "Office")
        const otherAddresses = addresses.filter((address) => address.addressType === "Other")
        res.status(200).json({ message: "Address retrieved successfully.", homeAddress, officeAddress, otherAddresses })
    } catch (error) {
        res.status(500).json({ message: "Cannot get the address." })   
    }
}

export const getSingleAddress = async(req, res) => {
    try {
        const id = req.params.id
        const address = await Address.findById(id)
        if(!address)
            return res.status(404).json({ message: "Address does not found." })
        res.status(200).json({ address })
    } catch (error) {
        res.status(500).json({ message: "Cannot get the address" })
    }
}

export const editAddress = async(req, res) => {
    try {
        const id = req.params.id
        const address = await Address.findByIdAndUpdate(id, req.body.data, {new: true})
        if(!address) 
            return res.status(404).json({ message: "Address does not found." })
        res.status(200).json({ message: "Address updated successfully.", address })
    } catch (error) {
        res.status(500).json({ message: "Cannot edit the address." })
    }
}

export const deleteAddress = async(req, res) => {
    try {
        const id = req.params.id
        const address = await Address.findByIdAndDelete(id)
        if(!address) 
            return res.status(404).json({ message: "Address does not found." })
        res.status(200).json({ message: "Address Deleted Successfully.", address })        
    } catch (error) {
        res.status(500).json({ message: "Cannot delete the address" })
    }
}