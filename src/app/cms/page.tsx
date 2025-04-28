"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import MyResponsiveBar from "@/components/Chart/MyResponsiveBar";

const visitMeta = {
  title: "방문유형 (PC · Mobile)",
  accessCount: { pc: 150, mobile: 40 },
  accessUser: { pc: 140, mobile: 25 },
};

const labels = ["7일전", "6일전", "5일전", "4일전", "3일전", "2일전", "기준일"];

const dummyLineData = [
  {
    id: "AI 사용량",
    data: [
      { x: "2025.05.07", y: 3 },
      { x: "2025.05.08", y: 4 },
      { x: "2025.05.09", y: 7 },
      { x: "2025.05.10", y: 7 },
      { x: "2025.05.11", y: 10 },
      { x: "2025.05.12", y: 11 },
      { x: "2025.05.13", y: 14 },
    ],
  },
];

const barChartMeta = [
  {
    title: "누적 가입 고객수(명)",
    total: 1234,
    period: 41,
    week: 41,
    counts: [8, 5, 3, 3, 10, 10, 2],
  },
  {
    title: "견적 다운로드(건)",
    total: 200,
    period: 40,
    week: 40,
    counts: [5, 3, 4, 6, 7, 10, 5],
  },
  {
    title: "AI 답변 확인 필요(건)",
    total: 87,
    period: 29,
    week: 29,
    counts: [4, 4, 5, 5, 4, 4, 3],
  },
  {
    title: "견적 문의 요청(건)",
    total: 100,
    period: 40,
    week: 40,
    counts: [3, 3, 4, 6, 8, 10, 6],
  },
  {
    title: "견적 PDF 다운로드(건)",
    total: 88,
    period: 39,
    week: 39,
    counts: [8, 5, 3, 3, 10, 10, 2],
  },
].map((item) => ({
  ...item,
  data: labels.map((label, i) => ({
    label,
    count: item.counts[i],
  })),
}));

// Styled Components
const DashboardWrapper = styled.div`
  background: #f5f6fa;
  padding: 20px;
  width: 1520px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const ChartCard = styled.div`
  background: #fff;
  border: 1px solid #dbdfea;
  border-radius: 8px;
  width: 480px;
  height: 430px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const LineChartCard = styled(ChartCard)`
  width: 100%;
  grid-column: 1 / -1;
`;

const MetaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartContainer = styled.div`
  height: 280px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #000;
`;

const Value = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #000;
`;

const Label = styled.div`
  font-size: 13px;
  color: #999;
`;

const dummyTop5 = [
  { name: "IoT 앱", date: "2시간 전", price: "30,000,000원" },
  { name: "식품군", date: "방금 전", price: "40,600,000원" },
  { name: "AI", date: "25.05.14", price: "90,000,000원" },
  { name: "전산", date: "25.05.13", price: "80,500,000원" },
  { name: "IoT 앱", date: "25.05.12", price: "30,000,000원" },
];

const dummyUserTop5 = [
  { name: "Lucas", count: 20 },
  { name: "David", count: 16 },
  { name: "Elena", count: 12 },
  { name: "오하연", count: 8 },
  { name: "정혜진", count: 6 },
];

const CmsDashboardPage = () => {
  const [barChartData, setBarChartData] = useState(() =>
    barChartMeta.map((item) => ({
      ...item,
      data: item.data.map((d) => ({ ...d, count: 0 })),
    }))
  );

  const [visitMetaData, setVisitMetaData] = useState({
    accessCount: { pc: 0, mobile: 0 },
    accessUser: { pc: 0, mobile: 0 },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarChartData(barChartMeta);
      setVisitMetaData(visitMeta);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const rows = [
    { label: "접속수별", key: "accessCount" },
    { label: "접속자별", key: "accessUser" },
  ];

  return (
    <DashboardWrapper>
      {barChartData.map((item, i) => (
        <ChartCard key={i}>
          <MetaSection>
            <Row>
              <Title>{item.title}</Title>
              <Value>{item.total.toLocaleString()}</Value>
            </Row>
            <Row>
              <Label>기간내</Label>
              <Label>{item.period}</Label>
            </Row>
            <Row>
              <Label>7일내</Label>
              <Label>{item.week}</Label>
            </Row>
          </MetaSection>

          <ChartContainer>
            <MyResponsiveBar data={item.data} />
          </ChartContainer>
        </ChartCard>
      ))}

      <ChartCard>
        <Title>{visitMeta.title}</Title>
        <MetaSection style={{ marginTop: "10px" }}>
          {rows.map(({ label, key }) => {
            const row = visitMetaData[key as keyof typeof visitMetaData] as {
              pc: number;
              mobile: number;
            };
            const total = row.pc + row.mobile;
            return (
              <Row key={key}>
                <Label style={{ minWidth: 80, color: "#324c8e" }}>{label}</Label>
                <Value style={{ color: "#324c8e", minWidth: 40 }}>{row.pc}</Value>
                <Value style={{ color: "#678b6c", minWidth: 40 }}>{row.mobile}</Value>
                <Value style={{ color: "#000", minWidth: 40 }}>{total}</Value>
              </Row>
            );
          })}
        </MetaSection>

        <div style={{ flex: 1 }}>
          <ChartContainer>
            <ResponsivePie
              data={[
                { id: "PC", label: "PC", value: visitMetaData.accessUser.pc },
                { id: "Mobile", label: "Mobile", value: visitMetaData.accessUser.mobile },
              ]}
              margin={{ top: 0, right: 10, bottom: 20, left: 10 }}
              innerRadius={0.6}
              padAngle={1}
              cornerRadius={3}
              enableArcLabels={false}
              enableArcLinkLabels={false}
              tooltip={() => null}
              colors={["#324c8e", "#678b6c"]}
              layers={[
                "arcs",
                "arcLabels",
                "arcLinkLabels",
                "legends",
                ({ centerX, centerY }) => (
                  <>
                    <text
                      x={centerX}
                      y={centerY - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        fill: "#324c8e",
                      }}
                    >
                      PC: {visitMetaData.accessUser.pc}
                    </text>
                    <text
                      x={centerX}
                      y={centerY + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        fill: "#678b6c",
                      }}
                    >
                      Mobile: {visitMetaData.accessUser.mobile}
                    </text>
                  </>
                ),
              ]}
            />
          </ChartContainer>
        </div>
      </ChartCard>

      <ChartCard>
        <Title>견적 문의 대상 TOP 5</Title>
        {dummyTop5.map((item, i) => (
          <Row key={i}>
            <span>{item.name}</span>
            <span>{item.price}</span>
          </Row>
        ))}
      </ChartCard>

      <ChartCard>
        <Title>견적 다운로드 TOP 5</Title>
        {dummyTop5.map((item, i) => (
          <Row key={i}>
            <span>{item.name}</span>
            <span>{item.price}</span>
          </Row>
        ))}
      </ChartCard>

      <ChartCard>
        <Title>자주 접속 TOP 5</Title>
        {dummyUserTop5.map((user, i) => (
          <Row key={i}>
            <span>{user.name}</span>
            <span>{user.count}회</span>
          </Row>
        ))}
      </ChartCard>

      <LineChartCard>
        <Title>AI 사용 현황</Title>
        <div style={{ flex: 1 }}>
          <ChartContainer>
            <ResponsiveLine
              data={dummyLineData}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              axisBottom={{ tickRotation: 0, tickPadding: 5 }}
              axisLeft={null}
              colors={{ scheme: "category10" }}
              pointSize={6}
              enableGridY={false}
              useMesh={true}
            />
          </ChartContainer>
        </div>
      </LineChartCard>
    </DashboardWrapper>
  );
};

export default CmsDashboardPage;
