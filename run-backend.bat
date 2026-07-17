@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.11
set GROQ_API_KEY=your_groq_api_key_here
set DB_USERNAME=root
set DB_PASSWORD=root
set JWT_SECRET=shopai-super-secret-key-change-in-production-2024
echo Starting ShopAI Backend on port 8080...
.\mvnw.cmd spring-boot:run
