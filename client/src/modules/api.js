function login({ login, password }) {
    return fetch('/api/v1/session', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login, password}),
    });
}

function getSessionInfo() {
    return fetch('/api/v1/session', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
        },
        credentials: 'include',
    });
}

function logOut(login) {
    return fetch('/api/v1/session', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({login}),
    });
}

function getText({ login, section }) {
    console.log({ login, section });
    return fetch(`/api/v1/text?login=${login}&section=${section}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });
}

function sendText({ text, author, created_at, section }) {
    return fetch('/api/v1/text', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text, author, created_at, section }),
    });
}

export { login, getSessionInfo, logOut, getText, sendText };