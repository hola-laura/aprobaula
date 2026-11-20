// Verdadero o falso: desliza a la derecha si es verdadero, a la izquierda si es falso.

// [etiqueta, afirmación, esVerdadera, explicación]
const MATCH_CARDS = [
    ['Piaget', 'El estadio sensoriomotor va aproximadamente del nacimiento a los 2 años.', true, 'Termina con la aparición de la función simbólica, hacia los 18-24 meses.'],
    ['Piaget', 'La conservación de la cantidad se consigue en el estadio preoperacional.', false, 'Llega con las operaciones concretas, hacia los 7 años. En el preoperacional el niño se centra en un solo rasgo.'],
    ['Vygotsky', 'La zona de desarrollo próximo es lo que el niño ya domina solo.', false, 'Es la distancia entre lo que hace solo y lo que puede hacer con ayuda.'],
    ['Vygotsky', 'Para Vygotsky el aprendizaje empieza en la interacción social y después se interioriza.', true, 'Es la ley de doble formación: primero entre personas (interpsicológico) y luego dentro del niño (intrapsicológico).'],
    ['Montessori', 'Propuso un ambiente preparado con material autocorrectivo.', true, 'El niño detecta su propio error con el material, sin depender del adulto.'],
    ['Montessori', 'Creó los centros de interés.', false, 'Los centros de interés son de Decroly.'],
    ['Decroly', 'Defendió el método global de lectura.', true, 'Para Decroly el niño percibe primero el todo y después las partes.'],
    ['Fröbel', 'Fundó el primer Kindergarten.', true, 'Lo fundó en 1840 y diseñó los dones, materiales geométricos para jugar.'],
    ['Malaguzzi', 'Llamó al ambiente "el tercer maestro".', true, 'En Reggio Emilia el espacio educa: luz, materiales y orden comunican una idea de infancia.'],
    ['Pikler', 'Recomendaba sentar al bebé antes de que lo consiga solo para estimularle.', false, 'Pikler defendía la libertad de movimiento: no colocar al bebé en posturas que aún no alcanza por sí mismo.'],
    ['Bowlby', 'Formuló la teoría del apego.', true, 'Mary Ainsworth desarrolló después la situación extraña y los tipos de apego.'],
    ['Erikson', 'La crisis de iniciativa frente a culpa corresponde a los 3-6 años.', true, 'Antes están confianza/desconfianza y autonomía/vergüenza y duda.'],
    ['Spitz', 'La angustia del octavo mes indica un problema de apego.', false, 'Es un hito sano: el bebé ya distingue a sus figuras de apego de los extraños.'],
    ['Ausubel', 'El aprendizaje significativo exige partir de lo que el niño ya sabe.', true, 'Lo nuevo debe relacionarse de forma no arbitraria con los conocimientos previos.'],
    ['Lowenfeld', 'La etapa del garabateo va aproximadamente de los 2 a los 4 años.', true, 'Después llega la etapa preesquemática, con los primeros "renacuajos".'],
    ['Ferreiro y Teberosky', 'En el nivel silábico el niño escribe una letra por cada sílaba.', true, 'Por ejemplo, "AO" para "gato".'],
    ['Orff', 'Su método se basa solo en escuchar música clásica.', false, 'Parte de la palabra, el ritmo, el movimiento y un instrumental de láminas.'],
    ['Dienes', 'Los bloques lógicos varían en forma, color, tamaño y grosor.', true, 'Son 48 piezas: 4 formas, 3 colores, 2 tamaños y 2 grosores.'],
    ['RD 95/2022', 'Las áreas de Infantil son tres.', true, 'Crecimiento en Armonía; Descubrimiento y Exploración del Entorno; Comunicación y Representación de la Realidad.'],
    ['RD 95/2022', 'La evaluación en Infantil es final y numérica.', false, 'Es global, continua y formativa, con la observación como técnica principal.'],
    ['LOMLOE', 'La Educación Infantil es obligatoria desde los 3 años.', false, 'Es voluntaria. El segundo ciclo es gratuito.'],
    ['LOMLOE', 'Las competencias clave son ocho.', true, 'Siguen la Recomendación del Consejo de la UE de 22 de mayo de 2018.'],
    ['LOPIVI', 'Obliga a los centros a tener un coordinador de bienestar y protección.', true, 'Lo establece la Ley Orgánica 8/2021.'],
    ['LOPIVI', 'Para comunicar una sospecha de violencia hay que tener pruebas concluyentes.', false, 'Basta con indicios. Quien trabaja con menores tiene un deber de comunicación cualificado.'],
    ['Constitución', 'El derecho a la educación está en el artículo 27.', true, 'Reconoce también la libertad de enseñanza y la gratuidad de la enseñanza básica.'],
    ['Constitución', 'El artículo 39 regula el acceso a la función pública.', false, 'El 39 protege a la familia y a los hijos. El acceso a la función pública está en los artículos 23.2 y 103.3.'],
    ['TREBEP', 'El personal eventual es una clase de empleado público.', true, 'Junto a funcionarios de carrera, interinos y personal laboral.'],
    ['Salud', 'Un bebé debe dormir boca arriba para prevenir la muerte súbita.', true, 'Sobre colchón firme y sin almohadas ni peluches en la cuna.'],
    ['Salud', 'Ante una herida se aplica algodón directamente.', false, 'El algodón deja restos. Se lava con agua y jabón y se presiona con una gasa.'],
    ['Alimentación', 'La miel está desaconsejada antes del año.', true, 'Puede contener esporas de la bacteria del botulismo.'],
    ['Alimentación', 'La alimentación complementaria se inicia hacia los 6 meses.', true, 'Es lo que recomiendan la OMS y la AEP, manteniendo la lactancia.'],
    ['Esfínteres', 'Si un niño tiene un escape, conviene reñirle para que aprenda.', false, 'Los escapes son parte del proceso. Reñir genera tensión y suele retrasar el control.'],
    ['Juego', 'El juego paralelo consiste en jugar al lado de otro sin interactuar.', true, 'Es típico hacia los 2-3 años, según la clasificación de Parten.'],
    ['Lenguaje', 'La holofrase es una frase de varias palabras.', false, 'Es una sola palabra que expresa una idea completa, como "agua" por "quiero agua".'],
    ['Lenguaje', 'Decir "yo cabo" es una hiperregularización.', true, 'El niño aplica la regla general a un verbo irregular: señal de que ha aprendido la regla.']
];
const MATCH_ROUND = 10;
let match = null;

function signSVG(key) {
    return `<span class="match-label">${key}</span>`;
}

function shuffleCards(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickRound() {
    // One card per sign per round, so you never see the same sign twice in a row.
    const seen = new Set();
    const out = [];
    for (const card of shuffleCards(MATCH_CARDS)) {
        if (seen.has(card[0])) continue;
        seen.add(card[0]);
        out.push(card);
        if (out.length === MATCH_ROUND) break;
    }
    return out;
}

function startMatch() {
    match = { cards: pickRound(), index: 0, correct: 0, locked: false };
    document.getElementById('matchResult').hidden = true;
    document.getElementById('matchFeedback').hidden = true;
    document.getElementById('matchPlay').hidden = false;
    renderMatchCard();
}

function renderMatchProgress() {
    const dots = document.getElementById('matchDots');
    dots.innerHTML = match.cards.map((_, i) => {
        const state = i < match.index ? (match.results?.[i] ? 'ok' : 'ko') : i === match.index ? 'now' : '';
        return `<span class="match-dot ${state}"></span>`;
    }).join('');
}

function renderMatchCard() {
    const stack = document.getElementById('matchStack');
    const [sign, text] = match.cards[match.index];
    const next = match.cards[match.index + 1];
    stack.innerHTML = `
        ${next ? `<div class="match-card is-behind" aria-hidden="true"><div class="match-sign">${signSVG(next[0])}</div></div>` : ''}
        <div class="match-card" id="matchCard">
            <span class="match-stamp yes">Verdadero</span>
            <span class="match-stamp no">Falso</span>
            <span class="prompt-label">¿Verdadero o falso?</span>
            <div class="match-sign">${signSVG(sign)}</div>
            <p class="prompt-answer match-text">${text}</p>
        </div>`;
    match.locked = false;
    renderMatchProgress();
    bindMatchDrag(document.getElementById('matchCard'));
}

function bindMatchDrag(card) {
    let startX = 0;
    let dx = 0;
    let dragging = false;
    const onMove = (e) => {
        if (!dragging) return;
        dx = e.clientX - startX;
        card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
        card.style.setProperty('--yes', Math.max(0, Math.min(1, dx / 90)));
        card.style.setProperty('--no', Math.max(0, Math.min(1, -dx / 90)));
    };
    const onUp = () => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');
        if (Math.abs(dx) > 90) {
            answerMatch(dx > 0);
        } else {
            card.style.transform = '';
            card.style.setProperty('--yes', 0);
            card.style.setProperty('--no', 0);
        }
    };
    card.addEventListener('pointerdown', (e) => {
        if (match.locked) return;
        dragging = true;
        startX = e.clientX;
        dx = 0;
        card.classList.add('is-dragging');
        card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onUp);
}

function answerMatch(saidTrue) {
    if (!match || match.locked) return;
    match.locked = true;
    const card = document.getElementById('matchCard');
    const [, , isTrue, why] = match.cards[match.index];
    const ok = saidTrue === isTrue;
    match.results = match.results || [];
    match.results[match.index] = ok;
    if (ok) match.correct++;

    card.classList.add(saidTrue ? 'fly-right' : 'fly-left');
    card.style.transform = '';

    if (ok) {
        const chip = document.getElementById('matchChip');
        chip.classList.remove('show');
        void chip.offsetWidth;
        chip.classList.add('show');
        setTimeout(nextMatchCard, 650);
    } else {
        const fb = document.getElementById('matchFeedback');
        document.getElementById('matchFeedbackTitle').textContent = isTrue ? 'Era verdadero' : 'Era falso';
        document.getElementById('matchFeedbackText').textContent = why;
        setTimeout(() => { fb.hidden = false; }, 280);
    }
}

function nextMatchCard() {
    document.getElementById('matchFeedback').hidden = true;
    match.index++;
    if (match.index >= match.cards.length) {
        finishMatch();
        return;
    }
    renderMatchCard();
}

function finishMatch() {
    renderMatchProgress();
    const xp = match.correct;
    userStats.gameXp = (userStats.gameXp || 0) + xp;
    userStats.matchBest = Math.max(userStats.matchBest || 0, match.correct);
    saveUserStats();
    if (typeof updateHomeStats === 'function') updateHomeStats();
    document.getElementById('matchPlay').hidden = true;
    document.getElementById('matchScore').textContent = `${match.correct}/${match.cards.length}`;
    document.getElementById('matchScoreSub').textContent = match.correct === match.cards.length
        ? `¡Ronda perfecta! +${xp} XP`
        : `+${xp} XP · Tu mejor ronda: ${userStats.matchBest}/${MATCH_ROUND}`;
    document.getElementById('matchResult').hidden = false;
    if (match.correct >= 8 && typeof maybeAskForReview === 'function') maybeAskForReview();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('matchNo')?.addEventListener('click', () => answerMatch(false));
    document.getElementById('matchYes')?.addEventListener('click', () => answerMatch(true));
    document.getElementById('matchContinue')?.addEventListener('click', nextMatchCard);
    document.getElementById('matchAgain')?.addEventListener('click', startMatch);
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('gameView')?.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') answerMatch(false);
        if (e.key === 'ArrowRight') answerMatch(true);
    });
});
