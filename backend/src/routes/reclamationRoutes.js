const express = require('express');
const router = express.Router();
const {
  createReclamation,
  getAllReclamations,
  getMyReclamations,
  getReclamationById,
  updateStatut,
  assignTechnicien
} = require('../controllers/reclamationController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, verifyRole('personnel_stb'), createReclamation);
router.get('/', verifyToken, verifyRole('technicien', 'admin'), getAllReclamations);
router.get('/mes-reclamations', verifyToken, verifyRole('personnel_stb'), getMyReclamations);
router.get('/:id', verifyToken, getReclamationById);
router.put('/:id/statut', verifyToken, verifyRole('technicien'), updateStatut);
router.put('/:id/assign', verifyToken, verifyRole('technicien'), assignTechnicien);

module.exports = router;