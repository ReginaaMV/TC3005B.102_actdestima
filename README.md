# TC3005B – Actividad de estimación

Aplicación web (HTML + CSS + JavaScript, sin dependencias) que estima software con tres métodos:

- **COCOMO básico**: esfuerzo, tiempo, personal y costo a partir de KLOC.
- **COSMIC**: tamaño funcional en CFP a partir de movimientos de datos (E, X, R, W).
- **Puntos de Función (IFPUG)**: UFP, VAF y PF ajustados.

## Cómo ejecutarla

Abre `index.html` en el navegador (doble clic). No requiere instalación.

Demo en GitHub Pages: `https://reginaamv.github.io/TC3005B.102_actdestima/`

## Estimación COCOMO de un proyecto

**Proyecto:** Sistema web de control de inventario para una papelería (catálogo, entradas/salidas, reportes).

| Dato | Valor |
|---|---|
| Modo | Orgánico (equipo pequeño, problema conocido) |
| Tamaño estimado | 12 KLOC |
| Constantes | a = 2.4, b = 1.05, c = 2.5, d = 0.38 |
| Salario mensual por persona | $18,000 MXN |

1. Esfuerzo: E = 2.4 × 12^1.05 ≈ **32.61 persona-mes**
2. Tiempo: D = 2.5 × 32.61^0.38 ≈ **9.40 meses**
3. Personal: P = 32.61 / 9.40 ≈ **3.5 personas** (3 a 4)
4. Costo: 32.61 × $18,000 ≈ **$586,981 MXN**

## Comprobación con los ejercicios de clase

| Caso | Resultado |
|---|---|
| Ejemplo 30 KLOC orgánico | E = 85.35 PM, D = 13.55 meses, P = 6.3 personas (la diapositiva redondea a 85.4 / 13.6 / 6) |
| Ejemplo Puntos de Función | UFP = 53, VAF = 1.00, PFA = 53 PF |
| Ejemplo COSMIC «Iniciar sesión» | 4 CFP, 32 horas-persona |
| **Ejercicio 1** (50 KLOC semi-acoplado) | E = 3.0 × 50^1.12 ≈ 239.9 PM · D = 2.5 × 239.9^0.35 ≈ 17.0 meses · P ≈ 14 personas |
| **Ejercicio 2** («Registrar una nueva calificación») | E: el profesor captura alumno, materia y calificación · R: el sistema lee al alumno y la materia para validar · W: el sistema guarda la calificación · X: el sistema muestra la confirmación → **4 CFP** |
| **Ejercicio 3** (4 EI, 3 EO, 2 EQ, 3 ILF, 1 EIF, media) | 16 + 15 + 8 + 30 + 7 = **76 UFP** |

La pestaña «Ejercicios de clase» de la app ejecuta estos cálculos y muestra si coinciden.

**Ejercicio 4 (comparación):** COCOMO fue el más rápido de aplicar porque solo requiere KLOC y un modo, pero ese dato es difícil de conocer al inicio del proyecto. COSMIC y Puntos de Función necesitan describir funciones (procesos, entradas, archivos), lo cual toma más tiempo pero se puede hacer desde los requisitos, sin saber el lenguaje ni el código.

## Estructura

```
index.html   Estructura de la página
styles.css   Estilos
app.js       Lógica de COCOMO, COSMIC y Puntos de Función
README.md    Este archivo
```
