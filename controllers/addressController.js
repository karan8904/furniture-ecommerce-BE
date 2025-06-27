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