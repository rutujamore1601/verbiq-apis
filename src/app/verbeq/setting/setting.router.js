
const router = require("express").Router();
const settingController = require('./setting.controller');

// Create Operation - Create setting
router.post('/createSetting', settingController.createSetting);

// Read Operation - Get all setting
router.get('/getAllSetting', settingController.getAllSetting);

// Read Operation - Get all setting by Id 
router.get("/getAllSettingById/:id", settingController.getAllSettingById);

// Read Operation - Get a single setting by Id
router.get('/getSettingById/:id', settingController.getSettingById);

// Update Operation - Update setting
router.put('/updateSetting/:id', settingController.updateSetting);

// Delete Operation - Delete setting
router.delete('/deleteSetting/:id', settingController.deleteSetting);

module.exports = router;
