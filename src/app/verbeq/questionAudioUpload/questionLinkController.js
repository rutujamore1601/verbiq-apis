// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const questionLinkAudioModel = require("./questionLinkAudioModel");
// const studentRegistrationModel = require("../studentRegistration/studentRegistration.model");
// const mongoose = require("mongoose");

// const baseDirectory = path.resolve(__dirname, "../../../../public/Qaudio");

// // Use memory storage first to process the request body
// const storage = multer.memoryStorage();

// const uploadQaudio = multer({
//   storage,
//   limits: { fileSize: 1024 * 1024 * 20 }, // 20MB limit
// });

// const audioUpload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         status: 400,
//         error: "Bad Request",
//         message: "No file uploaded",
//       });
//     }

//     const { questionId, userId, typeId } = req.body;

//     if (!questionId || !userId || !typeId) {
//       return res.status(400).json({
//         status: 400,
//         error: "Bad Request",
//         message: "Missing questionId, userId, or typeId",
//       });
//     }

//     const Student = await studentRegistrationModel.findOne({_id : userId});
//     console.log('Student', Student)

//     if (!Student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     const userName = `${userId}_${Student.firstName}`

//     const userFolder =  path.join(baseDirectory, userName);
//     if (!fs.existsSync(userFolder)) {
//       fs.mkdirSync(userFolder, { recursive: true });
//     }

//     const filePath = path.join(userFolder, req.file.originalname);
//     fs.writeFileSync(filePath, req.file.buffer);

//     const audioUrl = `${req.protocol}://${req.get("host")}/Qaudio/${userName}/${req.file.originalname}`;

//     // Save to MongoDB
//     const newAudioEntry = new questionLinkAudioModel({
//       userId: mongoose.Types.ObjectId(userId),
//       typeId: mongoose.Types.ObjectId(typeId),
//       questionId: mongoose.Types.ObjectId(questionId),
//       audioUrl: audioUrl,
//     });

//     await newAudioEntry.save();

//     res.status(200).json({
//       status: 200,
//       message: "Audio uploaded successfully",
//       audioUrl,
//       questionId,
//       userId,
//       typeId,
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({
//       status: 500,
//       error: "Internal Server Error",
//       message: "Something went wrong",
//     });
//   }
// };

// module.exports = {
//   audioUpload,
//   uploadQaudio,
// };


const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();

const uploadQaudio = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // 20MB limit
});


const audioUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "No file uploaded",
      });
    }

    const { questionId, userId, typeId } = req.body;

    if (!questionId || !userId || !typeId) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "Missing questionId, userId, or typeId",
      });
    }

    // Convert Buffer to Stream
    const formData = new FormData();
    formData.append("file", streamifier.createReadStream(req.file.buffer), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("questionId", questionId);
    formData.append("userId", userId);
    formData.append("typeId", typeId);

    const response = await axios.post("http://35.200.143.247:8080/upload_audio/", formData, {
      headers: formData.getHeaders(),
    });
    console.log('response', response)

    return res.status(200).json({
      status: 200,
      message: "Audio uploaded successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Something went wrong",
    });
  }
};

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/questionAudioLink");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.originalname}`);
  },
});

const uploadProfile = multer({
  storage: storage2,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});


const questionAudioUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "No file uploaded",
      });
    }
    const imageUrls = `${req.protocol}://${req.get("host")}/questionAudioLink/${req.file.originalname}`;
    console.log("imageUrls", imageUrls);

    res.status(200).json({
      status: 200,
      message: "Image(s) uploaded successfully",
      imageUrls,
    });
  } catch (error) {
    console.log("error", error);
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: "File too large",
        });
      }
    } else {
      res.status(500).json({
        status: 500,
        error: "Internal Server Error",
        message: "Something went wrong",
      });
    }
  }
};

module.exports = {
  audioUpload,
  uploadQaudio,
  questionAudioUpload,
  uploadProfile
};

