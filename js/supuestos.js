// Supuestos prácticos de elaboración propia. Orientativos: cada tribunal fija su formato.
const SUPUESTOS = [
    {
        id: 'sp-adaptacion-12m',
        routes: ['educador', 'educador_cam', 'maestros'],
        edad: 'Aula de 1-2 años',
        titulo: 'Periodo de adaptación con llanto persistente',
        enunciado: 'Lucía, de 14 meses, se incorpora a la escuela infantil en septiembre. Es su primera experiencia fuera de casa. Durante la primera semana llora mucho cuando su madre se va, rechaza la comida y solo se calma en brazos de una educadora concreta. La madre está angustiada y propone irse sin despedirse para que la niña "no se dé cuenta".',
        preguntas: [
            '¿Cómo valoras la conducta de Lucía desde el punto de vista evolutivo?',
            '¿Qué le responderías a la madre sobre irse sin despedirse?',
            'Diseña el plan de incorporación de las dos primeras semanas.',
            '¿Qué papel tiene la educadora de referencia?'
        ],
        claves: [
            'Es una reacción esperable: angustia de separación ligada al apego (Bowlby, Ainsworth; segundo organizador de Spitz). No es un problema, es señal de un vínculo con su familia.',
            'Desaconsejar irse a escondidas: genera desconfianza. Proponer una despedida breve, clara y siempre igual, y cumplir lo que se le dice ("vuelvo después de comer").',
            'Incorporación gradual: primeros días con la familia en el aula y en tiempos cortos, ir aumentando la estancia según la respuesta de la niña. Respetar sus ritmos de sueño y comida, sin forzar.',
            'Objeto de transición de casa (Winnicott), rutinas previsibles y una figura de referencia estable que la acoja, la consuele y vaya ampliando su vínculo con otros adultos.',
            'Comunicación diaria con la familia (entrada y salida, agenda o app) para transmitir tranquilidad; entrevista inicial previa para conocer hábitos.'
        ],
        normativa: ['Currículo autonómico de 0-6 años (periodo de adaptación y relación con las familias)', 'RD 95/2022: principios pedagógicos y colaboración con las familias']
    },
    {
        id: 'sp-mordiscos',
        routes: ['educador', 'educador_cam'],
        edad: 'Aula de 1-2 años',
        titulo: 'Un niño que muerde a sus compañeros',
        enunciado: 'Hugo, de 20 meses, ha mordido a tres compañeros en dos semanas, sobre todo en el rincón de juego cuando otro niño coge el juguete que él quiere. Las familias de los niños mordidos han pedido explicaciones y una de ellas exige saber quién ha sido.',
        preguntas: [
            '¿Por qué puede morder un niño de esta edad?',
            '¿Cómo actuarías en el momento del mordisco?',
            '¿Qué medidas de prevención tomarías en el aula?',
            '¿Cómo gestionas la comunicación con las familias?'
        ],
        claves: [
            'Conducta frecuente a esta edad: el lenguaje aún no le permite expresar frustración; también puede influir la exploración oral o la dentición. No es "maldad".',
            'En el momento: atender primero al niño mordido (consuelo, lavar con agua, frío local), y después decir a Hugo con calma y firmeza "no se muerde, duele", poniendo nombre a la emoción y ofreciendo alternativas.',
            'Prevención: observar cuándo ocurre (registro), duplicar juguetes muy deseados, grupos más pequeños en rincones, anticipar transiciones y ofrecerle palabras o gestos para pedir.',
            'Familias: informar a las familias afectadas de lo ocurrido y de las medidas, sin revelar la identidad del otro niño (confidencialidad y protección de datos). Coordinarse con la familia de Hugo para actuar igual en casa.'
        ],
        normativa: ['LO 3/2018 de protección de datos (confidencialidad)', 'Currículo autonómico: área Crecimiento en Armonía (regulación emocional y convivencia)']
    },
    {
        id: 'sp-panal',
        routes: ['educador', 'educador_cam'],
        edad: 'Aula de 2-3 años',
        titulo: 'Retirada del pañal a petición de la familia',
        enunciado: 'En enero, la familia de Martín (2 años y 4 meses) pide que le quitéis el pañal en la escuela porque "en verano lo dejamos y ahora ya toca". En el aula, Martín no avisa cuando se moja, rechaza sentarse en el orinal y llora si se le insiste.',
        preguntas: [
            '¿Está Martín preparado para la retirada del pañal? Justifica.',
            '¿Qué le propondrías a la familia?',
            '¿Cómo organizarías el momento del baño en el aula para favorecer el control?'
        ],
        claves: [
            'El control de esfínteres depende de la maduración y de señales de preparación: periodos secos, avisar, interés por el baño. Martín no las muestra: conviene esperar.',
            'Reunión con la familia: explicar las señales de preparación, acordar observarlas en casa y en la escuela y actuar de forma coherente cuando aparezcan. Evitar presiones, castigos y comparaciones.',
            'Baño accesible, rutinas de ir al baño en momentos clave (antes y después de la siesta, al salir al patio), cuentos y modelos de iguales, ropa cómoda, y escapes sin reproches.'
        ],
        normativa: ['Currículo autonómico 0-3: autonomía personal y hábitos de higiene', 'Requisitos mínimos de centros de 0-3 de la comunidad (aseos y espacios de higiene)']
    },
    {
        id: 'sp-alergia',
        routes: ['educador', 'educador_cam', 'maestros'],
        edad: 'Escuela infantil o colegio',
        titulo: 'Reacción alérgica en el comedor',
        enunciado: 'Durante la comida, Sara (3 años), con alergia diagnosticada a la proteína de leche de vaca, empieza a toser, le salen ronchas en la cara y dice que le pica la boca. Un compañero le había ofrecido su yogur.',
        preguntas: [
            '¿Cuáles son los pasos inmediatos?',
            '¿Qué debería existir en el centro antes de que pase algo así?',
            '¿Qué medidas organizativas evitarían el incidente?'
        ],
        claves: [
            'Inmediato: retirar el alimento, no dejar sola a la niña, valorar gravedad. Si hay dificultad respiratoria, ronquera o mareo: llamar al 112 y aplicar el protocolo y la medicación de urgencia prescrita (por ejemplo, autoinyector de adrenalina) si el centro lo tiene autorizado. Avisar a la familia.',
            'Antes: informe médico y plan individual de actuación, autorización de la familia, medicación localizada y personal formado (incluidos sustitutos y personal de comedor).',
            'Organización: menú adaptado e identificado, supervisión en la mesa, educar al grupo en no compartir comida y lavado de manos.'
        ],
        normativa: ['Protocolos de la comunidad sobre atención sanitaria y alergias en centros educativos', 'LOPIVI: derecho a un entorno seguro']
    },
    {
        id: 'sp-sospecha-maltrato',
        routes: ['educador', 'educador_cam', 'maestros'],
        edad: 'Cualquier edad',
        titulo: 'Indicios de desatención en un niño',
        enunciado: 'Desde hace un mes, Adam (4 años) llega a menudo sin desayunar, con la misma ropa varios días y con mala higiene. Hoy, al cambiarle de ropa tras un escape, ves moratones en la espalda en distintos estados de curación. Adam está más callado de lo habitual.',
        preguntas: [
            '¿Qué indicadores observas y qué tipo de situación podrían indicar?',
            '¿Qué debes hacer y a quién comunicarlo?',
            '¿Qué no debes hacer?'
        ],
        claves: [
            'Indicadores de posible negligencia (alimentación, higiene, ropa) y de posible maltrato físico (moratones en zonas poco habituales y en distintos estados). Cambio de conducta.',
            'Registrar por escrito lo observado de forma objetiva (fecha, qué se ve, qué dice el niño literalmente). Comunicarlo de inmediato a la dirección y al coordinador de bienestar y protección, que lo traslada a servicios sociales y, si hay riesgo grave, a fiscalía o fuerzas de seguridad. La LOPIVI establece un deber de comunicación para quien trabaja con menores.',
            'No interrogar al niño ni hacerle preguntas sugestivas, no confrontar a la familia, no prometer guardar el secreto, no comentarlo con otras familias. Mantener la confidencialidad.'
        ],
        normativa: ['LO 8/2021 (LOPIVI): deber de comunicación y coordinador de bienestar', 'LO 1/1996 de Protección Jurídica del Menor', 'Protocolo autonómico de maltrato infantil']
    },
    {
        id: 'sp-proyecto-5anos',
        routes: ['maestros'],
        edad: 'Aula de 5 años',
        titulo: 'Situación de aprendizaje a partir de un interés del grupo',
        enunciado: 'Tras una tormenta, los niños de tu aula de 5 años llegan preguntando de dónde viene la lluvia y por qué hay charcos en el patio y no en el arenero. Tienes 22 alumnos, entre ellos una niña con trastorno del espectro autista y dos niños que se están iniciando en el castellano.',
        preguntas: [
            'Plantea una situación de aprendizaje a partir de este interés.',
            '¿Qué competencias clave y áreas movilizarías?',
            '¿Cómo atenderías a la diversidad del grupo?',
            '¿Cómo evaluarías?'
        ],
        claves: [
            'Partir de lo que saben y quieren saber (asamblea, mural de hipótesis), experimentar (agua en distintos suelos, recipientes, observar charcos, medir lluvia con un pluviómetro casero) y cerrar con un producto compartido (libro de la clase, exposición a otras aulas o a las familias).',
            'Las tres áreas de forma global: Descubrimiento y Exploración del Entorno (experimentación), Comunicación y Representación (vocabulario, registro gráfico) y Crecimiento en Armonía (cooperación). Competencias STEM, lingüística, personal, social y de aprender a aprender.',
            'DUA: apoyos visuales y anticipación con agenda visual para la niña con TEA, rutinas estables; vocabulario con imágenes y trabajo en parejas para los alumnos que aprenden castellano; varias formas de expresar lo aprendido.',
            'Observación sistemática con registros o escalas, fotos y producciones de los niños (documentación pedagógica), autoevaluación sencilla y evaluación de la propia práctica.'
        ],
        normativa: ['RD 95/2022: situaciones de aprendizaje, competencias clave, evaluación global, continua y formativa', 'Decreto de currículo de tu comunidad', 'LOMLOE: DUA e inclusión']
    },
    {
        id: 'sp-conflicto-familia',
        routes: ['maestros', 'educador', 'educador_cam'],
        edad: 'Aula de 3 años',
        titulo: 'Una familia en desacuerdo con la metodología',
        enunciado: 'El padre de Daniel (3 años) te dice en la salida, delante de otras familias, que en el aula "solo jugáis" y que en otro colegio ya hacen fichas de letras. Exige que su hijo empiece a leer este curso.',
        preguntas: [
            '¿Cómo gestionas el momento?',
            '¿Qué argumentos darías sobre la metodología?',
            '¿Qué medidas de relación con las familias propondrías?'
        ],
        claves: [
            'No discutir en público: reconocer su preocupación y citarle a una entrevista para hablar con calma.',
            'En la entrevista: el juego es el principal recurso de aprendizaje en la etapa; mostrar con ejemplos y documentación qué aprende Daniel al jugar; explicar que la normativa plantea una aproximación a la lectura y la escritura respetando el ritmo de cada niño, no un objetivo cerrado.',
            'Hacer visible el aprendizaje (paneles, fotos, informes), reuniones de aula, talleres y participación de las familias en el aula.'
        ],
        normativa: ['RD 95/2022: principios pedagógicos (juego, actividad, experimentación) y aproximación a la lectoescritura', 'Currículo autonómico: colaboración con las familias']
    },
    {
        id: 'sp-espacios-0-1',
        routes: ['educador', 'educador_cam'],
        edad: 'Aula de 0-1 años',
        titulo: 'Organizar el aula de bebés',
        enunciado: 'Te asignan un aula de bebés de 4 a 11 meses en una escuela infantil de nueva apertura. El aula tiene 32 m², una zona de cunas anexa y una ventana grande. Tienes presupuesto para mobiliario y materiales.',
        preguntas: [
            '¿Cómo distribuirías el espacio?',
            '¿Qué materiales seleccionarías y con qué criterios?',
            '¿Cómo organizarías la jornada?'
        ],
        claves: [
            'Zonas diferenciadas: suelo amplio, firme y cálido para el movimiento libre (Pikler), zona de cambio con todo a mano y visión del grupo, zona de comida, zona de descanso tranquila y ventilada. Comprobar ratio y superficie según la norma de la comunidad.',
            'Materiales seguros, lavables, sin piezas pequeñas, de texturas y materiales naturales: cesto de los tesoros para los que se sientan, espejos, telas, estructuras bajas para los que empiezan a desplazarse.',
            'Jornada flexible que respeta los ritmos individuales de sueño, comida y vigilia; cuidados como momentos de relación individual; acogida y despedida personalizadas con información diaria a las familias.'
        ],
        normativa: ['Decreto de requisitos mínimos de centros de 0-3 de tu comunidad', 'Currículo autonómico 0-3']
    }
];
