export const mails = [
  {
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    name: "Carlos Rodríguez",
    email: "carlosrodriguez@example.com",
    subject: "Reunión Mañana",
    text: "Hola, tengamos una reunión mañana para discutir el proyecto. He estado revisando los detalles y tengo algunas ideas que me gustaría compartir. Es crucial que nos alineemos en nuestros próximos pasos para asegurar el éxito del proyecto.\n\nPor favor, ven preparado con cualquier pregunta o idea que puedas tener. ¡Espero con ansias nuestra reunión!\n\nSaludos cordiales, Carlos",
    date: "2023-10-22T09:00:00",
    read: true,
    labels: ["reunion", "trabajo", "importante"],
  },
  {
    id: "110e8400-e29b-11d4-a716-446655440000",
    name: "Ana García",
    email: "anagarcia@example.com",
    subject: "Re: Actualización del Proyecto",
    text: "Gracias por la actualización del proyecto. ¡Se ve genial! He revisado el informe y el progreso es impresionante. El equipo ha hecho un trabajo fantástico y aprecio el esfuerzo que todos han puesto.\n\nTengo algunas sugerencias menores que incluiré en el documento adjunto.\n\nDiscutamos esto durante nuestra próxima reunión. ¡Sigan con el excelente trabajo!\n\nSaludos cordiales, Ana",
    date: "2023-10-22T10:30:00",
    read: true,
    labels: ["trabajo", "importante"],
  },
  {
    id: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    name: "Roberto Gómez",
    email: "robertogomez@example.com",
    subject: "Planes para el fin de semana",
    text: "¿Algún plan para el fin de semana? Estaba pensando en ir de excursión a las montañas cercanas. Hace tiempo que no disfrutamos de una actividad al aire libre.\n\nSi te interesa, avísame y podemos planear los detalles. Será una excelente manera de desconectar y disfrutar de la naturaleza.\n\n¡Espero tu respuesta!\n\nSaludos, Roberto",
    date: "2023-04-10T11:45:00",
    read: true,
    labels: ["personal"],
  },
  // ... Continue with the rest of the emails ...
]

export type Mail = (typeof mails)[number]

export const accounts = [
  {
    label: "María López",
    email: "maria@example.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "María López",
    email: "maria@gmail.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "María López",
    email: "maria@icloud.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>iCloud</title>
        <path
          d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]

export type Account = (typeof accounts)[number]

export const contacts = [
  {
    name: "Sofía Martínez",
    email: "sofia.martinez@example.com",
  },
  {
    name: "Mateo González",
    email: "mateo.gonzalez@example.com",
  },
  {
    name: "Valentina López",
    email: "valentina.lopez@example.com",
  },
  {
    name: "Santiago Rodríguez",
    email: "santiago.rodriguez@example.com",
  },
  {
    name: "Isabella Pérez",
    email: "isabella.perez@example.com",
  },
  {
    name: "Sebastián Fernández",
    email: "sebastian.fernandez@example.com",
  },
  {
    name: "Camila Gómez",
    email: "camila.gomez@example.com",
  },
  {
    name: "Alejandro Díaz",
    email: "alejandro.diaz@example.com",
  },
  {
    name: "Valeria Sánchez",
    email: "valeria.sanchez@example.com",
  },
  {
    name: "Daniel Torres",
    email: "daniel.torres@example.com",
  },
  // ... Continue with the rest of the contacts ...
]

export type Contact = (typeof contacts)[number]
