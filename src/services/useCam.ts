'use client'

import { useActiveCamera } from "@/contexts/CamContext";
import { cameras } from "@/data/cameras";

export const getCam = (texto: string) => {

    const { setActiveCamera } = useActiveCamera();

    const palavrasDoTexto = texto.toLowerCase().replace(/[.,?!]/g, '').split(' ');

    cameras.map((camera) => {
        const keyword = camera.keyword.toLowerCase().replace(/[.,?!]/g, '').split(' ');

        if(keyword.includes(texto)){
            setActiveCamera(camera.url)
        }
    })
}