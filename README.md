# AI Chat Application - Spring AI + React

A modern, full-stack AI chat application built with Spring Boot 3.5, Spring AI, React 19, and Vite. The application uses Groq API with Llama-3.3-70B-Versatile model to provide intelligent conversational AI capabilities.

## 🚀 Project Overview

This is a complete AI chat application featuring:
- **Backend**: Spring Boot 3.5 with Spring AI integration
- **Frontend**: React 19 with Vite for fast development
- **AI Model**: Llama-3.3-70B-Versatile via Groq API
- **UI**: Modern ChatGPT-inspired dark theme interface

## 🛠 Technologies Used

### Backend
- **Java 21** - Modern Java with latest features
- **Spring Boot 3.5.0** - Enterprise-grade framework
- **Spring AI 1.0.0-M6** - AI integration framework
- **Maven** - Dependency management
- **Lombok** - Reduce boilerplate code
- **Validation** - Input validation

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite 6.0** - Lightning-fast build tool
- **Axios** - HTTP client for API calls
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting
- **CSS** - Custom styling (no Tailwind)

### AI
- **Groq API** - Fast AI inference
- **Llama-3.3-70B-Versatile** - State-of-the-art open-source LLM

## 📁 Project Structure

```
spring-ai/
├── src/main/java/com/example/springaidemo/
│   ├── Application.java                 # Main Spring Boot application
│   ├── config/
│   │   └── CorsConfig.java              # CORS configuration
│   ├── controller/
│   │   └── ChatController.java          # REST API endpoints
│   ├── dto/
│   │   ├── ChatRequest.java             # Request DTO
│   │   └── ChatResponse.java            # Response DTO
│   ├── exception/
│   │   └── GlobalExceptionHandler.java  # Global error handling
│   └── service/
│       └── ChatService.java             # AI service logic
├── src/main/resources/
│   └── application.properties           # Application configuration
├── frontend/
│   ├── index.html                       # HTML entry point
│   ├── package.json                     # Frontend dependencies
│   ├── vite.config.js                   # Vite configuration
│   └── src/
│       ├── main.jsx                     # React entry point
│       ├── App.jsx                      # Main App component
│       ├── App.css                      # Global styles
│       ├── components/
│       │   ├── ChatWindow.jsx           # Chat display component
│       │   ├── ChatWindow.css
│       │   ├── ChatInput.jsx            # Input component
│       │   ├── ChatInput.css
│       │   ├── MessageBubble.jsx        # Message display
│       │   ├── MessageBubble.css
│       │   ├── Loading.jsx              # Loading animation
│       │   └── Loading.css
│       └── services/
│           └── api.js                   # API service
└── pom.xml                              # Maven dependencies
```

## 🔧 Prerequisites

Before running the application, ensure you have:

- **Java 21** or higher installed
- **Maven 3.8+** for backend
- **Node.js 18+** and npm for frontend
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

## 🔑 Getting Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key for use in environment variables

## 🚀 How to Run

### Backend Setup

1. **Navigate to the project root**:
   ```bash
   cd spring-ai
   ```

2. **Set the GROQ_API_KEY environment variable**:
   
   **Windows (PowerShell)**:
   ```powershell
   $env:GROQ_API_KEY="your-groq-api-key-here"
   ```
   
   **Windows (Command Prompt)**:
   ```cmd
   set GROQ_API_KEY=your-groq-api-key-here
   ```
   
   **Linux/Mac**:
   ```bash
   export GROQ_API_KEY="your-groq-api-key-here"
   ```
   
   **Or create a `.env` file** in the project root:
   ```
   GROQ_API_KEY=your-groq-api-key-here
   ```

3. **Build and run the backend**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api/chat
```

### GET Endpoint
Send a message via query parameter:

```http
GET /api/chat?message=Hello
```

**Response**:
```json
{
  "question": "Hello",
  "answer": "Hello! How can I help you today?"
}
```

### POST Endpoint
Send a message via request body:

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Explain Spring AI"
}
```

**Response**:
```json
{
  "question": "Explain Spring AI",
  "answer": "Spring AI is a project that provides Spring-friendly abstractions..."
}
```

## 🧪 Testing with Postman

### GET Request Example

1. Create a new GET request
2. URL: `http://localhost:8080/api/chat?message=What is Java?`
3. Click Send

### POST Request Example

1. Create a new POST request
2. URL: `http://localhost:8080/api/chat`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "message": "Write a hello world in Python"
   }
   ```
5. Click Send

## ✨ Features

### Core Features
- **Real-time AI Chat**: Interact with Llama-3.3-70B model
- **Modern UI**: ChatGPT-inspired dark theme
- **Responsive Design**: Works on desktop and mobile
- **Auto-scroll**: Automatically scrolls to latest message
- **Loading Animation**: Visual feedback during AI processing
- **Error Handling**: User-friendly error messages

### Bonus Features
- **Markdown Rendering**: AI responses support markdown
- **Code Highlighting**: Syntax highlighting for code blocks
- **Copy Response**: Copy AI responses to clipboard
- **Clear Chat**: Clear conversation history
- **Conversation History**: Maintains chat session
- **Typing Indicator**: Shows when AI is thinking
- **Enter Key Support**: Press Enter to send messages

## 🎨 UI Design

The application features:
- **Gradient Background**: Beautiful dark gradient theme
- **Rounded Cards**: Modern card-based design
- **Message Bubbles**: User messages on right, AI on left
- **Smooth Animations**: Fade-in effects for messages
- **Custom Scrollbar**: Styled scrollbars for better UX
- **Loading Spinner**: Animated loading indicator
- **Suggestion Chips**: Quick message suggestions

## 🔒 Security Best Practices

- **No Hardcoded API Keys**: Uses environment variables
- **CORS Configuration**: Only allows frontend origin
- **Input Validation**: Validates all user inputs
- **Error Handling**: Proper exception handling
- **Timeout**: 30-second timeout for API calls

## 🐛 Troubleshooting

### Backend Issues

**Issue**: "Failed to get response from AI"
- **Solution**: Check your GROQ_API_KEY is set correctly
- **Solution**: Verify your Groq API key is valid and has credits

**Issue**: Port 8080 already in use
- **Solution**: Change port in `application.properties`

### Frontend Issues

**Issue**: "Network Error: No response from server"
- **Solution**: Ensure backend is running on port 8080
- **Solution**: Check CORS configuration

**Issue**: Module not found errors
- **Solution**: Run `npm install` in frontend directory

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your-actual-groq-api-key-here
```

Or set it directly in your terminal before running the application.

## 🏗 Architecture

### Backend Architecture
- **Controller Layer**: Handles HTTP requests/responses
- **Service Layer**: Business logic and AI integration
- **DTO Layer**: Data transfer objects
- **Config Layer**: Configuration (CORS, etc.)
- **Exception Layer**: Global exception handling

### Frontend Architecture
- **Component-based**: Modular React components
- **Service Layer**: API communication
- **State Management**: React hooks (useState)
- **Styling**: Component-specific CSS files

## 🧱 Code Quality

The project follows:
- **SOLID Principles**: Single responsibility, dependency injection
- **Clean Code**: Meaningful names, proper comments
- **Constructor Injection**: Dependency injection pattern
- **Proper Folder Structure**: Organized package structure
- **Type Safety**: TypeScript-like validation in Java

## 📦 Dependencies

### Backend (Maven)
- Spring Boot Starter Web
- Spring AI OpenAI Starter
- Spring Boot DevTools
- Spring Boot Starter Validation
- Lombok

### Frontend (npm)
- React 19
- React DOM 19
- Axios
- React Markdown
- Remark GFM
- React Syntax Highlighter
- Vite
- @vitejs/plugin-react

## 🚀 Deployment

### Backend Deployment
1. Build the JAR: `mvn clean package`
2. Set environment variables on server
3. Run: `java -jar target/spring-ai-demo-1.0.0.jar`

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to any static hosting service
3. Update API base URL in production

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and architecture patterns.

## 📧 Support

For issues or questions, please check the troubleshooting section or verify your API key configuration.

---

**Built with ❤️ using Spring AI and React**
