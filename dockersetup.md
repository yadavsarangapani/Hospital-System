# Docker Setup Guide

This document contains instructions to help you build and run the Smart Hospital Appointment Application locally using Docker. 

## Prerequisites
- **Docker Desktop** (or Docker Engine + Docker Compose) installed on your machine.

## Files Created
1. **`backend/Dockerfile`**: Configures the Java environment and builds the Spring Boot app into an executable JAR.
2. **`backend/.dockerignore`**: Prevents target builds and extra IDE configurations from bloating the container.
3. **`frontend/Dockerfile`**: Compiles the React application into static files and serves them via an Nginx web server.
4. **`frontend/.dockerignore`**: Excludes `node_modules/` and local `build/` files reducing build context size.
5. **`frontend/nginx.conf`**: Configures the Nginx server in the React container so the single-page application routing correctly redirects back to `index.html`.
6. **`docker-compose.yml`**: Defines the two containers (frontend and backend) and establishes how they are networked and which ports they expose to your local machine.

---

## 🚀 Running the Application

### 1. Build and Start the Containers

Open your preferred terminal, navigate to the **root** folder of your project (the `d:\HAS` directory where the `docker-compose.yml` file is located), and execute:

```bash
docker compose up -d --build
```

**What this command does:**
- `--build`: Forces Docker to build fresh images for both the frontend and backend instead of relying on outdated cached ones.
- `-d` (detached mode): Runs the containers in the background so your terminal remains free to use.

If you don't need to rebuild the images (e.g. you are just stopping and starting the containers again with no core code changes), you can omit the `--build` flag.

### 2. Access the Application

Once the containers spin up successfully, you can access the apps in your browser:

- **Frontend Application (React UI):** [http://localhost:3000](http://localhost:3000)
- **Backend APIs:** [http://localhost:8080/api](http://localhost:8080/api)
- **Swagger Documentation:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

**Note:** Both containers communicate seamlessly connected to the same shared Aiven MySQL Database instance you previously configured.

---

## Useful Docker Commands

### Stopping the System
When you want to turn the servers off, run:

```bash
docker compose down
```
*(This will gracefully stop and remove both the frontend and backend containers without wiping the image data.)*

### Viewing Logs
If you are experiencing any backend bugs or frontend connection issues, you can inspect the live output:

```bash
# View all logs
docker compose logs -f

# View specifically Backend logs
docker compose logs -f backend

# View specifically Frontend logs
docker compose logs -f frontend
```
*(Press `Ctrl+C` to exit the logging viewer.)*
