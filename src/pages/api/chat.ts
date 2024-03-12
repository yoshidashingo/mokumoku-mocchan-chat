// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';
// LangChainやその他必要なライブラリをインポートする
// 例: import { LangChainClient } from 'langchain';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ message: 'Invalid API Key' });
  }

  // LangChainのクライアントを初期化
  // const langChainClient = new LangChainClient(/* 設定 */);

  // LangChainを使用してOpenAI APIに問い合わせる
  try {
    const response = await langChainClient.query({
      messages: messages,
      apiKey: apiKey,
    });

    // LangChainからのレスポンスをクライアントに返す
    return res.status(200).json(response);
  } catch (error) {
    console.error('LangChain query error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
