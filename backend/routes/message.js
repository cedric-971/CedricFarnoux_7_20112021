const express = require("express");
const router = express.Router();

const messageCtrl = require("../controllers/message");
//const auth = require("../middleware/auth");


router.post('/new', messageCtrl.createMessage);
router.get('/',messageCtrl.listMessages);

module.exports = router;