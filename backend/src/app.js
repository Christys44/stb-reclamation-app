const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reclamationRoutes = require('./routes/reclamationRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reclamations', reclamationRoutes);
app.use('/api/historique', historiqueRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🚀 API STB Réclamation opérationnelle' });
});

// Route temporaire pour initialiser la base de données
app.get('/api/init-db', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        mot_de_passe VARCHAR(255) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'technicien', 'personnel_stb')) NOT NULL,
        actif BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reclamations (
        id SERIAL PRIMARY KEY,
        titre VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        categorie VARCHAR(50) NOT NULL,
        priorite VARCHAR(20) CHECK (priorite IN ('basse', 'moyenne', 'haute', 'critique')) DEFAULT 'moyenne',
        statut VARCHAR(20) CHECK (statut IN ('nouvelle', 'en_cours', 'en_attente', 'resolue', 'cloturee')) DEFAULT 'nouvelle',
        created_by INTEGER REFERENCES utilisateurs(id),
        assigned_to INTEGER REFERENCES utilisateurs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS historique_statuts (
        id SERIAL PRIMARY KEY,
        reclamation_id INTEGER REFERENCES reclamations(id),
        ancien_statut VARCHAR(20),
        nouveau_statut VARCHAR(20) NOT NULL,
        acteur_id INTEGER REFERENCES utilisateurs(id),
        commentaire TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.json({ message: '✅ Tables créées avec succès !' });
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});