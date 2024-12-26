const SESSIONHUB_API = "http://localhost:5000/api/sessions"; 

// Get all sessions
async function fetchSessions() {
    try {
        const response = await fetch(SESSIONHUB_API, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        renderSessions(data);
    } catch (error) {
        console.error(error.message);
    }
}

// Add a new session
async function addSession(sessionData) {
    try {
        const response = await fetch(SESSIONHUB_API, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });
        if (!response.ok) {
            throw new Error('Failed to add session');
        }
        await fetchSessions(); // Refresh the session list
    } catch (error) {
        console.error(error.message);
    }
}

// Update a session
async function updateSession(sessionId, updatedData) {
    try {
        const response = await fetch(`${SESSIONHUB_API}/${sessionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Failed to update session');
        }
        await fetchSessions(); // Refresh the session list
    } catch (error) {
        console.error(error.message);
    }
}

// Delete a session
async function deleteSession(sessionId) {
    try {
        const response = await fetch(`${SESSIONHUB_API}/${sessionId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to delete session');
        }
        await fetchSessions(); // Refresh the session list
    } catch (error) {
        console.error(error.message);
    }
}

// Render sessions in the HTML
function renderSessions(sessions) {
    const sessionList = document.getElementById('session-list');
    sessionList.innerHTML = '';
    sessions.forEach((session) => {
        const sessionItem = document.createElement('li');
        sessionItem.classList.add('list-group-item');
        sessionItem.innerHTML = `
            <strong>${session.date}</strong>: ${session.location} (${session.status})
            <button class="btn btn-sm btn-warning float-end" onclick="editSession('${session._id}')">Edit</button>
            <button class="btn btn-sm btn-danger float-end me-2" onclick="deleteSession('${session._id}')">Delete</button>
        `;
        sessionList.appendChild(sessionItem);
    });
}

// Initialize fetch on page load
document.addEventListener('DOMContentLoaded', fetchSessions);
