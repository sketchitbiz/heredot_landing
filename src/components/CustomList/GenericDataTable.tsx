'use client'

import { THEME_COLORS, ThemeMode } from "@/styles/theme_colors";
import React from "react";
import styled from "styled-components";
// 열 정의를 위한 더 일반적인 타입 정의
export interface ColumnDefinition<T> {
  header: string; // 헤더에 표시할 텍스트
  accessor: keyof T | string; // 행 객체에서 데이터를 액세스하는 키 또는 '__index__'와 같은 특수 문자열
  sortable?: boolean; // 열이 정렬 가능한지 여부
  formatter?: (value: any, item: T, rowIndex: number) => React.ReactNode; // 사용자 정의 셀 렌더러
  headerStyle?: React.CSSProperties; // 헤더에 대한 선택적 스타일
  cellStyle?: React.CSSProperties | ((value: any, item: T) => React.CSSProperties); // 셀에 대한 선택적 스타일
}

interface GenericDataTableProps<T> {
  data: T[]; // 현재 페이지의 실제 데이터 배열
  columns: ColumnDefinition<T>[]; // 열에 대한 구성
  isLoading?: boolean; // 선택적 로딩 상태
  error?: string | null; // 선택적 오류 메시지
  maxLength?: number; // 표시할 최대 행 수 (데이터가 미리 슬라이싱되지 않은 경우 유용)
  onRowClick?: (item: T, rowIndex: number) => void; // 행 클릭 시 콜백
  onHeaderClick?: (accessor: keyof T | string) => void; // 헤더 클릭 시 콜백 (정렬 용)
  sortKey?: keyof T | string | null; // 현재 활성화된 정렬 키
  sortOrder?: "asc" | "desc"; // 현재 정렬 순서
  keyExtractor: (item: T, index: number) => string | number; // 각 행에 대한 고유 키를 얻는 함수
  themeMode?: ThemeMode; // 테마 속성 수정
}

// 중첩된 속성 값을 가져오는 헬퍼 함수
const getPropertyValue = <T,>(obj: T, path: keyof T | string): any => {
  if (typeof path !== "string") return obj[path]; // 직접적인 키 액세스를 처리
  const keys = path.split(".");
  let value: any = obj;
  for (const key of keys) {
    if (value === null || typeof value !== "object") {
      return undefined;
    }
    value = value[key];
  }
  return value;
};

const GenericDataTable = <T extends object>({
  data,
  columns,
  isLoading = false,
  error = null,
  maxLength,
  onRowClick,
  onHeaderClick,
  sortKey,
  sortOrder,
  keyExtractor,
  themeMode = "dark",
}: GenericDataTableProps<T>) => {
  const renderCellContent = (item: T, column: ColumnDefinition<T>, rowIndex: number) => {
    const rawValue = getPropertyValue(item, column.accessor);

    if (column.formatter) {
      return column.formatter(rawValue, item, rowIndex);
    }
    // 일반적인 타입을 위한 기본 렌더링
    if (rawValue instanceof Date) {
      return rawValue.toLocaleString();
    }
    if (typeof rawValue === "boolean") {
      return rawValue ? "Yes" : "No";
    }
    if (rawValue === null || rawValue === undefined) {
      return "-"; // 또는 다른 placeholder
    }
    return String(rawValue); // 기본적으로 문자열로 변환
  };

  const getCellStyle = (item: T, column: ColumnDefinition<T>): React.CSSProperties | undefined => {
    if (!column.cellStyle) return undefined;
    if (typeof column.cellStyle === "function") {
      const rawValue = getPropertyValue(item, column.accessor);
      return column.cellStyle(rawValue, item);
    }
    return column.cellStyle;
  };

  if (isLoading) {
    // 더 정교한 로딩 인디케이터를 원할 수 있음
    return <LoadingContainer $themeMode={themeMode}>로딩 중...</LoadingContainer>;
  }

  if (error) {
    return <ErrorMessage $themeMode={themeMode}>오류: {error}</ErrorMessage>;
  }

  if (!data || data.length === 0) {
    return <NoDataMessage $themeMode={themeMode}>표시할 데이터가 없습니다.</NoDataMessage>;
  }

  const displayData = maxLength ? data.slice(0, maxLength) : data;

  return (
    <Table $themeMode={themeMode}>
      <thead>
      <tr>
  {columns.map((column, headerIndex) => {
    // column.sortable가 undefined일 경우 기본값 true로 설정
    const isSortable = (column.sortable ?? true) && onHeaderClick;
    const isSortedColumn = isSortable && column.accessor === sortKey;

    return (
      <Th
        key={`header-${String(column.accessor)}-${headerIndex}`}
        onClick={isSortable ? () => onHeaderClick(column.accessor) : undefined}
        style={{ ...column.headerStyle, cursor: isSortable ? "pointer" : "default" }}
        $isSortable={!!isSortable}
        $themeMode={themeMode}
      >
        {column.header}
        {isSortedColumn && <SortIcon $themeMode={themeMode}>{sortOrder === "asc" ? " ▲" : " ▼"}</SortIcon>}
      </Th>
    );
  })}
</tr>
      </thead>
      <tbody>
        {displayData.map((item, rowIndex) => (
          <TableRow
            key={keyExtractor(item, rowIndex)}
            $isEven={rowIndex % 2 === 0}
            onClick={onRowClick ? () => onRowClick(item, rowIndex) : undefined}
            $isClickable={!!onRowClick}
            $themeMode={themeMode}>
            {columns.map((column, cellIndex) => (
              <Td
                key={`cell-${String(column.accessor)}-${rowIndex}-${cellIndex}`}
                style={getCellStyle(item, column)}
                $isEven={rowIndex % 2 === 0}
                $themeMode={themeMode}>
                {renderCellContent(item, column, rowIndex)}
              </Td>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default GenericDataTable;

// --- 스타일 컴포넌트 (UserDataTable의 원본과 유사하게, props에 맞게 조정됨) ---

const Table = styled.table<{ $themeMode: ThemeMode }>`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 14px;
  text-align: center;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
`;

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  $isSortable?: boolean;
  $themeMode: ThemeMode;
}

const Th = styled.th<ThProps>`
  padding: 12px 8px;
  border-bottom: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  font-family: "Pretendard Variable", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableHeaderText : THEME_COLORS.dark.tableHeaderText};
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableHeaderBackground : THEME_COLORS.dark.tableHeaderBackground};
  cursor: ${(props) => (props.$isSortable ? "pointer" : "default")};
  user-select: none;
  white-space: nowrap;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;

  &:hover {
    background-color: ${(props) => {
      if (props.$isSortable) {
        return props.$themeMode === "light" ? "#F0F0F0" : "#424451";
      }
      return props.$themeMode === "light"
        ? THEME_COLORS.light.tableHeaderBackground
        : THEME_COLORS.dark.tableHeaderBackground;
    }};
  }
`;

const SortIcon = styled.span<{ $themeMode: ThemeMode }>`
  margin-left: 4px;
  font-size: 12px;
  vertical-align: middle;
  color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableHeaderText : THEME_COLORS.dark.tableHeaderText};
`;

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  $isEven: boolean;
  $isClickable: boolean;
  $themeMode: ThemeMode;
}

const TableRow = styled.tr<TableRowProps>`
  background-color: ${({ $isEven, $themeMode }) => {
    return $isEven
      ? $themeMode === "light"
        ? THEME_COLORS.light.tableRowEven
        : THEME_COLORS.dark.tableRowEven
      : $themeMode === "light"
      ? THEME_COLORS.light.tableRowOdd
      : THEME_COLORS.dark.tableRowOdd;
  }};
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#e0e0e0" : "#424451")};
  }
`;

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  $isEven: boolean; // 홀수/짝수 행 구분용 속성 추가
  $themeMode: ThemeMode;
}

const Td = styled.td<TdProps>`
  padding: 12px 8px;
  background: ${({ $isEven, $themeMode }) => {
    return $isEven
      ? $themeMode === "light"
        ? THEME_COLORS.light.tableRowEven
        : THEME_COLORS.dark.tableRowEven
      : $themeMode === "light"
      ? THEME_COLORS.light.tableRowOdd
      : THEME_COLORS.dark.tableRowOdd;
  }};
  font-family: "Pretendard Variable", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.tableText : THEME_COLORS.dark.tableText)};
  border-bottom: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  vertical-align: middle;
  text-align: center;
  word-break: break-word;
`;

const LoadingContainer = styled.div<{ $themeMode: ThemeMode }>`
  padding: 40px;
  text-align: center;
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.text)};
  font-size: 16px;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
`;

const ErrorMessage = styled.div<{ $themeMode: ThemeMode }>`
  padding: 40px;
  text-align: center;
  color: red;
  font-size: 16px;
  font-weight: bold;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
`;

const NoDataMessage = styled.div<{ $themeMode: ThemeMode }>`
  padding: 40px;
  text-align: center;
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.text)};
  font-size: 16px;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
`;
