# Flores amarillas para Karol

Un pequeño jardín cinematográfico hecho a mano: cinco escenas encadenadas por una
sola línea de tiempo —el despertar, la danza de los pétalos, el mensaje, el jardín
que florece y la carta— construidas con React, TypeScript, GSAP, SVG y Canvas.

## Empezar

```bash
npm install
npm run dev      # http://localhost:5173
```

Otros comandos:

```bash
npm run build      # build de producción en dist/
npm run preview    # sirve el build localmente
npm run typecheck  # TypeScript sin emitir
npm run lint       # oxlint
```

Requiere Node 20 o superior.

## Personalizar

Todo el contenido vive en dos archivos:

- **`src/config/experience.ts`** — nombres, encabezado, mensaje de apoyo, firma,
  invitación, textos de la carta, fecha y configuración de la música.
- **`src/config/gardenLayout.ts`** — la composición del jardín: qué flor va en qué
  posición, capa de profundidad, altura, inclinación, paleta y momento de floración,
  para escritorio y para móvil por separado.

No hace falta tocar ningún componente ni animación para cambiar los textos.

### Música

Deja tu canción en `public/audio/our-song.mp3` (o cambia `music.src`). El
reproductor respeta las restricciones de autoplay: la experiencia visual arranca
sola y el audio comienza con la primera interacción. Si el archivo no existe, el
sitio funciona con normalidad y el control de música se oculta.

## Cómo está construido

```
src/
├── animations/     líneas de tiempo GSAP (intro, jardín, carta) y tiempos maestros
├── components/
│   ├── atmosphere/ pétalos y polen en canvas, capas de luz, bruma y grano
│   ├── experience/ orquestador, mensaje, carta, control de salto
│   ├── flowers/    ilustraciones botánicas SVG reutilizables y el jardín
│   └── ui/         control de música
├── config/         contenido personalizable y composición del jardín
├── hooks/          movimiento reducido, tamaño de ventana, audio
├── lib/            GSAP, geometría botánica y azar determinista
└── styles/         tokens de diseño y estilos globales
```

Decisiones relevantes:

- **Flores en SVG** con degradados por instancia, centros con textura, tallos
  curvos y hojas con nervaduras. Se animan sólo con `transform` y `opacity`.
- **Pétalos y polen en un único canvas 2D**, con sprites pre-renderizados en tres
  niveles de desenfoque para dar profundidad de campo real sin coste por frame.
- **Sin filtros CSS sobre el jardín**: la perspectiva atmosférica se resuelve con
  paletas, opacidad y capas de bruma, para que las animaciones no re-rastericen.
- **`prefers-reduced-motion`** conserva toda la composición y el contenido, con
  fundidos en lugar de recorridos, y una línea de tiempo más corta.
- **Accesibilidad**: la carta es un `<dialog>` nativo con foco atrapado, `Esc` para
  cerrar, foco devuelto al botón al salir, etiquetas en los controles y contraste
  cuidado sobre el jardín.

## Desplegar

El proyecto es estático y usa rutas relativas (`base: './'`), así que funciona sin
cambios en Vercel, Netlify o GitHub Pages (incluido un subdirectorio).

```bash
npm run build
# publica dist/
```
