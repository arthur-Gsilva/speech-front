// app/api/get-camera/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { cameras } from "@/data/cameras";

const client = new OpenAI({
  apiKey: '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', // 🔑 coloque no .env.local
});

function normalize(text: string) {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Texto não enviado." }, { status: 400 });
  }

  const cameraNames = cameras.map((c) => c.keyword);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Você é um assistente que identifica qual câmera o usuário deseja abrir. 
        As câmeras válidas são: ${cameraNames.join(", ")}. 
        Só responda com o nome EXATO de uma câmera se ela estiver na lista. 
        Se não encontrar, retorne vazio.`,
      },
      {
        role: "user",
        content: `Texto do usuário: "${text}".
        Qual câmera ele quer abrir?`,
      },
    ],
    max_tokens: 20,
    temperature: 0,
  });

  const resposta = response.choices[0].message?.content?.trim() || "";
  const normalizado = normalize(resposta);

  const encontrada = cameras.find((c) => normalize(c.keyword) === normalizado);

  if (encontrada) {
    return NextResponse.json({ camera_url: encontrada.url });
  }

  return NextResponse.json({ error: "Nenhuma câmera identificada." }, { status: 404 });
}
