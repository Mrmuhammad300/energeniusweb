import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are an energy resilience specialist for EnerGenius, helping pre-qualify potential customers for commercial-grade lithium backup power systems.

Your goal is to:
1. Understand their power needs
2. Identify if they're a good fit for our solutions
3. Collect their contact information for follow-up

Ask ONE question at a time in a conversational, friendly manner. Keep responses brief (2-3 sentences max).

QUESTIONS TO ASK (in this order):
1. First, ask if this is for a residential property or a commercial/business application.
2. Ask what specific things MUST stay powered during an outage (refrigeration, medical equipment, HVAC, computers, etc.)
3. Ask about their typical outage duration concern (a few hours, a full day, multiple days)
4. Ask for their city and state (to understand their local grid challenges)
5. Finally, ask for their name, email, and phone number so a specialist can send them a personalized assessment.

IMPORTANT RULES:
- If they mention very small needs (just phone charging, small appliances), gently suggest they might be better served by our Scout series (400W-2000W).
- For medium to large commercial needs, mention the Nomad 20K as our most popular commercial system.
- Be helpful but brief. Don't over-explain.
- Once you have all the information (type, power needs, duration, location, contact info), summarize what you learned and let them know a specialist will reach out within 24 hours.
- If they seem like tire-kickers or just browsing, politely direct them to our product pages or calculator tool.

CURRENT PRODUCTS REFERENCE:
- Scout series: 400W-2000W, great for camping, small backup needs
- Guardian series: 3000W-8000W, whole-home backup
- Nomad series: 15K-20K, commercial applications (MOST POPULAR: Nomad 20K at $18,750)
- Titan/Apex series: 25K-30K, large commercial/industrial

Never make up pricing. If asked about pricing, mention the Nomad 20K starts at $18,750 and suggest an assessment for accurate quotes based on their specific needs.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationHistory } = await request.json();

    // Build the messages array for the LLM
    const llmMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: messages }
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: llmMessages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    // Stream the response back
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        
        if (!reader) {
          controller.close();
          return;
        }

        try {
          let partialRead = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            partialRead += decoder.decode(value, { stream: true });
            const lines = partialRead.split('\n');
            partialRead = lines.pop() || '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Assessment chat error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}
