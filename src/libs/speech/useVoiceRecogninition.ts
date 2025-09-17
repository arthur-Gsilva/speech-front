import { useActiveCamera } from "@/contexts/CamContext";
import { useEffect, useState } from "react";

const useSpeechRecognition = (
  isRecording: boolean,
  setFound: (a: boolean | null) => void
) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const { setActiveCamera } = useActiveCamera();

    useEffect(() => {
    const SpeechRecognition =
        // @ts-expect-error ignorando types para browser compatibility
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "pt-BR";

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => {
        setIsListening(false);

        if (isRecording) {
            recognition.start(); // Reinicia automaticamente se ainda for pra gravar
        }
    };

    // @ts-expect-error ignorando types
    recognition.onresult = async (event) => {
    const transcript: string =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

    console.log(transcript.replace(/[.,?!]/g, ""))

    try {
        const res = await fetch("/api/get-camera", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript }),
        });

        const data = await res.json();

        if (res.ok && data.camera_url) {
          setActiveCamera(data.camera_url);
          setFound(true);
        } else {
          console.log("Nenhuma câmera correspondente encontrada.");
          setFound(false);
        }
      } catch (e) {
        console.error("Erro ao consultar LLM:", e);
        setFound(false);
      }
    };

    if (isRecording) {
        recognition.start();
    }

    // Cleanup
    return () => {
        recognition.onend = null;
        recognition.stop();
    };
    }, [isRecording]);

  return { isListening };
};

export default useSpeechRecognition;
