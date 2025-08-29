const sqlite3 = require('sqlite3').verbose();
 
function fail(msg) {
  console.error("❌", msg);
  process.exit(1);
}
 
const db = new sqlite3.Database(':memory:');
 
db.serialize(() => {
db.run("CREATE TABLE users (id INT, name TEXT)");
db.run("INSERT INTO users VALUES (1, 'Alice')");
db.run("INSERT INTO users VALUES (2, 'Bob')");
 
  const safeQuery = "SELECT * FROM users WHERE id = ?";
  const maliciousId = "1 OR 1=1"; // intento de inyección
 
  // 1) Con consulta parametrizada, la inyección NO debe devolver filas
  db.all(safeQuery, [maliciousId], (err, rows) => {
    if (err) fail("Error (consulta con payload malicioso): " + err.message);
    if (rows.length !== 0) fail("La inyección devolvió filas usando consulta parametrizada.");
 
    // 2) Con parámetro válido, debe devolver exactamente 1 fila (Alice)
    db.all(safeQuery, [1], (err2, rows2) => {
      if (err2) fail("Error (consulta con id válido): " + err2.message);
      if (rows2.length !== 1 || rows2[0].name !== 'Alice') {
        fail("La consulta válida no devolvió el usuario esperado (Alice).");
      }
 
      console.log("✅ Prueba OK: la inyección no funcionó y la consulta válida devuelve Alice.");
      process.exit(0);
    });
  });
});
