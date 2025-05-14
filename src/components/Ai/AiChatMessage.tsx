'use client';

import styled, { css } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import React, { useMemo } from 'react';
import useAuthStore from '@/store/authStore';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';

/**
 * AiChatMessage 컴포넌트
 *
 * 이 컴포넌트는 채팅 메시지를 표시하는 역할을 합니다.
 * 사용자와 AI의 메시지를 구분하여 다른 스타일로 표시하며,
 * AI가 생성한 견적서를 테이블 형태로 표시합니다.
 */

// 견적서 데이터 타입 정의
// INVOICE_SCHEMA에 따른 타입 정의 (실제 schema.ts의 구조를 반영해야 함)
// 이 타입들은 AiPageContent.tsx와 동기화되어야 하며, 한 곳에서 정의하고 공유하는 것이 좋음
interface InvoiceFeatureItem {
  id: string;
  feature: string; // 기능 이름
  description: string; // 기능 설명
  amount: number | string; // 금액 (숫자 또는 "별도 문의" 등의 문자열)
  duration?: string; // 개발 기간 (선택적)
  category?: string; // 카테고리 (선택적)
  pages?: number | string; // 페이지 수 (선택적)
  note?: string; // 추가 참고사항 (선택적)
}

interface InvoiceGroup {
  category: string; // 그룹 카테고리(구분)
  items: InvoiceFeatureItem[]; // 해당 카테고리에 속한 기능 항목들
}

interface InvoiceTotal {
  amount: number; // 총 금액
  duration?: number; // 총 개발 기간 (선택적)
  pages?: number; // 총 페이지 수 (선택적)
}

export interface InvoiceDataType {
  project: string; // 프로젝트 이름
  invoiceGroup: InvoiceGroup[]; // 기능 그룹 배열
  total: InvoiceTotal; // 총계 정보
}

// 메시지 인터페이스 정의
export interface Message {
  id: number; // 메시지 고유 ID
  sender: 'user' | 'ai'; // 발신자 구분 (사용자/AI)
  text: string; // 메시지 텍스트
  imageUrl?: string; // 이미지 URL (선택적)
  fileType?: string; // 파일 타입 (선택적)
  invoiceData?: InvoiceDataType; // AI가 생성한 견적서 JSON 데이터 (선택적)
}

// MessageProps - 컴포넌트의 속성 인터페이스
interface MessageProps extends Omit<Message, 'id'> {
  onActionClick: (action: string, data?: { featureId?: string }) => void; // 버튼 클릭 핸들러
  calculatedTotalAmount?: number; // 계산된 총 금액 (삭제된 항목 제외)
  calculatedTotalDuration?: number; // 계산된 총 기간 (삭제된 항목 제외)
  calculatedTotalPages?: number; // 계산된 총 페이지 수 (삭제된 항목 제외)
  currentItems?: Array<
    InvoiceDataType['invoiceGroup'][number]['items'][number] & {
      isDeleted: boolean;
    }
  >; // 현재 항목 상태
}

// 스타일드 컴포넌트의 props 타입
interface StyledComponentProps {
  $sender: 'user' | 'ai'; // 발신자 구분 (스타일 적용용)
}

// 통화 변환 기능 추가
// 각 국가 코드별 환율 정보 (2023년 기준)
const exchangeRates = {
  USD: 1350, // 1 USD = 1,350 KRW
  JPY: 9, // 1 JPY = 9 KRW
  CNY: 190, // 1 CNY = 190 KRW
  EUR: 1450, // 1 EUR = 1,450 KRW
  GBP: 1700, // 1 GBP = 1,700 KRW
};

// 국가 코드별 통화 기호
const currencySymbols = {
  KR: '₩',
  US: '$',
  JP: '¥',
  CN: '¥',
  GB: '£',
  EU: '€',
  default: '$',
};

// 국가 코드를 통화 코드로 변환
const getCountryCurrency = (countryCode: string | null): string => {
  if (!countryCode) return 'USD';

  switch (countryCode) {
    case 'KR':
      return 'KRW';
    case 'US':
      return 'USD';
    case 'JP':
      return 'JPY';
    case 'CN':
      return 'CNY';
    case 'GB':
      return 'GBP';
    // EU 국가들
    case 'DE':
    case 'FR':
    case 'IT':
    case 'ES':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'FI':
    case 'PT':
    case 'IE':
    case 'GR':
    case 'SK':
    case 'SI':
    case 'LU':
    case 'LV':
    case 'LT':
    case 'EE':
    case 'CY':
    case 'MT':
      return 'EUR';
    default:
      return 'USD'; // 기본값은 USD
  }
};

// 통화 심볼 가져오기
const getCurrencySymbol = (countryCode: string | null): string => {
  if (!countryCode) return currencySymbols.default;

  const code = countryCode as keyof typeof currencySymbols;
  return currencySymbols[code] || currencySymbols.default;
};

// 금액 포맷 함수 - 통화 변환 및 표시 기능 추가
const formatAmount = (amount: number | string, countryCode: string | null) => {
  // 금액이 숫자가 아닌 경우 (예: "별도 문의") 그대로 반환
  if (typeof amount !== 'number') {
    return amount;
  }

  // 한국의 경우 원화만 표시
  if (countryCode === 'KR') {
    return `${amount.toLocaleString()} 원`;
  }

  // 다른 국가의 경우 변환된 금액과 원래 금액 모두 표시
  const currency = getCountryCurrency(countryCode);
  const symbol = getCurrencySymbol(countryCode);

  // 환율 적용 (기본값은 USD)
  const rate =
    exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.USD;
  const convertedAmount = Math.round(amount / rate);

  return `${symbol}${convertedAmount.toLocaleString()} (₩${amount.toLocaleString()})`;
};

// 테이블 스타일 정의 - 견적서에 사용되는 공통 테이블 스타일
const TableStyles = css`
  width: 100%;
  border: none;
  border-spacing: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  table-layout: fixed;
  word-wrap: break-word;

  th,
  td {
    border: none;
    padding: 5px 8px;
    vertical-align: middle;
    border: none;
  }

  tr:first-child th,
  tr:first-child td {
    border: none;
  }
  tr:last-child td {
    border: none;
  }
  th:first-child,
  td:first-child {
    border: none;
  }
  th:last-child,
  td:last-child {
    border: none;
  }

  thead {
    background-color: #1e1e2d;
    th {
      color: ${AppColors.onBackground};
      text-align: left;
      font-weight: 400;
      padding: 10px 8px;

      &:nth-child(1) {
        width: 18%;
      }
      &:nth-child(2) {
        width: 20%;
      }
      &:nth-child(3) {
        width: 32%;
      }
      &:nth-child(4) {
        width: 15%;
        min-width: 95px;
        text-align: center;
      }
      &:nth-child(5) {
        width: 20%;
      }
      &:nth-child(6) {
        width: 15%;
        text-align: center;
      }
    }
  }

  tbody {
    tr {
      background-color: #111119;
      &:nth-child(even) {
        background-color: #1e1e2d;
      }
    }
    td {
      color: ${AppColors.onBackground};
      &:nth-child(4) {
        text-align: right;
      }
    }

    tr:last-child {
      background-color: transparent;
      border-top: 1px solid ${AppColors.border};
      td {
        border-bottom: none;
      }
      td:first-child {
        font-weight: bold;
      }
      td:nth-child(4) {
        font-weight: bold;
        text-align: right;
        padding-right: 8px;
      }
    }

    td:last-child {
      text-align: center;
    }
  }
`;

// 마크다운 컨테이너 스타일 - AI 메시지 내 마크다운 포맷팅을 위한 컨테이너
const StyledMarkdownContainer = styled.div`
  table {
    ${TableStyles}
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${AppColors.border};
    font-weight: 300;

    td button {
      background-color: ${AppColors.onBackgroundGray};
      color: #ffffff;
      border: none;
      padding: 0.3rem 0.9rem;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: ${AppColors.primary};
      }
    }
  }
  //에이닷 텍스트 크기
  p {
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  strong {
    font-weight: 400;
  }
`;

// 메시지 래퍼 스타일 - 메시지 전체를 감싸는 컨테이너
const MessageWrapper = styled.div<StyledComponentProps>`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  // 발신자에 따라 정렬 방향 설정 (사용자: 오른쪽, AI: 왼쪽)
  justify-content: ${(props) =>
    props.$sender === 'user' ? 'flex-end' : 'flex-start'};
`;

// 메시지 박스 스타일 - 실제 메시지 내용을 담는 말풍선
const MessageBox = styled.div<StyledComponentProps>`
  max-width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 12px;
  ${AppTextStyles.body1}
  line-height: 1.7;
  letter-spacing: normal;

  ${(props) =>
    props.$sender === 'user'
      ? css`
          background-color: ${AppColors.primary};
          color: ${AppColors.onPrimary};
          border-bottom-right-radius: 0;
          white-space: pre-wrap;
          padding: 0.75rem 1rem; // 사용자 메시지 패딩 (위아래 동일하게 조정)
        `
      : css`
          background-color: ${AppColors.background};
          color: ${AppColors.onBackground};
        `};
`;

// 프로필 이미지 스타일 - AI 프로필 이미지
const ProfileImage = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  align-self: flex-start;
`;

// 프로필 이름 스타일 - AI 이름 표시
const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0;
`;

// 버튼 스타일 - 마크다운 내부에서 사용되는 버튼
const StyledActionButton = styled.button`
  background-color: ${AppColors.onBackgroundGray};
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${AppColors.primary};
  }
`;

// 버튼 렌더러의 props 타입 정의
type ButtonRendererProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  node?: unknown;
};

// 견적서 컨테이너 스타일 - 견적서 전체를 감싸는 컨테이너
const StyledInvoiceContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid ${AppColors.border};
  border-radius: 8px;
  background-color: #1c1c25;
  color: ${AppColors.onBackground};
  font-size: 0.9rem;
  max-width: 100%; // 컨테이너가 최대 너비를 사용하도록 설정
  margin-right: 0; // 오른쪽 마진 제거
`;

// 견적서 프로젝트 제목 스타일
const InvoiceProjectTitle = styled.h3`
  font-size: 1.3em;
  color: ${AppColors.onBackground};
  margin-bottom: 1em;
`;

// 견적서 테이블 스타일
const InvoiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    border-bottom: 1px solid ${AppColors.border};
    padding: 0.75em 0.5em;
    text-align: left;
    vertical-align: top;
  }

  th {
    font-weight: 600;
    background-color: #2a2a3a;
    color: ${AppColors.onPrimary};
    white-space: nowrap;
  }

  td {
    font-weight: 300;
  }

  // 각 열의 너비 및 스타일 지정
  .col-category {
    width: 18%;
    font-weight: 500;
  }
  .col-feature {
    width: 25%;
    font-weight: 500;
  }
  .col-description {
    width: 32%;
    font-size: 0.9em;
    line-height: 1.5;
  }
  .col-amount {
    width: 15%;
    text-align: right;
    white-space: nowrap;
  }
  .col-actions {
    width: 10%;
    text-align: center;
  }

  // 마지막 행(합계) 스타일
  tbody tr:last-child td {
    border-bottom: none;
    font-weight: bold;
  }

  .total-label {
    text-align: right;
    padding-right: 1em;
  }
`;

// 액션 버튼 스타일 - 견적서 내 항목 삭제/취소 버튼
const ActionButton = styled.button`
  background-color: ${AppColors.onBackgroundGray};
  color: #ffffff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${AppColors.primary};
  }
`;

/**
 * AiChatMessage 컴포넌트 함수
 *
 * @param sender - 발신자 (user/ai)
 * @param text - 메시지 텍스트
 * @param imageUrl - 첨부 이미지 URL (선택적)
 * @param fileType - 첨부 파일 타입 (선택적)
 * @param onActionClick - 버튼 클릭 핸들러
 * @param invoiceData - 견적서 데이터 (선택적)
 * @param calculatedTotalAmount - 계산된 총 금액 (선택적)
 * @param calculatedTotalDuration - 계산된 총 기간 (선택적)
 * @param calculatedTotalPages - 계산된 총 페이지 수 (선택적)
 * @param currentItems - 현재 견적서 항목 상태 (선택적)
 */
export function AiChatMessage({
  sender,
  text,
  imageUrl,
  fileType,
  onActionClick,
  invoiceData,
  calculatedTotalAmount,
  calculatedTotalDuration,
  calculatedTotalPages,
  currentItems,
}: MessageProps) {
  const isAiMessage = sender === 'ai';

  // 언어 정보 가져오기
  const { lang } = useLang();
  const t = aiChatDictionary[lang]; // 현재 언어에 해당하는 번역 텍스트

  // 사용자 국적 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const countryCode = user?.countryCode || 'KR'; // 기본값은 한국

  // 메모이제이션된 통화 포맷 함수
  const formatAmountWithCurrency = useMemo(
    () => (amount: number | string) => formatAmount(amount, countryCode),
    [countryCode]
  );

  // 마크다운 내 커스텀 컴포넌트 정의 (버튼 등)
  const customComponents: Options['components'] = {
    button: ({ node, ...props }: ButtonRendererProps) => {
      let action: string | undefined;
      let featureId: string | undefined;
      let buttonText: string = 'Button';

      // 노드 데이터에서 액션 정보 추출
      if (typeof node === 'object' && node !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        action = (node as any).properties?.['data-action'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        featureId = (node as any).properties?.['data-feature-id'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buttonText = (node as any).children?.[0]?.value || 'Button';
      }

      // 액션이 있는 경우 클릭 핸들러 연결
      if (action) {
        return (
          <StyledActionButton
            onClick={() => {
              if (action && onActionClick) {
                onActionClick(action, featureId ? { featureId } : undefined);
              } else if (featureId && onActionClick) {
                // data-action이 없고 data-feature-id만 있는 경우 (예: 삭제 버튼)
                onActionClick('delete_feature', { featureId });
              }
            }}
            {...props}
          >
            {buttonText}
          </StyledActionButton>
        );
      }
      // 액션이 없는 버튼 - 기본 스타일 적용
      return <StyledActionButton {...props}>{buttonText}</StyledActionButton>;
    },
  };

  return (
    <MessageWrapper $sender={sender}>
      {/* AI 메시지인 경우에만 프로필 이미지 표시 */}
      {isAiMessage && <ProfileImage src="/ai/pretty.png" alt="AI 프로필" />}
      <MessageBox $sender={sender}>
        {/* AI 메시지인 경우에만 이름 표시 */}
        {isAiMessage && (
          <ProfileName style={{ marginBottom: '0.5rem' }}>
            {t.profileName}
          </ProfileName>
        )}

        {/* 메시지 내용 - 마크다운 지원 */}
        <StyledMarkdownContainer>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={customComponents}
          >
            {text}
          </ReactMarkdown>
        </StyledMarkdownContainer>

        {/* AI 메시지이면서 견적서 데이터가 있는 경우 견적서 UI 표시 */}
        {isAiMessage && invoiceData && (
          <StyledInvoiceContainer>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div>
                <InvoiceProjectTitle>
                  {invoiceData.project || t.invoiceTitle}
                </InvoiceProjectTitle>
              </div>
            </div>

            {/* 견적서 테이블 */}
            <InvoiceTable>
              <thead>
                <tr>
                  <th className="col-category">{t.tableHeaders.category}</th>
                  <th className="col-feature">{t.tableHeaders.item}</th>
                  <th className="col-description">{t.tableHeaders.detail}</th>
                  <th className="col-amount">{t.tableHeaders.amount}</th>
                  <th className="col-actions">{t.tableHeaders.management}</th>
                </tr>
              </thead>
              <tbody>
                {/* 견적서 그룹 및 항목 반복 렌더링 */}
                {invoiceData.invoiceGroup?.map((group, groupIndex) => (
                  <React.Fragment key={`group-${group.category}-${groupIndex}`}>
                    {group.items?.map((item, itemIndex) => {
                      // 현재 항목의 삭제 상태 확인
                      const currentItemStatus = currentItems?.find(
                        (ci) => ci.id === item.id
                      );
                      const isActuallyDeleted = currentItemStatus
                        ? currentItemStatus.isDeleted
                        : false;

                      return (
                        <tr
                          key={item.id || `feature-${groupIndex}-${itemIndex}`}
                        >
                          {/* 첫 항목의 경우만 카테고리 열 표시 (rowspan 사용) */}
                          {itemIndex === 0 ? (
                            <td
                              className="col-category"
                              rowSpan={group.items.length || 1}
                              style={{
                                textDecoration: isActuallyDeleted
                                  ? 'line-through'
                                  : 'none',
                                color: isActuallyDeleted
                                  ? AppColors.disabled
                                  : AppColors.onBackground,
                              }}
                            >
                              {group.category}
                            </td>
                          ) : null}
                          {/* 항목명 */}
                          <td
                            className="col-feature"
                            style={{
                              textDecoration: isActuallyDeleted
                                ? 'line-through'
                                : 'none',
                              color: isActuallyDeleted
                                ? AppColors.disabled
                                : AppColors.onBackground,
                            }}
                          >
                            {item.feature}
                          </td>
                          {/* 세부 내용 */}
                          <td
                            className="col-description"
                            style={{
                              textDecoration: isActuallyDeleted
                                ? 'line-through'
                                : 'none',
                              color: isActuallyDeleted
                                ? AppColors.disabled
                                : AppColors.onBackground,
                            }}
                          >
                            {item.description}
                            {/* 참고사항 표시 */}
                            {item.note && (
                              <p
                                style={{
                                  fontSize: '0.9em',
                                  color: AppColors.onSurfaceVariant,
                                  marginTop: '0.3em',
                                }}
                              >
                                <em>
                                  {t.estimateInfo.note}: {item.note}
                                </em>
                              </p>
                            )}
                            {/* 예상 기간 표시 */}
                            {item.duration && (
                              <p
                                style={{
                                  fontSize: '0.9em',
                                  color: AppColors.onSurfaceVariant,
                                  marginTop: '0.3em',
                                }}
                              >
                                {t.estimateInfo.estimatedDuration}:{' '}
                                {item.duration}
                              </p>
                            )}
                            {/* 예상 페이지 수 표시 */}
                            {item.pages && (
                              <p
                                style={{
                                  fontSize: '0.9em',
                                  color: AppColors.onSurfaceVariant,
                                  marginTop: '0.3em',
                                }}
                              >
                                {t.estimateInfo.estimatedPages}: {item.pages}
                              </p>
                            )}
                          </td>
                          {/* 예상 금액 */}
                          <td
                            className="col-amount"
                            style={{
                              textDecoration: isActuallyDeleted
                                ? 'line-through'
                                : 'none',
                              color: isActuallyDeleted
                                ? AppColors.disabled
                                : AppColors.onBackground,
                            }}
                          >
                            {formatAmountWithCurrency(item.amount)}
                          </td>
                          {/* 관리 버튼 */}
                          <td className="col-actions">
                            <ActionButton
                              onClick={() =>
                                onActionClick('delete_feature_json', {
                                  featureId: item.id,
                                })
                              }
                            >
                              {isActuallyDeleted
                                ? t.buttons.cancel
                                : t.buttons.delete}
                            </ActionButton>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
                {/* 총 합계 행 */}
                <tr>
                  <td colSpan={3} className="total-label">
                    <strong>{t.estimateInfo.totalSum}</strong>
                  </td>
                  <td className="col-amount">
                    <strong>
                      {/* 계산된 값이 있으면 계산된 값 사용, 없으면 원본 데이터 사용 */}
                      {calculatedTotalAmount !== undefined
                        ? formatAmountWithCurrency(calculatedTotalAmount)
                        : formatAmountWithCurrency(invoiceData.total?.amount)}
                    </strong>
                  </td>
                  <td></td>
                </tr>
                {/* 총 예상 기간 행 (있는 경우만) */}
                {calculatedTotalDuration !== undefined && (
                  <tr>
                    <td colSpan={3} className="total-label">
                      {t.estimateInfo.totalDuration}
                    </td>
                    <td className="col-amount">
                      {calculatedTotalDuration} {t.estimateInfo.day}
                    </td>
                    <td></td>
                  </tr>
                )}
                {/* 총 예상 페이지 수 행 (있는 경우만) */}
                {calculatedTotalPages !== undefined && (
                  <tr>
                    <td colSpan={3} className="total-label">
                      {t.estimateInfo.totalPages}
                    </td>
                    <td className="col-amount">
                      {calculatedTotalPages} {t.estimateInfo.page}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </InvoiceTable>

            {/* 할인 및 PDF 저장 옵션 */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${AppColors.border}`,
              }}
            >
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1em' }}>
                {t.discount.title}
              </h4>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.9em' }}>
                {t.discount.description}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  paddingLeft: 0,
                  marginBottom: '1rem',
                }}
              >
                <li style={{ marginBottom: '0.5rem' }}>
                  {t.discount.options[0]}
                  <ActionButton
                    onClick={() => onActionClick('discount_extend_3w_20p')}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {t.buttons.select}
                  </ActionButton>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  {t.discount.options[1]}
                  <ActionButton
                    onClick={() => onActionClick('discount_remove_features')}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {t.buttons.select}
                  </ActionButton>
                </li>
              </ul>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1em' }}>
                {t.pdf.title}
              </h4>
              <ActionButton onClick={() => onActionClick('download_pdf')}>
                {t.buttons.downloadPdf}
              </ActionButton>
            </div>
          </StyledInvoiceContainer>
        )}

        {/* 첨부된 이미지가 있는 경우 표시 */}
        {imageUrl && fileType && fileType.startsWith('image/') && (
          <div
            style={{
              marginTop: '10px',
              textAlign: sender === 'user' ? 'right' : 'left',
            }}
          >
            <img
              src={imageUrl}
              alt="첨부 이미지"
              style={{
                maxWidth: '300px',
                maxHeight: '300px',
                borderRadius: '8px',
              }}
            />
          </div>
        )}
      </MessageBox>
    </MessageWrapper>
  );
}
