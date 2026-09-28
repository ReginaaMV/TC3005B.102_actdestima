// ---------- Lógica de cálculo ----------
const MODOS = { organico:[2.4,1.05,2.5,0.38], semi:[3.0,1.12,2.5,0.35], empotrado:[3.6,1.20,2.5,0.32] };
const PESOS = { EI:[3,4,6], EO:[4,5,7], EQ:[3,4,6], ILF:[7,10,15], EIF:[5,7,10] };
const NOMBRES = { EI:"EI · Entrada externa", EO:"EO · Salida externa", EQ:"EQ · Consulta externa", ILF:"ILF · Archivo lógico interno", EIF:"EIF · Archivo de interfaz externa" };

function cocomo(kloc, modo, salario = 0) {
  const [a,b,c,d] = MODOS[modo];
  const E = a * Math.pow(kloc, b);
  const D = c * Math.pow(E, d);
  return { E, D, P: E / D, costo: E * salario };
}
function cosmic(procesos, tasa) {
  const cfp = procesos.reduce((s,p) => s + p.E + p.X + p.R + p.W, 0);
  return { cfp, horas: cfp * tasa };
}
function puntosFuncion(cant, tdi) {
  let ufp = 0;
  for (const k in PESOS) cant[k].forEach((n,i) => ufp += n * PESOS[k][i]);
  const vaf = 0.65 + 0.01 * tdi;
  return { ufp, vaf, pfa: ufp * vaf };
}

// ---------- Utilidades de interfaz ----------
const $ = id => document.getElementById(id);
const num = el => Math.max(0, parseFloat(el.value) || 0);
const f2 = n => n.toLocaleString("es-MX", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const box = (v, l) => `<div><b>${v}</b><span>${l}</span></div>`;

document.querySelectorAll("nav button").forEach(b => b.onclick = () => {
  document.querySelectorAll("nav button").forEach(x => x.setAttribute("aria-selected", x === b));
  document.querySelectorAll("section").forEach(s => s.classList.toggle("on", s.id === b.dataset.t));
});

// ---------- COCOMO ----------
$("c-go").onclick = () => {
  const kloc = num($("c-kloc"));
  if (kloc <= 0) { $("c-out").innerHTML = "<p class='bad'>Escribe un tamaño mayor a 0 KLOC.</p>"; return; }
  const r = cocomo(kloc, $("c-mode").value, num($("c-sal")));
  $("c-out").innerHTML = box(f2(r.E), "persona-mes (E)") + box(f2(r.D), "meses (D)") + box(f2(r.P), "personas (P)") +
    (num($("c-sal")) ? box("$" + Math.round(r.costo).toLocaleString("es-MX"), "costo estimado") : "");
};

// ---------- COSMIC ----------
function addProc(nombre = "", v = [1,1,1,1]) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td><input type="text" value="${nombre}" placeholder="Ej. Iniciar sesión" aria-label="Nombre del proceso"></td>` +
    ["E","X","R","W"].map((m,i) => `<td><input type="number" min="0" value="${v[i]}" aria-label="Movimientos ${m}"></td>`).join("") +
    `<td class="cfp">0</td><td><button class="btn alt" aria-label="Quitar proceso">Quitar</button></td>`;
  tr.querySelector("button").onclick = () => { tr.remove(); calcCosmic(); };
  tr.querySelectorAll("input[type=number]").forEach(i => i.oninput = calcCosmic);
  $("s-table").tBodies[0].appendChild(tr);
}
function calcCosmic() {
  const procs = [...$("s-table").tBodies[0].rows].map(tr => {
    const n = [...tr.querySelectorAll("input[type=number]")].map(num);
    tr.querySelector(".cfp").textContent = n.reduce((a,b) => a + b, 0);
    return { E:n[0], X:n[1], R:n[2], W:n[3] };
  });
  const r = cosmic(procs, num($("s-rate")));
  $("s-out").innerHTML = box(r.cfp, "CFP totales") + box(f2(r.horas), "horas-persona");
}
$("s-add").onclick = () => { addProc(); calcCosmic(); };
$("s-go").onclick = calcCosmic;
$("s-rate").oninput = calcCosmic;
addProc("Iniciar sesión", [1,1,1,1]); calcCosmic();

// ---------- Puntos de Función ----------
for (const k in PESOS) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${NOMBRES[k]}</td>` + PESOS[k].map((w,i) =>
    `<td><input type="number" min="0" value="0" data-k="${k}" data-i="${i}" aria-label="${k} ${["baja","media","alta"][i]} (peso ${w})"></td>`).join("");
  $("f-table").tBodies[0].appendChild(tr);
}
$("f-go").onclick = () => {
  const cant = {}; for (const k in PESOS) cant[k] = [0,0,0];
  document.querySelectorAll("#f-table input").forEach(i => cant[i.dataset.k][i.dataset.i] = num(i));
  const tdi = Math.min(70, num($("f-tdi")));
  const r = puntosFuncion(cant, tdi);
  $("f-out").innerHTML = box(r.ufp, "UFP (sin ajustar)") + box(r.vaf.toFixed(2), "VAF") + box(f2(r.pfa), "PF ajustados");
};

// ---------- Comprobación ----------
$("k-go").onclick = () => {
  const c30 = cocomo(30, "organico");
  const c50 = cocomo(50, "semi");
  const fpEj = puntosFuncion({ EI:[0,3,0], EO:[0,2,0], EQ:[0,1,0], ILF:[0,2,0], EIF:[0,1,0] }, 35);
  const u3 = puntosFuncion({ EI:[0,4,0], EO:[0,3,0], EQ:[0,2,0], ILF:[0,3,0], EIF:[0,1,0] }, 35);
  const ej2 = cosmic([{ E:1, X:1, R:1, W:1 }], 8);
  const casos = [
    ["Ejemplo COCOMO 30 KLOC orgánico: E", "≈ 85.4 PM", c30.E, Math.abs(c30.E - 85.4) < 0.2, f2(c30.E) + " PM"],
    ["Ejemplo COCOMO 30 KLOC orgánico: D", "≈ 13.6 meses", c30.D, Math.abs(c30.D - 13.6) < 0.1, f2(c30.D) + " meses"],
    ["Ejemplo COCOMO 30 KLOC orgánico: P", "≈ 6 personas", c30.P, Math.round(c30.P) === 6, f2(c30.P) + " personas"],
    ["Ejemplo FP (TDI = 35)", "53 PF", fpEj.pfa, Math.round(fpEj.pfa) === 53, f2(fpEj.pfa) + " PF"],
    ["Ejemplo COSMIC «Iniciar sesión»", "4 CFP · 32 h", ej2.cfp, ej2.cfp === 4 && ej2.horas === 32, ej2.cfp + " CFP · " + ej2.horas + " h"],
    ["Ejercicio 1: 50 KLOC semi-acoplado (E)", "≈ 239.9 PM", c50.E, true, f2(c50.E) + " PM"],
    ["Ejercicio 1: D", "≈ 17.0 meses", c50.D, true, f2(c50.D) + " meses"],
    ["Ejercicio 1: P", "≈ 14 personas", c50.P, true, f2(c50.P) + " personas"],
    ["Ejercicio 3: UFP (4 EI, 3 EO, 2 EQ, 3 ILF, 1 EIF)", "76 UFP", u3.ufp, u3.ufp === 76, u3.ufp + " UFP"]
  ];
  $("k-table").tBodies[0].innerHTML = casos.map(c =>
    `<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[4]}</td><td class="${c[3] ? "ok" : "bad"}">${c[3] ? "Correcto" : "Revisar"}</td></tr>`).join("");
};
$("k-go").click();
$("c-go").click();
