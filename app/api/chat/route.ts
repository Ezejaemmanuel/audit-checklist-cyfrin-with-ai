// import { createOpenAI, openai } from "@ai-sdk/openai";
// import { getEdgeRuntimeResponse } from "@assistant-ui/react/edge";

// export const maxDuration = 30;

// export const POST = async (request: Request) => {
//     const requestData = await request.json();

//     const perplexity = createOpenAI({
//         name: 'perplexity',
//         apiKey: process.env.PERPLEXITY_API_KEY ?? '',
//         baseURL: 'https://api.perplexity.ai/',
//     });
//     const model = perplexity('llama-3.1-8b-instruct');
//     return getEdgeRuntimeResponse({
//         options: {
//             model: model,
//             system: "You are a smart contract security expert that finds bugs and explains and finds and fixes vulnerabilities in smart contracts.",
//             temperature: 0.8,
//             maxTokens: 1000,
//             headers: {

//             }
//         },
//         requestData,
//         abortSignal: request.signal,
//     });
// };


// import { createOpenAI } from "@ai-sdk/openai";
// import { streamText } from "ai";

// export const maxDuration = 30;

// // Custom error class for better error handling
// class AIApiError extends Error {
//     constructor(
//         message: string,
//         public statusCode: number,
//         public errorCode: string
//     ) {
//         super(message);
//         this.name = 'AIApiError';
//     }
// }

// export const POST = async (request: Request) => {
//     try {
//         // Validate request
//         if (!request.body) {
//             throw new AIApiError(
//                 "Request body is required",
//                 400,
//                 "INVALID_REQUEST"
//             );
//         }

//         // Validate API key
//         if (!process.env.PERPLEXITY_API_KEY) {
//             throw new AIApiError(
//                 "Perplexity API key is not configured",
//                 500,
//                 "API_KEY_MISSING"
//             );
//         }

//         const requestData = await request.json();

//         // Validate messages in request data
//         if (!requestData.messages || !Array.isArray(requestData.messages)) {
//             throw new AIApiError(
//                 "Messages array is required in request body",
//                 400,
//                 "INVALID_MESSAGES"
//             );
//         }

//         const perplexity = createOpenAI({
//             name: 'perplexity',
//             apiKey: process.env.PERPLEXITY_API_KEY,
//             baseURL: 'https://api.perplexity.ai/',
//         });

//         const model = perplexity('llama-3.1-8b-instruct');

//         // Convert messages to core format and add system message
//         const messages = [
//             {
//                 role: 'system',
//                 content: "You are a smart contract security expert that finds bugs and explains and finds and fixes vulnerabilities in smart contracts."
//             },
//             ...requestData.messages
//         ];

//         const result = await streamText({
//             model: model,
//             messages: messages,
//             temperature: 0.8,
//             maxTokens: 1000,
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         return result.toDataStreamResponse();

//     } catch (error) {
//         console.error('AI API Error:', error);

//         // Handle specific error types
//         if (error instanceof AIApiError) {
//             return new Response(
//                 JSON.stringify({
//                     error: error.message,
//                     code: error.errorCode,
//                     status: error.statusCode
//                 }),
//                 {
//                     status: error.statusCode,
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//         }

//         // Handle rate limiting errors
//         if (error instanceof Error && error.message.includes('rate limit')) {
//             return new Response(
//                 JSON.stringify({
//                     error: 'Rate limit exceeded. Please try again later.',
//                     code: 'RATE_LIMIT_EXCEEDED',
//                     status: 429
//                 }),
//                 {
//                     status: 429,
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Retry-After': '60'
//                     }
//                 }
//             );
//         }

//         // Handle token limit errors
//         if (error instanceof Error && error.message.includes('token limit')) {
//             return new Response(
//                 JSON.stringify({
//                     error: 'Token limit exceeded. Please reduce your input.',
//                     code: 'TOKEN_LIMIT_EXCEEDED',
//                     status: 400
//                 }),
//                 {
//                     status: 400,
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//         }

//         // Handle validation errors
//         if (error instanceof Error && error.message.includes('validation')) {
//             return new Response(
//                 JSON.stringify({
//                     error: 'Invalid input parameters.',
//                     code: 'VALIDATION_ERROR',
//                     status: 400
//                 }),
//                 {
//                     status: 400,
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//         }

//         // Handle network errors
//         if (error instanceof Error && error.message.includes('network')) {
//             return new Response(
//                 JSON.stringify({
//                     error: 'Network error occurred. Please try again.',
//                     code: 'NETWORK_ERROR',
//                     status: 503
//                 }),
//                 {
//                     status: 503,
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//         }

//         // Default error response
//         return new Response(
//             JSON.stringify({
//                 error: 'An unexpected error occurred',
//                 code: 'INTERNAL_SERVER_ERROR',
//                 status: 500
//             }),
//             {
//                 status: 500,
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//     }
// };



import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest } from 'next/server';
import { redis } from "@/lib/Initialize-redis";
import { auth, currentUser } from '@clerk/nextjs/server'


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Configure runtime
export const runtime = 'edge';

// Rate limiter configuration
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(10, '60s'),
    prefix: "ai-api-ratelimit",
    analytics: true, // Enable analytics for monitoring
});

// Custom error class for better error handling
class AIApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errorCode: string
    ) {
        super(message);
        this.name = 'AIApiError';
    }
}

// Helper function to create error responses
const createErrorResponse = (error: AIApiError | Error, status = 500) => {
    const errorBody = {
        error: error.message,
        code: error instanceof AIApiError ? error.errorCode : 'INTERNAL_SERVER_ERROR',
        status: error instanceof AIApiError ? error.statusCode : status
    };

    return new Response(JSON.stringify(errorBody), {
        status: error instanceof AIApiError ? error.statusCode : status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
};

export async function POST(request: NextRequest) {

    try {
        // Get user ID from authentication
        const user = await auth();
        const userId = user.userId;

        // Check authentication
        if (!userId) {
            throw new AIApiError(
                "Authentication required. Please sign in to use this service.",
                401,
                "AUTHENTICATION_REQUIRED"
            );
        }

        // Check rate limit
        const { success, remaining, reset, limit } = await ratelimit.limit(userId);

        if (!success) {
            const resetInSeconds = Math.ceil((reset - Date.now()) / 1000);
            throw new AIApiError(
                `Rate limit exceeded. You've used all ${limit} prompts. Please try again in ${resetInSeconds} seconds or use ChatGPT/Perplexity directly.`,
                429,
                "RATE_LIMIT_EXCEEDED"
            );
        }

        // Validate request body
        if (!request.body) {
            throw new AIApiError(
                "Request body is required",
                400,
                "INVALID_REQUEST"
            );
        }

        // Validate API key
        if (!process.env.PERPLEXITY_API_KEY) {
            throw new AIApiError(
                "API configuration error. Please contact support.",
                500,
                "API_KEY_MISSING"
            );
        }

        const requestData = await request.json();



        // Initialize Perplexity AI client
        const perplexity = createOpenAI({
            name: 'perplexity',
            apiKey: process.env.PERPLEXITY_API_KEY,
            baseURL: 'https://api.perplexity.ai/',
        });

        const model = perplexity('llama-3.1-8b-instruct');

        // Prepare messages with system prompt
        const messages = [
            {
                role: 'system',
                content: "You are a smart contract security expert that finds bugs and explains and finds and fixes vulnerabilities in smart contracts."
            },
            ...requestData.messages
        ];

        // Stream the response
        const result = await streamText({
            model: model,
            messages: messages,
            temperature: 0.8,
            maxTokens: 1000,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Create response with rate limit headers
        const response = result.toDataStreamResponse();
        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', reset.toString());
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

        return response;

    } catch (error) {
        console.error('AI API Error:', error);

        // Handle specific error types
        if (error instanceof AIApiError) {
            return createErrorResponse(error);
        }

        // Handle rate limiting errors
        if (error instanceof Error && error.message.includes('rate limit')) {
            return createErrorResponse(new AIApiError(
                'Rate limit exceeded. Please try again later.',
                429,
                'RATE_LIMIT_EXCEEDED'
            ));
        }

        // Handle token limit errors
        if (error instanceof Error && error.message.includes('token limit')) {
            return createErrorResponse(new AIApiError(
                'Token limit exceeded. Please reduce your input.',
                400,
                'TOKEN_LIMIT_EXCEEDED'
            ));
        }

        // Handle validation errors
        if (error instanceof Error && error.message.includes('validation')) {
            return createErrorResponse(new AIApiError(
                'Invalid input parameters.',
                400,
                'VALIDATION_ERROR'
            ));
        }

        // Handle network errors
        if (error instanceof Error && error.message.includes('network')) {
            return createErrorResponse(new AIApiError(
                'Network error occurred. Please try again.',
                503,
                'NETWORK_ERROR'
            ));
        }

        // Handle API timeout errors
        if (error instanceof Error && error.message.includes('timeout')) {
            return createErrorResponse(new AIApiError(
                'Request timed out. Please try again.',
                504,
                'TIMEOUT_ERROR'
            ));
        }

        // Handle Perplexity API specific errors
        if (error instanceof Error && error.message.includes('Perplexity')) {
            return createErrorResponse(new AIApiError(
                'AI service error. Please try again later.',
                502,
                'AI_SERVICE_ERROR'
            ));
        }

        // Default error response
        return createErrorResponse(
            new AIApiError(
                'An unexpected error occurred',
                500,
                'INTERNAL_SERVER_ERROR'
            )
        );
    }
}