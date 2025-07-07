import Charges from "../models/chargesSchema.js";

export const addCharge = async (req, res) => {
  try {
    const { name, chargePercent } = req.body;
    const isChargeExists = await Charges.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if(isChargeExists)
        return res.status(400).json({ message: "This charge is already existing." })
    const charge = await Charges.insertOne({ name, chargePercent })
    res.status(201).json({ message: "Charge created successfully.", charge })
  } catch (error) {
    return res.status(500).json({ message: "Cannot create charge." })
  }
};

export const getCharges = async(req, res) => {
    try {
        const charges = await Charges.find()
        res.status(200).json(charges)
    } catch (error) {
        return res.status(500).json({ message: "Cannot get the charges." })
    }
}

export const updateCharge = async(req, res) => {
    try {
        const {id, name, chargePercent} = req.body
        const charge = await Charges.findByIdAndUpdate( id, {name: name, chargePercent:chargePercent }, {new: true})
        res.status(200).json({ message: "Charge details updated successfully.", charge })
    } catch (error) {
        res.status(500).json({ message: "Cannot update the status." })
    }
}

export const deleteCharge = async(req, res) => {
  try {
    const id = req.params.id
    await Charges.findByIdAndDelete(id)
    res.status(200).json({ message: "Charge Deleted Successfully.", id: id })
  } catch (error) {
    res.status(500).json({ message: "Cannot delete the status." }) 
  }
}
