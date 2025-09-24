import { NextResponse } from "next/server";
import OpenAI from "openai";
import { cameras } from "@/data/cameras";

// Usando chave da API a partir de .env.local
const client = new OpenAI({
  apiKey: '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', // Mude para usar variável de ambiente
});

function normalize(text: string) {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export async function POST(req: Request) {
  let text: string;
  try {
    const requestBody = await req.json();
    text = requestBody.text;
  } catch (error) {
    console.error("Erro ao parsear o JSON:", error);
    return NextResponse.json({ error: "Erro ao parsear o JSON" }, { status: 400 });
  }

  console.log("Texto recebido:", text);

  if (!text) {
    return NextResponse.json({ error: "Texto não enviado." }, { status: 400 });
  }

  const cameraNames = cameras.map((c) => c.keyword);

  try {
    console.log("Enviando requisição para OpenAI...");
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // Verifique se o modelo está correto
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
          content: `Texto do usuário: "${text}". Qual câmera ele quer abrir?`,
        },
      ],
      max_tokens: 20,
      temperature: 0,
    });

    console.log("Resposta do OpenAI:", response);

    // Verifique se 'choices' tem conteúdo
    if (!response.choices || response.choices.length === 0) {
      console.error("Resposta sem escolhas.");
      return NextResponse.json({ error: "Erro na resposta do OpenAI." }, { status: 500 });
    }

    const resposta = response.choices[0].message?.content?.trim() || "";
    console.log("Resposta processada:", resposta);

    const normalizado = normalize(resposta);
    console.log("Texto normalizado:", normalizado);

    const encontrada = cameras.find((c) => normalize(c.keyword) === normalizado);
    if (encontrada) {
      console.log("Câmera encontrada:", encontrada.url);
      return NextResponse.json({ camera_url: encontrada.url });
    }

    console.log("Nenhuma câmera identificada.");
    return NextResponse.json({ error: "Nenhuma câmera encontrada." }, { status: 404 });
  } catch (error) {
    console.error("Erro ao consultar OpenAI:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
