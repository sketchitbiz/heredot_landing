import { NextResponse } from "next/server";

// GET /api/estimates
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId"); // 예시: userId 쿼리 파라미터 받기

  // TODO: 인증된 사용자 ID를 가져오거나 userId 파라미터를 사용하여 DB 조회
  console.log("API Route: GET /api/estimates called", { userId });

  // Placeholder 응답
  const dummyEstimates = [
    { id: "est_1", title: "견적 1", date: "2024-01-15", userId },
    { id: "est_2", title: "견적 2", date: "2024-02-20", userId },
  ];

  // 실제 구현 시에는 DB에서 userId에 맞는 데이터를 조회합니다.
  return NextResponse.json({ estimates: dummyEstimates });
}

// POST /api/estimates
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, selections } = body;

    // TODO: userId (로그인 ID 또는 임시 ID)와 selections 데이터를 DB에 저장
    console.log("API Route: POST /api/estimates called with body:", body);

    if (!userId || !selections) {
      return NextResponse.json({ message: "Missing userId or selections" }, { status: 400 });
    }

    // Placeholder: 성공 응답 (실제로는 DB 저장 후 생성된 ID 반환)
    const newEstimateId = `est_${Date.now()}`;
    console.log(`견적 저장 완료 (Placeholder). User: ${userId}, New Estimate ID: ${newEstimateId}`);

    return NextResponse.json(
      { message: "Estimate saved successfully (placeholder)", estimateId: newEstimateId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing POST /api/estimates:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
