# Catering.AI

Catering.AI is an AI-powered wedding food visualization studio for caterers, event planners, and premium clients. It helps teams preview how buffet setups, live counters, dessert tables, table styling, and theme-based plating will look inside a real venue before production begins.

The core workflow is simple: upload a venue photo, upload a catering reference image, describe the event-day setup, and generate a photorealistic preview using Nano Banana / Gemini image generation. The venue is treated as the fixed scene so the output shows how catering services will look in the actual space.

## Features

- AI wedding food visualization for premium catering sales
- Venue-preserving generation: the room layout, camera angle, architecture, and lighting are kept as the base scene
- Catering reference support for buffet styling, live counters, dessert concepts, plating, and table decor
- Theme filters for royal, traditional, and modern event moods
- Budget-level styling options
- Template references for quick inspiration
- Moodboard collection for generated visuals
- PDF and PPTX moodboard export
- React frontend with an Express backend

## Use Case

Example prompt:

```text
Show me a royal Rajasthani buffet for a palace wedding.
```

With a venue photo and catering reference, Catering.AI generates a visual preview of how the catering setup could look on the main wedding day inside that venue.

## Tech Stack

- React
- CRACO / Create React App
- Tailwind CSS
- Express
- Nano Banana / Gemini image API
- PDFKit
- PptxGenJS

## Project Structure

```text
Catering.AI-main/
  backend/
    server.js
  public/
    Assets/
  src/
    components/
    pages/
  .env.example
  package.json
```

## Setup

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Add your Nano Banana / Gemini API key to `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
NANO_BANANA_API_KEY=your_api_key_here
NANO_BANANA_MODEL=gemini-2.5-flash-image
ALLOW_LOCAL_IMAGE_FALLBACK=false
```

Do not commit `.env`. It contains private credentials.

## Run Locally

Start the backend:

```bash
npm run backend
```

Start the frontend:

```bash
npm run frontend
```

Default local URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8000
```

If port `3000` is already in use, run the frontend on another port:

```powershell
$env:PORT="3001"; npm run frontend
```

## Backend API

Health check:

```http
GET /api/health
```

Templates:

```http
GET /api/templates
GET /api/templates/download/:filename
```

Image generation:

```http
POST /api/generate
```

Expected payload:

```json
{
  "prompt": "Show a royal Rajasthani buffet for a palace wedding.",
  "function_type": "Royal",
  "venue_image": "base64 venue image",
  "design_image": "base64 catering reference image"
}
```

Moodboard exports:

```http
POST /api/moodboard/download-pdf
POST /api/moodboard/download-ppt
```

## Important Prompt Behavior

The backend prompt is designed around this rule:

```text
The venue image is the fixed base scene. Preserve the venue architecture, room layout, lighting direction, camera angle, walls, flooring, ceiling, and perspective. Add realistic catering services into that exact venue.
```

The catering reference image is used only for food presentation, buffet styling, live counters, dessert concepts, table decor, and theme inspiration.

## Build

Create a production build:

```bash
npm run build
```

## Security Notes

- Keep API keys only in `.env`
- Never expose Nano Banana / Gemini keys in frontend React code
- Rotate any key that has been shared publicly or committed by mistake
- Make sure `.env` stays ignored by git

## License

This project is currently private/proprietary unless a license is added.
