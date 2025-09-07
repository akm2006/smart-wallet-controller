'use client';

import { useState } from 'react';
import Wallet from '../components/Wallet';
// Corrected import: No curly braces for default exports
import SmartWalletUI from '../components/SmartWalletUI'; 
import Image from 'next/image';

export default function Home() {
    const [privateKey, setPrivateKey] = useState<`0x${string}` | null>(null);

    const handleWalletConnect = (_address: `0x${string}`, pk: `0x${string}`) => {
        setPrivateKey(pk);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/60 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-center items-center mb-8">
                    <Image src="/0xGasless.png" alt="0xGasless Logo" width={100} height={100} className="rounded-full w-16 h-16 mt-4" />
                    <h1 className="text-5xl font-bold text-center mb-8 text-white font-quantico shadow-lg tracking-tighter leading-tight mt-10">
                        Smart Wallet Controller
                    </h1>
                </div>

                {!privateKey ? (
                    <Wallet onConnect={handleWalletConnect} />
                ) : (
                    <SmartWalletUI privateKey={privateKey} />
                )}
            </div>
        </main>
    );
}

