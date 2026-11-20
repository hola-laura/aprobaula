#!/usr/bin/env python3
"""Genera data/questions.json y js/questions-data.js a partir de bank/*.txt y bank/ccaa.py.

Formato de bank/*.txt:
    ## TEMA            (o "## TEMA @MD" para preguntas de una sola comunidad)
    ? enunciado
    + respuesta correcta
    - respuesta incorrecta (x3)
    = explicación
"""
import glob, json, os, random, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'bank'))
from ccaa import CCAA, ccaa_questions  # noqa: E402

TOPICS = {
    'M01': 'Características del niño hasta los 6 años',
    'M02': 'Desarrollo psicomotor',
    'M03': 'Desarrollo de la personalidad y afectividad',
    'M04': 'El niño descubre a los otros',
    'M05': 'Desarrollo cognitivo',
    'M06': 'Corrientes pedagógicas y psicológicas',
    'M07': 'La familia y el periodo de adaptación',
    'M08': 'Educación para la salud',
    'M09': 'Alimentación, nutrición y dietética',
    'M10': 'Educación afectivo-sexual e igualdad',
    'M11': 'Capacidades, áreas y competencias del currículo',
    'M12': 'Principios de intervención educativa',
    'M13': 'Programación del primer ciclo (0-3)',
    'M14': 'Programación del segundo ciclo (3-6)',
    'M15': 'La función del maestro',
    'M16': 'Organización del espacio y del tiempo',
    'M17': 'Equipamiento y materiales',
    'M18': 'Desarrollo del lenguaje',
    'M19': 'Enseñanza de la lengua',
    'M20': 'Literatura infantil',
    'M21': 'Educación musical',
    'M22': 'Expresión plástica',
    'M23': 'Expresión corporal y juego',
    'M24': 'La imagen y los medios',
    'M25': 'Desarrollo lógico-matemático',
    'LEY': 'Legislación educativa estatal',
    'CUR': 'Currículo de tu comunidad',
    'E03': 'Cuidados y rutinas en 0-3',
    'EI03': 'Normativa de escuelas infantiles',
    'CE': 'Constitución Española',
    'EST': 'Estatuto de Autonomía',
    'FP': 'Empleo público, igualdad y prevención',
}
CAM_GENERAL = {
    'G01': 'La Constitución Española de 1978',
    'G02': 'El Estatuto de Autonomía de la Comunidad de Madrid',
    'G03': 'La Asamblea y el Gobierno de la Comunidad de Madrid',
    'G04': 'La Administración de la Comunidad de Madrid',
    'G05': 'Información y atención al ciudadano. Administración electrónica',
    'G06': 'Protección de datos personales',
    'G07': 'El personal de las Administraciones Públicas (TREBEP)',
    'G08': 'Derechos y deberes, código de conducta, régimen disciplinario e incompatibilidades',
    'G09': 'El Convenio colectivo del personal laboral de la Comunidad de Madrid',
    'G10': 'Igualdad, violencia de género y LGTBIfobia',
}
CAM_SPECIFIC = {
    'S01': 'Modalidades de atención a la infancia y tendencias pedagógicas',
    'S02': 'La Escuela Infantil en el sistema educativo. Derechos y protección a la infancia',
    'S03': 'La infancia en situación de riesgo social. Maltrato infantil',
    'S04': 'La Educación Infantil: sentido, finalidad y marco legal en Madrid',
    'S05': 'Organización de las Escuelas de Educación Infantil',
    'S06': 'La evaluación en la Escuela Infantil',
    'S07': 'Documentos organizativos. Proyecto Educativo de Centro',
    'S08': 'Teoría curricular y niveles de concreción',
    'S09': 'La Propuesta Pedagógica. Programación en el primer ciclo',
    'S10': 'Principios de intervención educativa. Espacios, tiempos y recursos',
    'S11': 'La atención a la diversidad',
    'S12': 'Perfil del Técnico Superior en Educación Infantil',
    'S13': 'El período de adaptación',
    'S14': 'El juego en el desarrollo del niño',
    'S15': 'La familia y la relación familia-escuela',
    'S16': 'Desarrollo de 0 a 6 años. Desarrollo sensoriomotor y cognitivo',
    'S17': 'Desarrollo afectivo-emocional',
    'S18': 'Desarrollo social. El apego. Normas y límites',
    'S19': 'La psicomotricidad',
    'S20': 'Desarrollo del lenguaje y la comunicación',
    'S21': 'Estrategias para el lenguaje oral. Literatura infantil',
    'S22': 'La lengua inglesa en edades tempranas',
    'S23': 'La nutrición de 0 a 6 años',
    'S24': 'La higiene. Control de esfínteres',
    'S25': 'Actividad y descanso. El sueño',
    'S26': 'Expresión musical',
    'S27': 'Expresión plástica',
    'S28': 'La expresión lógico-matemática',
    'S29': 'El niño y la cultura audiovisual. Las TIC',
    'S30': 'Primeros auxilios y entornos seguros',
}
TOPICS.update(CAM_GENERAL)
TOPICS.update(CAM_SPECIFIC)
TEMA_NUM = {f'M{i:02d}': i for i in range(1, 26)}
TEMA_LABEL = {}
TEMA_LABEL.update({k: f'General {int(k[1:])}' for k in CAM_GENERAL})
TEMA_LABEL.update({k: f'Tema {int(k[1:])}' for k in CAM_SPECIFIC})

# Las preguntas comunes se reutilizan en la vía de la Comunidad de Madrid,
# asignadas al tema del anexo III de la Orden 2120/2023 que les corresponde.
CAM_MAP = {
    'M01': 'S16', 'M02': 'S19', 'M03': 'S17', 'M04': 'S18', 'M05': 'S16', 'M06': 'S01',
    'M09': 'S23', 'M10': 'S17', 'M11': 'S08', 'M12': 'S10', 'M13': 'S09', 'M14': 'S06',
    'M15': 'S12', 'M16': 'S10', 'M17': 'S10', 'M18': 'S20', 'M19': 'S21', 'M20': 'S21',
    'M21': 'S26', 'M22': 'S27', 'M23': 'S14', 'M24': 'S29', 'M25': 'S28', 'CE': 'G01',
}


def cam_topic(q):
    t, text = q['tema'], (q['q'] + ' ' + ' '.join(q['answers'])).lower()
    has = lambda *ws: any(w in text for w in ws)
    if q['ccaa'] not in (None, 'MD'):
        return None
    if t in CAM_MAP:
        if t == 'M14' and not has('evalua', 'informe'):
            return None
        if t == 'M15' and has('maestro tutor', 'tutoría'):
            return None
        return CAM_MAP[t]
    if t == 'M07':
        return 'S13' if has('adaptación') else 'S15'
    if t in ('M08', 'E03'):
        if has('atragant', 'herida', 'fiebre', 'lactante', 'pilas', 'juguetes', 'enchufes'):
            return 'S30'
        if has('dormir', 'sueño', 'descanso', 'siesta', 'cuna'):
            return 'S25'
        if has('adaptación', 'llora'):
            return 'S13'
        return 'S24'
    if t == 'LEY':
        if has('lopivi', 'violencia', 'convención', 'delincuentes', 'sospecha'):
            return 'S02'
        if has('protección de datos', '3/2018'):
            return 'G06'
        if has('95/2022', 'lomloe', '3/2020', 'voluntario', 'objetivo', 'evaluación', 'finalidad', 'tramo de edad', 'dua', 'enfoques', 'segundo ciclo'):
            return 'S04'
        return None
    if t == 'FP':
        if has('3/2007', 'composición equilibrada'):
            return 'G10'
        if has('trebep', 'empleado público', 'grupo b', 'subgrupo', 'situación administrativa', 'edad mínima', 'vacaciones', 'publicidad'):
            return 'G07' if has('clases', 'subgrupo', 'grupo b', 'trebep', 'edad mínima', 'publicidad') else 'G08'
        if has('39/2015', '40/2015', 'alzada'):
            return 'G05'
        return None
    if t == 'CUR' and q['ccaa'] == 'MD':
        return 'S04'
    if t == 'EST' and q['ccaa'] == 'MD':
        return 'G02'
    if t == 'EI03' and q['ccaa'] in (None, 'MD'):
        return 'S05'
    return None

ROUTES = {
    'maestros': {
        'label': 'Maestros · Educación Infantil',
        'short': 'Maestros',
        'topics': [f'M{i:02d}' for i in range(1, 26)] + ['LEY', 'CUR'],
    },
    'educador': {
        'label': 'Educador/a Infantil 0-3',
        'short': 'Educador 0-3',
        'topics': ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10',
                   'M12', 'M13', 'M15', 'M16', 'M17', 'M18', 'M20', 'M21', 'M23',
                   'E03', 'EI03', 'LEY', 'CUR', 'CE', 'EST', 'FP'],
    },
    'educador_cam': {
        'label': 'Educador/a · Comunidad de Madrid (Grupo III)',
        'short': 'Educador CAM',
        'fixedCcaa': 'MD',
        'topics': list(CAM_GENERAL) + list(CAM_SPECIFIC),
        'exam': {
            'size': 60,
            'blocks': [{'topics': list(CAM_GENERAL), 'count': 10}, {'topics': list(CAM_SPECIFIC), 'count': 50}],
            'minutes': 65,
            'maxScore': 30,
            'passScore': 15,
            'name': 'Simulacro del primer ejercicio',
            'meta': '60 preguntas (10 general + 50 específico) · 65 min · fallos restan 1/3 · nota sobre 30',
        },
    },
}


def parse_bank():
    out = []
    for path in sorted(glob.glob(os.path.join(ROOT, 'bank', '*.txt'))):
        tema, ccaa, cur = None, None, None
        for raw in open(path, encoding='utf-8'):
            line = raw.rstrip('\n')
            if line.startswith('## '):
                parts = line[3:].split()
                tema = parts[0]
                ccaa = parts[1][1:] if len(parts) > 1 and parts[1].startswith('@') else None
                assert tema in TOPICS, (path, tema)
            elif line.startswith('? '):
                cur = {'tema': tema, 'ccaa': ccaa, 'q': line[2:].strip(), 'answers': [], 'correct': None, 'e': ''}
                out.append(cur)
            elif line.startswith('+ '):
                cur['correct'] = len(cur['answers'])
                cur['answers'].append(line[2:].strip())
            elif line.startswith('- '):
                cur['answers'].append(line[2:].strip())
            elif line.startswith('= '):
                cur['e'] = line[2:].strip()
    for q in out:
        assert q['correct'] is not None and len(q['answers']) == 4 and q['e'], q
    return out


def main():
    rng = random.Random(20261120)
    items = parse_bank() + ccaa_questions(random.Random(7))
    extra = []
    for q in items:
        if q['tema'] in CAM_GENERAL or q['tema'] in CAM_SPECIFIC:
            continue
        ct = cam_topic(q)
        if ct:
            extra.append(dict(q, tema=ct, ccaa=None))
    items = items + extra
    counters = {}
    questions = []
    for q in items:
        answers = q['answers'][:]
        correct_text = answers[q['correct']]
        rng.shuffle(answers)
        counters[q['tema']] = counters.get(q['tema'], 0) + 1
        qid = f"{q['tema'].lower()}-{q['ccaa'].lower() + '-' if q['ccaa'] else ''}{counters[q['tema']]}"
        questions.append({
            'id': qid,
            'topic': q['tema'],
            'ccaa': q['ccaa'],
            'question': q['q'],
            'answers': answers,
            'correctIndex': answers.index(correct_text),
            'explanation': q['e'],
        })
    ids = [q['id'] for q in questions]
    assert len(ids) == len(set(ids))
    data = {
        'schemaVersion': 1,
        'app': 'Aprobaula',
        'updatedAt': '2026-11-20',
        'totalQuestions': len(questions),
        'topics': TOPICS,
        'temaNumbers': TEMA_NUM,
        'temaLabels': TEMA_LABEL,
        'routes': ROUTES,
        'ccaa': {k: v[0] for k, v in CCAA.items()},
        'questions': questions,
    }
    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    with open(os.path.join(ROOT, 'data', 'questions.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    with open(os.path.join(ROOT, 'js', 'questions-data.js'), 'w', encoding='utf-8') as f:
        f.write('var QUESTIONS_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    by = {}
    for q in questions:
        by[q['topic']] = by.get(q['topic'], 0) + 1
    print(len(questions), 'preguntas')
    print(by)
    pos = [q['correctIndex'] for q in questions]
    print('posición correcta:', {i: pos.count(i) for i in range(4)})


if __name__ == '__main__':
    main()
