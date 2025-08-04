const express = require('express');
const router = express.Router();
const multer = require('multer');
const Helper = require('../models/helper');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.post(
  '/',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'kycDocument', maxCount: 1 },
    { name: 'otherDocument', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        services,
        organization,
        languages,
        gender,
        phonePrefix,
        phoneNumber,
        vehicleType,
        vehicleNumber,
        kycDocType,
        otherDocType
      } = req.body;

      const newHelper = new Helper({
        fullName,
        email,
        services: JSON.parse(services || '[]'),
        organization,
        languages: JSON.parse(languages || '[]'),
        gender,
        phonePrefix,
        phoneNumber,
        vehicleType,
        vehicleNumber,
        kycDocType,
        otherDocType,
        photo: req.files['photo']?.[0]?.path,
        kycDocument: req.files['kycDocument']?.[0]?.path,
        otherDocument: req.files['otherDocument']?.[0]?.path
      });

      await newHelper.save();
      res.status(201).json({ message: 'Helper saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save helper' });
    }
  }
);

module.exports = router;
