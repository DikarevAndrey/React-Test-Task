const fs = require('fs');
const pathToDataFile = "./texts.json";
const UserService = require('./userService.js');
const userService = new UserService();

class TextService {
    constructor() {
        if (TextService.__instance) {
            return TextService.__instance;
        }

        TextService.__instance = this;
    }

    newText({ section, author, text, created_at }) {
        const privateSections = ['PRIVATE1', 'PRIVATE2', 'PRIVATE3', 'PRIVATE4'];
        let access = true;
        if (privateSections.includes(section)) {
            if (!userService.checkPermissions({ login: author, section } )) {
                access = false;
            }
        }

        if (access) {
            const newTextEntry = {
                author: author,
                text: text,
                created_at: created_at,
                section: section,
            };

            let texts = this.getTexts();
            const oldTextIndex = texts.findIndex((text) => {
                return text.author === newTextEntry.author && text.section === newTextEntry.section;
            });

            if (oldTextIndex !== -1) {
                texts[oldTextIndex].text = newTextEntry.text;
                texts[oldTextIndex].created_at = newTextEntry.created_at;
            } else {
                texts.push(newTextEntry);
            }
            fs.writeFileSync(pathToDataFile, JSON.stringify(texts), {encoding: 'utf8'});

            return newTextEntry;
        } else {
            return null;
        }
    }

    getText({ login, section }) {
        const privateSections = ['PRIVATE1', 'PRIVATE2', 'PRIVATE3', 'PRIVATE4'];
        let access = true;
        if (privateSections.includes(section)) {
            if (!userService.checkPermissions({ login, section } )) {
                access = false;
            }
        }

        if (access) {
            const textData = this.getTexts().find((_text) => {
                return _text.author === login && _text.section === section;
            });

            if (textData) {
                return textData;
            } else {
                return 'No text';
            }
        } else {
            return null;
        }
    }

    getTexts() {
        const rawData = fs.readFileSync(pathToDataFile, {encoding: 'utf8'});
        let textsData = [];

        try {
            textsData = JSON.parse(rawData);
        } catch (error) {
            textsData = [];
        }

        return textsData;
    }
}

module.exports = TextService;