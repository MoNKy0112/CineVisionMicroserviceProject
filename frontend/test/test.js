// frontend/tests_integration/e2e/test_register_user_verbose.spec.js
const { test, expect } = require("@playwright/test");

test("E2E: Registro completo desde FRONT → Gateway → Backend → DB", async ({ page }) => {

  console.log("\n==============================================");
  console.log(" 🔥 INICIO TEST E2E: REGISTRO DE USUARIO 🔥 ");
  console.log("==============================================\n");

  const FRONT_URL = "http://localhost:3000";
  const API_VALIDATE = "http://localhost:8080/api/user/users/find?email=prueba2@gmail.com";

  console.log("🔗 Abriendo Frontend en:", FRONT_URL);
  await page.goto(FRONT_URL);

  console.log("\n📝 Llenando formulario...");
  await page.fill('input[placeholder="Nombre - Apellido"]', "prueba2");
  await page.fill('input[placeholder="Correo electrónico"]', "prueba2@gmail.com");
  await page.fill('input[placeholder="Teléfono - 0 5** *** ** **"]', "0 512 345 67 88");
  await page.fill('input[placeholder="Contraseña"]', "1234");
  await page.fill('input[placeholder="Repita la contraseña"]', "1234");

  console.log("✔ Formulario llenado correctamente.");

  console.log("\n🚀 Enviando formulario (clic en 'Inscribirse')...");
  await page.click('button:has-text("Inscribirse")');

  console.log("⏳ Esperando respuesta visual del frontend...");
  await page.waitForTimeout(1500);

  console.log("\n🔎 Validando creación de usuario mediante API Gateway:");
  console.log("GET:", API_VALIDATE);

  const gatewayResponse = await page.request.get(API_VALIDATE);

  console.log("\n📡 Status recibido desde el API Gateway:", gatewayResponse.status());
  expect(gatewayResponse.status()).toBe(200);

  const userData = await gatewayResponse.json();

  console.log("\n📦 JSON recibido desde API Gateway:");
  console.log(JSON.stringify(userData, null, 4));

  console.log("\n🔍 Validando campos del usuario creado...");

  expect(userData.email).toBe("prueba2@gmail.com");
  console.log("✔ email OK");

  expect(userData.customerName || userData.username).toBe("prueba2");
  console.log("✔ customerName / username OK");

  console.log("\n==============================================");
  console.log(" 🎉 TEST E2E COMPLETO EXITOSO (FRONT→GW→BE→DB) 🎉 ");
  console.log("==============================================\n");
});
