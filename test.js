// test.js
const sqlite3 = require("sqlite3").verbose();
 
function testSQLInjection() {
  const db = new sqlite3.Database(":memory:");
 
  db.serialize(() => {
db.run("CREATE TABLE users (id INT, name TEXT)");
db.run("INSERT INTO users VALUES (1, 'Alice')");
db.run("INSERT INTO users VALUES (2, 'Bob')");
 
    // Intento de inyección SQL
    const maliciousId = "1 OR 1=1";
 
    // ⚠️ Versión vulnerable (concatenación directa)
    const vulnerableQuery = `SELECT * FROM users WHERE id = ${maliciousId}`;
 
    db.all(vulnerableQuery, [], (err, rows) => {
      if (err) {
        console.error("Error al ejecutar query:", err);
        process.exit(1);
      }
 
      if (rows.length > 1) {
        console.error("❌ Vulnerabilidad detectada: la inyección devolvió múltiples filas");
        process.exit(1);
      } else {
        console.log("✅ Consulta segura (no vulnerable)");
        process.exit(0);
      }
    });
  });
}
 
testSQLInjection();
