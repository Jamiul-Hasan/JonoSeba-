# jonoseba-backend

Spring Boot 3 (Java 17, Maven) backend for JonoSeba.

## Dependencies
- Spring Web, Validation, Data JPA, Security, WebSocket
- MySQL Connector (runtime)
- Lombok
- JJWT (api, impl runtime, jackson runtime)
- Spring Boot Test

## Configuration
Set environment variables (defaults in `application.yml`):
- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_NAME` (default: `jonoseba`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: empty)
- `JWT_SECRET` (default: `change-me`)
- `JWT_EXP_MINUTES` (default: `60`)
- `JWT_ISSUER` (default: `jonoseba`)
- `WS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)

## Run
Using Maven (requires Maven installed):

```bash
cd C:\xampp\htdocs\AOOP\JonoSeba-\JonoSeba-\jonoseba-backend
mvn spring-boot:run
```

Or build:

```bash
mvn clean package
java -jar target\jonoseba-backend-0.0.1-SNAPSHOT.jar
```

