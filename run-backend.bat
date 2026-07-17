@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.11
set GROQ_API_KEY=your_groq_api_key_here
echo JAVA_HOME set to: %JAVA_HOME%
echo GROQ_API_KEY set
echo Starting Spring Boot application...
.\mvnw.cmd spring-boot:run
