const API_URL = 'http://localhost:3000/api';

document.getElementById('load').addEventListener('click', loadMessages);
document.getElementById('add').addEventListener('click', addMessage);
document.getElementById('test').addEventListener('click', testConnection);


async function loadMessages() {
    const messagesDiv = document.getElementById('messages');
    const statusDiv = document.getElementById('status');
    
    try {
        messagesDiv.innerHTML = '<div class="loading">Cargando mensajes...</div>';
        statusDiv.innerHTML = '';

        const response = await fetch(`${API_URL}/message`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const messages = await response.json();
        
        if (messages.length === 0) {
            messagesDiv.innerHTML = '<div>No hay mensajes disponibles</div>';
            return;
        }

        messagesDiv.innerHTML = messages.map(msg => `
            <div class="message-item">
                <strong>#${msg.id}</strong>: ${msg.content}
                ${msg.created_at ? `<br><small>Creado: ${new Date(msg.created_at).toLocaleString()}</small>` : ''}
            </div>
        `).join('');
        
        statusDiv.innerHTML = `<div style="color: green;">Cargados ${messages.length} mensajes</div>`;
        
    } catch (error) {
        messagesDiv.innerHTML = `<div class="error">Error al cargar mensajes: ${error.message}</div>`;
        statusDiv.innerHTML = `<div class="error">Verifica que el backend esté ejecutándose en puerto 3000</div>`;
    }
}

async function addMessage() {
    const statusDiv = document.getElementById('status');
    
    try {
        const newMessage = {
            content: `Nuevo mensaje ${new Date().toLocaleTimeString()}`
        };

        const response = await fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        statusDiv.innerHTML = `<div style="color: green;">Mensaje agregado correctamente</div>`;
        
        // Recargar los mensajes después de agregar uno nuevo
        setTimeout(loadMessages, 500);
        
    } catch (error) {
        statusDiv.innerHTML = `<div class="error">Error al agregar mensaje: ${error.message}</div>`;
    }
}

async function testConnection() {
    const statusDiv = document.getElementById('status');
    
    try {
        statusDiv.innerHTML = '<div>Probando conexión con el backend...</div>';
        
        const response = await fetch(`${API_URL}/message`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        statusDiv.innerHTML = `<div style="color: green;">Conexión exitosa con el backend</div>`;
        
    } catch (error) {
        statusDiv.innerHTML = `<div class="error">No se pudo conectar con el backend: ${error.message}</div>`;
    }
}

// Cargar mensajes automáticamente al abrir la página
window.addEventListener('load', () => {
    setTimeout(testConnection, 1000);
});