const express = require('express');
const router = express.Router();
const { getHistorique, addCommentaire } = require('../controllers/historiqueController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/:id', verifyToken, getHistorique);
router.post('/:id/commentaire', verifyToken, verifyRole('technicien'), addCommentaire);

module.exports = router;