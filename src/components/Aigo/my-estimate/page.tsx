"use client"

import React from 'react'
import styled from 'styled-components'
import { useEstimateStore } from '@/store/estimateStore'
import EstimateCard from '@/components/Aigo/components/EstimateCard'
import type { ProjectEstimate } from '@/app/ai-esti/types'
import { useRouter } from 'next/navigation'

const Container = styled.div`
  max-width: 960px;
  height:100%;
  margin: 0 auto;
  padding: 16px;
  background: ${({ theme }) => theme.body};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 16px;
  color: ${({ theme }) => theme.subtleText};
`
const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 12px 0 4px;
`
const Desc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.subtleText};
`
const CTAButton = styled.button`
  margin-top: 12px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.surface2};
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`


// 추가: 라이브 섹션
// (미사용 스타일 제거)


export default function MyEstimatePage() {
  const router = useRouter()
  const { projectEstimate } = useEstimateStore()

  return (
    <Container>
      {!projectEstimate ? (
        <EmptyState>
          <Title>저장된 견적이 없습니다</Title>
          <Desc>AI 상담으로 첫 견적을 만들어 보세요.</Desc>
          <CTAButton onClick={() => router.push('/ai-estimate')}>AI 견적 시작하기</CTAButton>
        </EmptyState>
      ) : (
        <>
          <Title>나의 최신 견적</Title>
          <EstimateCard estimate={projectEstimate as ProjectEstimate} />
        </>
      )}


    </Container>
  )
}
