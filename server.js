import express from "express";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

import cors from "cors";

const app = express();
app.use(cors());
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
    cb(ok ? null : new Error("Nur Bilder oder PDF erlaubt"), ok);
  }
});
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static("public"));

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type:"string", enum:["purchase","contract","appointment","letter"] },
    title: { type:"string" },
    date: { type:"string" },
    amount: { type:"string" },
    cycle: { type:"string", enum:["monthly","yearly","once","unknown"] },
    cancelDate: { type:"string" },
    returnDate: { type:"string" },
    warrantyDate: { type:"string" },
    invoice: { type:"string" },
    appointmentDate: { type:"string" },
    location: { type:"string" },
    deadline: { type:"string" },
    notes: { type:"string" },
    confidence: { type:"number" },
    evidence: { type:"array", items:{type:"string"} },
    needsConfirmation: { type:"boolean" }
  },
  required:["type","title","date","amount","cycle","cancelDate","returnDate","warrantyDate","invoice","appointmentDate","location","deadline","notes","confidence","evidence","needsConfirmation"]
};

app.post("/api/analyze", upload.single("document"), async (req,res) => {
  if (!req.file) return res.status(400).json({error:"Kein Dokument"});
  try {
const imageBase64 = await fs.readFile(req.file.path, { encoding: "base64" });

const imageUrl = `data:${req.file.mimetype};b   

    const response = await client.responses.create({
      model: process.env.KEEPly_MODEL || "gpt-6-luna",
      input: [{
        role:"user",
        content:[
          {type:"input_text", text:`Analysiere dieses deutsche Alltagsdokument für Keeply.
Extrahiere nur Informationen, die im Dokument wirklich stehen. Erfinde keine Fristen.
Leere/unbekannte Werte als "" zurückgeben.
type: purchase für Kauf/Rechnung/Quittung, contract für Vertrag/Abo/Versicherung,
appointment für Termine/Einladungen, sonst letter.
Datumsformat YYYY-MM-DD, appointmentDate YYYY-MM-DDTHH:MM.
amount nur Zahl mit Punkt als Dezimaltrenner.
Bei Kündigungs-, Rückgabe-, Garantie- oder sonstigen rechtlich relevanten Fristen:
nur ein Datum setzen, wenn es ausdrücklich oder eindeutig aus dem Dokument folgt.
needsConfirmation=true, sobald eine Frist, ein Termin oder Vertragsdetail erkannt wurde.
evidence: kurze Fundstellen/Begründungen, keine langen Zitate.`},
          {type:"input_image", image_url:imageUrl}
        ]
      }],
      text:{
        format:{
          type:"json_schema",
          name:"keeply_document",
          strict:true,
          schema
        }
      }
    });

    const data = JSON.parse(response.output_text);
    res.json(data);
    client.files.delete(uploaded.id).catch(()=>{});
  } catch(err) {
    console.error(err);
    res.status(500).json({error:"Analyse fehlgeschlagen"});
  } finally {
    await fs.unlink(req.file.path).catch(()=>{});
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Keeply läuft auf http://localhost:${process.env.PORT || 3000}`)
);
