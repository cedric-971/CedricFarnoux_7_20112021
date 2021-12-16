const express = require("express");
const router = express.Router();

const likeCtrl = require("../controllers/like");



router.post('/:messageId/like', likeCtrl.likePost);
router.post('/:messageId/dislike', likeCtrl.dislikePost);











module.exports = router;
