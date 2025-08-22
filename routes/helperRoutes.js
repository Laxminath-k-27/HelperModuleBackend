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
    const uniqueName = file.originalname;
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
        services,
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
        otherDocument: req.files['otherDocument']?.[0]?.path,
        joinedDate: new Date()
      });

      const newHelperResult =await newHelper.save();

      const newEmployeeSummary = new EmployeeSummary({
        employeeId,
        fullName,
        services,
        photo: req.files['photo']?.[0]?.path,
        phoneNumber
      })

      await newEmployeeSummary.save();

      res.status(201).json(newHelperResult);
    } catch (error) {
      
      res.status(500).json({ error: 'Failed to save helper' });
    }
  }
);

router.get('/', async (req, res) => {
  const { sortBy = "employeeId"} = req.query;
  try {
    const helpersList = await EmployeeSummary.find().sort({ [sortBy]: 1 });
    
    res.json(helpersList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch helpers' });
  }
});

router.get('/:employeeId', async(req,res) => {
  try {
    const { employeeId } = req.params;
    const helper = await Helper.find({ employeeId: employeeId })
    
    res.status(200).json({ data: helper });
  } catch (error) {
    res.status(500).json({ err: 'EmployeeId not found'});
  }
})

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/search/filter', async (req,res) => {
  try {
    const { searchString = "", sortBy = "employeeId" } = req.query;
    let { services = "", organizations = "" } = req.query;

    const regex = searchString ? new RegExp( escapeRegex( searchString ) , "i") : null;

    services = services.split(",").filter(Boolean);
    organizations = organizations.split(",").filter(Boolean);

    const andConditions = [];

    if(services.length){
      andConditions.push({ services: { $in: services } });
    }

    if(organizations.length){
      andConditions.push({ organization: { $in: organizations } });
    }

    if(regex){
      andConditions.push({
        $or: [
          { employeeId: { $regex: regex } },
          { fullName: { $regex: regex } },
          { phoneNumber: { $regex: regex } }
        ]
      });
    }

    const matchStage = andConditions.length > 0 ? { $and: andConditions } : {};

    const sortStage = {};
    sortStage[sortBy] = 1

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          _id: 0,
          employeeId: 1,
          fullName: 1,
          services: 1,
          organization: 1,
          photo: 1,
          phoneNumber: 1
        }
      },
      { $sort: sortStage }
    ];

    console.log("Pipeline:", JSON.stringify(pipeline, null, 2));

    const results = await Helper.aggregate(pipeline);
    console.log(results);

    res.status(200).json(results);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


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


      console.log('Request Body:', req.body);
      console.log('Files:', req.files);

      const existingHelper = await Helper.findOne({ employeeId });

      if (!existingHelper) {
        return res.status(404).json({ message: 'Helper not found' });
      }

      const updatedFields = {
        fullName,
        email,
        services,
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
        otherDocument: req.files['otherDocument']?.[0]?.path || ''
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
          services,
          photo: updatedFields.photo,
          phoneNumber
        }
      );

      res.status(200).json({ message: 'Helper updated successfully', updatedHelper });

    } catch (error) {

      res.status(500).json({ message: 'Failed to update helper' });

    }
  }
);


router.delete('/:employeeId', async (req,res) => {
  try {
    const {employeeId} = req.params;

    const helper = await Helper.deleteMany({employeeId: employeeId});

    const helperSummary = await EmployeeSummary.deleteMany({employeeId: employeeId});

    res.status(200).json({ message: helper.acknowledged+" "+helperSummary.acknowledged})

  } catch (error) {

    res.status(500).json({ err: 'Error occured' });

  }
})

module.exports = router;
