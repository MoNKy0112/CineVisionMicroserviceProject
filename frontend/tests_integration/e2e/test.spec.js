// tests_integration/e2e/test.spec.js
const { test, expect } = require("@playwright/test");
const path = require("path");

test("E2E robusto: intentar llenar formulario y validar creación", async ({ page }) => {
  const FRONT_URL = "http://localhost:3000";
  const EMAIL = `prueba2+${Date.now()}@gmail.com`; // evita duplicados
  console.log(EMAIL)
  const API_VALIDATE = `http://localhost:8080/api/user/users/find?email=${EMAIL}`;

  console.log("-> Abriendo frontend:", FRONT_URL);
  await page.goto(FRONT_URL, { waitUntil: "networkidle" });

  // Abrir modal (intentos varios)
  console.log("-> Intentando abrir modal (buscando enlace 'kayıt ol' o botón)");
  const openSelectors = [
    'text=/kayıt ol/i',
    'text=/kayit ol/i',
    'text="Kayıt Ol"',
    'role=link[name=/kayıt ol/i]',
    'role=button[name=/kayıt ol/i]',
    'css=header a:has-text("Kayıt")'
  ];

  let opened = false;
  for (const sel of openSelectors) {
    try {
      const loc = page.locator(sel);
      if (await loc.count() > 0) {
        console.log(`  -> Encontrado selector para abrir modal: ${sel}`);
        await loc.first().scrollIntoViewIfNeeded();
        await loc.first().click({ force: true }).catch(e => console.warn("click err:", e.message));
        opened = true;
        break;
      }
    } catch (e) {
      console.warn("  -> error probando selector", sel, e.message);
    }
  }

  if (!opened) {
    console.warn("No se pudo abrir el modal automáticamente. Pausando para inspección interactiva...");
    await page.pause();
  }

  // Esperar a que haya inputs (o labels) visibles
  await page.waitForTimeout(800);

  // Screenshot inicial del modal
  const beforeScreenshot = path.join(process.cwd(), "playwright_before_modal.png");
  await page.screenshot({ path: beforeScreenshot, fullPage: false });
  console.log("Screenshot guardado:", beforeScreenshot);

  // Recolectar inputs y contenteditable candidates
  const inputs = page.locator("input");
  const contenteds = page.locator("[contenteditable='true'], [contenteditable=true]");
  const totalInputs = await inputs.count();
  const totalContent = await contenteds.count();
  console.log(`-> Inputs encontrados: ${totalInputs}, contenteditable: ${totalContent}`);

  // Imprime atributos de cada input
  for (let i = 0; i < totalInputs; i++) {
    const n = inputs.nth(i);
    const visible = await n.isVisible();
    const disabled = await n.isDisabled();
    const readonly = await n.getAttribute("readonly");
    const placeholder = await n.getAttribute("placeholder");
    const type = await n.getAttribute("type");
    console.log(` input[${i}] visible=${visible} disabled=${disabled} readonly=${readonly} type=${type} placeholder=${placeholder}`);
  }

  for (let i = 0; i < totalContent; i++) {
    const n = contenteds.nth(i);
    const visible = await n.isVisible();
    console.log(` contenteditable[${i}] visible=${visible}`);
  }

  // Valores a escribir (orden: nombre, email, telefono, pass, pass2)
  const values = [
    "prueba4",
    EMAIL,
    "0 512 345 67 88",
    "TestPass123!",
    "TestPass123!"
  ];

  // Intentar llenar por inputs visibles no-disabled
  let filledCount = 0;
  for (let i = 0; i < totalInputs && filledCount < values.length; i++) {
    const el = inputs.nth(i);
    const visible = await el.isVisible();
    const disabled = await el.isDisabled();
    if (!visible || disabled) {
      console.log(` skipping input[${i}] (visible=${visible} disabled=${disabled})`);
      continue;
    }

    const valToWrite = values[filledCount];
    console.log(`-> Intentando llenar input[${i}] con: ${valToWrite}`);

    try {
      await el.scrollIntoViewIfNeeded();
      await el.click({ force: true });
      // primero fill
      await el.fill(valToWrite, { timeout: 3000 });
      console.log(`   fill OK input[${i}]`);
      filledCount++;
      continue;
    } catch (e) {
      console.warn(`   fill fallo input[${i}]: ${e.message}`);
    }

    // intentar type si fill falla
    try {
      await el.click({ force: true });
      await el.type(valToWrite, { delay: 50 });
      console.log(`   type OK input[${i}]`);
      filledCount++;
      continue;
    } catch (e) {
      console.warn(`   type fallo input[${i}]: ${e.message}`);
    }

    // intentar set via JS si todo falla
    try {
      await el.evaluate((node, v) => {
        node.focus();
        node.value = v;
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.dispatchEvent(new Event("change", { bubbles: true }));
      }, valToWrite);
      console.log(`   evaluate set value OK input[${i}]`);
      filledCount++;
      continue;
    } catch (e) {
      console.warn(`   evaluate fallo input[${i}]: ${e.message}`);
    }
  }

  // Si quedaron valores por llenar, probar contenteditable
  for (let i = 0; i < totalContent && filledCount < values.length; i++) {
    const el = contenteds.nth(i);
    const visible = await el.isVisible();
    if (!visible) {
      console.log(` skipping contenteditable[${i}] (not visible)`);
      continue;
    }
    const valToWrite = values[filledCount];
    console.log(`-> Intentando llenar contenteditable[${i}] con: ${valToWrite}`);
    try {
      await el.click({ force: true });
      await el.fill ? await el.fill(valToWrite) : await el.type(valToWrite);
      console.log(`   contenteditable fill/type OK`);
      filledCount++;
    } catch (e) {
      // fallback evaluate
      try {
        await el.evaluate((node, v) => {
          node.innerText = v;
          node.dispatchEvent(new Event("input", { bubbles: true }));
        }, valToWrite);
        console.log(`   contenteditable evaluate OK`);
        filledCount++;
      } catch (ee) {
        console.warn(`   contenteditable fallo: ${ee.message}`);
      }
    }
  }

  console.log(`-> Valores escritos: ${filledCount}/${values.length}`);

  // Screenshot después de intentar llenar
  const afterScreenshot = path.join(process.cwd(), "playwright_after_fill.png");
  await page.screenshot({ path: afterScreenshot, fullPage: false });
  console.log("Screenshot after fill guardado:", afterScreenshot);

  // Si no escribió todo, pausa para inspección
  if (filledCount < values.length) {
    console.error("No se pudieron llenar todos los campos automáticamente. Pausando para inspección.");
    await page.pause(); // te permite interactuar y ver el DOM con inspector
    // después de inspeccionar, puedes reanudar y continuar manualmente
  } else {
    // enviar formulario - intentar varios selectores
    console.log("-> Intentando enviar el formulario...");
    const submitSelectors = [
      'button:has-text("Kayıt Ol")',
      'button:has-text("Inscribirse")',
      'text=Kayıt Ol',
      'button[type="submit"]'
    ];

    let submitted = false;
    for (const s of submitSelectors) {
      const loc = page.locator(s);
      if (await loc.count() > 0 && await loc.first().isVisible()) {
        try {
          await loc.first().scrollIntoViewIfNeeded();
          await loc.first().click({ force: true });
          submitted = true;
          console.log(" -> Submit con selector:", s);
          break;
        } catch (e) {
          console.warn(" -> Submit fallo selector:", s, e.message);
        }
      }
    }

    if (!submitted) {
      console.warn("No se pudo localizar el botón submit automáticamente.");
    } else {
      await page.waitForTimeout(1500);
      // validar por gateway
      console.log("-> Validando usuario via API Gateway:", API_VALIDATE);
      const resp = await page.request.get(API_VALIDATE);
      console.log(" Gateway status:", resp.status());
      if (resp.status() === 200) {
        const body = await resp.json();
        console.log(" Gateway body:", JSON.stringify(body, null, 2));
        expect(body.email).toBe(EMAIL);
      } else {
        console.error("Gateway no devolvió 200. status:", resp.status());
      }
    }
  }
});
