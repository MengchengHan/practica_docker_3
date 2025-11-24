const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Usar archivo físico en lugar de memoria
const dbPath = '/data/db.sqlite';  // Ruta en el volumen Docker
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Insertar datos solo si la tabla está vacía
  db.get("SELECT COUNT(*) as count FROM messages", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO messages (content) VALUES ('Hola Mundo')");
      db.run("INSERT INTO messages (content) VALUES ('Funciona!')");
      console.log('Datos iniciales insertados');
    }
  });
});

// Ruta para OBTENER mensajes (GET)
app.get('/api/message', (req, res) => {
  db.all("SELECT * FROM messages ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Ruta para CREAR mensajes (POST)
app.post('/api/message', (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'El contenido del mensaje es requerido' });
  }

  const sql = 'INSERT INTO messages (content) VALUES (?)';
  
  db.run(sql, [content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ 
        id: this.lastID,
        content: content,
        message: 'Mensaje creado exitosamente'
      });
    }
  });
});

// Ruta para ELIMINAR mensajes (OPCIONAL)
app.delete('/api/message/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
    } else {
      res.json({ message: 'Mensaje eliminado exitosamente' });
    }
  });
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
  console.log('Base de datos en:', dbPath);
});