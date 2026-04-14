import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Create contacts/users table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE,
            name TEXT,
            isNew BOOLEAN,
            duplicates BOOLEAN
        )`);

        // Insert some mock contacts
        const mockContacts = [
            { phone: '9876543210', name: 'John Doe', isNew: 0, duplicates: 0 },
            { phone: '8888888888', name: 'Priya Sharma', isNew: 1, duplicates: 0 },
            { phone: '7777777777', name: 'Raj Kumar', isNew: 0, duplicates: 1 }
        ];

        const insertContact = db.prepare(`INSERT OR IGNORE INTO contacts (phone, name, isNew, duplicates) VALUES (?, ?, ?, ?)`);
        mockContacts.forEach(contact => {
            insertContact.run(contact.phone, contact.name, contact.isNew, contact.duplicates);
        });
        insertContact.finalize();

        // Create transactions table
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contactPhone TEXT,
            amount REAL,
            roundOffAmt REAL,
            status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

export default db;
