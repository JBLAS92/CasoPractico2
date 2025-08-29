const request = require("supertest");
const app = require("./index"); // importa tu servidor Express
 
describe("Pruebas de seguridad en /search", () => {
  it("Debe devolver resultados al hacer una búsqueda válida", async () => {
    const res = await request(app).get("/search?name=Alice");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Alice"); // Ajusta según tu salida
  });
 
  it("No debe ser vulnerable a SQL Injection", async () => {
    const res = await request(app).get("/search?name=' OR '1'='1");
    expect(res.statusCode).toBe(200);
    expect(res.text).not.toContain("Bob"); // No debe traer todos los registros
  });
});
