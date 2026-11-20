# Aprobaula

Test y estudio para las oposiciones de Educación Infantil en España.

Web: https://hola-laura.github.io/aprobaula/ (cuando se active GitHub Pages)

Basada en el motor de [Drivo Test](https://github.com/hola-laura/carnet-conducir-app): web app estática + Capacitor para iOS.

No es una app oficial ni está vinculada a ninguna administración educativa.

## Qué hace

- **Dos vías**: Maestros · Educación Infantil (los 25 temas de la Orden de 9 de septiembre de 1993) y Educador/a Infantil 0-3. Al entrar se elige la vía y la comunidad (17 + Ceuta y Melilla).
- **Simulacro**: 50 preguntas, los fallos restan 1/3, se puede dejar en blanco, nota sobre 10.
- **Práctica, sesión diaria adaptativa, biblioteca filtrada por tema, repaso de errores y guardadas** (igual que Drivo).
- **Estudiar**: fichas por tema (qué entra + ideas clave), supuestos prácticos con claves de resolución y autores y conceptos.
- **Mi temario**: el usuario sube su tema (PDF, Word .docx o texto) y la app crea preguntas de rellenar el hueco con datos del propio texto (autores, leyes, fechas, cifras). Todo en el dispositivo. También puede escribir preguntas a mano y guardar o recuperar una copia (.json).
- **Verdadero o falso**: el juego de deslizar de Drivo con autores y normativa.

## Estructura

```
bank/                 Banco de preguntas (texto plano, fácil de editar)
  01-…07-*.txt        Preguntas por bloque
  ccaa.py             Normas por comunidad (currículo, Estatuto, requisitos 0-3)
scripts/
  build-questions.py  Genera data/questions.json y js/questions-data.js
  copy-www.js         Copia la web a www/ para Capacitor
js/
  app.js              Motor (de Drivo, adaptado)
  mi-temario.js       Subida de temario y generador de preguntas
  estudiar.js         Fichas y supuestos
  supuestos.js        Supuestos prácticos
  conceptos.js        Autores y conceptos
  match-game.js       Verdadero o falso
vendor/pdfjs/         pdf.js 4.10 (Apache 2.0) para leer PDF en el dispositivo
```

### Añadir o corregir preguntas

Edita el `.txt` correspondiente de `bank/` y ejecuta:

```
python3 scripts/build-questions.py
```

Formato:

```
## M05            (tema; "## EI03 @MD" = solo Comunidad de Madrid)
? Enunciado
+ Respuesta correcta
- Incorrecta
- Incorrecta
- Incorrecta
= Explicación
```

Temas disponibles: `M01`-`M25` (temario de Maestros), `LEY`, `CUR`, `E03` (cuidados 0-3), `EI03` (normativa de escuelas infantiles), `CE`, `EST`, `FP`. Las respuestas se barajan solas al generar.

### iOS

```
npm install
npx cap add ios      # solo la primera vez
npm run ios:open
```

`appId`: `com.aprobaula.app`.

## Fuentes consultadas (nov. 2026)

- Temario de Maestros, Educación Infantil: Orden de 9 de septiembre de 1993 (BOE 21/09/1993), anexo I, vigente en las convocatorias de 2026.
- Real Decreto 95/2022 (BOE-A-2022-1654). LOMLOE (LO 3/2020). LOPIVI (LO 8/2021).
- Decretos de currículo de Infantil por comunidad: cotejados en dos recopilaciones (campuseducacion.com y opositando.shop). Ceuta y Melilla: Orden EFP/608/2022.
- Requisitos de centros 0-3: mapa legislativo de Eurydice España (Ministerio). Madrid: Decreto 18/2008 (texto en comunidad.madrid).
- Educador/a Infantil del Ayuntamiento de Madrid 2026: bases específicas (madrid.es). 120 preguntas tipo test de 3 opciones, fallos restan 1/3, 40 temas.

## Pendiente

Ver `PENDIENTE.md`.
