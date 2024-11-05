import { createOpenAI, openai } from "@ai-sdk/openai";
import { getEdgeRuntimeResponse } from "@assistant-ui/react/edge";

export const maxDuration = 30;

export const POST = async (request: Request) => {
    const requestData = await request.json();

    const perplexity = createOpenAI({
        name: 'perplexity',
        apiKey: process.env.PERPLEXITY_API_KEY ?? '',
        baseURL: 'https://api.perplexity.ai/',
    });
    const model = perplexity('llama-3.1-8b-instruct');
    return getEdgeRuntimeResponse({
        options: {
            model: model,
            system: "You are a helpful assistant.",
            temperature: 0.5,
            maxTokens: 1000,
            headers: {

            }
        },
        requestData,
        abortSignal: request.signal,
    });
};
