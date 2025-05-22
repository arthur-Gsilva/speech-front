import { Suspense } from 'react';
import PlayerClient from '@/components/PLayerClient'

export default function PlayerPage() {
    return (
        <Suspense fallback={<div className="text-white p-10">Carregando player...</div>}>
            <PlayerClient />
        </Suspense>
    );
}
