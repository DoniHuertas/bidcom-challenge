# Link Tracker

Link Tacker es un sistema para enmascarar URLs y poder obtener datos de cuántas
veces se llamó a cada uno de los links, así como también agregar reglas de para el
funcionamiento del redirect.

La desarrollé unsando Node v18.14.2 y Nest v10.3.2

## Instalación

```bash
$ npm install
```

## Correr la Aplicación

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Enpoints

### Post("/create")
Se debe enviar en el body: url, contraseña y opcionalmente un numero que representa la cantidad de minutos que estará vigente el link
retorna un JSON con la url enmascarada y la fecha de expiracion de la url.
```json
{
  "url" : "https://github.com",
  "password" : "abc123",
  "expiresIn" : 10
}
```
### Get("/")
Trae todos los links guardados en la base de datos.

### Get("/l/:urlEnmascarada")
Se necesita introducir por query param la contraseña con la que se creó el link. Redirige a la url almacenada.

### Get("/:urlEnmascarada/stats")
Retorna la cantidad de veces que el link fue usado para redireccionar.

### Put("/l/:urlEnmascarada")
Invalida la url enmascarada.

### Delete("/")
Elimina todas las urls almacenadas en la base de datos.
