import { useEffect, useState } from "react";

const useSpeechRecognition = (onCameraDetected: (url: string | null) => void) => {
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "pt-BR";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event: any) => {
      const transcript: string = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Reconhecido:", transcript);

      try {
        const response = await fetch("http://localhost:5000/get-camera", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript }),
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (data.camera_url) {
          console.log("URL da câmera:", data.camera_url);
          onCameraDetected(data.camera_url);
        } else {
          console.log("Nenhuma câmera identificada.");
          onCameraDetected(null);
        }
      } catch (error) {
        console.error("Erro ao enviar requisição:", error);
        onCameraDetected(null);
      }
    };

    recognition.start();

    return () => recognition.stop();
  }, [onCameraDetected]);

  return { isListening };
};

export default useSpeechRecognition;
