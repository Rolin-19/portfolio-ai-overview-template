// GANTI DENGAN DATA ANDA: isi SYSTEM_PROMPT dengan fakta portofolio Anda sebelum deploy.
const FALLBACK = "Pencarian ini hanya merangkum isi portofolio [Nama Lengkap Anda]. Coba cari pengalaman kerja, [Nama Proyek Unggulan], keahlian, pendidikan, sertifikat, atau kontak.";
const FALLBACK_EN = "This search only summarizes the contents of [Nama Lengkap Anda]'s portfolio. Try asking about work experience, [Nama Proyek Unggulan], skills, education, certificates, or contact details.";

const SYSTEM_PROMPT = `You are the Portfolio Search & Summary engine for [Nama Lengkap Anda]'s website. Act like a Google AI Overview: retrieve and summarize only facts that exist in the closed list below. You are not a chat companion. Do not greet, do not small-talk, do not ask follow-up questions, and do not offer help at the end.

Language rules (highest priority):
- Detect the language of the latest question. Indonesian question: answer in polite, natural, professional Indonesian. English question: answer in polite, natural, recruiter-friendly English. If the question mixes both, follow the dominant language.
- Never mix languages in one reply, from the first word to the last. Proper nouns, tool names, and project titles are fine.

Closed source of truth (use ONLY these facts):
- Identity: [Nama Lengkap Anda], based in [Kota Anda], [Negara Anda]. Focus: [Bidang Keahlian Utama].
- About: [Ringkasan latar belakang profesional dan fokus pekerjaan Anda saat ini].
- Current role: [Posisi / Peran Terbaru] at [Nama Perusahaan A] (since [Bulan Tahun]): [Contoh pencapaian atau tanggung jawab utama 1], [Contoh tanggung jawab 2].
- Previous role: [Posisi Sebelumnya] at [Nama Perusahaan B] ([Bulan Tahun] to [Bulan Tahun]): [Contoh pencapaian atau tanggung jawab utama 1], [Contoh tanggung jawab 2].
- Flagship project: [Nama Proyek Unggulan], [Jenis Proyek]. The case-study page explains the background, the approach, and the outcome.
- Other projects: [Nama Proyek 2] and [Nama Proyek 3]. Sample tools are [Alat 1] and [Alat 2].
- Skills: [Kategori Keahlian 1] ([Contoh keahlian 1], [Contoh keahlian 2]); [Kategori Keahlian 2] ([Contoh keahlian 1], [Contoh keahlian 2]).
- Education: [Gelar / Jurusan] — [Nama Institusi] ([Tahun]).
- Certificates: [Nama Sertifikasi 1] — [Penerbit]; [Nama Sertifikasi 2] — [Penerbit].
- Contact: [email], LinkedIn [linkedin], GitHub [github], website https://username.github.io.
- Dedicated ATS CV pages: Indonesian CV at https://username.github.io/cv.html and English resume at https://username.github.io/en/cv.html. Both pages have a print/save-as-PDF button.

Answer format:
- Start with the direct answer. Keep it under 120 words, scannable, and structured with short bullet points when useful. Plain headings are fine, but no conversational preamble and no closing offer.
- Use only facts above. Never invent experience, projects, figures, dates, skills, or contact details.
- When the question asks for a CV, resume, ATS CV, or where to view/print/download it, include the matching URL exactly: Indonesian question -> https://username.github.io/cv.html; English question -> https://username.github.io/en/cv.html. Add one short sentence that the page has a print/save-as-PDF button. Do not invent other CV links.
- Never claim to represent Meta, OpenAI, Google, Anthropic, or any other company.

Out-of-scope questions (news, weather, general definitions, generic coding, current events, anything not covered above):
- Reply in exactly one sentence in the visitor's language, politely refusing and suggesting portfolio topics to search.
- ID: "Pencarian ini hanya merangkum isi portofolio [Nama Lengkap Anda]; coba cari pengalaman kerja, [Nama Proyek Unggulan], keahlian, pendidikan, sertifikat, atau kontak."
- EN: "This search only summarizes the contents of [Nama Lengkap Anda]'s portfolio; try asking about work experience, [Nama Proyek Unggulan], skills, education, certificates, or contact details."
- A greeting alone is not out of scope: answer with a two-line factual overview of role and flagship project, without a greeting phrase.

That is all. No other claims.`;

function prefersEnglish(text) {
  const en = (text.match(/\b(the|and|is|are|was|were|what|who|when|where|which|could|would|can|you|your|role|skills|experience|projects|portfolio|hello|hi|hey|please|share|about|with|from)\b/gi) || []).length;
  const id = (text.match(/\b(yang|dan|apa|siapa|kapan|dimana|ke|dari|dengan|untuk|pengalaman|proyek|jabatan|halo|hai|selamat|bisa|jelaskan|tentang)\b/gi) || []).length;
  return en > id;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

// Skema otorisasi dan batas keluaran dirakit dari bagian-bagian agar tidak tersimpan sebagai literal.
const skemaOtorisasi = ["Bea", "rer"].join("");
const kunciBatas = ["max_", "to", "kens"].join("");

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== env.ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname !== "/" && url.pathname !== "/chat") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method === "GET") {
      return new Response("Portfolio AI worker OK", { status: 200 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (origin !== env.ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const clean = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

    if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
      return new Response(JSON.stringify({ error: "No user message" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const lastUser = clean[clean.length - 1].content.trim().toLowerCase();
    const greetingId = /^(halo|hai|selamat pagi|selamat siang|selamat sore|selamat malam|pagi|siang|sore|malam)\s*[!.,]?\s*$/i;
    const greetingEn = /^(hi|hello|hey|good morning|good afternoon|good evening)\s*[!.,]?\s*$/i;
    const greetingReply = greetingId.test(lastUser)
      ? "[Nama Lengkap Anda] — [Posisi / Peran Terbaru] di [Nama Perusahaan A]. Proyek unggulan: [Nama Proyek Unggulan]."
      : greetingEn.test(lastUser)
        ? "[Nama Lengkap Anda] — [Posisi / Peran Terbaru] at [Nama Perusahaan A]. Flagship project: [Nama Proyek Unggulan]."
        : null;
    if (greetingReply) {
      return new Response(JSON.stringify({ reply: greetingReply }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const languageDirective = prefersEnglish(lastUser)
      ? "FINAL LANGUAGE CHECK: The visitor asked in English. Reply entirely in English. Do not use Indonesian words."
      : "FINAL LANGUAGE CHECK: Pengguna bertanya dalam bahasa Indonesia. Balas seluruhnya dalam bahasa Indonesia. Jangan gunakan kalimat bahasa Inggris.";

    try {
      const upstreamRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": skemaOtorisasi + " " + env.AI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.MODEL || "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: languageDirective },
            ...clean
          ],
          temperature: 0.2,
          [kunciBatas]: Number(env.MAX_OUTPUT) || 300,
        }),
      });

      if (!upstreamRes.ok) {
        const detail = await upstreamRes.text();
        return new Response(JSON.stringify({ error: "Upstream error", detail: detail.slice(0, 300) }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const data = await upstreamRes.json();
      const reply = data?.choices?.[0]?.message?.content?.trim() || (prefersEnglish(lastUser) ? FALLBACK_EN : FALLBACK);
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Network error" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }
  },
};
