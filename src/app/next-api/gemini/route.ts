import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

// API 키를 환경 변수에서 가져옵니다.
const apiKey = process.env.GEMINI_API_KEY;

// API 키가 없으면 에러를 발생시킵니다.
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

// GoogleGenerativeAI 인스턴스를 초기화합니다.
const genAI = new GoogleGenerativeAI(apiKey);

// 사용할 모델 설정 (예: gemini-1.5-flash)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// 생성 설정 (선택 사항)
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// 안전 설정 (선택 사항)
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// POST 요청 핸들러
export async function POST(request: Request) {
  try {
    // 요청 본문에서 prompt를 추출합니다.
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 채팅 세션을 시작합니다.
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [], // 필요에 따라 이전 대화 기록 제공
    });

    // 프롬프트를 보내고 결과를 받습니다.
    const result = await chatSession.sendMessage(prompt);

    // 성공적인 응답을 반환합니다.
    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // 내부 서버 오류 응답을 반환합니다.
    return NextResponse.json({ error: "Failed to fetch response from Gemini API" }, { status: 500 });
  }
}
