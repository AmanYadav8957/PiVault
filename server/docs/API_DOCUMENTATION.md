# PigoPiOps Backend API Documentation

## Architecture Overview
The backend follows a **Modular / Feature-Based 3-Tier Layered Architecture**:
- **Routes (`*.routes.ts`)**: HTTP route declarations & middleware bindings.
- **Controllers (`*.controller.ts`)**: Request parameter extraction, response dispatching, and HTTP status codes.
- **Services (`*.service.ts`)**: Core business logic, cryptographic functions, and Mongoose database operations.
- **Models (`*.model.ts`)**: Schema definitions, indexes, and document interfaces.

## Modules
- **`auth`**: Authentication (login, logout with token invalidation, token refresh, switch role, me).
- **`projects`**: Project CRUD, cascaded deletion, aggregate resource metrics.
- **`credentials`**: Key vault management with AES-256 encryption at rest.
- **`environments`**: Environment variables manager with encryption and bulk `.env` parser.
- **`documents`**: Project documentation, file uploads, base64 data attachments.
- **`users`**: User directory, RBAC management, and project assignment.
