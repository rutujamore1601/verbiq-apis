
const router = require("express").Router();
const adminUserController = require('./adminUser.controller');

// Create Operation - Create adminUser
router.post('/createAdminUser', adminUserController.createAdminUser);

router.post('/login', adminUserController.login);

// Read Operation - Get all adminUser
router.get('/getAllAdminUser', adminUserController.getAllAdminUser);

// Read Operation - Get all adminUser by Id 
router.get("/getAllAdminUserById/:id", adminUserController.getAllAdminUserById);

// Read Operation - Get a single adminUser by Id
router.get('/getAdminUserById/:id', adminUserController.getAdminUserById);

// Update Operation - Update adminUser
router.put('/updateAdminUser/:id', adminUserController.updateAdminUser);

// Delete Operation - Delete adminUser
router.delete('/deleteAdminUser/:id', adminUserController.deleteAdminUser);

module.exports = router;
