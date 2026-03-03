const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, actif) 
       VALUES ($1, $2, $3, 'personnel_stb', false) RETURNING id, nom, email, role, actif`,
      [nom, email, hashedPassword]
    );
    res.status(201).json({
      message: 'Inscription réussie ! Votre compte est en attente de validation par un administrateur.',
      user: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    if (!user.actif) {
      return res.status(403).json({ message: 'Votre compte est en attente de validation par un administrateur.' });
    }
    const token = jwt.sign(
      { id: user.id, nom: user.nom, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      message: 'Connexion réussie',
      token,
      role: user.role,
      nom: user.nom,
      id: user.id
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { register, login };