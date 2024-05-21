// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';
// LangChainやその他必要なライブラリをインポートする
// 例: import { LangChainClient } from 'langchain';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  const apiKey = "xxxxxx";

  if (!apiKey) {
    return res.status(400).json({ message: 'Invalid API Key' });
  }

  try {
    const chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
    });

    const prompt = ChatPromptTemplate.fromMessages(messages);
    const chain = prompt.pipe(chatModel);
    const response = await chain.invoke({});

    console.log(response);

    // LangChainからのレスポンスをクライアントに返す
    return res.status(200).json(response);
  } catch (error) {
    console.error('LangChain query error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
