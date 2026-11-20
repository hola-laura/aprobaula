// Mi temario: la persona sube sus temas (PDF, Word, texto) y la app crea
// preguntas de rellenar el hueco con los datos clave del propio texto.
// Todo ocurre en el dispositivo: el archivo no se envía a ningún servidor.

let userTemarios = [];
const TEMARIO_DB = 'aprobaula';
const TEMARIO_KEY = 'temarios';
const MANUAL_ID = 'manual';
const MAX_PER_TEMA = 200;

// ---------- Almacenamiento ----------

function temarioStore(mode, fn) {
    return new Promise((resolve) => {
        try {
            const req = indexedDB.open(TEMARIO_DB, 1);
            req.onupgradeneeded = () => req.result.createObjectStore('data');
            req.onsuccess = () => {
                const tx = req.result.transaction('data', mode);
                const result = fn(tx.objectStore('data'));
                tx.oncomplete = () => resolve(result && 'result' in result ? result.result : true);
                tx.onerror = () => resolve(null);
            };
            req.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
}

async function loadUserTemarios() {
    let list = await temarioStore('readonly', (store) => store.get(TEMARIO_KEY));
    if (!Array.isArray(list)) {
        try { list = JSON.parse(localStorage.getItem('aprobaula:temarios') || '[]'); } catch (e) { list = []; }
    }
    userTemarios = Array.isArray(list) ? list : [];
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    refreshUserQuestions();
}

async function saveUserTemarios() {
    const ok = await temarioStore('readwrite', (store) => store.put(userTemarios, TEMARIO_KEY));
    try { localStorage.setItem('aprobaula:temarios', JSON.stringify(userTemarios)); } catch (e) {}
    if (!ok) showToast('No se ha podido guardar en este dispositivo');
    refreshUserQuestions();
}

// ---------- Integración con la app ----------

function getUserQuestions() {
    const out = [];
    userTemarios.forEach((tema) => {
        (tema.questions || []).forEach((q) => {
            out.push({
                id: q.id,
                question: q.question,
                answers: q.answers,
                correctIndex: q.correctIndex,
                category: 'USR:' + tema.id,
                ccaa: null,
                explanation: q.explanation || '',
                image: ''
            });
        });
    });
    return out;
}

function getUserTopicIds() {
    return userTemarios.filter((t) => (t.questions || []).length).map((t) => 'USR:' + t.id);
}

function getUserTopicName(topic) {
    const tema = userTemarios.find((t) => 'USR:' + t.id === topic);
    return tema ? tema.name : 'Mi temario';
}

function refreshUserQuestions() {
    if (typeof applyRouteFilter === 'function') applyRouteFilter();
    const select = document.getElementById('categoryFilter');
    if (select) select.dataset.key = '';
    if (typeof updateHomeStats === 'function') updateHomeStats();
    renderTemarioList();
    renderManualTemaOptions();
}

// ---------- Lectura de archivos ----------

async function readTemarioFile(file) {
    const name = (file.name || '').toLowerCase();
    if (name.endsWith('.pdf') || file.type === 'application/pdf') return readPdf(file);
    if (name.endsWith('.docx')) return readDocx(file);
    if (name.endsWith('.doc')) throw new Error('Los .doc antiguos no se pueden leer. Guárdalo como .docx o PDF.');
    return file.text();
}

async function readPdf(file) {
    const pdfjs = await import(new URL('vendor/pdfjs/pdf.min.mjs', document.baseURI).href);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('vendor/pdfjs/pdf.worker.min.mjs', document.baseURI).href;
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        let text = '';
        content.items.forEach((item) => {
            text += item.str;
            text += item.hasEOL ? '\n' : (item.str.endsWith(' ') ? '' : ' ');
        });
        pages.push(text);
        setTemarioStatus(`Leyendo página ${i} de ${doc.numPages}…`);
    }
    return pages.join('\n');
}

// .docx es un zip: buscamos word/document.xml y sacamos el texto de los párrafos.
async function readDocx(file) {
    const buf = new Uint8Array(await file.arrayBuffer());
    const view = new DataView(buf.buffer);
    let eocd = -1;
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
        if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('El archivo Word no se puede leer.');
    const entries = view.getUint16(eocd + 10, true);
    let ptr = view.getUint32(eocd + 16, true);
    for (let n = 0; n < entries; n++) {
        const method = view.getUint16(ptr + 10, true);
        const compSize = view.getUint32(ptr + 20, true);
        const nameLen = view.getUint16(ptr + 28, true);
        const extraLen = view.getUint16(ptr + 30, true);
        const commentLen = view.getUint16(ptr + 32, true);
        const localOffset = view.getUint32(ptr + 42, true);
        const entryName = new TextDecoder().decode(buf.subarray(ptr + 46, ptr + 46 + nameLen));
        if (entryName === 'word/document.xml') {
            const lNameLen = view.getUint16(localOffset + 26, true);
            const lExtraLen = view.getUint16(localOffset + 28, true);
            const start = localOffset + 30 + lNameLen + lExtraLen;
            const raw = buf.subarray(start, start + compSize);
            let xmlBytes = raw;
            if (method === 8) {
                if (typeof DecompressionStream === 'undefined') throw new Error('Tu navegador no puede abrir Word. Prueba con PDF o pega el texto.');
                const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                xmlBytes = new Uint8Array(await new Response(stream).arrayBuffer());
            }
            const xml = new TextDecoder().decode(xmlBytes);
            return xml
                .replace(/<w:tab\/>/g, ' ')
                .replace(/<\/w:p>/g, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
        }
        ptr += 46 + nameLen + extraLen + commentLen;
    }
    throw new Error('No encuentro texto en el archivo Word.');
}

// ---------- Generador de preguntas ----------

const NAME_STOP = new Set(('El La Los Las Un Una Unos Unas En Por Para Con Sin Este Esta Estos Estas Ese Esa Al Del Se Su Sus Es Son Como Cuando Si No Y O Pero Además También Así Según Desde Hasta Entre Sobre Tras Ante Cada Todo Toda Todos Todas Otro Otra Ya Muy Más Menos Tema Educación Infantil Primaria Comunidad Casa Ley Real Decreto Orden Constitución Estado Gobierno Ministerio Administración Página Capítulo Bloque Índice Introducción Conclusión Bibliografía Figura Tabla Nota Ejemplo Por ejemplo').split(' '));
const KNOWN_LAWS = ['Ley Orgánica 2/2006', 'Ley Orgánica 3/2020', 'Ley Orgánica 8/2021', 'Ley Orgánica 8/2013', 'Real Decreto 95/2022', 'Real Decreto 1630/2006', 'Real Decreto 132/2010', 'Real Decreto 157/2022'];
const KNOWN_AUTHORS = ['Piaget', 'Vygotsky', 'Montessori', 'Decroly', 'Bruner', 'Wallon', 'Freud', 'Erikson', 'Bowlby', 'Ausubel', 'Fröbel', 'Malaguzzi', 'Pikler', 'Gesell', 'Freinet', 'Bandura', 'Gardner', 'Chomsky'];

const EXTRACTORS = [
    { type: 'ley', re: /\b(?:Ley Orgánica|Real Decreto Legislativo|Real Decreto-ley|Real Decreto|Decreto Foral|Decreto|Ley|Orden(?: [A-Z]{2,4})?)\s+(?:[A-Z]{2,4}\/)?\d{1,4}\/\d{4}\b/g },
    { type: 'año', re: /\b(1[5-9]\d\d|20\d\d)\b/g },
    { type: 'cifra', re: /\b\d+(?:[.,]\d+)?\s?(?:%|por ciento|años|meses|semanas|días|horas|minutos|m²|metros|niños|niñas|alumnos|unidades|temas|artículos)\b/g },
    { type: 'cita', re: /[«"“]([^»"”]{3,60})[»"”]/g, group: 1 },
    { type: 'nombre', re: /(?<![\p{L}])[A-ZÁÉÍÓÚÑ][\p{Ll}]{3,}(?:\s+(?:de\s+|del\s+|y\s+|von\s+)?[A-ZÁÉÍÓÚÑ][\p{Ll}]{2,}){0,2}/gu }
];

function splitSentences(text) {
    return text
        .replace(/\r/g, '')
        .replace(/-\n(?=\p{Ll})/gu, '')
        .replace(/[ \t]+/g, ' ')
        .split(/(?<=[.!?;:])\s+|\n{2,}|\n(?=[•\-–\d]+[.)]?\s)/u)
        .map((s) => s.replace(/\s*\n\s*/g, ' ').replace(/^[•\-–\s]+/, '').trim())
        .filter((s) => s.length >= 40 && s.length <= 260 && /\p{L}/u.test(s));
}

function findKeys(sentence) {
    const found = [];
    EXTRACTORS.forEach((ex) => {
        ex.re.lastIndex = 0;
        let m;
        while ((m = ex.re.exec(sentence))) {
            const value = (ex.group ? m[ex.group] : m[0]).trim();
            const index = ex.group ? m.index + m[0].indexOf(value) : m.index;
            if (ex.type === 'nombre') {
                const words = value.split(/\s+/);
                if (NAME_STOP.has(words[0]) || NAME_STOP.has(value)) continue;
                const known = KNOWN_AUTHORS.some((a) => value.includes(a));
                if (index === 0 && words.length < 2 && !known) continue;
            }
            if (ex.type === 'cita' && value.split(/\s+/).length > 6) continue;
            found.push({ type: ex.type, value, index, end: index + value.length });
        }
    });
    // una cifra o un año dentro de una ley no cuentan por separado
    const laws = found.filter((k) => k.type === 'ley');
    return found.filter((k) => k.type === 'ley' || !laws.some((l) => k.index < l.end && k.end > l.index));
}

function normKey(v) {
    return v.toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').trim();
}

function fakeNumbers(key, count) {
    const m = key.match(/\d+(?:[.,]\d+)?/);
    if (!m) return [];
    const n = parseFloat(m[0].replace(',', '.'));
    const deltas = key.length === 4 && /^\d{4}$/.test(key) ? [-3, 2, 5, -7, 10] : [n * 0.5, n * 1.5, n + 2, n - 1, n * 2];
    const out = [];
    for (const d of deltas) {
        let v = key.length === 4 && /^\d{4}$/.test(key) ? n + d : d;
        if (v <= 0) continue;
        v = Number.isInteger(n) ? Math.round(v) : Math.round(v * 10) / 10;
        if (v === n || (v === 1 && /s\b/.test(key))) continue;
        const txt = key.replace(m[0], String(v).replace('.', ','));
        if (!out.includes(txt)) out.push(txt);
        if (out.length >= count) break;
    }
    return out;
}

function unitOf(value) {
    return normKey(value).replace(/[\d.,\s]/g, '');
}

function pickDistractors(key, pool, sentence) {
    const target = normKey(key.value);
    const sent = normKey(sentence);
    const seen = new Set([target]);
    const out = [];
    if (key.type === 'cifra') pool = pool.filter((c) => unitOf(c) === unitOf(key.value));
    const isPerson = (v) => KNOWN_AUTHORS.some((a) => v.includes(a)) || /^[A-ZÁÉÍÓÚÑ]\p{Ll}+\s+[A-ZÁÉÍÓÚÑ]\p{Ll}+$/u.test(v);
    if (key.type === 'nombre') {
        const person = isPerson(key.value);
        pool = pool.filter((c) => isPerson(c) === person);
        if (!person) pool = pool.filter((c) => c.split(/\s+/).length === key.value.split(/\s+/).length || pool.length < 4);
    }
    if (key.type === 'ley') {
        const kind = key.value.replace(/\s+[\w/]*\d.*$/, '');
        pool = pool.concat(KNOWN_LAWS.filter((l) => l.startsWith(kind)), KNOWN_LAWS);
    }
    for (const cand of pool) {
        const k = normKey(cand);
        if (seen.has(k) || sent.includes(k)) continue;
        seen.add(k);
        out.push(cand);
        if (out.length === 3) return out;
    }
    if (key.type === 'año' || key.type === 'cifra') {
        for (const f of fakeNumbers(key.value, 5)) {
            const k = normKey(f);
            if (seen.has(k)) continue;
            seen.add(k);
            out.push(f);
            if (out.length === 3) return out;
        }
    }
    if (key.type === 'nombre' && isPerson(key.value)) {
        for (const a of KNOWN_AUTHORS) {
            const k = normKey(a);
            if (seen.has(k) || sent.includes(k)) continue;
            seen.add(k);
            out.push(a);
            if (out.length === 3) return out;
        }
    }
    return out.length === 3 ? out : null;
}

function shuffleLocal(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildClozeQuestions(text, temaId) {
    const sentences = splitSentences(text);
    const perSentence = sentences.map((s) => ({ s, keys: findKeys(s) })).filter((x) => x.keys.length);
    const pools = {};
    perSentence.forEach(({ keys }) => keys.forEach((k) => {
        (pools[k.type] = pools[k.type] || []).push(k.value);
    }));
    Object.keys(pools).forEach((type) => {
        // los más repetidos primero: suelen ser los conceptos importantes del tema
        const freq = {};
        pools[type].forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
        pools[type] = shuffleLocal(Object.keys(freq)).sort((a, b) => freq[b] - freq[a]);
    });
    const priority = ['ley', 'nombre', 'año', 'cifra', 'cita'];
    const typeCount = {};
    const used = new Set();
    const questions = [];
    perSentence.forEach(({ s, keys }, i) => {
        if (questions.length >= MAX_PER_TEMA) return;
        // variedad: primero el tipo de dato que menos ha salido hasta ahora
        const ordered = [...keys].sort((a, b) =>
            ((typeCount[a.type] || 0) - (typeCount[b.type] || 0)) ||
            (priority.indexOf(a.type) - priority.indexOf(b.type)));
        for (const key of ordered) {
            const uniq = key.type + ':' + normKey(key.value) + ':' + i;
            if (used.has(uniq)) continue;
            const pool = shuffleLocal(pools[key.type] || []);
            const distractors = pickDistractors(key, pool, s);
            if (!distractors) continue;
            used.add(uniq);
            typeCount[key.type] = (typeCount[key.type] || 0) + 1;
            const blanked = s.slice(0, key.index) + '______' + s.slice(key.index + key.value.length);
            const answers = shuffleLocal([key.value, ...distractors]);
            questions.push({
                id: `usr-${temaId}-${questions.length + 1}`,
                question: `Completa según tu temario: «${blanked}»`,
                answers,
                correctIndex: answers.indexOf(key.value),
                explanation: `En tu temario: «${s}»`
            });
            break;
        }
    });
    return questions;
}

// ---------- Interfaz ----------

function setTemarioStatus(text) {
    const el = document.getElementById('temarioStatus');
    if (el) el.textContent = text || '';
}

function escapeTemario(value) {
    return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderTemarioList() {
    const list = document.getElementById('temarioList');
    if (!list) return;
    const temas = userTemarios.filter((t) => (t.questions || []).length);
    const backup = `
        <div class="temario-backup">
            <button type="button" class="pill-button outline" data-temario-export ${userTemarios.length ? '' : 'disabled'}>Guardar copia</button>
            <button type="button" class="pill-button outline" data-temario-import>Recuperar copia</button>
            <input type="file" id="temarioBackupFile" accept=".json,application/json" hidden>
        </div>`;
    if (!temas.length) {
        list.innerHTML = '<p class="library-empty">Aún no has subido ningún tema.</p>' + backup;
        return;
    }
    list.innerHTML = temas.map((t) => `
        <div class="prompt-card temario-item" data-id="${t.id}">
            <span class="prompt-label">${t.id === MANUAL_ID ? 'Escritas por ti' : 'Subido el ' + new Date(t.createdAt).toLocaleDateString('es-ES')}</span>
            <span class="prompt-answer">${escapeTemario(t.name)}</span>
            <span class="route-meta">${t.questions.length} preguntas</span>
            <div class="temario-actions">
                <button type="button" class="pill-button" data-temario-practice="${t.id}">Practicar</button>
                <button type="button" class="pill-button outline" data-temario-delete="${t.id}">Borrar</button>
            </div>
        </div>`).join('') + backup;
}

function renderManualTemaOptions() {
    const select = document.getElementById('manualTema');
    if (!select) return;
    const current = select.value;
    const opts = [{ id: MANUAL_ID, name: 'Mis preguntas' }]
        .concat(userTemarios.filter((t) => t.id !== MANUAL_ID));
    select.innerHTML = opts.map((t) => `<option value="${t.id}">${escapeTemario(t.name)}</option>`).join('');
    if (current) select.value = current;
}

async function createTemarioFromInput() {
    const fileInput = document.getElementById('temarioFile');
    const pasted = document.getElementById('temarioText').value.trim();
    const file = fileInput.files && fileInput.files[0];
    let name = document.getElementById('temarioName').value.trim();
    if (!file && !pasted) {
        setTemarioStatus('Elige un archivo o pega el texto de tu tema.');
        return;
    }
    const btn = document.getElementById('temarioCreateBtn');
    btn.disabled = true;
    try {
        setTemarioStatus('Leyendo tu tema…');
        const text = file ? await readTemarioFile(file) : pasted;
        if (!name) name = file ? file.name.replace(/\.[^.]+$/, '') : 'Mi tema ' + (userTemarios.length + 1);
        const id = Date.now().toString(36);
        const questions = buildClozeQuestions(text, id);
        if (!questions.length) {
            setTemarioStatus('No he encontrado datos clave (autores, leyes, fechas, cifras) para hacer preguntas. Si es un PDF escaneado, no tiene texto que leer: prueba a pegar el texto.');
            return;
        }
        userTemarios.push({ id, name, createdAt: Date.now(), questions });
        await saveUserTemarios();
        setTemarioStatus(`Listo: ${questions.length} preguntas de «${name}».`);
        fileInput.value = '';
        document.getElementById('temarioText').value = '';
        document.getElementById('temarioName').value = '';
        document.getElementById('temarioPickBtn').textContent = 'Elegir archivo (PDF, Word o texto)';
    } catch (error) {
        console.error(error);
        setTemarioStatus(error && error.message ? error.message : 'No se ha podido leer el archivo.');
    } finally {
        btn.disabled = false;
    }
}

async function saveManualQuestion() {
    const q = document.getElementById('manualQ').value.trim();
    const inputs = [...document.querySelectorAll('.manual-answer input[type="text"]')];
    const correctPos = Number(document.querySelector('input[name="manualCorrect"]:checked')?.value || 0);
    const filled = inputs.map((el, i) => ({ text: el.value.trim(), i })).filter((a) => a.text);
    if (!q || filled.length < 2 || !inputs[correctPos].value.trim()) {
        showToast('Escribe la pregunta, al menos dos respuestas y marca la correcta');
        return;
    }
    const temaId = document.getElementById('manualTema').value || MANUAL_ID;
    let tema = userTemarios.find((t) => t.id === temaId);
    if (!tema) {
        tema = { id: MANUAL_ID, name: 'Mis preguntas', createdAt: Date.now(), questions: [] };
        userTemarios.push(tema);
    }
    const answers = filled.map((a) => a.text);
    tema.questions.push({
        id: `usr-${tema.id}-m${Date.now().toString(36)}`,
        question: q,
        answers,
        correctIndex: filled.findIndex((a) => a.i === correctPos),
        explanation: document.getElementById('manualE').value.trim()
    });
    await saveUserTemarios();
    document.getElementById('manualQ').value = '';
    document.getElementById('manualE').value = '';
    inputs.forEach((el) => { el.value = ''; });
    showToast('✓ Pregunta guardada');
}

function practiceTemario(id) {
    const topic = 'USR:' + id;
    const pool = questionsData.filter((q) => q.category === topic);
    if (!pool.length) return;
    testMode = 'practice';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    blankAnswers = 0;
    currentTest = shuffleArray(pool);
    showView('testView');
    loadQuestion();
}

async function deleteTemario(id) {
    const tema = userTemarios.find((t) => t.id === id);
    if (!tema) return;
    const ok = await askConfirm({
        title: '¿Borrar este tema?',
        text: `Se borrarán las ${tema.questions.length} preguntas de «${tema.name}». Si no tienes una copia guardada, no se pueden recuperar.`,
        ok: 'Borrar',
        cancel: 'Cancelar'
    });
    if (!ok) return;
    userTemarios = userTemarios.filter((t) => t.id !== id);
    await saveUserTemarios();
}

function exportTemarios() {
    const blob = new Blob([JSON.stringify({ app: 'Aprobaula', version: 1, exportedAt: new Date().toISOString(), temarios: userTemarios })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aprobaula-mi-temario-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function importTemarios(file) {
    try {
        const data = JSON.parse(await file.text());
        const incoming = Array.isArray(data.temarios) ? data.temarios : [];
        let added = 0;
        incoming.forEach((t) => {
            if (!t || !t.id || !Array.isArray(t.questions)) return;
            const existing = userTemarios.find((x) => x.id === t.id);
            if (existing) {
                const ids = new Set(existing.questions.map((q) => q.id));
                t.questions.forEach((q) => { if (!ids.has(q.id)) { existing.questions.push(q); added++; } });
            } else {
                userTemarios.push(t);
                added += t.questions.length;
            }
        });
        await saveUserTemarios();
        showToast(added ? `✓ Recuperadas ${added} preguntas` : 'Esa copia ya estaba cargada');
    } catch (e) {
        showToast('Ese archivo no es una copia de Aprobaula');
    }
}

async function showTemario() {
    renderTemarioList();
    renderManualTemaOptions();
    showView('temarioView');
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserTemarios();
    document.getElementById('temarioPickBtn')?.addEventListener('click', () => document.getElementById('temarioFile').click());
    document.getElementById('temarioFile')?.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        document.getElementById('temarioPickBtn').textContent = f.name;
        const nameInput = document.getElementById('temarioName');
        if (!nameInput.value.trim()) nameInput.value = f.name.replace(/\.[^.]+$/, '');
    });
    document.getElementById('temarioCreateBtn')?.addEventListener('click', createTemarioFromInput);
    document.getElementById('manualSaveBtn')?.addEventListener('click', saveManualQuestion);
    document.getElementById('temarioHomeBtn')?.addEventListener('click', showTemario);
    document.getElementById('temarioList')?.addEventListener('click', (e) => {
        const practice = e.target.closest('[data-temario-practice]');
        if (practice) return practiceTemario(practice.dataset.temarioPractice);
        const del = e.target.closest('[data-temario-delete]');
        if (del) return deleteTemario(del.dataset.temarioDelete);
        if (e.target.closest('[data-temario-export]')) return exportTemarios();
        if (e.target.closest('[data-temario-import]')) document.getElementById('temarioBackupFile')?.click();
    });
    document.getElementById('temarioList')?.addEventListener('change', (e) => {
        if (e.target.id === 'temarioBackupFile' && e.target.files[0]) importTemarios(e.target.files[0]);
    });
});
