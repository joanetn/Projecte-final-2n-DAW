const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const backupPath = dbPath + '.bak.' + Date.now();

try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    fs.writeFileSync(backupPath, raw, 'utf8');
    console.log('Backup created at', backupPath);

    const db = JSON.parse(raw);
    if (Array.isArray(db.Notificacio)) {
        db.Notificacio.forEach(n => {
            n.read = false;
            if (Object.prototype.hasOwnProperty.call(n, 'llegit')) n.llegit = false;
        });
    } else if (db.Notificacio && typeof db.Notificacio === 'object') {
        const n = db.Notificacio;
        n.read = false;
        if (Object.prototype.hasOwnProperty.call(n, 'llegit')) n.llegit = false;
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Updated notifications to read=false and saved to', dbPath);
} catch (err) {
    console.error('Error updating db.json:', err);
    process.exit(1);
}
