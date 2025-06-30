module.exports = (req, res, next) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ msg: "Invalid or missing coordinates" });
  }

  req.location = {
    type: 'Point',
    coordinates: [lng, lat],
  };
  next();
};
