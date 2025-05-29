import { useActiveCamera } from "@/contexts/CamContext";
import { cameras } from "@/data/cameras";
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
    recognition.onresult = (event) => {
    const transcript: string =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

    console.log(transcript.replace(/[.,?!]/g, ""))

    let cameraEncontrada = null;

    for (const cam of cameras) {
        if (transcript.includes(cam.keyword.toLowerCase())) {
            cameraEncontrada = cam;
            break;
        }
    }

    if (cameraEncontrada) {
        setActiveCamera(cameraEncontrada.url);
        setFound(true);
    } else {
        console.log("Nenhuma câmera correspondente encontrada.");
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
