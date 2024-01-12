const express = require('express');
const router = express.Router();
const { extractText } = require('../controllers/ocr.controller');

router.get('/extract', extractText);

module.exports = router;