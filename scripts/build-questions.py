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
TEMA_NUM = {f'M{i:02d}': i for i in range(1, 26)}

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
