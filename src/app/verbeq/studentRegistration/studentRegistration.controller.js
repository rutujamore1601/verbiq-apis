const studentRegistrationModel = require("./studentRegistration.model");
const commonUtils = require("../../../shared/utils/common.util");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../shared/utils/email");
const bcrypt = require("bcrypt");

require("dotenv").config();

console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

// Create Operation - Create studentRegistration
const createStudentRegistration = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    const { password, confirmPassword, email } =
      req.body;

    const existingUser = await studentRegistrationModel.findOne({
      email: email,
      password: password
    });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: `User with this email ${email} already exists!` });
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        status: 400,
        message: "password and confirmPassword is not matched..",
      });
      return;
    }

    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "12h" }
    );

    const register = await studentRegistrationModel.create({
      ...req.body,
      token
    });

    if (!register) {
      res.status(400).json({ status: 400, message: "Failed to register.." });
    }

    res.status(200).json({
      data: register,
      message: "User register successfully",
      success: true,
      statusCode: 200,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while creating the studentRegistration.",
    });
  }
};

// Update Operation - Update studentRegistration
const updateStudentRegistration = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    const id = req.params.id;

    const updateProfile = await studentRegistrationModel.findByIdAndUpdate(
      id,
      req.body,
      { useFindAndModify: false }
    );

    if (!updateProfile) {
      res.status(400).send({
        message: "Failed to updated profile...",
        success: true,
        statusCode: 400,
      });
    }

    const user = await studentRegistrationModel.findById(id);
    res.status(200).send({
      data: user,
      message: "studentRegistration was updated successfully.",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error });
  }
};

const verify = async (req, res) => {
  const token = req.query._id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      res.status(400).json({ status: 400, message: "failed to verify email" });
      return;
    }

    const verifyEmail = await studentRegistrationModel.findOneAndUpdate(
      { email: decoded.email },
      { emailVerified: true },
      { new: true }
    );

    if (!verifyEmail) {
      res.status(400).json({ status: 400, message: "failed to verify email" });
      return;
    }

    res.send("Email verified successfully");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ status: 400, message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(400).json({ status: 400, message: "Token expired" });
    } else {
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
};

// Submit OTP for verification
const submitOtp = (req, res) => {
  const userData = req.body;

  if (!req.body) {
    res.status(400).send({ message: "Mobile number and OTP are required!" });
    return;
  }

  // Get the generated OTP for the provided mobile number
  const generatedOTP = generateOTP(userData.mobileNo);

  if (userData.otp === generatedOTP) {
    // OTP is correct, generate a token
    const token = commonUtils.generateToken({ mobileNo: userData.mobileNo });

    // Fetch user data from the database using mobileNo
    studentRegistrationModel.findOne(
      { mobileNo: userData.mobileNo },
      (err, user) => {
        console.log("user", user);
        if (err || !user) {
          res.status(500).send({
            message: "Error fetching user data!",
            authentication: false,
            success: false,
            statusCode: 500,
          });
          return;
        }

        // User data found, send it in the response along with the token
        res.status(200).send({
          token: token,
          userData: user,
          message: "OTP verification successful. Login successful!",
          authentication: true,
          success: true,
          statusCode: 200,
        });
      }
    );
  } else {
    // Invalid OTP
    res.status(401).send({
      message: "Invalid OTP! Please try again.",
      authentication: false,
      success: false,
      statusCode: 401,
    });
  }
};

// Read Operation - Get all studentRegistration
const getAllStudentRegistration = async (req, res) => {
  try {
    const data = await studentRegistrationModel.find();

    if (data.length > 0) {
      res.status(200).send({
        data: data,
        message: "studentRegistration Data fetched successfully!",
        success: true,
        statusCode: 200,
        totalData: data.length,
      });
    } else {
      res.status(200).send({
        data: [],
        message: "studentRegistration Data not found!",
        success: false,
        statusCode: 200,
        totalData: 0,
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving the studentRegistration Data.",
    });
  }
};

// Read Operation - Get all studentRegistration by Id
const getAllStudentRegistrationById = (req, res) => {
  const id = req.params.id;
  const condition = { _id: id };

  studentRegistrationModel
    .find(condition)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "studentRegistration fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "studentRegistration not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Retrieve the studentRegistration.",
      });
    });
};

// Read Operation - Get a single studentRegistration by Id
const getStudentRegistrationById = (req, res) => {
  const id = req.params.id;
  studentRegistrationModel
    .findById(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "studentRegistration fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: {},
          dataCount: 0,
          message: "studentRegistration not found with ID=" + id,
          status: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Retrieve the studentRegistration.",
      });
    });
};

const getStudentRegistrationByUserType = (req, res) => {
  const userType = req.params.userType;

  studentRegistrationModel
    .find({ userType: userType })
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          dataCount: 1,
          message: "Student registration fetched successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          data: {},
          dataCount: 0,
          message: "Student registration not found with userType=" + userType,
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
        success: false,
        statusCode: 500,
      });
    });
};

// Delete Operation - Delete studentRegistration
const deleteStudentRegistration = (req, res) => {
  const id = req.params.id;

  studentRegistrationModel
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "studentRegistration was deleted successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot delete studentRegistration with ID=" +
            id +
            ". Maybe studentRegistration was not found!",
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// create Operation - login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: "email and password are required." });
    return;
  }

  studentRegistrationModel
    .findOne({ email, password })
    .exec((err, data) => {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
          success: false,
          statusCode: 500,
        });
        return;
      }

      if (data) {
        const token = jwt.sign(
          { email: data.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "12h" }
        );

        studentRegistrationModel
          .findByIdAndUpdate(data._id, { token: token }, { new: true })
          .exec((err, updatedUser) => {
            if (err) {
              res.status(500).send({
                message: "Internal Server Error",
                success: false,
                statusCode: 500,
              });
              return;
            }
            res.status(200).send({
              data: data,
              message: "Login successful!",
              success: true,
              statusCode: 200,
            });
          });
      } else {
        res.status(400).send({
          message: "Login failed. Invalid email or password.",
          success: false,
          statusCode: 400,
        });
      }
    });
};

const forgetPassword = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    if (!mobileNo) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please Enter Your Mobile Number",
      });
      return;
    }
    // hii

    const studentVerification = await studentRegistrationModel.findOne({
      mobileNo: mobileNo,
    });
    console.log("studentVerification", studentVerification);
    if (!studentVerification) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: `User with Mobile No ${mobileNo} is not found`,
      });
      return;
    }

    const generateRandomOTP = () => {
      const min = 1000; // Minimum 4-digit number
      const max = 9999; // Maximum 4-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const otp = generateRandomOTP();
    const updateOtp = await studentRegistrationModel.findByIdAndUpdate(
      studentVerification._id,
      { otp: otp },
      { new: true }
    );

    if (!updateOtp) {
      res
        .status(400)
        .json({ status: 400, error: "400", message: "Failed To Send OTP" });
      return;
    }

    const result = {
      mobileNo: updateOtp.mobileNo,
      NewOTP: updateOtp.otp,
    };

    res.status(200).json({ result });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
};

const otpVerify = async (req, res) => {
  try {
    const { mobileNo, NewOTP } = req.body;
    console.log("NewOtp", NewOTP);

    // Increase the timeout to 30 seconds (30000 milliseconds)
    const studentVerification = await studentRegistrationModel
      .findOne({ mobileNo })
      .maxTimeMS(30000);

    if (!studentVerification) {
      return res.status(404).json({
        status: 404,
        error: "404",
        message: "User not found with provided mobile number",
      });
    }

    if (String(studentVerification.otp) === String(NewOTP)) {
      return res.status(200).json({
        status: 200,
        message: "OTP verification successful",
        mobileNo,
      });
    }

    return res.status(400).json({
      status: 400,
      error: "400",
      message: "Failed To Verify OTP",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      error: "500",
      message: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const verifyEmail = await studentRegistrationModel.findOne({
      email: email,
      emailVerified: true,
    });
    if (!verifyEmail) {
      res
        .status(404)
        .json({ status: 404, message: "Email is not registered.." });
      return;
    }
    const token = jwt.sign(
      {
        email: email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );
    // let localHost = "http://localhost:8080";
    let localHost = "https://frontend-verbq.onrender.com";

    // const verificationUrl = `https://www.mindbowser.com/`;
    const verificationUrl = `${localHost}/create-password/?_id=${token}`;

    console.log("verificationUrl", verificationUrl);
    let subject = "Reset Password";
    let text = "Please reset your password";
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Address</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
    
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .header {
                text-align: center;
                padding: 20px 0;
            }
    
            .header img {
                width: 50%;
                height: auto;
            }
    
            .content {
                padding: 20px;
            }
    
            .content p {
                font-size: 16px;
                line-height: 1.6;
            }
    
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px 20px;
                text-align: center;
                background-color: #ffffff;
                color: #0066cc;
                text-decoration: none;
                border-radius: 5px;
                border: #0066cc solid 1px;
                font-size: 16px;
            }
    
            .footer {
                text-align: center;
                padding: 20px 0;
                font-size: 14px;
                color: #777;
            }
    
            .social-links {
                margin: 20px 0;
            }
    
            .social-links a {
                margin: 0 10px;
                text-decoration: none;
                color: #777;
            }
    
            .social-links img {
                width: 24px;
                height: 24px;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <img src="https://avatars.githubusercontent.com/u/125542434?s=400&u=e8f162415dbe533b339a29bd9f1150e6c16f3bc8&v=4"
                    alt="verbq Logo">
            </div>
            <div class="content">
                <p>Hello, ${verifyEmail.fullName}</p>
                <p>Please click the below button to reset the password:</p>
                <a href="${verificationUrl}" class="button">Reset Password</a>

            </div>
            <div class="footer">
                <div class="social-links">
                    <a href="https://facebook.com/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook">
                    </a>
                    <a href="https://twitter.com/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter">
                    </a>
                    <a href="https://linkedin.com/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn">
                    </a>
                    <a href="https://instagram.com/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram">
                    </a>
                </div>
                &copy; 2024 verbq. All rights reserved.
            </div>
        </div>
    </body>
    
    </html>
    `;

    const sentEmail = await sendEmail(email, "verbq Reset Password", message);
    console.log("sentEmail", sentEmail);
    if (!sentEmail) {
      res
        .status(400)
        .json({ status: 400, message: "Failed to send reset password email" });
      return;
    }

    res
      .status(200)
      .json({ status: 200, message: "Email have sent to reset password" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const reset = async (req, res) => {
  const token = req.query._id;
  const { password, confirmPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      res.status(400).json({ status: 400, message: "failed to verify email" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        status: 400,
        message: "password and confirmPassword is not matching..",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatePassword = await studentRegistrationModel.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword, confirmPassword: hashedPassword },
      { new: true }
    );

    if (!updatePassword) {
      res
        .status(400)
        .json({ status: 400, message: "failed to reset password" });
      return;
    }

    res
      .status(200)
      .json({ status: 200, message: "password updated successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ status: 400, message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(400).json({ status: 400, message: "Token expired" });
    } else {
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
};

module.exports = resetPassword;

module.exports = {
  createStudentRegistration,
  getAllStudentRegistration,
  getAllStudentRegistrationById,
  getStudentRegistrationById,
  updateStudentRegistration,
  deleteStudentRegistration,
  login,
  submitOtp,
  forgetPassword,
  otpVerify,
  resetPassword,
  getStudentRegistrationByUserType,
  verify,
  reset,
};

