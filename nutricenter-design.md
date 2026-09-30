---
name: nutricenter-design
description: Aplica la identidad visual de Nutricenter a interfaces web, e-commerce, componentes, prototipos y piezas digitales. Usar cuando el usuario pida diseñar, construir o adaptar una experiencia para Nutricenter; no aplicar automáticamente a otras marcas de salud o nutrición.
---

# Diseño Nutricenter

Construye una experiencia limpia, saludable y comercial, reconocible como Nutricenter. Conserva la arquitectura y convenciones del proyecto existente; adapta estos lineamientos a su sistema de componentes en lugar de imponer una tecnología nueva.

## Identidad visual

Usa estos tokens como base:

```css
:root {
  --nc-green: #60b135;
  --nc-green-accessible: #3f7f24;
  --nc-graphite: #353535;
  --nc-heading: #515050;
  --nc-slate: #808891;
  --nc-slate-dark: #585e61;
  --nc-surface-muted: #caccca;
  --nc-white: #ffffff;
}
```

- `#60B135` es el color distintivo. Úsalo en acentos, iconos, estados activos, etiquetas, bordes y áreas de marca.
- Usa `#3F7F24` cuando un botón o fondo verde lleve texto blanco de tamaño normal. El verde original con blanco no alcanza contraste AA para texto pequeño.
- Usa `#353535` para footer, texto de alto contraste y promociones oscuras.
- Usa `#515050` para títulos y `#808891` para texto secundario.
- Mantén el blanco como fondo dominante. Evita llenar toda la interfaz con múltiples tonos de verde.

## Tipografía

- Montserrat: títulos, navegación, etiquetas, nombres de producto y botones.
- Roboto: párrafos, formularios, precios auxiliares y texto de interfaz.
- Roboto Slab: opcional para algún acento comercial; no mezclarla de forma generalizada.

Escala de referencia para escritorio:

- Título de sección: 35 px, peso 500, mayúsculas, `letter-spacing: 2px`.
- Título de tarjeta destacada: 29 px, peso 500.
- Nombre de producto: 16 px, peso 600 o 700, interlineado 1.2.
- Precio: 20 px.
- Navegación y cuerpo: 14 px, cuerpo con interlineado 1.6.
- En móvil, reduce los títulos de sección a 24–28 px.

## Composición

- Contenedor de escritorio cercano a 1200 px, con 30 px de margen interior; usa márgenes adaptables en pantallas pequeñas.
- Grilla de catálogo: cuatro columnas en escritorio, separación de 20 px horizontal y 40 px vertical. Reduce de forma progresiva a dos y una columna.
- Separa las secciones entre 40 y 60 px para conservar amplitud visual.
- Usa banners de ancho completo con fotografía de bienestar, ejercicio o alimentación saludable.
- Mantén las fotografías de producto frontales, limpias y con proporciones consistentes.

## Componentes

- Tarjetas promocionales: fondo `#CACCCA`, radio de 25 px y contenido centrado.
- Tarjetas de producto: fondo blanco, poco ornamento, imagen dominante y título/precio alineados con claridad.
- Botones: forma de píldora con radio de 20–30 px. El primario usa `#3F7F24` con texto blanco; el secundario es transparente con borde grafito y texto oscuro.
- Campos de búsqueda: fondo blanco, borde gris tenue de 1–2 px, radio de 3–4 px y altura aproximada de 40 px.
- Iconografía: trazo simple, gris por defecto y verde para selección o acción.
- Footer: fondo `#353535`, texto blanco y distribución en columnas cuando haya suficiente ancho.

## Dirección de arte

La sensación debe ser saludable, confiable, fresca y orientada a resultados. Favorece composiciones con mucho blanco, personas activas, alimentos frescos y productos bien iluminados. Para campañas, combina fotografía oscura o fondo grafito con verde y blanco para lograr alto contraste.

Usa el logotipo oficial proporcionado por el usuario o presente en el proyecto. No redibujes ni generes una versión aproximada del logotipo. No presentes como oficial ningún color o tipografía adicional sin identificarlo como propuesta.

## Aplicación

Al crear o editar una interfaz:

1. Mapea los tokens anteriores al sistema de estilos existente.
2. Mantén una jerarquía clara entre promoción, categoría, producto y acción.
3. Verifica contraste, estados de foco, navegación por teclado y comportamiento responsive.
4. Explica brevemente cualquier desviación necesaria por accesibilidad, legibilidad o restricciones técnicas.

Fuente visual de referencia: https://www.tunutricenter.com/
