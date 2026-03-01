const pool = require('../config/db');

const getHistorique = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT h.*, u.nom AS acteur
       FROM historique_statuts h
       LEFT JOIN utilisateurs u ON h.acteur_id = u.id
       WHERE h.reclamation_id = $1
       ORDER BY h.created_at ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const addCommentaire = async (req, res) => {
  const { id } = req.params;
  const { commentaire } = req.body;
  const acteur_id = req.user.id;
  try {
    const current = await pool.query('SELECT statut FROM reclamations WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }
    const statut = current.rows[0].statut;
    await pool.query(
      `INSERT INTO historique_statuts (reclamation_id, nouveau_statut, acteur_id, commentaire)
       VALUES ($1, $2, $3, $4)`,
      [id, statut, acteur_id, commentaire]
    );
    res.status(201).json({ message: 'Commentaire ajouté' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getHistorique, addCommentaire };