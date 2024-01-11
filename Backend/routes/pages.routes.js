const express = require('express');
const router = express.Router();
const { addPages, deletePages, reorderPages } = require('../controllers/pages.controller');

router.post('/add', addPages);
router.post('/delete', deletePages);
router.post('/reorder', reorderPages);


module.exports = router;