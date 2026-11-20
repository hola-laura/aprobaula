// Estudiar: fichas por tema, supuestos prácticos y autores.

// Qué entra en cada uno de los 25 temas de Maestros (resumen propio del epígrafe oficial,
// Orden de 9 de septiembre de 1993) y en los bloques comunes.
const TEMA_SCOPE = {
    M01: 'Factores del desarrollo, etapas y momentos significativos, el primer año de vida y el papel de los adultos.',
    M02: 'Desarrollo psicomotor hasta los 6 años, psicomotricidad en el currículo, sensación y percepción, intervención educativa.',
    M03: 'Desarrollo afectivo, aportaciones de distintos autores, conquista de la autonomía y pautas de intervención.',
    M04: 'Descubrimiento del otro, vinculación y aceptación, escuela socializadora, riesgo social y conflictos en el grupo.',
    M05: 'Conocimiento de la realidad, observación y exploración del mundo físico, natural y social, formación de conceptos.',
    M06: 'Corrientes pedagógicas y psicológicas, experiencias renovadoras y valoración crítica.',
    M07: 'Función educativa de la familia, periodo de adaptación y relación entre familias y equipo docente.',
    M08: 'Descanso, higiene, actividad, prevención de accidentes, primeros auxilios y enfermedades infantiles.',
    M09: 'Alimentación, nutrición y dietética, menús equilibrados, trastornos alimentarios y la comida como momento educativo.',
    M10: 'Educación afectivo-sexual, identidad y roles, y prevención de la discriminación por razón de sexo.',
    M11: 'Capacidades generales de la etapa a través de objetivos, competencias y saberes de las áreas.',
    M12: 'Enfoque globalizador, aprendizaje significativo, observación y experimentación, atención a la diversidad.',
    M13: 'Programación en 0-3: objetivos, contenidos y metodología adecuados a esas edades.',
    M14: 'Programación en 3-6, unidades de programación o situaciones de aprendizaje y continuidad con Primaria.',
    M15: 'Intencionalidad educativa, relaciones en el aula, trabajo en equipo y relación con las familias.',
    M16: 'Espacios y tiempos, ritmos y rutinas, y evaluación de ambos.',
    M17: 'Equipamiento, material didáctico y curricular: selección, uso y evaluación.',
    M18: 'Lenguaje y pensamiento, comprensión y expresión, comunicación no verbal y problemas frecuentes.',
    M19: 'Técnicas y recursos para la lengua oral, aproximación a la lectura y la escritura, lenguas en contacto.',
    M20: 'Literatura infantil, valor del cuento, criterios de selección, narración y biblioteca de aula.',
    M21: 'Educación musical, sonido y silencio, actividades, recursos y folklore.',
    M22: 'Evolución de la expresión plástica, elementos, técnicas, materiales y evaluación.',
    M23: 'Expresión corporal, gesto y movimiento, juego simbólico y dramatización.',
    M24: 'Lectura de imágenes, medios audiovisuales, publicidad y tecnologías en el aula.',
    M25: 'Capacidades lógico-matemáticas, recursos y actividades para la etapa.',
    LEY: 'LOE-LOMLOE, Real Decreto 95/2022, LOPIVI, protección de datos y acceso a la función docente.',
    CUR: 'El decreto de currículo de Infantil de tu comunidad.',
    E03: 'Cuidados y rutinas en 0-3: control de esfínteres, sueño, cambio, adaptación, higiene y prevención de infecciones.',
    EI03: 'Normativa de las escuelas infantiles: requisitos mínimos, ratios y profesionales.',
    CE: 'Constitución Española: estructura, derechos y deberes, y artículos clave para educación.',
    EST: 'El Estatuto de Autonomía de tu comunidad.',
    FP: 'TREBEP, procedimiento administrativo, igualdad y prevención de riesgos laborales.',
    G01: 'Constitución de 1978: características, estructura, principios, derechos y deberes fundamentales y su protección.',
    G02: 'Estatuto de Autonomía de Madrid: estructura, contenido y competencias (legislativa, reglamentaria y ejecutiva).',
    G03: 'Asamblea de Madrid, procedimiento legislativo, Ley de Gobierno y Administración, Presidente y Consejeros.',
    G04: 'Consejerías, Administración institucional y Administración de Justicia en Madrid.',
    G05: 'Información y atención al ciudadano (presencial, electrónica y telefónica), identificación electrónica.',
    G06: 'RGPD (Reglamento 2016/679) y Ley Orgánica 3/2018.',
    G07: 'TREBEP y clases de personal.',
    G08: 'Derechos y deberes, código de conducta, régimen disciplinario e incompatibilidades.',
    G09: 'Convenio colectivo único del personal laboral de la Comunidad de Madrid.',
    G10: 'Igualdad, violencia de género, LGTBIfobia; especial referencia a Madrid.',
    S01: 'Modalidades de atención a la infancia en España, la UE y otros países; tendencias pedagógicas y psicológicas.',
    S02: 'La escuela infantil en el sistema educativo, derechos y protección a la infancia, organismos internacionales.',
    S03: 'Riesgo social, detección y notificación del maltrato, programas de apoyo.',
    S04: 'Sentido y finalidad de la etapa, ciclos y áreas, marco legal en Madrid.',
    S05: 'Organización de las escuelas: órganos de gobierno, equipo educativo y participación.',
    S06: 'Evaluación: fines, tipos, instrumentos, evaluación inicial, observación e información a familias.',
    S07: 'Documentos organizativos y Proyecto Educativo de Centro.',
    S08: 'Teoría curricular, fuentes y niveles de concreción.',
    S09: 'Propuesta pedagógica y programación en el primer ciclo.',
    S10: 'Principios de intervención, enfoque globalizador, espacios, tiempos y recursos.',
    S11: 'Atención a la diversidad y necesidades educativas especiales.',
    S12: 'Perfil del TSEI: funciones, trabajo en equipo, reuniones y gestión de conflictos.',
    S13: 'Planificación del período de adaptación y papel de familia y equipo.',
    S14: 'El juego: evolución, tipos, metodología y materiales.',
    S15: 'La familia, relación familia-escuela y cauces de participación.',
    S16: 'Desarrollo de 0 a 6 años, desarrollo sensoriomotor y cognitivo.',
    S17: 'Desarrollo afectivo-emocional, identidad, autonomía y sexualidad infantil.',
    S18: 'Desarrollo social, apego, vida en grupo, moralidad, normas y límites.',
    S19: 'Psicomotricidad, esquema corporal, lateralidad, espacio y tiempo.',
    S20: 'Desarrollo del lenguaje: teorías, evolución y problemas frecuentes.',
    S21: 'Recursos para el lenguaje oral y literatura infantil.',
    S22: 'Inglés en edades tempranas y bilingüismo.',
    S23: 'Nutrición, dieta equilibrada, alergias e intolerancias, la comida como momento educativo.',
    S24: 'Higiene, hábitos y control de esfínteres.',
    S25: 'Actividad, descanso y sueño de 0 a 6 años.',
    S26: 'Expresión musical: sonido, ritmo, canción y folklore.',
    S27: 'Expresión plástica y evolución de la expresión gráfica.',
    S28: 'Pensamiento lógico-matemático.',
    S29: 'Cultura audiovisual y TIC.',
    S30: 'Primeros auxilios, accidentes y entornos seguros.',
};

let studyPane = 'fichas';

function setStudyPane(pane) {
    studyPane = pane;
    document.querySelectorAll('#studyTabs [data-study]').forEach((btn) => {
        btn.setAttribute('aria-selected', btn.dataset.study === pane ? 'true' : 'false');
    });
    document.getElementById('studyFichas').hidden = pane !== 'fichas';
    document.getElementById('studySupuestos').hidden = pane !== 'supuestos';
    document.getElementById('studyAutores').hidden = pane !== 'autores';
    if (pane === 'fichas') renderFichas();
    if (pane === 'supuestos') renderSupuestos();
    if (pane === 'autores') loadGlossary();
}

function studyEscape(value) {
    return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderFichas() {
    const box = document.getElementById('studyFichas');
    const key = (userRoute() || 'all') + ':' + (userCcaa() || '') + ':' + questionsData.length;
    if (box.dataset.key === key) return;
    box.dataset.key = key;
    const byTopic = {};
    questionsData.forEach((q) => {
        if (String(q.category).startsWith('USR:')) return;
        (byTopic[q.category] = byTopic[q.category] || []).push(q);
    });
    const topics = routeTopics().filter((t) => byTopic[t]);
    box.innerHTML = topics.map((topic) => {
        const seen = new Set();
        const ideas = byTopic[topic]
            .map((q) => (q.explanation || '').trim())
            .filter((e) => e && !seen.has(e) && seen.add(e));
        const scope = TEMA_SCOPE[topic];
        return `
            <details class="prompt-card ficha">
                <summary>
                    <span class="prompt-label">${ideas.length} ideas clave</span>
                    <span class="ficha-title">${studyEscape(displayCategory(topic))}</span>
                </summary>
                ${scope ? `<p class="ficha-scope"><strong>Qué entra:</strong> ${studyEscape(scope)}</p>` : ''}
                <ul class="ficha-list">${ideas.map((e) => `<li>${studyEscape(e)}</li>`).join('')}</ul>
                <button type="button" class="pill-button outline ficha-practice" data-practice-topic="${topic}">Practicar este tema</button>
            </details>`;
    }).join('') + '<p class="glossary-credit">Las fichas resumen las ideas clave de las preguntas. No sustituyen al tema completo: úsalas para repasar.</p>';
}

function supuestoAnswerKey(id) {
    return 'aprobaula:supuesto:' + id;
}

function renderSupuestos() {
    const box = document.getElementById('studySupuestos');
    const route = userRoute();
    const list = SUPUESTOS.filter((s) => !route || s.routes.includes(route));
    box.innerHTML = list.map((s) => {
        let saved = '';
        try { saved = localStorage.getItem(supuestoAnswerKey(s.id)) || ''; } catch (e) {}
        return `
            <details class="prompt-card supuesto" data-id="${s.id}">
                <summary>
                    <span class="prompt-label">${studyEscape(s.edad)}</span>
                    <span class="ficha-title">${studyEscape(s.titulo)}</span>
                </summary>
                <p class="supuesto-text">${studyEscape(s.enunciado)}</p>
                <ol class="ficha-list supuesto-questions">${s.preguntas.map((p) => `<li>${studyEscape(p)}</li>`).join('')}</ol>
                <label class="form-label" for="ans-${s.id}">Tu respuesta</label>
                <textarea id="ans-${s.id}" class="form-input supuesto-answer" rows="6" placeholder="Escribe tu planteamiento. Se guarda en este dispositivo.">${studyEscape(saved)}</textarea>
                <button type="button" class="pill-button" data-show-claves="${s.id}">Ver claves de resolución</button>
                <div class="supuesto-claves" hidden>
                    <p class="prompt-label">Claves</p>
                    <ul class="ficha-list">${s.claves.map((c) => `<li>${studyEscape(c)}</li>`).join('')}</ul>
                    <p class="prompt-label">Normativa a citar</p>
                    <ul class="ficha-list">${s.normativa.map((n) => `<li>${studyEscape(n)}</li>`).join('')}</ul>
                </div>
            </details>`;
    }).join('') + '<p class="glossary-credit">Supuestos de elaboración propia. El formato real (escrito, oral o test) depende de cada convocatoria.</p>';
}

function practiceTopic(topic) {
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

// Sustituye al showGlossary de app.js: ahora abre la sección Estudiar.
async function showGlossary() {
    await runWithLoader(async () => {
        await ensureQuestions();
        setStudyPane(studyPane);
    });
    showView('glossaryView');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('studyTabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-study]');
        if (btn) setStudyPane(btn.dataset.study);
    });
    const view = document.getElementById('glossaryView');
    view?.addEventListener('click', (e) => {
        const practice = e.target.closest('[data-practice-topic]');
        if (practice) return practiceTopic(practice.dataset.practiceTopic);
        const claves = e.target.closest('[data-show-claves]');
        if (claves) {
            const panel = claves.nextElementSibling;
            panel.hidden = !panel.hidden;
            claves.textContent = panel.hidden ? 'Ver claves de resolución' : 'Ocultar claves';
        }
    });
    view?.addEventListener('input', (e) => {
        if (!e.target.classList.contains('supuesto-answer')) return;
        const id = e.target.closest('[data-id]')?.dataset.id;
        try { if (id) localStorage.setItem(supuestoAnswerKey(id), e.target.value); } catch (err) {}
    });
});
