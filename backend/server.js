const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos en memoria (para pruebas)
const db = new sqlite3.Database(':memory:');

// Crear tabla y datos de ejemplo
db.serialize(() => {
  db.run(`CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  )`);
  
  db.run("INSERT INTO messages (content) VALUES ('Hola Mundo')");
  db.run("INSERT INTO messages (content) VALUES ('Funciona!')");
});

// Ruta para obtener mensajes
app.get('/api/message', (req, res) => {
  db.all("SELECT * FROM messages", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Ruta para crear mensajes (POST)
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

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});