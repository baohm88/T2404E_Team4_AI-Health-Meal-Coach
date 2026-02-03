# Docker Deployment Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Setup Environment Variables
Copy the example environment file and update with your values:
```bash
cp .env.example .env
```

Edit `.env` file and set your actual values, especially:
- `OPENAI_API_KEY`: Your OpenAI/Groq API key
- `MYSQL_ROOT_PASSWORD`: MySQL root password
- `MYSQL_PASSWORD`: MySQL user password
- `JWT_SECRET`: JWT secret key (minimum 32 characters)

### 2. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **MySQL**: localhost:3306

## Individual Service Commands

### Backend Only
```bash
# Build
docker build -t health-coach-backend ./AiHealthCoach

# Run
docker run -d \
  -p 8080:8080 \
  --name health-coach-backend \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/health_coach_db \
  health-coach-backend
```

### Frontend Only
```bash
# Build
docker build -t health-coach-frontend ./frontend

# Run
docker run -d \
  -p 3000:3000 \
  --name health-coach-frontend \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080 \
  health-coach-frontend
```

### Database Only
```bash
docker run -d \
  -p 3306:3306 \
  --name health-coach-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=health_coach_db \
  -e MYSQL_USER=healthcoach \
  -e MYSQL_PASSWORD=healthcoach123 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

## Troubleshooting

### Backend won't start
- Check if MySQL is ready: `docker-compose logs mysql`
- Verify database connection: `docker-compose logs backend`
- Ensure port 8080 is not in use

### Frontend won't build
- Clear Next.js cache: `rm -rf frontend/.next`
- Rebuild: `docker-compose up --build frontend`

### Database connection issues
- Wait for MySQL to be fully initialized (first run takes longer)
- Check network: `docker network inspect health_coach_network`
- Verify environment variables in `.env` file

### View Container Status
```bash
# Check running containers
docker-compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' health_coach_backend
docker inspect --format='{{.State.Health.Status}}' health_coach_db
```

## Production Deployment

For production, consider:
1. Use secrets management instead of `.env` files
2. Set up proper SSL/TLS certificates
3. Use external database with backups
4. Configure reverse proxy (Nginx/Traefik)
5. Set appropriate resource limits
6. Enable monitoring and logging

### Example Production Override
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  backend:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      JAVA_OPTS: "-Xmx1g -Xms512m"
  frontend:
    environment:
      NODE_ENV: production
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Remove old images
docker image prune -f
```

### Backup Database
```bash
# Export database
docker exec health_coach_db mysqldump -u healthcoach -phealthcoach123 health_coach_db > backup.sql

# Import database
docker exec -i health_coach_db mysql -u healthcoach -phealthcoach123 health_coach_db < backup.sql
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```
