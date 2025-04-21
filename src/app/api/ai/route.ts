import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    // TODO: 새로운 대화 생성 로직 구현
    // 1. DB에 새로운 대화 생성
    // 2. AI 모델에 초기 메시지 전송
    // 3. 응답 저장

    return NextResponse.json({
      success: true,
      conversationId: "new-conversation-id",
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // TODO: 사용자의 모든 대화 내역을 가져오는 로직 구현
    return NextResponse.json({
      conversations: [],
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
