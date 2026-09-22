# Tu canción

Coloca aquí tu canción (formato `.mp3`, `.m4a` u `.ogg`) con el nombre:

```
public/audio/our-song.mp3
```

Mientras el archivo no exista, el sitio funciona con normalidad: el control de
música aparece desactivado en silencio y toda la experiencia visual continúa.

Si quieres usar otro nombre o ruta, edita `music.src` en
`src/config/experience.ts`. El reproductor respeta las restricciones de
autoplay del navegador: el audio sólo comienza después de la primera
interacción (toque, clic o tecla).
