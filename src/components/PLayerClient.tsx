'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Hls from 'hls.js';

export default function PlayerClient() {
    const searchParams = useSearchParams();
    const initialCameraUrl = searchParams.get('cam');

    const videoARef = useRef<HTMLVideoElement | null>(null);
    const videoBRef = useRef<HTMLVideoElement | null>(null);
    const hlsARef = useRef<Hls | null>(null);
    const hlsBRef = useRef<Hls | null>(null);

    const [activeVideo, setActiveVideo] = useState<'A' | 'B'>('A');
    const [currentUrl] = useState<string | null>(initialCameraUrl);

    const loadStream = (videoEl: HTMLVideoElement, hlsRef: React.MutableRefObject<Hls | null>, url: string) => {
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;

            hls.loadSource(url);
            hls.attachMedia(videoEl);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoEl.play().catch(console.error);
            });
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            videoEl.src = url;
            videoEl.play().catch(console.error);
        }
    };

    const swapVideo = (newUrl: string) => {
        const isAActive = activeVideo === 'A';
        const nextVideoRef = isAActive ? videoBRef : videoARef;
        const nextHlsRef = isAActive ? hlsBRef : hlsARef;

        const nextVideo = nextVideoRef.current;
        if (!nextVideo) return;

        // Carrega o novo vídeo "por trás"
        loadStream(nextVideo, nextHlsRef, newUrl);

        // Espera o novo vídeo estar pronto para trocar
        const handleCanPlay = () => {
            nextVideo.removeEventListener('canplay', handleCanPlay);
            setActiveVideo(isAActive ? 'B' : 'A');
        };

        nextVideo.addEventListener('canplay', handleCanPlay);
    };

    useEffect(() => {
        if (currentUrl && videoARef.current) {
            loadStream(videoARef.current, hlsARef, currentUrl);
        }

        return () => {
            hlsARef.current?.destroy();
            hlsBRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        const bc = new BroadcastChannel("camera-sync");
        bc.onmessage = (event) => {
            if (typeof event.data === 'string') {
                swapVideo(event.data);
            }
        };

        return () => {
            bc.close();
        };
    }, [activeVideo]);

    return (
        <div className="w-screen h-screen bg-black relative overflow-hidden">
            <video
                ref={videoARef}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${activeVideo === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                autoPlay
                muted
                playsInline
                controls={false}
            />
            <video
                ref={videoBRef}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${activeVideo === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                autoPlay
                muted
                playsInline
                controls={false}
            />
        </div>
    );
}
