const express = require('express');
const router = express.Router();
const multer = require('multer');
const Helper = require('../models/helper');
const fs = require('fs');
const Counter = require('../models/counter');
const EmployeeSummary = require('../models/helperSummary');

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


async function getNextEmployeeId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'employee' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const idNumber = 10000 + counter.seq;
  return 'EMP' + idNumber;
}

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

      const employeeId = await getNextEmployeeId();

      const newHelper = new Helper({
        employeeId,
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

      const newEmployeeSummary = new EmployeeSummary({
        employeeId,
        fullName,
        services,
        photo: req.files['photo']?.[0]?.path
      })

      newEmployeeSummary.save();

      res.status(201).json({ message: 'Helper and Helper Summary saved successfully', employeeId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save helper' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const helpersList = await EmployeeSummary.find();
    console.log(helpersList)
    res.json(helpersList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch helpers' });
  }
});

router.get('/:employeeId', async(req,res) => {
    try {
        const {employeeId} = req.params;
        const helper = await Helper.find({employeeId: employeeId})
        
        console.log("sent data"+helper)
        res.status(200).json({data: helper});
    } catch (error) {
        res.status(500).json({ err: 'EmployeeId not found'});
    }
})


router.patch('/:employeeId', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'kycDocument', maxCount: 1 },
    { name: 'otherDocument', maxCount: 1 }]), async (req, res) => {

    const { employeeId } = req.params;

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

      const existingHelper = await Helper.findOne({ employeeId });

      if (!existingHelper) {
        return res.status(404).json({ message: 'Helper not found' });
      }

      const updatedFields = {
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
      };

      const updatedHelper = await Helper.findOneAndUpdate(
        { employeeId },
        updatedFields,
        { new: true }
      );

      await EmployeeSummary.findOneAndUpdate(
        { employeeId },
        {
          fullName,
          services: JSON.parse(services || '[]'),
          photo: updatedFields.photo
        }
      );

      res.status(200).json({ message: 'Helper updated successfully', updatedHelper });

    } catch (error) {
      console.error('Error updating helper:', error);
      res.status(500).json({ message: 'Failed to update helper' });
    }
  }
);


router.delete('/:employeeId', async (req,res) => {
    try {
        const {employeeId} = req.params;
        const helper = await Helper.deleteMany({employeeId: employeeId});
        const helperSummary = await EmployeeSummary.deleteMany({employeeId: employeeId});
        console.log(helper.acknowledged)
        res.status(200).json({ message: helper.acknowledged+" "+helperSummary.acknowledged})
    } catch (error) {
        res.status(500).json({ err: 'Error occured' });
    }
    
})

module.exports = router;
