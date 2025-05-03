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

      try {
        const response = await fetch("http://localhost:5000/get-camera", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript }),
        });

        const data = await response.json();

        if (data.camera_url) {
          setActiveCamera(data.camera_url);
          setFound(true);
        } else {
          console.log("Nenhuma câmera identificada.");
          setFound(false);
        }
      } catch (error) {
        console.error("Erro ao enviar requisição:", error);
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
