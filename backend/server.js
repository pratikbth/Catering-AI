const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const PDFDocument = require("pdfkit");
const pptxgen = require("pptxgenjs");
const { PNG } = require("pngjs");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const rootDir = path.resolve(__dirname, "..");
const assetsDir = path.join(rootDir, "public", "Assets");

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: process.env.JSON_LIMIT || "80mb" }));
app.use("/assets", express.static(assetsDir));

const templateCatalog = [
  {
    id: "heritage-banquet",
    title: "Heritage Banquet",
    category: "Banquet",
    description: "Warm luxury styling for formal catered gatherings.",
    filename: "heritage-banquet-template.json",
    asset: "1cat.jpg",
  },
  {
    id: "garden-soiree",
    title: "Garden Soiree",
    category: "Outdoor",
    description: "Fresh outdoor event styling with botanical accents.",
    filename: "garden-soiree-template.json",
    asset: "2cat.jpg",
  },
  {
    id: "modern-reception",
    title: "Modern Reception",
    category: "Reception",
    description: "Clean, contemporary layouts for polished events.",
    filename: "modern-reception-template.json",
    asset: "3cat.jpg",
  },
  {
    id: "festive-dining",
    title: "Festive Dining",
    category: "Dining",
    description: "Layered tablescapes for celebratory catering moments.",
    filename: "festive-dining-template.json",
    asset: "4cat.jpg",
  },
];

function withAssetUrls(req, template) {
  const origin = `${req.protocol}://${req.get("host")}`;
  return {
    id: template.id,
    title: template.title,
    category: template.category,
    description: template.description,
    filename: template.filename,
    thumbnailUrl: `${origin}/assets/${template.asset}`,
  };
}

function hashText(text) {
  return crypto.createHash("sha256").update(text || "catering-ai").digest();
}

function buildGeneratedImage({ prompt, function_type, space }) {
  const width = 1024;
  const height = 768;
  const png = new PNG({ width, height });
  const hash = hashText([prompt, function_type, space].filter(Boolean).join("|"));

  const palette = [
    [24 + (hash[0] % 48), 18 + (hash[1] % 42), 28 + (hash[2] % 50)],
    [90 + (hash[3] % 95), 52 + (hash[4] % 80), 42 + (hash[5] % 92)],
    [180 + (hash[6] % 60), 146 + (hash[7] % 80), 96 + (hash[8] % 70)],
  ];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (width * y + x) << 2;
      const t = x / width;
      const u = y / height;
      const glow = Math.max(0, 1 - Math.hypot(t - 0.52, u - 0.42) * 1.7);
      png.data[idx] = Math.round(palette[0][0] * (1 - t) + palette[1][0] * t + palette[2][0] * glow * 0.35);
      png.data[idx + 1] = Math.round(palette[0][1] * (1 - u) + palette[1][1] * u + palette[2][1] * glow * 0.35);
      png.data[idx + 2] = Math.round(palette[0][2] * (1 - t) + palette[1][2] * t + palette[2][2] * glow * 0.35);
      png.data[idx + 3] = 255;
    }
  }

  drawRect(png, 130, 170, 764, 420, [255, 248, 235, 36]);
  drawRect(png, 176, 230, 672, 40, [255, 248, 235, 84]);
  drawRect(png, 176, 498, 672, 40, [255, 248, 235, 70]);

  for (let i = 0; i < 9; i += 1) {
    const x = 190 + i * 82 + (hash[i + 9] % 22);
    const h = 120 + (hash[i + 18] % 90);
    drawRect(png, x, 342 - h / 2, 34, h, [255, 233, 188, 105]);
    drawRect(png, x - 16, 342 - h / 2 - 8, 66, 14, [255, 250, 220, 120]);
  }

  for (let i = 0; i < 32; i += 1) {
    const x = 80 + ((hash[i % hash.length] * 37 + i * 53) % 870);
    const y = 70 + ((hash[(i + 11) % hash.length] * 31 + i * 29) % 620);
    const size = 3 + (hash[(i + 17) % hash.length] % 8);
    drawRect(png, x, y, size, size, [255, 245, 210, 120]);
  }

  return PNG.sync.write(png).toString("base64");
}

async function generateNanoBananaImage(payload) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NANO_BANANA_API_KEY;
  if (!apiKey) {
    if (process.env.ALLOW_LOCAL_IMAGE_FALLBACK === "false") {
      throw new Error("GEMINI_API_KEY is missing. Add it to .env to use Nano Banana image generation.");
    }
    return buildGeneratedImage(payload);
  }

  const model = process.env.NANO_BANANA_MODEL || "gemini-3.1-flash-image-preview";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const parts = await buildGeminiParts(payload);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || `Gemini API request failed with status ${response.status}`;
    throw new Error(message);
  }

  const responseParts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = responseParts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const imageData = imagePart?.inlineData?.data || imagePart?.inline_data?.data;

  if (!imageData) {
    const text = responseParts.map((part) => part.text).filter(Boolean).join(" ");
    throw new Error(text || "Gemini returned no image data.");
  }

  return imageData;
}

async function buildGeminiParts(payload) {
  const {
    prompt,
    function_type,
    space,
    venue_image,
    design_image,
    reference_image,
    venue_image_url,
    design_image_url,
  } = payload;

  const context = [
    "You are a premium wedding catering visualization AI. Generate one photorealistic sales preview image.",
    "TASK: edit the provided venue photo by adding wedding catering services into the same real venue.",
    "VENUE LOCK RULES: preserve the original venue architecture, room layout, walls, flooring, ceiling, windows, pillars, fixed furniture, lighting direction, camera angle, lens perspective, and scale. Do not change the venue identity. Do not replace the venue with a new hall.",
    "CATERING ADDITIONS: add a luxurious wedding catering setup that fits naturally in the venue: buffet stations, live counters, dessert table, beverage station, table styling, floral accents, serviceware, menu signage, warm event lighting, and premium guest-ready presentation.",
    "REFERENCE RULES: use the catering reference image only for food service style, buffet counter design, plating, colors, materials, and decor inspiration. Do not copy the reference background or venue.",
    "COMPOSITION RULES: keep the result believable, physically placed on the floor/tables, correctly lit, and matched to the venue perspective. Avoid distorted tables, unreadable text, warped people, duplicated food, or fantasy architecture.",
    "QUALITY: high-end Indian wedding catering, realistic, sharp, elegant, commercial moodboard quality.",
    `Client request: ${prompt}`,
    function_type ? `Theme/atmosphere: ${function_type}` : null,
    space ? `Venue space: ${space}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const parts = [{ text: context }];
  const imageInputs = [
    {
      label: "VENUE IMAGE - preserve this scene exactly and add catering into it.",
      data: venue_image,
      url: venue_image_url,
    },
    {
      label: "CATERING REFERENCE IMAGE - use only for catering style, buffet, plating, counters, desserts, and table decor inspiration.",
      data: design_image || reference_image,
      url: design_image_url,
    },
  ];

  for (const input of imageInputs) {
    const base64 = input.data || (input.url ? await imageUrlToBase64(input.url) : null);
    if (base64) {
      parts.push({ text: input.label });
      parts.push({
        inline_data: {
          mime_type: detectMimeType(base64),
          data: stripDataUri(base64),
        },
      });
    }
  }

  return parts;
}

async function imageUrlToBase64(url) {
  if (!url) return null;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch reference image: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const buffer = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

function detectMimeType(imageData) {
  const match = String(imageData).match(/^data:(image\/\w+);base64,/);
  return match?.[1] || "image/png";
}

function drawRect(png, left, top, width, height, rgba) {
  const x0 = Math.max(0, Math.floor(left));
  const y0 = Math.max(0, Math.floor(top));
  const x1 = Math.min(png.width, Math.floor(left + width));
  const y1 = Math.min(png.height, Math.floor(top + height));

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const idx = (png.width * y + x) << 2;
      const alpha = rgba[3] / 255;
      png.data[idx] = Math.round(png.data[idx] * (1 - alpha) + rgba[0] * alpha);
      png.data[idx + 1] = Math.round(png.data[idx + 1] * (1 - alpha) + rgba[1] * alpha);
      png.data[idx + 2] = Math.round(png.data[idx + 2] * (1 - alpha) + rgba[2] * alpha);
      png.data[idx + 3] = 255;
    }
  }
}

function stripDataUri(imageData) {
  if (!imageData) return null;
  return String(imageData).replace(/^data:image\/\w+;base64,/, "");
}

function addPdfImage(doc, imageData, index) {
  const cleanImage = stripDataUri(imageData);
  if (!cleanImage) return;

  const imageBuffer = Buffer.from(cleanImage, "base64");
  const x = index % 2 === 0 ? 50 : 320;
  const y = 110 + Math.floor(index / 2) * 230;
  doc.image(imageBuffer, x, y, { fit: [220, 165], align: "center", valign: "center" });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "catering-ai-backend" });
});

app.get("/api/templates", (req, res) => {
  res.json({ templates: templateCatalog.map((template) => withAssetUrls(req, template)) });
});

app.get("/api/templates/download/:filename", (req, res) => {
  const template = templateCatalog.find((item) => item.filename === req.params.filename);
  if (!template) {
    return res.status(404).json({ detail: "Template not found" });
  }

  res.setHeader("Content-Disposition", `attachment; filename="${template.filename}"`);
  res.json({
    id: template.id,
    title: template.title,
    category: template.category,
    description: template.description,
    suggestedPrompt: `Create a ${template.category.toLowerCase()} catering venue inspired by ${template.title}.`,
  });
});

app.post("/api/generate", async (req, res) => {
  const { prompt, function_type, space } = req.body || {};
  if (!prompt || !String(prompt).trim()) {
    return res.status(400).json({ success: false, error: "Prompt is required" });
  }

  try {
    const imageData = await generateNanoBananaImage(req.body);
    res.json({ success: true, image_data: imageData });
  } catch (error) {
    console.error("Image generation failed:", error.message);
    res.status(502).json({ success: false, error: error.message });
  }
});

app.post("/api/moodboard/download-pdf", (req, res) => {
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"moodboard.pdf\"");
  doc.pipe(res);

  doc.fontSize(24).text("Catering.AI Moodboard", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#666").text(`Generated ${new Date().toLocaleString()}`, { align: "center" });
  doc.fillColor("#000");

  images.slice(0, 6).forEach((item, index) => {
    addPdfImage(doc, item.image_data, index);
    const x = index % 2 === 0 ? 50 : 320;
    const y = 282 + Math.floor(index / 2) * 230;
    doc.fontSize(8).fillColor("#444").text(item.prompt || "Generated design", x, y, { width: 220, height: 36 });
  });

  if (images.length === 0) {
    doc.moveDown(4).fontSize(14).text("No designs were added to this moodboard yet.", { align: "center" });
  }

  doc.end();
});

app.post("/api/moodboard/download-ppt", async (req, res, next) => {
  try {
    const images = Array.isArray(req.body?.images) ? req.body.images : [];
    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "Catering.AI";
    pptx.subject = "Generated catering design moodboard";
    pptx.title = "Catering.AI Moodboard";

    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: "211A22" };
    titleSlide.addText("Catering.AI Moodboard", {
      x: 0.8,
      y: 2.3,
      w: 11.8,
      h: 0.7,
      fontFace: "Aptos Display",
      fontSize: 36,
      color: "FFF5E6",
      bold: true,
      align: "center",
    });

    if (images.length === 0) {
      titleSlide.addText("No designs were added yet.", {
        x: 0.8,
        y: 3.2,
        w: 11.8,
        h: 0.4,
        fontSize: 16,
        color: "CDBFAE",
        align: "center",
      });
    }

    images.forEach((item, index) => {
      const slide = pptx.addSlide();
      slide.background = { color: "211A22" };
      slide.addText(`Design ${index + 1}`, {
        x: 0.55,
        y: 0.3,
        w: 12.2,
        h: 0.4,
        fontSize: 20,
        color: "FFF5E6",
        bold: true,
      });
      slide.addImage({
        data: `data:image/png;base64,${stripDataUri(item.image_data)}`,
        x: 0.65,
        y: 0.9,
        w: 12.0,
        h: 5.6,
        sizingCrop: true,
      });
      slide.addText(item.prompt || "Generated catering design", {
        x: 0.65,
        y: 6.65,
        w: 12.0,
        h: 0.35,
        fontSize: 11,
        color: "D8CAB8",
      });
    });

    const buffer = await pptx.write({ outputType: "nodebuffer" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.setHeader("Content-Disposition", "attachment; filename=\"moodboard.pptx\"");
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ detail: "Backend error", error: error.message });
});

app.listen(port, () => {
  if (!fs.existsSync(assetsDir)) {
    console.warn(`Assets directory not found: ${assetsDir}`);
  }
  console.log(`Catering.AI backend listening on http://localhost:${port}`);
});
