const express = require("express");
const router = express.Router();
const commentCtrl = require('../controllers/comment');








router.post('/new', commentCtrl.createComment);

module.exports = router;