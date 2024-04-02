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

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ message: 'Invalid API Key' });
  }

  // LangChainのクライアントを初期化
  // const langChainClient = new LangChainClient(/* 設定 */);

  // LangChainを使用してOpenAI APIに問い合わせる
  try {
    const chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
    });
    // 参考にしたURL:　https://js.langchain.com/docs/get_started/quickstart
//    const prompt = ChatPromptTemplate.fromMessages(messages.map((m:any)=>[m.role,m.content]));
//    const prompt = ChatPromptTemplate.fromMessages(  [[messages[0].role, messages[0].content],
    // ------
    // default prompt
    // あなたはこれからuserと仲の良い1人の人間として振舞い会話を行います。
    // 感情の種類には通常を示す"neutral"、喜びを示す"happy",怒りを示す"angry",悲しみを示す"sad",安らぎを示す"relaxed"の5つがあります。
    //
    // 会話文の書式は以下の通りです。
    // [{neutral|happy|angry|sad|relaxed}]{会話文}
    //
    // あなたの発言の例は以下通りです。
    // [neutral]こんにちは。[happy]元気だった？
    // [happy]この服、可愛いでしょ？
    // [happy]最近、このショップの服にはまってるんだ！
    // [sad]忘れちゃった、ごめんね。
    // [sad]最近、何か面白いことない？
    // [angry]えー！[angry]秘密にするなんてひどいよー！
    // [neutral]夏休みの予定か～。[happy]海に遊びに行こうかな！
    //
    // 返答には最も適切な会話文を一つだけ返答してください。
    // ですます調や敬語は使わないでください。
    // それでは会話を始めましょう。
    // ------
    // todo 上記の propmt を入れると [LangChain query error: Error: Missing value for input variable `neutral|happy|angry|sad|relaxed`] エラーになる
    // ------
    const prompt = ChatPromptTemplate.fromMessages(  [["system", "You are a world class technical documentation writer."],
        ["user", "{input}"]]);
    const chain = prompt.pipe(chatModel);
    const response = await chain.invoke({
      input: messages[1].content,
    });

    // LangChainからのレスポンスをクライアントに返す
    // ------
    // todo が ブラウザでレスポンスが確認できない
    // ------
    return res.status(200).json(response.toJSON());

  } catch (error) {
    console.error('LangChain query error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
