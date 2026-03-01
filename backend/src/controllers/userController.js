const pool = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nom, email, role, actif, created_at FROM utilisateurs ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, email, role, actif } = req.body;
  try {
    const result = await pool.query(
      `UPDATE utilisateurs SET nom=$1, email=$2, role=$3, actif=$4 
       WHERE id=$5 RETURNING id, nom, email, role, actif`,
      [nom, email, role, actif, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE utilisateurs SET actif=FALSE WHERE id=$1', [id]);
    res.json({ message: 'Utilisateur désactivé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };