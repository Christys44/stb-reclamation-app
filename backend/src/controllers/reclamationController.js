const pool = require('../config/db');

const createReclamation = async (req, res) => {
  const { titre, description, categorie, priorite } = req.body;
  const created_by = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO reclamations (titre, description, categorie, priorite, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titre, description, categorie, priorite, created_by]
    );
    const reclamation = result.rows[0];
    await pool.query(
      `INSERT INTO historique_statuts (reclamation_id, nouveau_statut, acteur_id, commentaire)
       VALUES ($1, $2, $3, $4)`,
      [reclamation.id, 'nouvelle', created_by, 'Réclamation créée']
    );
    res.status(201).json({ message: 'Réclamation créée', reclamation });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getAllReclamations = async (req, res) => {
  const { statut, priorite, categorie } = req.query;
  try {
    let query = `
      SELECT r.*, 
        u1.nom AS createur, 
        u2.nom AS technicien
      FROM reclamations r
      LEFT JOIN utilisateurs u1 ON r.created_by = u1.id
      LEFT JOIN utilisateurs u2 ON r.assigned_to = u2.id
      WHERE 1=1
    `;
    const params = [];
    if (statut) { params.push(statut); query += ` AND r.statut = $${params.length}`; }
    if (priorite) { params.push(priorite); query += ` AND r.priorite = $${params.length}`; }
    if (categorie) { params.push(categorie); query += ` AND r.categorie = $${params.length}`; }
    query += ' ORDER BY r.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getMyReclamations = async (req, res) => {
  const created_by = req.user.id;
  try {
    const result = await pool.query(
      `SELECT r.*, u.nom AS technicien
       FROM reclamations r
       LEFT JOIN utilisateurs u ON r.assigned_to = u.id
       WHERE r.created_by = $1
       ORDER BY r.created_at DESC`,
      [created_by]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getReclamationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, 
        u1.nom AS createur, 
        u2.nom AS technicien
       FROM reclamations r
       LEFT JOIN utilisateurs u1 ON r.created_by = u1.id
       LEFT JOIN utilisateurs u2 ON r.assigned_to = u2.id
       WHERE r.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const updateStatut = async (req, res) => {
  const { id } = req.params;
  const { statut, commentaire } = req.body;
  const acteur_id = req.user.id;
  try {
    const current = await pool.query('SELECT statut FROM reclamations WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }
    const ancien_statut = current.rows[0].statut;
    const result = await pool.query(
      `UPDATE reclamations SET statut = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [statut, id]
    );
    await pool.query(
      `INSERT INTO historique_statuts (reclamation_id, ancien_statut, nouveau_statut, acteur_id, commentaire)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, ancien_statut, statut, acteur_id, commentaire]
    );
    res.json({ message: 'Statut mis à jour', reclamation: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const assignTechnicien = async (req, res) => {
  const { id } = req.params;
  const acteur_id = req.user.id;
  try {
    const result = await pool.query(
      `UPDATE reclamations SET assigned_to = $1, statut = 'en_cours', updated_at = NOW()
       WHERE id = $2 AND statut = 'nouvelle' RETURNING *`,
      [acteur_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Réclamation non disponible' });
    }
    await pool.query(
      `INSERT INTO historique_statuts (reclamation_id, ancien_statut, nouveau_statut, acteur_id, commentaire)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, 'nouvelle', 'en_cours', acteur_id, 'Prise en charge par le technicien']
    );
    res.json({ message: 'Réclamation prise en charge', reclamation: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  createReclamation,
  getAllReclamations,
  getMyReclamations,
  getReclamationById,
  updateStatut,
  assignTechnicien
};