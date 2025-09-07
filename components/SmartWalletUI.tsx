'use client';
import { useState } from 'react';

// Common token symbols and their addresses on Avalanche Mainnet
const AVALANCHE_TOKEN_MAP: { [key: string]: string } = {
    AVAX: 'AVAX',
    USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    'USDT': '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    'WAVAX': '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
};
const ERC20_SYMBOLS = {
    USDC: AVALANCHE_TOKEN_MAP.USDC,
    'USDT': AVALANCHE_TOKEN_MAP['USDT'],
    'WAVAX': AVALANCHE_TOKEN_MAP['WAVAX'],
};
const SWAP_SYMBOLS = { ...ERC20_SYMBOLS, AVAX: 'AVAX' };



const AccordionSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-gray-900/50 rounded-lg border border-gray-600">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 text-left font-semibold text-lg text-gray-200 flex justify-between items-center">
                {title}
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </button>
            {isOpen && <div className="p-4 border-t border-gray-700">{children}</div>}
        </div>
    );
};

export default function SmartWalletUI({ privateKey }: { privateKey: `0x${string}` }) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [args, setArgs] = useState({
        nativeDest: '', nativeAmount: '',
        erc20Dest: '', erc20Amount: '', erc20Symbol: 'USDC',
        swapAmount: '', swapIn: 'AVAX', swapOut: 'USDC',
        approveMax: false,
    });

    const handleAction = async (action: string, actionArgs: any) => {
        setIsLoading(true);
        setResult('');
        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ privateKey, action, args: actionArgs }),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            const formattedResult = typeof data.data === 'object' ? JSON.stringify(data.data, null, 2) : data.data;
            setResult(formattedResult);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setResult(`❌ ERROR:\n${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setArgs(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setArgs(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleErc20Transfer = () => {
        const tokenAddress = ERC20_SYMBOLS[args.erc20Symbol as keyof typeof ERC20_SYMBOLS];
        handleAction('smart_transfer', {
            destination: args.erc20Dest,
            amount: args.erc20Amount,
            tokenAddress: tokenAddress,
        });
    };

    return (
        <div className="space-y-4 text-white">
            <h2 className="text-2xl font-bold text-center text-blue-300 font-quantico">0xGasless Smart Account Debugger</h2>
            
            {(isLoading || result) && (
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 min-h-[100px]">
                     <h3 className="text-lg font-semibold text-gray-300 mb-2">Result</h3>
                    {isLoading ? (
                         <div className="flex items-center space-x-3 text-yellow-400">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                            <span>Executing on-chain...</span>
                        </div>
                    ) : (
                        <pre className={`text-sm overflow-x-auto whitespace-pre-wrap ${result.startsWith('❌') ? 'text-red-400' : 'text-green-300'}`}>{result}</pre>
                    )}
                </div>
            )}

            <AccordionSection title="1. Account Info & Status" defaultOpen={true}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleAction('get_balance', {})} disabled={isLoading} className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">Get All Balances</button>
                    <button onClick={() => handleAction('get_address', {})} disabled={isLoading} className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">Get Smart Account Address</button>
                </div>
            </AccordionSection>
            
            <AccordionSection title="2. Token Swap (Gasless)">
                 <p className="text-xs text-gray-400 mb-3">Test a complex transaction using the Agentkit's `smart_swap` tool.</p>
                 <div className="space-y-3">
                     <div className="flex items-center space-x-2">
                        <input type="text" name="swapAmount" placeholder="Amount to Swap" value={args.swapAmount} onChange={handleInputChange} className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded-md" />
                        <select name="swapIn" value={args.swapIn} onChange={handleInputChange} className="w-1/4 p-2 bg-gray-700 border border-gray-600 rounded-md">
                           {Object.keys(SWAP_SYMBOLS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                         <span className="font-bold">for</span>
                         <select name="swapOut" value={args.swapOut} onChange={handleInputChange} className="w-1/4 p-2 bg-gray-700 border border-gray-600 rounded-md">
                           {Object.keys(SWAP_SYMBOLS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                     <div className="flex items-center mt-2">
                        <input type="checkbox" name="approveMax" id="approveMax" checked={args.approveMax} onChange={handleInputChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600" />
                        <label htmlFor="approveMax" className="ml-2 text-sm text-gray-300">Approve Max (Needed for some tokens)</label>
                     </div>
                </div>
                 <button onClick={() => handleAction('smart_swap', { amount: args.swapAmount, tokenInSymbol: args.swapIn, tokenOutSymbol: args.swapOut, approveMax: args.approveMax })} disabled={isLoading || !args.swapAmount} className="w-full mt-4 p-3 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-500">Execute Swap</button>
            </AccordionSection>

            <AccordionSection title="3. Native & ERC20 Transfers (Gasless)">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {/* Native Transfer */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-300">Native AVAX Transfer</h4>
                         <input type="text" name="nativeDest" placeholder="Recipient Address (0x...)" value={args.nativeDest} onChange={handleInputChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                         <input type="text" name="nativeAmount" placeholder="Amount (e.g., 0.01)" value={args.nativeAmount} onChange={handleInputChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                         <button onClick={() => handleAction('smart_transfer', { destination: args.nativeDest, amount: args.nativeAmount, tokenAddress: 'eth' })} disabled={isLoading || !args.nativeDest || !args.nativeAmount} className="w-full mt-2 p-3 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500">Send AVAX</button>
                    </div>
                    {/* ERC20 Transfer */}
                    <div className="space-y-3 mt-4 md:mt-0">
                        <h4 className="font-semibold text-gray-300">ERC20 Token Transfer</h4>
                         <select name="erc20Symbol" value={args.erc20Symbol} onChange={handleInputChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md">
                            {Object.keys(ERC20_SYMBOLS).map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <input type="text" name="erc20Dest" placeholder="Recipient Address (0x...)" value={args.erc20Dest} onChange={handleInputChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                         <input type="text" name="erc20Amount" placeholder="Amount (e.g., 1.5)" value={args.erc20Amount} onChange={handleInputChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                         <button onClick={handleErc20Transfer} disabled={isLoading || !args.erc20Dest || !args.erc20Amount} className="w-full mt-2 p-3 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500">Send ERC20</button>
                    </div>
                 </div>
            </AccordionSection>
        </div>
    );
}

