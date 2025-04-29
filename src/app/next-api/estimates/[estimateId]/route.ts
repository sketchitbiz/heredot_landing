import { NextResponse } from 'next/server';

interface Params {
  estimateId: string;
}

// 임시 데이터 (실제 데이터 로직으로 교체 필요)
const dummyEstimateData = {
  id: "temp123",
  name: "Sample Estimate",
  amount: 1000,
};

// GET /api/estimates/{estimateId}
export async function GET(request: Request, { params }: { params: Params }) {
  const { estimateId } = params;
  // TODO: DB에서 estimateId로 데이터 조회
  console.log(`API Route: GET /api/estimates/${estimateId} called`);
  // estimateId를 사용하여 임시 데이터 반환 (실제로는 DB 조회 결과 사용)
  const responseData = { ...dummyEstimateData, id: estimateId };
  return NextResponse.json({ estimate: responseData });
}

// PUT /api/estimates/{estimateId}
export async function PUT(request: Request, { params }: { params: Params }) {
  const { estimateId } = params;
  try {
    const body = await request.json();
    // TODO: DB에서 estimateId로 데이터 업데이트
    // TODO: 권한 검사
    console.log(`API Route: PUT /api/estimates/${estimateId} called with body:`, body);
    return NextResponse.json({ message: `Estimate ${estimateId} updated successfully (placeholder)`, estimateId });
  } catch (error) {
    console.error(`Error processing PUT /api/estimates/${estimateId}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/estimates/{estimateId}
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { estimateId } = params;
  // TODO: DB에서 estimateId로 데이터 삭제
  // TODO: 권한 검사
  console.log(`API Route: DELETE /api/estimates/${estimateId} called`);
  return NextResponse.json({ message: `Estimate ${estimateId} deleted successfully (placeholder)`, estimateId });
}
