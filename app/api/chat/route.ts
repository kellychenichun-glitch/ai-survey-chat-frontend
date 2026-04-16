import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // 調用 Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          // 轉換歷史消息格式
          ...history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })),
          // 加入當前消息
          {
            role: 'user',
            content: message
          }
        ],
        system: '你是一位專業的客服助理。請用繁體中文回答問題,保持友善、專業的態度。回答要簡潔明確,如果不確定答案,請誠實告知。'
      })
    })

    if (!response.ok) {
      throw new Error('Claude API 調用失敗')
    }

    const data = await response.json()
    const assistantMessage = data.content[0].text

    return NextResponse.json({ 
      response: assistantMessage,
      success: true 
    })

  } catch (error) {
    console.error('Chat API 錯誤:', error)
    return NextResponse.json(
      { 
        response: '抱歉,系統暫時無法處理您的請求。請稍後再試。',
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    )
  }
}
