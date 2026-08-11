## ADDED Requirements

### Requirement: Health check endpoint

The system SHALL expose a `GET /health` endpoint that returns the service health status as JSON.

#### Scenario: Healthy service response

- **WHEN** a client sends `GET /health`
- **THEN** the system responds with HTTP status 200
- **AND** the response body is `{ "status": "ok" }`
- **AND** the `Content-Type` header is `application/json`

#### Scenario: Unknown route

- **WHEN** a client sends a request to any path other than `/health`
- **THEN** the system responds with HTTP status 404

### Requirement: Server startup

The system SHALL start an HTTP server on a configurable port.

#### Scenario: Default port

- **WHEN** the server starts without a `PORT` environment variable
- **THEN** it listens on port 3000

#### Scenario: Custom port

- **WHEN** the server starts with `PORT=8080`
- **THEN** it listens on port 8080
