KEEPly V0.3 – echte KI-Dokumentanalyse

Was neu ist:
- Backend für Foto/PDF-Analyse
- OpenAI Responses API
- strukturierte JSON-Ausgabe
- Fristen werden nicht frei erfunden und müssen bestätigt werden
- API-Schlüssel bleibt serverseitig
- hochgeladene temporäre Datei wird nach der Analyse gelöscht
- Frontend bleibt lokal einfach bedienbar

Lokal starten:
1. Node.js installieren.
2. Im Keeply_V0.3-Ordner: npm install
3. OPENAI_API_KEY als Umgebungsvariable setzen.
4. npm start
5. http://localhost:3000 öffnen.

Für iPhone-Nutzung muss dieser Ordner auf einem HTTPS-Hostingdienst bereitgestellt werden.
Noch nicht produktionsreif: Login, verschlüsselte dauerhafte Dokumentablage, Push-Mitteilungen,
Backups, Datenschutztexte und Missbrauchsschutz fehlen noch.

WICHTIG:
Keeply soll Fristen/Termine aus Dokumenten als Vorschlag anzeigen. Nutzer müssen relevante
Fristen vor dem Speichern bestätigen. Keine Rechtsberatung.
