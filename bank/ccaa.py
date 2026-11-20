# Datos por comunidad, verificados en nov. 2026 (ver README: fuentes).
# code: (nombre, norma currículo Infantil LOMLOE, Estatuto de Autonomía, norma requisitos centros 0-3 o None)
CCAA = {
    'AN': ('Andalucía', 'el Decreto 100/2023, de 9 de mayo (desarrollado por la Orden de 30 de mayo de 2023)', 'la Ley Orgánica 2/2007, de 19 de marzo', 'el Decreto 76/2025, de 5 de marzo'),
    'AR': ('Aragón', 'la Orden ECD/853/2022, de 13 de junio', 'la Ley Orgánica 5/2007, de 20 de abril', None),
    'AS': ('Principado de Asturias', 'el Decreto 56/2022, de 5 de agosto', 'la Ley Orgánica 7/1981, de 30 de diciembre', 'el Decreto 27/2015, de 15 de abril'),
    'IB': ('Illes Balears', 'el Decreto 30/2022, de 1 de agosto', 'la Ley Orgánica 1/2007, de 28 de febrero', 'el Decreto 23/2020, de 31 de julio (texto consolidado)'),
    'CN': ('Canarias', 'el Decreto 196/2022, de 13 de octubre', 'la Ley Orgánica 1/2018, de 5 de noviembre', 'el Decreto 201/2008, de 30 de septiembre'),
    'CB': ('Cantabria', 'el Decreto 66/2022, de 7 de julio (Infantil y Primaria)', 'la Ley Orgánica 8/1981, de 30 de diciembre', 'el Decreto 144/2007, de 31 de octubre'),
    'CL': ('Castilla y León', 'el Decreto 37/2022, de 29 de septiembre', 'la Ley Orgánica 14/2007, de 30 de noviembre', 'el Decreto 12/2008, de 14 de febrero'),
    'CM': ('Castilla-La Mancha', 'el Decreto 80/2022, de 12 de julio', 'la Ley Orgánica 9/1982, de 10 de agosto', 'el Decreto 88/2009, de 7 de julio'),
    'CT': ('Cataluña', 'el Decreto 21/2023, de 7 de febrero', 'la Ley Orgánica 6/2006, de 19 de julio', 'el Decreto 282/2006, de 4 de julio'),
    'VC': ('Comunitat Valenciana', 'el Decreto 100/2022, de 29 de julio', 'la Ley Orgánica 1/2006, de 10 de abril', 'el Decreto 2/2009, de 9 de enero'),
    'EX': ('Extremadura', 'el Decreto 98/2022, de 20 de julio', 'la Ley Orgánica 1/2011, de 28 de enero', 'el Decreto 91/2008, de 9 de mayo'),
    'GA': ('Galicia', 'el Decreto 150/2022, de 8 de septiembre', 'la Ley Orgánica 1/1981, de 6 de abril', None),
    'MD': ('Comunidad de Madrid', 'el Decreto 36/2022, de 8 de junio', 'la Ley Orgánica 3/1983, de 25 de febrero', 'el Decreto 18/2008, de 6 de marzo'),
    'MC': ('Región de Murcia', 'el Decreto 196/2022, de 3 de noviembre', 'la Ley Orgánica 4/1982, de 9 de junio', None),
    'NC': ('Comunidad Foral de Navarra', 'el Decreto Foral 61/2022, de 1 de junio', 'la Ley Orgánica 13/1982, de 10 de agosto (Amejoramiento del Fuero)', None),
    'PV': ('País Vasco', 'el Decreto 75/2023, de 30 de mayo', 'la Ley Orgánica 3/1979, de 18 de diciembre', None),
    'RI': ('La Rioja', 'el Decreto 36/2022, de 29 de junio', 'la Ley Orgánica 3/1982, de 9 de junio', None),
    'CE': ('Ceuta', 'la Orden EFP/608/2022, de 29 de junio (ámbito de gestión del Ministerio)', 'la Ley Orgánica 1/1995, de 13 de marzo', None),
    'ML': ('Melilla', 'la Orden EFP/608/2022, de 29 de junio (ámbito de gestión del Ministerio)', 'la Ley Orgánica 2/1995, de 13 de marzo', None),
}

def cap(s):
    return s[0].upper() + s[1:]

def strip_paren(s):
    return s.split(' (')[0]

def ccaa_questions(rng):
    out = []
    codes = list(CCAA)
    for code in codes:
        name, cur, est, req = CCAA[code]
        others = [c for c in codes if c != code and strip_paren(CCAA[c][1]) != strip_paren(cur)]
        rng.shuffle(others)
        d = [cap(strip_paren(CCAA[c][1])) + '.' for c in others[:3]]
        out.append({
            'tema': 'CUR', 'ccaa': code,
            'q': f'¿Qué norma establece el currículo de Educación Infantil en {name}?',
            'answers': [cap(cur) + '.'] + d, 'correct': 0,
            'e': f'En {name} el currículo de Infantil con la LOMLOE lo fija {cur}, que desarrolla el Real Decreto 95/2022. Si te presentas en otra comunidad, cambia esta norma por la suya.'
        })
        others = [c for c in codes if c != code]
        rng.shuffle(others)
        d = [cap(strip_paren(CCAA[c][2])) + '.' for c in others[:3]]
        out.append({
            'tema': 'EST', 'ccaa': code,
            'q': f'¿Qué norma aprueba el Estatuto de Autonomía de {name}?',
            'answers': [cap(est) + '.'] + d, 'correct': 0,
            'e': f'El Estatuto de {name} se aprobó por {est}. El Estatuto es la norma institucional básica de la comunidad (artículo 147 de la Constitución).'
        })
        if req:
            others = [c for c in codes if c != code and CCAA[c][3]]
            rng.shuffle(others)
            d = [cap(strip_paren(CCAA[c][3])) + '.' for c in others[:3]]
            out.append({
                'tema': 'EI03', 'ccaa': code,
                'q': f'¿Qué norma regula los requisitos de los centros de primer ciclo de Educación Infantil en {name}?',
                'answers': [cap(req) + '.'] + d, 'correct': 0,
                'e': f'Los requisitos de los centros de 0-3 años (espacios, ratios, titulaciones) los fija cada comunidad. En {name} la norma de referencia es {req}.'
            })
    return out
