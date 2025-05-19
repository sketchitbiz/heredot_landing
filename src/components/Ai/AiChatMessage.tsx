'use client';

import styled, { css } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import React, { useMemo, useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { ChatDictionary } from '@/app/ai/components/StepData';
import type {
  InvoiceDataType,
  MessageProps as ChatMessageProps,
} from '@/types/invoice';
import { formatAmount, formatAmountForPdf } from '@/utils/formatters';

/**
 * AiChatMessage 컴포넌트
 *
 * 이 컴포넌트는 채팅 메시지를 표시하는 역할을 합니다.
 * 사용자와 AI의 메시지를 구분하여 다른 스타일로 표시하며,
 * AI가 생성한 견적서를 테이블 형태로 표시합니다.
 */

// 스타일드 컴포넌트의 props 타입
interface StyledComponentProps {
  $sender: 'user' | 'ai';
}

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
      border-top: 1px solid ${AppColors.aiBorder};
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
    border: 1px solid ${AppColors.aiBorder};
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
  padding: 0.3rem 0.3rem;
  border-radius: 24px;
  ${AppTextStyles.body1}
  line-height: 1.7;
  letter-spacing: normal;

  ${(props) =>
    props.$sender === 'user'
      ? css`
          background-color: ${AppColors.primary};
          color: ${AppColors.onPrimary};
          border-bottom-right-radius: 0px;
          white-space: pre-wrap;
          padding: 0.25rem 1.25rem 0.5rem 1.25rem; // 사용자 메시지 패딩 (위아래 동일하게 조정)
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
`;

// AI 프로필 헤더 (이미지와 이름을 감싸는 컨테이너)
const AiProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
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
interface CustomMarkdownNode {
  type?: string;
  properties?: {
    [key: string]: unknown; // 좀 더 일반적인 속성 타입
    'data-action'?: string;
    'data-feature-id'?: string;
  };
  children?: Array<CustomMarkdownNode | { value?: string }>; // 자식 노드는 재귀적이거나 텍스트 노드일 수 있음
  value?: string; // 텍스트 노드의 경우
}

type ButtonRendererProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  node?: CustomMarkdownNode; // 수정된 타입 적용
};

// 견적서 컨테이너 스타일 - 견적서 전체를 감싸는 컨테이너
const StyledInvoiceContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid ${AppColors.aiBorder};
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
    border-bottom: 1px solid ${AppColors.aiBorder};

    height: 4em;
    text-align: left;
    vertical-align: top;
  }

  th {
    padding: 1em 1em;
    font-weight: 600;
    background-color: #2a2a3a;
    color: ${AppColors.onPrimary};
    white-space: nowrap;
    &:nth-child(3) {
      // "세부 내용" 헤더
      text-align: center;
    }
  }

  td {
    padding: 2em 1em;
    font-weight: 300;
  }

  // 각 열의 너비 및 스타일 지정
  .col-category {
    width: 18%;
    text-align: center;
    font-weight: 500;
  }
  .col-feature {
    width: 25%;
    text-align: center;
    font-weight: 500;
  }
  .col-description {
    width: 32%;
    font-size: 0.9em;
    line-height: 1.5;
    vertical-align: middle;
  }
  .col-amount {
    width: 15%;
    text-align: center;
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
  width: 100px;
  color: #ffffff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;

  @media (max-width: 750px) {
    min-width: 70px;
    width: 70px;
  }

  &:hover {
    background-color: ${AppColors.primary};
  }
`;

// 모바일 견적서 전체 컨테이너
const MobileInvoiceContainer = styled.div`
  margin-top: 1rem;
`;

// 모바일 견적서 카드 아이템 스타일
const MobileInvoiceCardItem = styled.div`
  background-color: #1e1e2d;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: ${AppColors.onBackground};

  .item-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
    font-size: 0.9em;

    .label {
      font-weight: 500;
      color: ${AppColors.onSurfaceVariant};
      margin-bottom: 0.25rem;
    }
    .value {
      text-align: left;
      word-break: break-word;
    }
    .deleted {
      text-decoration: line-through;
      color: ${AppColors.disabled};
    }
  }

  .description-value {
    text-align: left;
    margin-bottom: 0.5rem;
    font-size: 0.9em;
    line-height: 1.5;
    word-break: break-word;
    p {
      margin-bottom: 0.3em !important;
      font-size: 1em !important;
      font-weight: 300 !important;
      line-height: 1.4 !important;
    }
    em {
      font-size: 0.9em !important;
      color: ${AppColors.onSurfaceVariant} !important;
    }
  }

  .actions-row {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
`;

// PrintableInvoice를 위한 스타일 컴포넌트들
const PrintableInvoiceWrapper = styled.div`
  width: 780px;
  padding: 20px;
  background-color: white;
  color: black;
  font-family: 'Helvetica', 'Arial', sans-serif;
  box-sizing: border-box;
  font-size: 9pt;

  .quotation-title {
    font-size: 20pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: black;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;

    th,
    td {
      border: 1px solid #bfbfbf;
      padding: 6px 8px;
      vertical-align: middle;
      word-break: break-word;
      height: 30px;
    }

    th {
      background-color: #f0f0f0;
      font-weight: bold;
      color: #333333;
      white-space: nowrap;
    }
  }
`;

interface PrintableInvoiceProps {
  invoiceData: InvoiceDataType;
  invoiceDetailsForPdf: {
    items: Array<
      InvoiceDataType['invoiceGroup'][number]['items'][number] & {
        isDeleted: boolean;
      }
    >;
    currentTotal: number;
    currentTotalDuration: number;
    currentTotalPages: number;
  };
  t: ChatDictionary;
  lang: string;
  userName?: string | null;
  userPhone?: string | null;
  userEmail?: string | null;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  invoiceData,
  invoiceDetailsForPdf,
  t,
  lang,
  userName,
  userPhone,
  userEmail,
}) => {
  const formatDateForPdf = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };
  const currentDateForPdf = formatDateForPdf(new Date());

  // 스타일 상수 정의 (PrintableInvoice 내부)
  const baseCellStyle = {
    padding: '5px 8px',
    border: '1px solid #BFBFBF',
    fontSize: '9pt',
    verticalAlign: 'middle' as const,
    height: '28px',
  };
  const headerCellStyle = {
    ...baseCellStyle,
    backgroundColor: '#F2F2F2',
    fontWeight: 'bold',
    textAlign: 'center' as const,
  };
  const valueCellStyle = { ...baseCellStyle, textAlign: 'left' as const };
  const clientValueCellStyle = {
    ...valueCellStyle,
    fontWeight: 'bold' as const,
  };
  const stampContainerStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
  };
  const stampImageStyle = {
    position: 'absolute' as const,
    right: '15px',
    top: '15px',
    width: '55px',
    height: '55px',
  };

  const currentRecipientName =
    userName || invoiceData.project || t.recipientNameFallback || '고객명';
  const currentClientEmail =
    userEmail || t.clientEmailFallback || '이메일 없음';
  const currentQuoteItemName =
    invoiceData.project || t.defaultQuoteName || 'IoT 앱';

  const companyNameValue = t.companyName || '주식회사 여기닷';
  const representativeNameValue = t.representativeName || '강태원';
  const companyAddressValue = `${
    t.companyAddressStreet || '경기도 성남시 수정구 대학판교로 815, 777호'
  } (${t.companyAddressDetail || '시흥동, 판교창조경제밸리'})`;
  const companyPhoneForPdfValue = t.companyPhoneForPdf || '82+031-8039-7981';
  const companyRegistrationNumberValue =
    t.companyRegistrationNumber || '289-86-03278';

  const totalAmountWithVatForPdfValue = formatAmountForPdf(
    Math.round((invoiceDetailsForPdf.currentTotal || 0) * 1.1),
    'KR',
    false
  );

  const specialNotes = {
    title: t.remarksTitle || '비고란',
    items: [
      `${t.inspectionPeriod || '검수기간'}: ${
        t.inspectionPeriodValue ||
        '개발 완료일 익일부터 1개월 (이후 요청 별도 협의 필요)'
      }`,
      `${t.warrantyPeriod || '하자보수'}: ${
        t.warrantyPeriodValue ||
        '검수 종료일 익일부터 6개월 (기획과 디자인 변경 별도 협의 필요)'
      }`,
      `${t.techStack || '자사 보유 기술스택'}: ${
        t.techStackValue && typeof t.techStackValue === 'object'
          ? (
              t.techStackValue as {
                app: string;
                web: string;
                server: string;
                db: string;
              }
            ).app +
            ', ' +
            (
              t.techStackValue as {
                app: string;
                web: string;
                server: string;
                db: string;
              }
            ).web +
            ', ' +
            (
              t.techStackValue as {
                app: string;
                web: string;
                server: string;
                db: string;
              }
            ).server +
            ', ' +
            (
              t.techStackValue as {
                app: string;
                web: string;
                server: string;
                db: string;
              }
            ).db
          : typeof t.techStackValue === 'string'
          ? t.techStackValue
          : '(앱)hybridapp, Flutter, webview, (웹)react.js, express.js, node.js, java spring boot, python (서버) 네이버 클라우드, 카페24클라우드, AWS등 DB: Mysql, Postgre, 몽고DB등'
      }`,
      `${t.crossPlatform || '크로스 플랫폼 및 브라우징'}: ${
        t.crossPlatformValue ||
        '윈도우10 이상 및 맥 운영체제 / 갤럭시 및 아이폰 출시 5년 이하 기기 / 사파리, 크롬, 엣지 (이외의 브라우저는 대응하지 않음)'
      }`,
      t.legalNotice1 ||
        '* 당 견적서는 단순 견적서가 아닌, 기능 기획이 포함된 (주)여기닷의 무형지식재산으로 견적서를 전달받은 사람이 견적을 조회하는 용도 외에 다른 용도로 사용할 수 없으며, 타인에게 당 견적서의 전체 또는 일부 내용을 구두나 파일 등으로 전달한 경우, 당사에서 주장하는 모든 민형사상의 책임과 배상에 대하여 동의하는 것으로 간주함. 만약 동의하지 않을 경우, 당 견적서는 조회 없이 파기해야 함*',
      t.validityNotice || `* 견적서는 작성일로부터 일주일간 유효함*`,
      t.additionalCostsNotice ||
        '* 도메인(URL및SSL등)/서버비용/AOS 및 IOS 개발자 계정/알림 수단/유료API 등에 따라 발생하는 비용은 별도이며, 견적서에 포함되지 않은 기능은 추가 비용이 발생함*',
    ],
    footerNotice:
      t.aiDisclaimer || 'AI견적은 실제 견적과 일부 상이 할 수 있습니다',
  };

  const stampImagePath = '/ai/stamp.png';

  const quotationTitleValue = t.quotationTitle || '견적서';
  const quoteDateLabelValue = t.quoteDateLabel || '견적 발행일';
  const clientNameLabelValue = t.clientNameLabel || '고객명';
  const clientEmailLabelValue = t.clientEmailLabel || '메일주소';
  const quoteNameLabelValue = t.quoteNameLabel || '견적명';
  const totalAmountLabelValue = t.totalAmountLabel || '총 금액 (VAT포함)';
  const supplierNameLabelValue = t.supplierNameLabel || '상호명';
  const supplierCeoLabelValue = t.supplierCeoLabel || '대표명';
  const supplierBizNumLabelValue = t.supplierBizNumLabel || '사업자번호';
  const supplierIndustryLabelValue = t.supplierIndustryLabel || '업종·업태';
  const supplierAddressLabelValue = t.supplierAddressLabel || '주소';

  const industryTypeValue = '응용소프트웨어 개발 및 공급업, 서비스업';
  const basicSurveyTitleValue = t.basicSurveyTitle || '기초 조사';
  const basicSurveyContentPlaceholderValue =
    t.basicSurveyContentPlaceholder || ' ';
  const quoteDetailsTitleValue = t.quoteDetailsTitle || '견적상세';

  return (
    <PrintableInvoiceWrapper id="printable-invoice-content">
      <div className="quotation-title">{quotationTitleValue} (QUOTATION)</div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '10px',
        }}
      >
        <tbody>
          <tr>
            <td style={{ ...headerCellStyle, width: '15%' }}>
              {quoteDateLabelValue}
            </td>
            <td style={{ ...valueCellStyle, width: '25%' }}>
              {currentDateForPdf}
            </td>
            <td style={{ ...headerCellStyle, width: '15%' }}>
              {supplierNameLabelValue}
            </td>
            <td style={{ ...valueCellStyle, width: '30%' }}>
              {companyNameValue}
            </td>
            <td
              style={{
                border: '1px solid #BFBFBF',
                borderLeft: 'none',
                width: '15%',
              }}
              rowSpan={5}
            >
              <div style={stampContainerStyle}>
                <img src={stampImagePath} alt="직인" style={stampImageStyle} />
              </div>
            </td>
          </tr>
          <tr>
            <td style={headerCellStyle}>{clientNameLabelValue}</td>
            <td style={clientValueCellStyle}>
              {currentRecipientName}
              {userPhone && (
                <>
                  <br />
                  {userPhone}
                </>
              )}
            </td>
            <td style={headerCellStyle}>{supplierCeoLabelValue}</td>
            <td style={valueCellStyle}>
              {representativeNameValue}
              {companyPhoneForPdfValue && (
                <>
                  <br />
                  {companyPhoneForPdfValue}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td style={headerCellStyle}>{clientEmailLabelValue}</td>
            <td style={valueCellStyle}>{currentClientEmail}</td>
            <td style={headerCellStyle}>{supplierBizNumLabelValue}</td>
            <td style={valueCellStyle}>{companyRegistrationNumberValue}</td>
          </tr>
          <tr>
            <td style={headerCellStyle}>{quoteNameLabelValue}</td>
            <td style={clientValueCellStyle}>{currentQuoteItemName}</td>
            <td style={headerCellStyle}>{supplierIndustryLabelValue}</td>
            <td style={valueCellStyle}>{industryTypeValue}</td>
          </tr>
          <tr>
            <td style={{ ...headerCellStyle, fontWeight: 'bold' }}>
              {totalAmountLabelValue}
            </td>
            <td style={{ ...clientValueCellStyle, fontWeight: 'bold' }}>
              {totalAmountWithVatForPdfValue}
            </td>
            <td style={headerCellStyle}>{supplierAddressLabelValue}</td>
            <td style={valueCellStyle}>{companyAddressValue}</td>
          </tr>
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '10px',
        }}
      >
        <tbody>
          <tr>
            <td
              style={{ ...headerCellStyle, width: '15%', textAlign: 'center' }}
            >
              {basicSurveyTitleValue}
            </td>
            <td style={{ ...valueCellStyle, minHeight: '40px' }}>
              {basicSurveyContentPlaceholderValue}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          fontSize: '10pt',
          fontWeight: 'bold',
          marginBottom: '5px',
          marginTop: '15px',
        }}
      >
        {quoteDetailsTitleValue}
      </div>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0rem' }}
      >
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: '18%' }}>
              {t.tableHeaders.category}
            </th>
            <th style={{ ...headerCellStyle, width: '22%' }}>
              {t.tableHeaders.item}
            </th>
            <th style={{ ...headerCellStyle, width: '40%' }}>
              {t.tableHeaders.detail}
            </th>
            <th style={{ ...headerCellStyle, width: '20%' }}>
              {t.tableHeaders.amount}
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.invoiceGroup?.map((group) => {
            const visibleItems = group.items.filter((item) => {
              const currentItemDetails = invoiceDetailsForPdf.items.find(
                (ci) => ci.id === item.id
              );
              return !(currentItemDetails && currentItemDetails.isDeleted);
            });
            if (visibleItems.length === 0) return null;
            return visibleItems.map((item, visibleItemIndex) => (
              <tr key={`pdf-item-${item.id}`}>
                {visibleItemIndex === 0 && (
                  <td
                    style={{ ...valueCellStyle, textAlign: 'center' }}
                    rowSpan={visibleItems.length || 1}
                  >
                    {group.category}
                  </td>
                )}
                <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                  {item.feature}
                </td>
                <td style={valueCellStyle}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        item.description?.replace(/\n|\r\n|\r/g, '<br />') ||
                        '',
                    }}
                  />
                  {item.note &&
                    !/^[A-Z]{3}\s[\d,.]+\s\(₩[\d,.]+\)$/.test(item.note) && (
                      <p
                        style={{
                          fontSize: '0.8em',
                          color: '#555',
                          marginTop: '5px',
                        }}
                      >
                        <em>
                          {(t.estimateInfo as any).note}: {item.note}
                        </em>
                      </p>
                    )}
                </td>
                <td style={{ ...valueCellStyle, textAlign: 'right' }}>
                  {item.note &&
                  /^[A-Z]{3}\s[\d,.]+\s\(₩[\d,.]+\)$/.test(item.note)
                    ? item.note
                    : formatAmountForPdf(item.amount, 'KR', false)}
                </td>
              </tr>
            ));
          })}
          <tr>
            <td colSpan={3} style={{ ...headerCellStyle, textAlign: 'right' }}>
              <strong>{t.estimateInfo.totalSum}</strong>
            </td>
            <td
              style={{
                ...valueCellStyle,
                textAlign: 'right',
                fontWeight: 'bold',
              }}
            >
              <strong>
                {formatAmountForPdf(
                  invoiceDetailsForPdf.currentTotal,
                  'KR',
                  false
                )}
              </strong>
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="total-label">
              <strong>{t.estimateInfo.vatIncluded}</strong>
            </td>
            <td
              style={{
                textAlign: 'right',
              }}
            >
              <strong>
                {formatAmountForPdf(
                  Math.round((invoiceDetailsForPdf.currentTotal || 0) * 1.1),
                  'KR',
                  false
                )}
              </strong>
            </td>
          </tr>
          {invoiceDetailsForPdf.currentTotalDuration > 0 && (
            <tr>
              <td
                colSpan={3}
                style={{ ...headerCellStyle, textAlign: 'right' }}
              >
                {t.estimateInfo.totalDuration}
              </td>
              <td style={{ textAlign: 'right' }}>
                {typeof invoiceDetailsForPdf.currentTotalDuration === 'number'
                  ? `${Math.ceil(
                      invoiceDetailsForPdf.currentTotalDuration / 5
                    )} ${t.estimateInfo.week} (${
                      lang === 'ko' ? '약 ' : 'Approx. '
                    }${Math.ceil(
                      invoiceDetailsForPdf.currentTotalDuration / 20
                    )} ${t.estimateInfo.monthUnit})`
                  : `${invoiceDetailsForPdf.currentTotalDuration} ${t.estimateInfo.day}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        style={{
          fontSize: '10pt',
          fontWeight: 'bold',
          marginBottom: '5px',
          marginTop: '20px',
          textAlign: 'left',
        }}
      >
        {specialNotes.title}
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '0px',
          fontSize: '8pt',
        }}
      >
        <tbody>
          <tr>
            <td style={{ border: '1px solid #BFBFBF', padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {specialNotes.items.map((note, index) => (
                    <tr key={`note-${index}`}>
                      <td
                        style={{
                          ...valueCellStyle,
                          borderBottom:
                            index === specialNotes.items.length - 1
                              ? 'none'
                              : '1px solid #E0E0E0',
                          lineHeight: '1.4',
                          textAlign: note.startsWith('*') ? 'center' : 'left',
                          fontSize: note.startsWith('*') ? '7.5pt' : '8pt',
                          color: note.startsWith('*') ? '#555555' : '#333333',
                          padding: '6px 8px',
                        }}
                      >
                        {note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <p
        style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '7.5pt',
          color: '#555555',
        }}
      >
        {specialNotes.footerNotice}
      </p>
    </PrintableInvoiceWrapper>
  );
};

/**
 * AiChatMessage 컴포넌트 함수
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
  lang,
}: ChatMessageProps) {
  const isAiMessage = sender === 'ai';

  const t =
    aiChatDictionary[lang as keyof typeof aiChatDictionary] ||
    aiChatDictionary.ko;

  const user = useAuthStore((state) => state.user);
  const countryCode = user?.countryCode || 'KR';

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 750);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatAmountWithCurrency = useMemo(
    () =>
      (amount: number | string, forceDetailed: boolean = false) =>
        formatAmount(amount, countryCode, forceDetailed),
    [countryCode]
  );

  const customComponents: Options['components'] = {
    button: ({ node, ...props }: ButtonRendererProps) => {
      let action: string | undefined;
      let featureId: string | undefined;
      let buttonText: string = 'Button';

      if (node && node.properties) {
        action = node.properties['data-action'] as string | undefined;
        featureId = node.properties['data-feature-id'] as string | undefined;
      }
      if (
        node &&
        node.children &&
        node.children.length > 0 &&
        (node.children[0] as CustomMarkdownNode).value
      ) {
        buttonText = (node.children[0] as CustomMarkdownNode).value || 'Button';
      }

      if (action) {
        return (
          <StyledActionButton
            onClick={() => {
              if (action && onActionClick) {
                onActionClick(action, featureId ? { featureId } : undefined);
              } else if (featureId && onActionClick) {
                onActionClick('delete_feature', { featureId });
              }
            }}
            {...props}
          >
            {buttonText}
          </StyledActionButton>
        );
      }
      return <StyledActionButton {...props}>{buttonText}</StyledActionButton>;
    },
  };

  return (
    <MessageWrapper $sender={sender}>
      <MessageBox $sender={sender}>
        {isAiMessage && (
          <AiProfileHeader>
            <ProfileImage src="/ai/pretty.png" alt="AI 프로필" />
            <ProfileName>{t.profileName}</ProfileName>
          </AiProfileHeader>
        )}

        <StyledMarkdownContainer>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={customComponents}
          >
            {text}
          </ReactMarkdown>
        </StyledMarkdownContainer>

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

            {isMobileView ? (
              <MobileInvoiceContainer>
                {invoiceData.invoiceGroup?.map((group) =>
                  group.items?.map((item, itemIndex) => {
                    const currentItemStatus = currentItems?.find(
                      (ci) => ci.id === item.id
                    );
                    const isActuallyDeleted = currentItemStatus
                      ? currentItemStatus.isDeleted
                      : false;
                    return (
                      <MobileInvoiceCardItem
                        key={item.id || `mobile-item-${itemIndex}`}
                      >
                        <div className="item-row">
                          <span className="label">
                            {t.tableHeaders.category}
                          </span>
                          <span
                            className={`value ${
                              isActuallyDeleted ? 'deleted' : ''
                            }`}
                          >
                            {group.category}
                          </span>
                        </div>
                        <div className="item-row">
                          <span className="label">{t.tableHeaders.item}</span>
                          <span
                            className={`value ${
                              isActuallyDeleted ? 'deleted' : ''
                            }`}
                          >
                            {item.feature}
                          </span>
                        </div>
                        <div className="item-row">
                          <span className="label">{t.tableHeaders.detail}</span>
                          <div
                            className={`description-value value ${
                              isActuallyDeleted ? 'deleted' : ''
                            }`}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {item.description}
                            </ReactMarkdown>
                            {item.note &&
                              !/^[A-Z]{3}\s[\d,.]+\s\(₩[\d,.]+\)$/.test(
                                item.note
                              ) && (
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
                          </div>
                        </div>
                        <div className="item-row">
                          <span className="label">{t.tableHeaders.amount}</span>
                          <span
                            className={`value ${
                              isActuallyDeleted ? 'deleted' : ''
                            }`}
                          >
                            {item.note &&
                            /^[A-Z]{3}\s[\d,.]+\s\(₩[\d,.]+\)$/.test(item.note)
                              ? item.note
                              : formatAmountWithCurrency(item.amount, true)}
                          </span>
                        </div>
                        <div className="actions-row">
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
                        </div>
                      </MobileInvoiceCardItem>
                    );
                  })
                )}
                <MobileInvoiceCardItem
                  style={{ marginTop: '2rem', backgroundColor: '#2a2a3a' }}
                >
                  <div className="item-row">
                    <span className="label" style={{ fontWeight: 'bold' }}>
                      {t.estimateInfo.totalSum}
                    </span>
                    <span className="value" style={{ fontWeight: 'bold' }}>
                      {invoiceData.total?.totalConvertedDisplay &&
                      typeof invoiceData.total.totalConvertedDisplay ===
                        'string'
                        ? invoiceData.total.totalConvertedDisplay
                        : calculatedTotalAmount !== undefined
                        ? formatAmountWithCurrency(calculatedTotalAmount, true)
                        : formatAmountWithCurrency(
                            invoiceData.total?.amount,
                            true
                          )}
                    </span>
                  </div>
                  <div className="item-row">
                    <span className="label" style={{ fontWeight: 'bold' }}>
                      {t.estimateInfo.vatIncluded}
                    </span>
                    <span className="value" style={{ fontWeight: 'bold' }}>
                      {invoiceData.total?.totalConvertedDisplay &&
                      typeof invoiceData.total.totalConvertedDisplay ===
                        'string'
                        ? formatAmountWithCurrency(
                            Math.round(
                              (calculatedTotalAmount ||
                                invoiceData.total?.amount ||
                                0) * 1.1
                            ),
                            true
                          )
                        : calculatedTotalAmount !== undefined
                        ? formatAmountWithCurrency(
                            Math.round(calculatedTotalAmount * 1.1),
                            true
                          )
                        : formatAmountWithCurrency(
                            Math.round((invoiceData.total?.amount || 0) * 1.1),
                            true
                          )}
                    </span>
                  </div>
                  {calculatedTotalDuration !== undefined && (
                    <div className="item-row">
                      <span className="label">
                        {t.estimateInfo.totalDuration}
                      </span>
                      <span className="value">
                        {typeof calculatedTotalDuration === 'number'
                          ? `${Math.ceil(calculatedTotalDuration / 5)} ${
                              t.estimateInfo.week
                            } (${lang === 'ko' ? '약 ' : ''}${Math.ceil(
                              calculatedTotalDuration / 20
                            )} ${t.estimateInfo.monthUnit})`
                          : `${calculatedTotalDuration} ${t.estimateInfo.day}`}
                      </span>
                    </div>
                  )}
                  {calculatedTotalPages !== undefined && (
                    <div className="item-row">
                      <span className="label">{t.estimateInfo.totalPages}</span>
                      <span className="value">
                        {calculatedTotalPages} {t.estimateInfo.page}
                      </span>
                    </div>
                  )}
                </MobileInvoiceCardItem>
              </MobileInvoiceContainer>
            ) : (
              <InvoiceTable>
                <thead>
                  <tr>
                    <th className="col-category">{t.tableHeaders.category}</th>
                    <th className="col-feature">{t.tableHeaders.item}</th>
                    <th className="col-description">{t.tableHeaders.detail}</th>
                    <th className="col-amount">{t.tableHeaders.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.invoiceGroup?.map((group) => (
                    <React.Fragment key={`group-${group.category}`}>
                      {group.items?.map((item, itemIndex) => {
                        const currentItemStatus = currentItems?.find(
                          (ci) => ci.id === item.id
                        );
                        const isActuallyDeleted = currentItemStatus
                          ? currentItemStatus.isDeleted
                          : false;

                        return (
                          <tr key={item.id || `feature-${itemIndex}`}>
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
                              {item.note &&
                                !/^[A-Z]{3}\s[\d,.]+\s\(₩[\d,.]+\)$/.test(
                                  item.note
                                ) && (
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
                            </td>
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
                              {item.note &&
                              /^[A-Z]{3}\s[\d,.]+\s\(₩[\d,.]+\)$/.test(
                                item.note
                              )
                                ? item.note
                                : formatAmountWithCurrency(item.amount, true)}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  <tr>
                    <td colSpan={3} className="total-label">
                      <strong>{t.estimateInfo.totalSum}</strong>
                    </td>
                    <td className="col-amount">
                      <strong>
                        {invoiceData.total?.totalConvertedDisplay &&
                        typeof invoiceData.total.totalConvertedDisplay ===
                          'string'
                          ? invoiceData.total.totalConvertedDisplay
                          : calculatedTotalAmount !== undefined
                          ? formatAmountWithCurrency(
                              calculatedTotalAmount,
                              true
                            )
                          : formatAmountWithCurrency(
                              invoiceData.total?.amount,
                              true
                            )}
                      </strong>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="total-label">
                      <strong>{t.estimateInfo.vatIncluded}</strong>
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <strong>
                        {formatAmountWithCurrency(
                          Math.round(
                            (calculatedTotalAmount ||
                              invoiceData.total?.amount ||
                              0) * 1.1
                          ),
                          true
                        )}
                      </strong>
                    </td>
                    <td></td>
                  </tr>
                  {calculatedTotalDuration !== undefined && (
                    <tr>
                      <td colSpan={3} className="total-label">
                        {t.estimateInfo.totalDuration}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {typeof calculatedTotalDuration === 'number'
                          ? `${Math.ceil(calculatedTotalDuration / 5)} ${
                              t.estimateInfo.week
                            } (${lang === 'ko' ? '약 ' : ''}${Math.ceil(
                              calculatedTotalDuration / 20
                            )} ${t.estimateInfo.monthUnit})`
                          : `${calculatedTotalDuration} ${t.estimateInfo.day}`}
                      </td>
                    </tr>
                  )}
                  {calculatedTotalPages !== undefined && (
                    <tr>
                      <td colSpan={3} className="total-label">
                        {t.estimateInfo.totalPages}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {calculatedTotalPages} {t.estimateInfo.page}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </InvoiceTable>
            )}

            {/* 할인 및 PDF 저장 옵션 */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${AppColors.aiBorder}`,
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
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {t.discount.options.map((optionText, index) => {
                  let action = '';
                  if (index === 0) {
                    action = 'discount_extend_8w_20p';
                  } else if (index === 1) {
                    action = 'discount_remove_features_budget';
                  } else if (index === 2) {
                    action = 'discount_ai_suggestion';
                  }

                  let mainText = optionText;
                  let subText = '';
                  if (
                    index === 2 &&
                    optionText.includes('(') &&
                    optionText.includes(')')
                  ) {
                    const match = optionText.match(/(.*)\\s*\\((.*)\\)/);
                    if (match) {
                      mainText = match[1].trim();
                      subText = `(${match[2].trim()})`;
                    }
                  }

                  return (
                    <li
                      key={index}
                      style={{
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {index === 2 && subText ? (
                        <span
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span>{mainText}</span>
                          <span
                            style={{
                              fontSize: '0.9em',
                              color: AppColors.onSurfaceVariant,
                            }}
                          >
                            {subText}
                          </span>
                        </span>
                      ) : (
                        <span>{optionText}</span>
                      )}
                      <ActionButton
                        onClick={() => {
                          console.log(
                            `[AiChatMessage] ActionButton clicked. Action: ${action}, Index: ${index}`
                          );
                          onActionClick(action);
                        }}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        {t.discount.optionsButtonTexts[index] ||
                          t.buttons.select}
                      </ActionButton>
                    </li>
                  );
                })}
              </ul>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1em' }}>
                {t.pdf.title}
              </h4>
              <ActionButton
                onClick={() => onActionClick('download_pdf')}
                style={{
                  backgroundColor: '#2E7D32',
                  width: '150px',
                }}
              >
                {t.buttons.downloadPdf}
              </ActionButton>
            </div>
          </StyledInvoiceContainer>
        )}

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
