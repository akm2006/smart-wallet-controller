import { NextResponse } from 'next/server';
import { Agentkit, AgentkitToolkit } from "@0xgasless/agentkit";
import { formatUnits } from 'ethers'; // Import ethers for formatting utilities


let toolkitCache: AgentkitToolkit | null = null;
let toolkitPrivateKey: string | null = null;

async function getToolkit(privateKey: string) {
    if (toolkitCache && toolkitPrivateKey === privateKey) {
        console.log("--- Returning cached AgentkitToolkit instance ---");
        return toolkitCache;
    }

    console.log("--- Initializing new AgentkitToolkit instance ---");
    
    const apiKey = process.env.OXGASLESS_API_KEY;
    const rpcUrl = process.env.RPC_URL;
    const chainID = process.env.CHAIN_ID;

    if (!apiKey || !rpcUrl || !chainID) {
        throw new Error("Missing required environment variables. Please check your .env.local file.");
    }
    
    // Set environment variables for the toolkit's tools to use internally
    process.env["PRIVATE_KEY"] = privateKey;
    process.env["RPC_URL"] = rpcUrl;
    process.env["CHAIN_ID"] = chainID;
    process.env["0xGASLESS_API_KEY"] = apiKey;

    const agentkit = await Agentkit.configureWithWallet({
        privateKey: privateKey as `0x${string}`,
        rpcUrl: rpcUrl,
        apiKey: apiKey,
        chainID: Number(chainID),
    });

    toolkitCache = new AgentkitToolkit(agentkit);
    toolkitPrivateKey = privateKey;
    
    console.log("✅ AgentkitToolkit initialized successfully for Smart Account operations.");
    return toolkitCache;
}

/**
 * API Route Handler (POST).
 */
export async function POST(request: Request) {
    try {
        const { privateKey, action, args } = await request.json();

        if (!privateKey || !action) {
            return NextResponse.json({ success: false, error: 'Missing privateKey or action' }, { status: 400 });
        }

        const toolkit = await getToolkit(privateKey);
        const tools = toolkit.getTools();
        
        const toolToExecute = tools.find(t => t.name === action);
        
        if (!toolToExecute) {
            return NextResponse.json({ success: false, error: `Tool '${action}' not found.` }, { status: 404 });
        }

        console.log(`[API] Attempting to execute tool '${action}' with args:`, args);

        let result = await toolToExecute.invoke(args || {});

        if (action === 'smart_swap' && typeof result === 'string' && result.startsWith('Swap successful!')) {
            console.log("[API] Formatting swap result...");
            try {
                const outputLine = result.split('\n').find(line => line.includes('(Approximate) Output:'));
                
                if (outputLine) {
                    const rawOutputPart = outputLine.replace('(Approximate) Output:', '').trim(); 
                    const [rawAmount, symbol] = rawOutputPart.split(' ');

                    
                    let decimals = 18; 
                    if (symbol && (symbol.toUpperCase() === 'USDC' || symbol.toUpperCase() === 'USDT.E')) {
                        decimals = 6;
                    }
                    
                    const formattedAmount = formatUnits(rawAmount, decimals);
                    
                    
                    const newOutputLine = `(Approximate) Output: ${parseFloat(formattedAmount).toFixed(6)} ${symbol || ''}`;
                    result = result.replace(outputLine, newOutputLine);
                    console.log(`[API] Successfully formatted swap result.`);
                }
            } catch (formatError) {
                console.error("[API] Failed to format swap result, returning original result. Error:", formatError);
            }
        }
    

        console.log(`[API] Tool '${action}' executed successfully. Result:`, result);
        return NextResponse.json({ success: true, data: result });

    } catch (error: any) {
        console.error("[API EXECUTE ERROR]:", error);
        const errorDetails = error.reason || error.message || (typeof error === 'object' ? JSON.stringify(error) : 'An unknown error occurred');
        return NextResponse.json({ success: false, error: `Error: ${errorDetails}` }, { status: 500 });
    }
}

