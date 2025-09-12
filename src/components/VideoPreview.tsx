'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Hls from 'hls.js';

type Props = {
    url: string;
    position: { x: number; y: number };
    visible: boolean;
};

export const VideoPreview = ({ url, visible, position }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setContainer(document.body);
    }, []);

    useEffect(() => {
        let hls: Hls | null = null;

        if (videoRef.current && visible && url) {
            const video = videoRef.current;

            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.muted = true;
                    video.play().catch(() => {});
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.muted = true;
                video.play().catch(() => {});
            }
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
            if (hls) hls.destroy();
        };
    }, [url, visible]);

    if (!visible || !container) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                top: position.y + 10,
                left: position.x + 10,
                width: 200,
                height: 120,
                backgroundColor: 'black',
                border: '1px solid #07A6FF',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
            />
        </div>,
        container
    );
};
