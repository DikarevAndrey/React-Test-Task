const fs = require('fs');
const uuidv4 = require('uuid/v4');
const pathToDataFile = "./users.json";

const permissions = {
    PRIVATE1: 1,
    PRIVATE2: 2,
    PRIVATE3: 4,
    PRIVATE4: 8,
};

class UserService {
    constructor() {
        if (UserService.__instance) {
            return UserService.__instance;
        }

        UserService.__instance = this;
    }

    getSessionInfo(sessionId) {
        const user = this.getUsers().find((_user) => {
            return _user['session'] === sessionId;
        });

        if (!user) {
            return null;
        } else {
            return {
                login: user.login,
            };
        }
    }

    newSession(userData) {
        const users = this.getUsers();
        const userIndex = users.findIndex((_user) => {
            return _user['login'] === userData['login'];
        });

        if (userIndex !== -1 && users[userIndex]['password'] === userData['password']) {
            const sessionId = uuidv4();
            users[userIndex]['session'] = sessionId;
            fs.writeFileSync(pathToDataFile, JSON.stringify(users), {encoding: 'utf8'});
            return {
                session: users[userIndex]['session'],
                login: users[userIndex]['login'],
            }
        } else {
            return null;
        }
    }

    deleteSession(userData) {
        const users = this.getUsers();
        const userIndex = users.findIndex((_user) => {
            return _user['login'] === userData['login'];
        });

        if (userIndex !== -1) {
            users[userIndex]['session'] = null;
            fs.writeFileSync(pathToDataFile, JSON.stringify(users), {encoding: 'utf8'});
            return {
                login: users[userIndex]['login'],
            }
        } else {
            return null;
        }
    }

    checkPermissions({ login, section }) {
        const user = this.getUsers().find((_user) => {
            return _user['login'] === login;
        });

        if (!user) {
            return false;
        } else {
            return Boolean(user.permissions & permissions[section]);
        }
    }

    checkSession({ login, sessionId }) {
        const user = this.getUsers().find((_user) => {
            return _user['login'] === login;
        });

        if (!user) {
            return false;
        } else {
            return user.session === sessionId;
        }
    }

    getUsers() {
        const rawData = fs.readFileSync(pathToDataFile, {encoding: 'utf8'});
        let usersData = [];

        try {
            usersData = JSON.parse(rawData);
        } catch (error) {
            usersData = [];
        }

        return usersData;
    }
}

module.exports = UserService;