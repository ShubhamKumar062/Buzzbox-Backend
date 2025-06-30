const Group = require('../model/group');
module.exports.createGroup = async (req, res) => {
  const { name, description, location } = req.body;
  if (!name || !description || !location?.coordinates) {
    return res.status(400).json({
      message: "All fields (name, description, location) are required",
    });
  }
  try {
    const newGroup = new Group({
      name,
      description,
      admin: req.user.id, 
      location,
    });
    const group = await newGroup.save();
    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (err) {
    console.error("Group Creation Error:", err.message);
    res.status(500).json({ message: "Server error while creating group" });
  }
};

module.exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({
      message: "All groups fetched successfully",
      count: groups.length,
      groups,
    });
  } catch (err) {
    console.error("Group Fetch Error:", err.message);
    res.status(500).json({ message: "Server error while fetching groups" });
  }
};

module.exports.getGroupById = async (req, res) => {
  const groupId = req.params.id;
  try {
    const groupExists = await Group.findById(groupId);
    if (!groupExists) {
      return res.status(400).json({ message: "Group does not exist" });
    }
    res.status(200).json({
      message: "Group fetched successfully",
      groupExists,
    });
  } catch (err) {
    console.error("Group Fetch by ID Error:", err.message);
    res.status(500).json({ message: "Server error while fetching group" });
  }
};

module.exports.getNearbyGroups = async (req, res) => {
  const { coordinates } = req.location || {};
  if (!coordinates || coordinates.length !== 2) {
    return res.status(400).json({ message: "Invalid location data" });
  }
  try {
    const nearbyGroups = await Group.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates
          },
          $maxDistance: 10000 
        }
      }
    });
    res.status(200).json({
      message: "Nearby groups fetched successfully",
      count: nearbyGroups.length,
      groups: nearbyGroups
    });
  } catch (err) {
    console.error("Nearby group fetch error:", err.message);
    res.status(500).json({ message: "Server error fetching nearby groups" });
  }
};
