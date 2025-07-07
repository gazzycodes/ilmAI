# ilmAI Documentation

## Overview
ilmAI is an AI-powered Islamic knowledge assistant that provides authentic answers based on verified Quranic verses and authentic Hadith. The application uses Google Gemini 2.0 Flash API with a Retrieval Augmented Generation (RAG) approach to provide accurate and source-based responses.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- NPM (v6 or higher)
- Google Gemini API key

### Installation
1. Clone the repository:
```bash
git clone https://github.com/gazzycodes/ilmAI.git
cd ilmAI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the application:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Live Demo
- **Main Domain**: [https://ilmai.live](https://ilmai.live)
- **WWW Domain**: [https://www.ilmai.live](https://www.ilmai.live)
- **Status**: ✅ Production Ready with SSL/HTTPS
- **SSL Certificate**: Let's Encrypt (Auto-renewal enabled)
- **Security**: Force HTTPS with automatic HTTP redirects

## Project Structure
- `/src` - Application source code
  - `/utils` - Utility functions
  - `/routes` - API routes
- `/public` - Static assets
- `/data` - Knowledge base datasets

## API Endpoints
- `GET /api/health` - Check if the API is running
- `POST /api/query` - Submit a query to the AI assistant

### Query Endpoint
```
POST /api/query
Content-Type: application/json

{
  "query": "What does Islam say about kindness?"
}
```

Response format:
```json
{
  "response": "Islam places great emphasis on kindness...",
  "query": "What does Islam say about kindness?",
  "sources": [
    {
      "type": "Quran",
      "text": "...",
      "arabic": "...",
      "reference": "Surah Al-Baqarah (2:83)"
    }
  ],
  "hasRelevantContent": true
}
```

## Logging System

ilmAI includes a built-in logging system that helps with debugging and monitoring the application. The logging system has four levels:

- **ERROR (0)**: Critical errors that prevent the application from functioning properly
- **WARN (1)**: Warning messages that indicate potential issues
- **INFO (2)**: Informational messages about normal operation
- **DEBUG (3)**: Detailed debug information for troubleshooting

You can configure the log level in the `.env` file:

```
LOG_LEVEL=2  # 0=ERROR, 1=WARN, 2=INFO, 3=DEBUG
```

Setting a specific log level will show messages at that level and all lower levels. For example, setting `LOG_LEVEL=2` will show ERROR, WARN, and INFO messages, but not DEBUG messages.

## Process Management

ilmAI includes a process management system that helps with handling server instances and port conflicts. The system provides the following features:

- **Automatic Port Selection**: If the default port (3000) is already in use, the server will automatically try to find a free port.
- **Server Status Check**: You can check if the server is running and which port it's using with `npm run status`.
- **Graceful Shutdown**: The server will shut down gracefully when you press Ctrl+C.

## Search and Relevance System

ilmAI uses an advanced search and relevance system to find the most appropriate Quranic verses and Hadiths for user queries:

### Keyword Extraction
- Removes common stopwords
- Filters out short words
- Focuses on meaningful terms

### Concept-Based Matching
- Identifies important concepts in queries (e.g., prayer, death, belief)
- Matches related terms to improve relevance
- Boosts scores for conceptual matches

### Relevance Scoring
- Calculates relevance based on keyword matches
- Applies higher weights to conceptual matches
- Filters results based on relevance thresholds

### Source Filtering
- Prioritizes highly relevant sources
- Provides fallback to best available matches when needed
- Sorts sources by relevance score

## Extending the Application

### Adding More Quran Verses
To add more Quran verses, edit the `data/quran.json` file and add new entries following the existing format:

```json
{
  "surah": 1,
  "ayah": 1,
  "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  "surah_name": "Al-Fatihah",
  "revelation_type": "Meccan"
}
```

You can also use the import script to import verses from another JSON file:
```bash
node scripts/import-data.js --source=path/to/your/verses.json --type=quran
```

The source file should have the following structure:
```json
{
  "verses": [
    {
      "surah": 1,
      "ayah": 1,
      "arabic": "...",
      "translation": "...",
      "surah_name": "...",
      "revelation_type": "..."
    }
    // more verses...
  ]
}
```

### Adding More Hadith
To add more Hadith, edit the `data/hadith.json` file and add new entries following the existing format:

```json
{
  "collection": "Sahih Bukhari",
  "book": "Book of Revelation",
  "number": "1",
  "arabic": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
  "text": "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.",
  "narrator": "Umar ibn Al-Khattab",
  "grade": "Sahih"
}
```

You can also use the import script to import hadiths from another JSON file:
```bash
node scripts/import-data.js --source=path/to/your/hadiths.json --type=hadith
```

The source file should have the following structure:
```json
{
  "hadiths": [
    {
      "collection": "...",
      "book": "...",
      "number": "...",
      "arabic": "...",
      "text": "...",
      "narrator": "...",
      "grade": "..."
    }
    // more hadiths...
  ]
}
```

### Customizing the AI Prompt
To customize how the AI responds to queries, edit the `src/utils/promptBuilder.js` file. The `buildPrompt` function constructs the prompt that is sent to the Gemini API.

### Improving Search Functionality
The search functionality is implemented in `src/utils/dataService.js`. You can enhance the search algorithm by modifying the `searchQuran` and `searchHadith` functions.

## Roadmap

### Coming Soon (Next Update)
- **Prompt Enhancement**: Automatic query refinement for better source matching
- **Advanced Source Filtering**: Improved relevance detection and filtering
- **User Feedback System**: Allow users to rate response quality

### Planned Features
- **Multi-language Support**: Interface in multiple languages
- **Topic Explorer**: Browse Islamic topics by category
- **Voice Interface**: Ask questions using voice input
- **Personalization**: Save favorite responses and queries

## Production Deployment

### Infrastructure
- **Server**: Ubuntu 22.04 VPS (45.58.127.18)
- **Domains**: ilmai.live, www.ilmai.live
- **DNS**: Cloudflare DNS management
- **SSL**: Let's Encrypt certificates with auto-renewal
- **Web Server**: Nginx reverse proxy with SSL termination
- **Containerization**: Docker with Docker Compose
- **Database**: MongoDB 7.0.21

### Deployment Architecture
```
Internet → Cloudflare DNS → VPS Server (45.58.127.18)
                                ↓
                           Nginx (SSL Termination)
                                ↓
                           Docker Container (ilmAI App)
                                ↓
                           MongoDB Database
```

### SSL Configuration
- **Certificate Authority**: Let's Encrypt
- **Domains Covered**: ilmai.live, www.ilmai.live
- **Auto-renewal**: Enabled via Certbot
- **Security Headers**: HSTS, XSS Protection, Content Security Policy
- **HTTP to HTTPS**: Automatic redirects enforced

### CI/CD Pipeline
- **Repository**: https://github.com/gazzycodes/ilmAI
- **Trigger**: Push to main branch
- **Deployment**: Automated via GitHub Actions
- **Process**: Build → Test → Deploy → Health Check

### Monitoring & Health Checks
- **Health Endpoint**: `/api/health`
- **Container Health**: Docker health checks every 30s
- **SSL Monitoring**: Certificate expiry tracking
- **Uptime**: 24/7 monitoring

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 