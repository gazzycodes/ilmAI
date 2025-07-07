# ilmAI - AI-Powered Islamic Knowledge Assistant

An AI-powered Islamic knowledge assistant that provides authentic answers based on verified Quranic verses and authentic Hadith.

## Project Vision
To create a truth-centered Islamic knowledge assistant that helps users get authentic answers to spiritual, ethical, and modern life questions — strictly based on verified sources while transparently showing references.

## Key Features
1. **Natural Language Understanding** - Ask questions in natural language about Islamic guidance
2. **Source Transparency** - Clear references to Quran and authentic Hadith
3. **Contextual Relevance** - Application of teachings to modern contexts
4. **Truth Guardrails** - Only authenticated sources, no fabrications

## Live Demo
Visit [ilmai.live](https://ilmai.live) to try the application.

## Quick Start
### Windows
Double-click on `start.bat` to run the application.

### Linux/Mac
Run the following commands:
```bash
chmod +x start.sh
./start.sh
```

Then open your browser and go to the URL shown in the console (usually http://localhost:3000).

### Check Server Status
To check if the server is running and which port it's using:
```bash
npm run status
```

## Manual Setup
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your environment variables in a `.env` file:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key
   LOG_LEVEL=2  # 0=ERROR, 1=WARN, 2=INFO, 3=DEBUG
   ```
4. Run the development server with `npm run dev`

## Project Structure
- `/src` - Application source code
- `/public` - Static assets
- `/data` - Knowledge base datasets
- `/utils` - Utility functions
- `/routes` - API routes
- `/scripts` - Utility scripts

## Roadmap
- **Coming Soon**: Prompt enhancement for better source matching
- **Coming Soon**: Advanced source filtering with improved relevance detection
- **Planned**: Multi-language support
- **Planned**: Topic explorer to browse Islamic topics by category

## Documentation
For detailed documentation, see [DOCUMENTATION.md](DOCUMENTATION.md).

## License
[MIT](LICENSE) 