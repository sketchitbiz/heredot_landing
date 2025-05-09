"use client";

import styled, { css } from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React from "react";

// INVOICE_SCHEMA에 따른 타입 정의 (실제 schema.ts의 구조를 반영해야 함)
// 이 타입들은 AiPageContent.tsx와 동기화되어야 하며, 한 곳에서 정의하고 공유하는 것이 좋음
interface InvoiceFeatureItem {
  id: string;
  feature: string;
  description: string;
  amount: number | string;
  duration?: string;
  category?: string;
  pages?: number | string;
  note?: string;
}

interface InvoiceGroup {
  category: string;
  items: InvoiceFeatureItem[];
}

interface InvoiceTotal {
  amount: number;
  duration?: number;
  pages?: number;
}

export interface InvoiceDataType {
  project: string;
  invoiceGroup: InvoiceGroup[];
  total: InvoiceTotal;
}

// Message 인터페이스 export 추가 및 invoiceData 필드 추가
export interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  imageUrl?: string; // 이미지 URL (선택적)
  fileType?: string; // 파일 타입 (선택적)
  invoiceData?: InvoiceDataType; // AI가 생성한 견적서 JSON 데이터
}

// MessageProps 인터페이스에 계산된 총합 및 현재 아이템 목록 props 추가
interface MessageProps extends Omit<Message, "id"> {
  onActionClick: (action: string, data?: { featureId?: string }) => void;
  calculatedTotalAmount?: number;
  calculatedTotalDuration?: number;
  calculatedTotalPages?: number;
  currentItems?: Array<InvoiceDataType["invoiceGroup"][number]["items"][number] & { isDeleted: boolean }>;
}

interface StyledComponentProps {
  $sender: "user" | "ai";
}

// formatAmount 함수 정의 (컴포넌트 바깥 또는 유틸리티 파일로 이동 가능)
const formatAmount = (amount: number | string) => {
  if (typeof amount === "number") {
    return `${amount.toLocaleString()} 원`;
  }
  return amount; // "별도 문의" 등 문자열 그대로 반환
};

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

const MessageWrapper = styled.div<StyledComponentProps>`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  justify-content: ${(props) => (props.$sender === "user" ? "flex-end" : "flex-start")};
`;

const MessageBox = styled.div<StyledComponentProps>`
  max-width: 75%;
  padding: 0.3rem 1rem;
  border-radius: 12px;
  ${AppTextStyles.body1}
  line-height: 1.7;
  letter-spacing: normal;

  ${(props) =>
    props.$sender === "user"
      ? css`
          background-color: ${AppColors.primary};
          color: ${AppColors.onPrimary};
          border-bottom-right-radius: 0;
          white-space: pre-wrap;
          padding: 0.75rem 1rem;
        `
      : css`
          background-color: ${AppColors.background};
          color: ${AppColors.onBackground};
        `};
`;

const ProfileImage = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  align-self: flex-start;
`;

const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0;
`;

// --- 새 버튼 스타일 컴포넌트 정의 ---
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
// -------------------------------------

// button 렌더러 props 타입 정의 (unknown 사용)
type ButtonRendererProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  node?: unknown;
};

// 견적서 UI용 스타일 컴포넌트 (이전 제안 기반)
const StyledInvoiceContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid ${AppColors.border};
  border-radius: 8px;
  background-color: #1c1c25;
  color: ${AppColors.onBackground};
  font-size: 0.9rem;
`;

const InvoiceProjectTitle = styled.h3`
  font-size: 1.3em;
  color: ${AppColors.onBackground};
  margin-bottom: 1em;
`;

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

  tbody tr:last-child td {
    border-bottom: none;
    font-weight: bold;
  }

  .total-label {
    text-align: right;
    padding-right: 1em;
  }
`;

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
  const isAiMessage = sender === "ai";

  const customComponents: Options["components"] = {
    button: ({ node, ...props }: ButtonRendererProps) => {
      let action: string | undefined;
      let featureId: string | undefined;
      let buttonText: string = "Button";

      // 타입 가드 및 속성 접근
      if (typeof node === "object" && node !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        action = (node as any).properties?.["data-action"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        featureId = (node as any).properties?.["data-feature-id"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buttonText = (node as any).children?.[0]?.value || "Button";
      }

      if (action) {
        // StyledActionButton 사용
        return (
          <StyledActionButton
            onClick={() => {
              if (action && onActionClick) {
                onActionClick(action, featureId ? { featureId } : undefined);
              } else if (featureId && onActionClick) {
                // data-action이 없고 data-feature-id만 있는 경우 (예: 삭제 버튼)
                onActionClick("delete_feature", { featureId });
              }
            }}
            {...props}>
            {buttonText}
          </StyledActionButton>
        );
      }
      // 기본 버튼 (스타일 없는) 또는 StyledActionButton 중 선택
      // 여기서는 일관성을 위해 data-action 없는 버튼도 Styled 적용 (클릭 액션은 없음)
      return <StyledActionButton {...props}>{buttonText}</StyledActionButton>;
    },
  };

  return (
    <MessageWrapper $sender={sender}>
      {isAiMessage && <ProfileImage src="/pretty.png" alt="AI 프로필" />}
      <MessageBox $sender={sender}>
        {isAiMessage && (
          <ProfileName style={{ marginBottom: "0.5rem" }}>
            <strong>강유하</strong>
          </ProfileName>
        )}

        <StyledMarkdownContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={customComponents}>
            {text}
          </ReactMarkdown>
        </StyledMarkdownContainer>

        {isAiMessage && invoiceData && (
          <StyledInvoiceContainer>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <InvoiceProjectTitle>{invoiceData.project || "프로젝트 견적"}</InvoiceProjectTitle>
              </div>
            </div>

            <InvoiceTable>
              <thead>
                <tr>
                  <th className="col-category">구분</th>
                  <th className="col-feature">항목</th>
                  <th className="col-description">세부 내용</th>
                  <th className="col-amount">예상 금액</th>
                  <th className="col-actions">관리</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceGroup?.map((group, groupIndex) => (
                  <React.Fragment key={`group-${group.category}-${groupIndex}`}>
                    {group.items?.map((item, itemIndex) => {
                      const currentItemStatus = currentItems?.find((ci) => ci.id === item.id);
                      const isActuallyDeleted = currentItemStatus ? currentItemStatus.isDeleted : false;

                      return (
                        <tr key={item.id || `feature-${groupIndex}-${itemIndex}`}>
                          {itemIndex === 0 ? (
                            <td
                              className="col-category"
                              rowSpan={group.items.length || 1}
                              style={{
                                textDecoration: isActuallyDeleted ? "line-through" : "none",
                                color: isActuallyDeleted ? AppColors.disabled : AppColors.onBackground,
                              }}>
                              {group.category}
                            </td>
                          ) : null}
                          <td
                            className="col-feature"
                            style={{
                              textDecoration: isActuallyDeleted ? "line-through" : "none",
                              color: isActuallyDeleted ? AppColors.disabled : AppColors.onBackground,
                            }}>
                            {item.feature}
                          </td>
                          <td
                            className="col-description"
                            style={{
                              textDecoration: isActuallyDeleted ? "line-through" : "none",
                              color: isActuallyDeleted ? AppColors.disabled : AppColors.onBackground,
                            }}>
                            {item.description}
                            {item.note && (
                              <p style={{ fontSize: "0.9em", color: AppColors.onSurfaceVariant, marginTop: "0.3em" }}>
                                <em>참고: {item.note}</em>
                              </p>
                            )}
                            {item.duration && (
                              <p style={{ fontSize: "0.9em", color: AppColors.onSurfaceVariant, marginTop: "0.3em" }}>
                                예상 기간: {item.duration}
                              </p>
                            )}
                            {item.pages && (
                              <p style={{ fontSize: "0.9em", color: AppColors.onSurfaceVariant, marginTop: "0.3em" }}>
                                예상 페이지: {item.pages}
                              </p>
                            )}
                          </td>
                          <td
                            className="col-amount"
                            style={{
                              textDecoration: isActuallyDeleted ? "line-through" : "none",
                              color: isActuallyDeleted ? AppColors.disabled : AppColors.onBackground,
                            }}>
                            {formatAmount(item.amount)}
                          </td>
                          <td className="col-actions">
                            <ActionButton onClick={() => onActionClick("delete_feature_json", { featureId: item.id })}>
                              {isActuallyDeleted ? "취소" : "삭제"}
                            </ActionButton>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
                <tr>
                  <td colSpan={3} className="total-label">
                    <strong>총 합계</strong>
                  </td>
                  <td className="col-amount">
                    <strong>
                      {calculatedTotalAmount !== undefined
                        ? formatAmount(calculatedTotalAmount)
                        : formatAmount(invoiceData.total?.amount)}
                    </strong>
                  </td>
                  <td></td>
                </tr>
                {calculatedTotalDuration !== undefined && (
                  <tr>
                    <td colSpan={3} className="total-label">
                      총 예상 기간
                    </td>
                    <td className="col-amount">{calculatedTotalDuration} 일</td>
                    <td></td>
                  </tr>
                )}
                {calculatedTotalPages !== undefined && (
                  <tr>
                    <td colSpan={3} className="total-label">
                      총 예상 페이지 수
                    </td>
                    <td className="col-amount">{calculatedTotalPages} 페이지</td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </InvoiceTable>
          </StyledInvoiceContainer>
        )}

        {imageUrl && fileType && fileType.startsWith("image/") && (
          <div style={{ marginTop: "10px", textAlign: sender === "user" ? "right" : "left" }}>
            <img
              src={imageUrl}
              alt="첨부 이미지"
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
      </MessageBox>
    </MessageWrapper>
  );
}
