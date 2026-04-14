import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get contact by phone or query
app.get('/api/contacts', (req, res) => {
    const { query } = req.query;

    if (!query || query.length < 10) {
        return res.json(null);
    }

    db.get('SELECT * FROM contacts WHERE phone = ?', [query], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            res.json({
                ...row,
                isNew: Boolean(row.isNew),
                duplicates: Boolean(row.duplicates)
            });
        } else {
            res.json({
                phone: query,
                name: 'Unknown User',
                isNew: true,
                duplicates: false,
                isGlobal: false
            });
        }
    });
});

// Get all contacts
app.get('/api/contacts/all', (req, res) => {
    db.all('SELECT * FROM contacts', [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows.map(row => ({
            ...row,
            isNew: Boolean(row.isNew),
            duplicates: Boolean(row.duplicates)
        })));
    });
});

// Create a payment
app.post('/api/pay', (req, res) => {
    const { contact, amount, roundOffAmt } = req.body;

    if (!contact || !contact.phone || !amount) {
        return res.status(400).json({ error: 'Missing payment details' });
    }

    db.run(
        'INSERT INTO transactions (contactPhone, amount, roundOffAmt, status) VALUES (?, ?, ?, ?)',
        [contact.phone, amount, roundOffAmt || 0, 'PENDING_HOLD'],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, transactionId: this.lastID });
        }
    );
});

// Get transactions history
app.get('/api/transactions', (req, res) => {
    db.all('SELECT * FROM transactions ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
