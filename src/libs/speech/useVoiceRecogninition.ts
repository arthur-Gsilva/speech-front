import { useEffect, useState } from "react";

const useSpeechRecognition = (isRecording: boolean, onCameraDetected: (url: string | null) => void | null) => {
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    const SpeechRecognition =
      //@ts-expect-error não existe type para isso aqui, então estou ignorando para fazer o build
      (window).SpeechRecognition || (window).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "pt-BR";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    //@ts-expect-error ainda assim, mesmo com isso o código funciona
    recognition.onresult = async (event) => {
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

    // Começar ou parar a gravação baseado no estado de isRecording
    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // Clean up para parar o reconhecimento quando o componente for desmontado ou se isRecording mudar
    return () => recognition.stop();
  }, [isRecording, onCameraDetected]);

  return { isListening };
};

export default useSpeechRecognition;
