---
name: reedad-nutricenter
description: "Diseñar o implementar ReEdad, la plataforma responsive de bienestar de NutriCenter: identificación con DUI, cuestionario, resultado, seguimiento y administración. Usar solo al trabajar en esta experiencia."
---

# ReEdad · NutriCenter

Ayuda a implementar la experiencia descrita en `ReEdad · Experiencia in-store NutriCente` en la raíz del proyecto NutriCenter. Lee ese archivo completo antes de tomar decisiones de producto o cambiar código; contiene las 10 preguntas, los pesos propuestos, perfiles, puntos y niveles. Toma como vigentes las decisiones de implementación indicadas al inicio del archivo. Lee también `nutricenter-design.md` y reutiliza los tokens y componentes existentes de Tailwind, Montserrat y Roboto. Si el encargo cambia el alcance, sigue la instrucción más reciente del usuario.

## Experiencia y alcance

- Hay una sola plataforma responsive para check-in, cuestionario, resultado, perfil e historial. El recorrido completo sucede dentro de ella, sin QR ni teléfono como control remoto. Puede presentar una vista de atracción o un marcador colectivo en tienda; ninguna vista pública muestra DUI, respuestas, WhatsApp, datos de contacto ni historial de salud.
- El recorrido es entrada a la plataforma → consentimiento y check-in con DUI → edad y sexo → 10 preguntas y una pregunta de preferencia → resultado → un reto de 30 días y recomendación → tarjeta y seguimiento. Si se proyecta un reveal en una pantalla pública, requiere elección explícita; por defecto el resultado permanece privado.
- Para un MVP completo, el documento propone plataforma en tienda, persistencia y cálculo, WhatsApp, tarjeta compartible y panel de administración. Wearables son fase 2. Ajusta la profundidad de la implementación al pedido concreto; identifica con claridad qué partes son demostraciones o requieren credenciales, proveedor, catálogo o decisiones comerciales.
- Mantén editables desde el panel las preguntas, pesos, perfiles, recompensas y contenido de recomendaciones que el producto declare configurables. Evita duplicar reglas en la interfaz y el servidor.

## Cálculo y lenguaje

- La fórmula propuesta es `ReEdad = edad real + suma de años del quiz`, limitada a edad real −10 y edad real +15. La pregunta extra sobre prioridad personal no altera el número. Clasifica el resultado con los cinco rangos y mensajes definidos en el documento.
- Calcula los cinco pilares, el pilar más fuerte y la mejora con mayor potencial a partir de las respuestas. Da un solo reto de 30 días, conectado con esa mejora y la prioridad elegida. Trata los pesos y cualquier afirmación cuantitativa como propuesta pendiente de validación clínica; no presentes el cálculo como una medición médica validada.
- En la interfaz usa «ReEdad» o «edad de tus hábitos», nunca «edad biológica». Muestra un aviso visible de que es una experiencia de bienestar y no un diagnóstico médico. Conserva el tono cercano en español salvadoreño del documento sin culpabilizar a la persona.
- Diferencia ReEdad de puntos: la primera busca bajar con el tiempo; los segundos recompensan constancia. Aplica topes de frecuencia y reglas de puntos del documento sin permitir recompensas duplicadas por repetir una acción.

## Responsive y accesibilidad

- Diseña primero el flujo para teléfonos pequeños y adáptalo al mismo producto en tablet, escritorio y pantallas de tienda. Cada pregunta ocupa una vista legible, con cuatro opciones táctiles, progreso visible, controles de volver/continuar y estado conservado si se interrumpe la sesión. Evita desbordamiento horizontal y texto diminuto; verifica al menos un teléfono estrecho, uno estándar y tablet/escritorio.
- Adapta perfil, historial, tarjeta y administración a móvil, tablet y escritorio. En móvil usa apilamiento y botones cómodos; en pantallas amplias aprovecha columnas sin alargar las líneas de lectura. La tarjeta compartible mantiene proporción 9:16 independientemente del ancho de pantalla.
- Diseña la vista de tienda para grandes formatos y distintas relaciones de aspecto, con un mensaje de atracción legible a distancia. Si el dispositivo está expuesto a otras personas, resuelve la privacidad de la entrada del DUI y del cuestionario antes de mostrar esas vistas: usa un área de interacción privada o un modo de privacidad adecuado al dispositivo. Una pantalla pública solo muestra contenido no sensible y vuelve a un estado seguro al terminar o expirar la sesión.
- Asegura navegación por teclado, foco visible, etiquetas accesibles, contraste suficiente y alternativa a animaciones intensas mediante `prefers-reduced-motion`. No dependas solo de verde/amarillo/rojo para comunicar los pilares.

## Datos y decisiones pendientes

- Solicita consentimiento explícito antes de guardar datos personales o de salud y separa permisos opcionales para compartir, mostrar un resultado en público, aparecer en ranking, recibir WhatsApp o conectar un reloj. El DUI identifica el perfil, pero por sí solo no debe autorizar a otra persona a consultar el historial: define una verificación adicional para el acceso recurrente. No expongas el DUI completo en pantallas compartidas, URLs, analítica o registros; limita su acceso y almacenamiento. Permite abandonar la experiencia sin exponer una sesión anterior y define expiración y limpieza de sesiones en dispositivos compartidos.
- La integración real con WhatsApp, datos de reloj, CRM, cupones y recompensas necesita proveedores y credenciales definidos. Nunca simules un envío o conexión real sin indicarlo. La conexión con reloj es opcional y no bloquea el quiz manual.
- El documento deja abiertos nombre final, modo de interacción privada en tienda, CRM/lealtad, validación clínica, presupuesto de recompensas y tiendas piloto. Avanza con supuestos reversibles cuando el encargo lo permita; consulta al usuario antes de fijar decisiones que cambien esos compromisos.

## Comprobación

Verifica el recorrido completo sin QR en móvil, tablet y dispositivo de tienda; el check-in con DUI y el retorno de una persona registrada; el consentimiento y la privacidad entre sesiones; los límites y rangos del cálculo; y estados de error y reanudación. Ejecuta las comprobaciones del proyecto (`npm run build` y `npm run lint`) cuando cambies código. Explica qué es funcional y qué sigue siendo una propuesta o integración pendiente.
