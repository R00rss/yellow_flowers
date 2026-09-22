/**
 * Todo el contenido personalizable vive aquí.
 * Edita este archivo para cambiar los textos sin tocar ninguna animación.
 */
export const experienceConfig = {
  recipientName: 'Karol',
  senderName: 'Ronny',

  /** Encabezado principal (se revela palabra por palabra). */
  headline: 'Karol, hoy las flores amarillas son para ti.',

  /** Mensaje de apoyo, debajo del encabezado. */
  subtitle:
    'Porque incluso en un mundo digital, siempre encontraré una forma de regalarte algo bonito.',

  /** Firma de la escena principal. */
  signature: 'Con amor, Ronny.',

  /** Invitación a abrir la carta (escena 5). */
  invitation: 'Karol, tengo algo más para ti...',
  letterCta: 'Abre tu carta ♡',
  letterCloseLabel: 'Volver al jardín',
  skipLabel: 'Saltar introducción',

  /** Carta. */
  letterDate: '21 de septiembre',
  letterTitle: 'Mi querida Karol',
  letter: [
    'Hoy quería regalarte flores amarillas, pero también quería regalarte algo que pudiera quedarse contigo de una manera diferente.',
    'Por eso hice este pequeño jardín para ti.',
    'Cada flor representa una sonrisa que me has regalado, cada pétalo un momento bonito, y cada detalle una forma de recordarte lo especial que eres para mí.',
    'Espero que, cuando veas estas flores, recuerdes cuánto te amo y lo feliz que me hace compartir mi vida contigo.',
  ],
  letterClosing: 'Con todo mi amor,',
  letterSignature: 'Ronny.',

  /** Música: coloca el archivo en public/audio/our-song.mp3 */
  music: {
    enabled: true,
    src: 'audio/our-song.mp3',
    title: 'Nuestra canción',
    volume: 0.55,
    fadeIn: 2.4,
    fadeOut: 1.1,
  },
} as const

export type ExperienceConfig = typeof experienceConfig
