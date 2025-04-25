import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { conversationId: string } }) {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // TODO: 특정 대화의 전체 메시지 내역을 가져오는 로직 구현
    return NextResponse.json({
      conversation: {
        id: params.conversationId,
        messages: [],
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { conversationId: string } }) {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    // TODO: 새로운 메시지 처리 로직 구현
    // 1. 사용자 메시지를 DB에 저장
    // 2. AI 모델에 메시지 전송
    // 3. AI 응답을 DB에 저장
    // 4. 클라이언트에 응답 전송

    return NextResponse.json({
      success: true,
      message: {
        id: "new-message-id",
        role: "assistant",
        content: "AI 응답 내용",
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
