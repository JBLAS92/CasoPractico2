const request = require("supertest");
const app = require("./index");
 
// Cambia a "vulnerable" o "seguro" según el index.js que estés probando
const modo = process.env.TEST_MODE || "seguro";
 
describe("Prueba de SQL Injection", () => {
  it(`Debe comportarse correctamente en modo: ${modo}`, async () => {
    const res = await request(app).get("/user?name=' OR '1'='1");
 
    if (modo === "vulnerable") {
      // En la versión vulnerable, la inyección devuelve resultados
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    } else {
      // En la versión segura, la inyección NO devuelve nada
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    }
  });
 
  it("Debe devolver un usuario válido si existe", async () => {
    const res = await request(app).get("/user?name=Alice");
 
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Alice");
  });
});
