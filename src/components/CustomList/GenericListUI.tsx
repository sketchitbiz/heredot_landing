"use client";

import React, {useImperativeHandle, forwardRef,  useState, useEffect, useMemo, useCallback, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import GenericDataTable, { ColumnDefinition } from "./GenericDataTable"; // 경로 확인
import GenericDateRangePicker from "./GenericDateRangePicker"; // 경로 확인
import DropdownCustom from "./DropdownCustom";
import { THEME_COLORS, ThemeMode } from "@/styles/theme_colors";
import ActionButton from "../ActionButton";




// Helper: getPropertyValue (기존 유지, UserListPage 버전 개선 적용)
const getPropertyValue = <T extends object>(obj: T, path: keyof T | string): any => {
  if (!obj) return undefined;
  if (typeof path === "string" && path in obj) {
    return obj[path as keyof T];
  }
  if (typeof path === "number" || typeof path === "symbol") {
    return obj[path as keyof T];
  }
  if (typeof path === "string" && path.includes(".")) {
    const keys = path.split(".");
    let value: any = obj;
    for (const key of keys) {
      if (value === null || typeof value !== "object" || !(key in value)) {
        return undefined;
      }
      value = value[key];
    }
    return value;
  }
  return undefined;
};

// --- Component Props ---
interface BaseRecord {
  id?: string | number; // 기본 ID 필드 가정 (keyExtractor 대체용)
  index?: number; // index 필드도 고려
  [key: string]: any; // 다른 필드 허용
}

// API Fetch 함수 타입 정의 (수정: 페이지/정렬 파라미터 제거)
export interface FetchParams {
  fromDate?: string; // Optional
  toDate?: string; // Optional
  keyword?: string; // Optional
}

export interface FetchResult<T> {
  data: T[];
  totalItems: number; // 필터링된 총 아이템 수
  allItems?: number; // 필터링 전 전체 아이템 수 (Optional)
}

// 초기 상태 타입
interface InitialState {
  page?: number;
  size?: number;
  sortKey?: string | null;
  sortOrder?: "asc" | "desc";
  fromDate?: string;
  toDate?: string;
  keyword?: string;
}

// GenericListUI Props 정의 (수정)
interface GenericListUIProps<T extends BaseRecord> {
  title: React.ReactNode;
  columns: ColumnDefinition<T>[];
  fetchData: (params: FetchParams) => Promise<FetchResult<T>>;
  excelFileName?: string;

  // 새로 변경된 props
  addButtonLabel?: string;
  deleteBtnCallBack?: () => void;
  isShowExcelTemplate?: boolean;
  excelUploadBtnCallBack?: (() => void);

  initialState?: InitialState;
  keyExtractor?: (item: T, index: number) => string | number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enableDateFilter?: boolean;
  dateRangeOptions?: string[];
  itemsPerPageOptions?: number[];
  themeMode?: ThemeMode;
  onRowClick?: (item: T, rowIndex: number) => void;
  renderTabs?: () => React.ReactNode;
}

// 등록, 템플릿 버튼 (밝은 톤)
const PrimaryButton = styled(ActionButton)<{ $themeMode: ThemeMode }>`
  width: 110px;
  height: 40px;
  background: ${({ $themeMode }) =>
    $themeMode === 'light'
      ? THEME_COLORS.light.primary
      : THEME_COLORS.dark.buttonText};
  color: ${({ $themeMode }) =>
    $themeMode === 'light' ? '#f8f8f8' : THEME_COLORS.dark.primary};
  border: none;
  &:hover:not(:disabled) {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#e8e8e8" : "#555555")};
  }
`;

// 삭제, 업로드 버튼 (어두운 톤)
const SecondaryButton = styled(ActionButton)<{ $themeMode: ThemeMode }>`
  width: 110px;
  height: 40px;
  background: ${({ $themeMode }) => ($themeMode === "light" ? "#eeeeee" : "#333333")};
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#333333" : "#eeeeee")};
  border: none;
  &:hover:not(:disabled) {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#dddddd" : "#555555")};
  }
`;

// 다운로드 버튼 (특정 색)
const DownloadButton = styled(ActionButton)`
  width: 110px;
  height: 40px;
  background: #51815a;
  color: white;
  border: none;
  &:hover:not(:disabled) {
    background-color: #3e6b47;
  }
`;


// --- The Component --- (상태 및 로직 대폭 수정)
const GenericListUIInner = <T extends BaseRecord>(
  {
    title,
    columns,
    fetchData,
    excelFileName = "DataExport",
    initialState = {},
    keyExtractor,
    enableSearch = true,
    searchPlaceholder = "검색어를 입력해주세요",
    enableDateFilter = true,
    itemsPerPageOptions = [12, 30, 50, 100],
    themeMode = "light",
    onRowClick,
    renderTabs,
    addButtonLabel = "추가",
    isShowExcelTemplate,
    deleteBtnCallBack,
    excelUploadBtnCallBack,
  }: GenericListUIProps<T>,
  ref: React.Ref<{ refetch: () => void }>
) => {

  // --- 내부 상태 --- (데이터 상태 추가, API 호출 관련 상태 제거)
  const [allData, setAllData] = useState<T[]>([]); // API로부터 받은 전체 데이터
  const [totalItems, setTotalItems] = useState(0); // 필터링된 아이템 수 (API 메타데이터 기준)
  const [allItems, setAllItems] = useState<number | undefined>(undefined); // 전체 아이템 수 (API 메타데이터 기준)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI 제어 상태 (페이지네이션, 정렬, 필터)
  const [currentPage, setCurrentPage] = useState(initialState.page ?? 1);
  const [itemsPerPage, setItemsPerPage] = useState(initialState.size ?? itemsPerPageOptions[0] ?? 12);
  const [sortKey, setSortKey] = useState<string | null>(initialState.sortKey ?? null); // 기본 정렬 없음
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialState.sortOrder ?? "asc");
  const [fromDate, setFromDate] = useState(initialState.fromDate ?? dayjs().subtract(6, "month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(initialState.toDate ?? dayjs().format("YYYY-MM-DD"));
  const [searchTermInput, setSearchTermInput] = useState(initialState.keyword ?? ""); // 검색 "입력" 상태
  const [searchKeyword, setSearchKeyword] = useState(initialState.keyword ?? ""); // 실제 "적용된" 검색어

  // --- 데이터 로딩 콜백 --- (API 호출 시점 변경)
  const fetchDataCallback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: FetchParams = {
        keyword: searchKeyword || undefined,
      };
      if (enableDateFilter) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }
      const result = await fetchData(params); // 페이지/정렬 파라미터 없이 호출

      setAllData(result.data); // 전체 데이터 저장
      setTotalItems(result.totalItems); // 메타데이터 저장
      setAllItems(result.allItems); // 메타데이터 저장
      setCurrentPage(1); // 데이터 로드 시 항상 1페이지로 리셋
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      setAllData([]); // 에러 시 데이터 초기화
      setTotalItems(0);
      setAllItems(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, fromDate, toDate, enableDateFilter, fetchData]); // keyword, date 변경 시 호출
  
  useImperativeHandle(ref, () => ({
    refetch: () => {
      fetchDataCallback(); // 내부 API 호출
    },
  }));
  
  // 초기 로딩
  useEffect(() => {
    fetchDataCallback();
  }, []); // 마운트 시 1회 호출

  // --- 클라이언트 측 데이터 처리 --- (정렬, 페이지네이션)
  const sortedData = useMemo(() => {
    const sortableData = [...allData]; // 전체 데이터 복사
    if (sortKey) {
      sortableData.sort((a, b) => {
        const valA = getPropertyValue(a, sortKey);
        const valB = getPropertyValue(b, sortKey);
        let comparison = 0;
        if (valA === null || valA === undefined) comparison = -1;
        else if (valB === null || valB === undefined) comparison = 1;
        else if (dayjs.isDayjs(valA) && dayjs.isDayjs(valB)) comparison = valA.valueOf() - valB.valueOf();
        else if (typeof valA === "string" && typeof valB === "string") comparison = valA.localeCompare(valB);
        else if (typeof valA === "number" && typeof valB === "number") comparison = valA - valB;
        else comparison = String(valA).localeCompare(String(valB));
        return sortOrder === "asc" ? comparison : comparison * -1;
      });
    }
    return sortableData;
  }, [allData, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // --- 파생 상태 (페이지네이션) ---
  // totalItems는 API 결과의 메타데이터 사용 (필터링된 개수)
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayTotalItems = totalItems;
  const displayAllItems = allItems ?? totalItems;

  // --- 이벤트 핸들러 (수정) ---
  // 페이지 변경: 상태만 업데이트
  const handlePageNumChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };
  // 페이지 크기 변경: 상태만 업데이트
  const handleItemsPerPageChange = (newSize: number) => {
    if (newSize !== itemsPerPage) {
      setItemsPerPage(newSize);
      setCurrentPage(1);
    }
  };
  // 정렬 변경: 상태만 업데이트
  const handleHeaderClick = (accessor: keyof T | string) => {
    const newSortOrder = sortKey === accessor && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(accessor as string);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // 정렬 시 1페이지로
  };

  // 날짜 변경: 상태 업데이트 + API 호출
  const handleDateChangeInternal = (newFrom: string, newTo: string) => {
    setFromDate(newFrom);
    setToDate(newTo);
    fetchDataCallback(); // 날짜 변경 시 API 재호출
  };

  // 검색어 입력: 입력 상태만 업데이트 (API 호출 없음)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermInput(e.target.value);
  };
  // 조회 버튼 클릭: 적용된 검색어 업데이트 + API 호출
  const handleImmediateSearch = () => {
    setSearchKeyword(searchTermInput.trim());
    fetchDataCallback(); // 조회 버튼 클릭 시 API 재호출
  };


  

  // 엑셀 다운로드 핸들러 (수정: 클라이언트 데이터 사용)
  const handleDownloadClick = () => {
    setIsLoading(true); // 로딩 표시 (데이터 준비 중)
    try {
      // 정렬된 전체 데이터 사용 (페이지네이션 전)
      const dataToDownload = sortedData;

      if (!dataToDownload || dataToDownload.length === 0) {
        console.warn("다운로드할 데이터가 없습니다.");
        alert("다운로드할 데이터가 없습니다."); // 임시
        return;
      }

      // 컬럼 정보를 사용하여 데이터 포맷팅 (기존 로직 유지)
      const formattedData = dataToDownload.map((item) => {
        const row: { [key: string]: any } = {};
        columns.forEach((col) => {
          if (col.accessor) {
            let value = getPropertyValue(item, col.accessor);
            if (col.formatter && typeof col.formatter === "function") {
              const formattedVal = col.formatter(value, item, -1);
              if (
                typeof formattedVal === "string" ||
                typeof formattedVal === "number" ||
                typeof formattedVal === "boolean"
              ) {
                value = formattedVal;
              } else if (value instanceof Date || dayjs.isDayjs(value)) {
                value = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
              } else if (typeof value === "boolean") {
                value = value ? "Y" : "N";
              }
            } else {
              if (value instanceof Date) value = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
              else if (typeof value === "boolean") value = value ? "Y" : "N";
              else if (value === null || value === undefined) value = "";
            }
            const headerName = typeof col.header === "string" ? col.header.replace(/\n/g, " ") : String(col.accessor);
            row[headerName] = value;
          }
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${excelFileName}_${dayjs().format("YYYYMMDD")}.xlsx`);
      alert("엑셀이 다운로드되었습니다."); // 임시
    } catch (err) {
      console.error("Excel download failed:", err);
      alert("엑셀 다운로드 중 오류가 발생했습니다."); // 임시
    } finally {
      setIsLoading(false);
    }
  };

  // --- 행 클릭 핸들러 (기존 유지) ---
  const handleRowClickInternal = useCallback(
    (item: T, index: number) => {
      if (onRowClick) {
        onRowClick(item, index); // 부모 컴포넌트의 onRowClick 함수 호출
      }
    },
    [onRowClick]
  );

  // --- 키 추출기 (기존 유지) ---
  const internalKeyExtractor = useMemo(() => {
    if (keyExtractor) return keyExtractor;
    // 기본 keyExtractor: item.id 또는 item.index 사용 시도
    return (item: T, index: number) => item.id ?? item.index ?? `row-${index}`;
  }, [keyExtractor]);


  return (
    <Container $themeMode={themeMode}>
      <TopHeader>
        <TitleContainer>
          {typeof title === "string" ? (
            <CMSTitle $themeMode={themeMode}>{title}</CMSTitle>
          ) : (
            title /* ReactNode 직접 렌더링 */
          )}
        </TitleContainer>
        {renderTabs && <TabsWrapper>{renderTabs()}</TabsWrapper>}
      </TopHeader>

      <ControlHeader>
        <APIControls>
          {enableDateFilter && (
            <DateRangePickerContainer>
              <GenericDateRangePicker
                initialFromDate={fromDate}
                initialToDate={toDate}
                onDateChange={handleDateChangeInternal}
                themeMode={themeMode}
              />
            </DateRangePickerContainer>
          )}
          {enableSearch && (
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder={searchPlaceholder}
                value={searchTermInput}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleImmediateSearch();
                }}
                $themeMode={themeMode}
              />
              <SearchButton onClick={handleImmediateSearch} $themeMode={themeMode}>
                조회
              </SearchButton>
            </SearchContainer>
          )}
        </APIControls>

        <EventControls>
  <LeftControls>
    {addButtonLabel && (
      <PrimaryButton $themeMode={themeMode} onClick={() => console.log("등록 클릭됨")}>
        {addButtonLabel}
      </PrimaryButton>
    )}
    {deleteBtnCallBack && (
      <SecondaryButton $themeMode={themeMode} onClick={deleteBtnCallBack}>삭제</SecondaryButton>
    )}
  </LeftControls>

  <RightControls>
    {isShowExcelTemplate && (
      <PrimaryButton $themeMode={themeMode} onClick={() => console.log("엑셀 템플릿")}>
        엑셀 템플릿
      </PrimaryButton>
    )}
    {excelUploadBtnCallBack && (
      <SecondaryButton $themeMode={themeMode} onClick={excelUploadBtnCallBack}>
        엑셀 업로드
      </SecondaryButton>
    )}
    <DownloadButton onClick={handleDownloadClick} $themeMode={themeMode} disabled={isLoading}>
      {isLoading ? "다운로드 중..." : "엑셀 다운로드"}
    </DownloadButton>

    <PaginationControls>
      <NavButton
        onClick={() => handlePageNumChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        $themeMode={themeMode}>
        &lt;
      </NavButton>
      <PageBox $themeMode={themeMode}>
        {currentPage} / {totalPages > 0 ? totalPages : 1}
      </PageBox>
      <NavButton
        onClick={() => handlePageNumChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        $themeMode={themeMode}>
        &gt;
      </NavButton>
      <DropdownCustom
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        options={itemsPerPageOptions}
        themeMode={themeMode}
      />
      <ItemsPerPageText $themeMode={themeMode}>개씩 보기</ItemsPerPageText>
    </PaginationControls>
  </RightControls>
</EventControls>

      </ControlHeader>

        <TableContainer $themeMode={themeMode}>
          <GenericDataTable
            data={paginatedData}
            columns={columns}
            isLoading={false}
            error={null}
            onRowClick={handleRowClickInternal}
            onHeaderClick={handleHeaderClick}
            sortKey={sortKey}
            sortOrder={sortOrder}
            keyExtractor={internalKeyExtractor}
            themeMode={themeMode}
          />
        </TableContainer>
      {/* )} */}
    </Container>
  );
};

const GenericListUI = forwardRef(GenericListUIInner) as <T extends BaseRecord>(
  props: GenericListUIProps<T> & { ref?: React.Ref<{ refetch: () => void }> }
) => React.ReactElement;


export default GenericListUI;

// --- 스타일 컴포넌트 (레이아웃 관련 수정) ---



const Container = styled.div<{ $themeMode: ThemeMode }>`
  min-width: 1200px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px 30px 30px 30px; // 오른쪽 패딩 포함
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.background : THEME_COLORS.dark.background};
  color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.text};
`;



const TopHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 15px;
`;

const TitleContainer = styled.div`
  /* 제목 영역 스타일 (필요시 추가) */
`;

const ControlHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 0;
  gap: 20px;
`;

const APIControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const EventControls = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;


const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input<{ $themeMode: ThemeMode }>`
  width: 250px;
  height: 40px;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  border-right: none;
  border-radius: 4px 0 0 4px;

  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.inputText : THEME_COLORS.dark.inputText)};
  padding-left: 15px;
  padding-right: 35px;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.inputBackground : THEME_COLORS.dark.inputBackground};

  background-image: url("/icon_search.png");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 16px;

  &::placeholder {
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#AAAAAA" : "#888888")};
  }

  &:focus {
    outline: none;
    border-color: ${({ $themeMode }) =>
      $themeMode === "light" ? THEME_COLORS.light.primary : THEME_COLORS.dark.accent};
    background-image: url("/icon_search.png");
  }
`;

const SearchButton = styled.button<{ $themeMode: ThemeMode }>`
  width: 60px;
  height: 40px;
  margin-left: 10px;
  background: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.primary : THEME_COLORS.dark.buttonBackground};
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.buttonText : THEME_COLORS.dark.buttonText)};
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  border-left: none;
  border-radius: 0;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ListInfo = styled.div<{ $themeMode: ThemeMode }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-right: 10px;
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.text)};
  font-size: 14px;
`;



const ExcelButton = styled(ActionButton)`
  background: ${({ $themeMode }) => ($themeMode === "light" ? "#f8f8f8" : THEME_COLORS.dark.primary)};
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.primary : THEME_COLORS.dark.buttonText)};
  border: none;
  &:hover:not(:disabled) {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#e8e8e8" : "#424451")};
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Cnt = styled.div<{ $themeMode: ThemeMode }>`
  font-size: 14px;
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#555555" : THEME_COLORS.dark.text)};
  white-space: nowrap;
`;

const PageBox = styled.div<{ $themeMode: ThemeMode }>`
  margin: 0 5px;
  font-size: 14px;
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.text)};
  white-space: nowrap;
`;

const ItemsPerPageText = styled.p<{ $themeMode: ThemeMode }>`
  margin: 0;
  margin-left: 5px;
  font-size: 14px;
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#555555" : THEME_COLORS.dark.text)};
  white-space: nowrap;
`;

const TableContainer = styled.div<{ $themeMode: ThemeMode }>`
  width: 100%;
  min-width: 1000px;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  border-radius: 4px;
  background: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
  overflow: visible; /* 가로/세로 스크롤 방지 */

  @media (max-width: 1400px) {
    min-width: 1000px;
  }
`;


const LoadingContainer = styled.div<{ $themeMode: ThemeMode }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
`;

const LoadingSpinner = styled.div<{ $themeMode: ThemeMode }>`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.primary : THEME_COLORS.dark.accent)};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div<{ $themeMode: ThemeMode }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.tableBackground};
`;

const ErrorMessage = styled.p<{ $themeMode: ThemeMode }>`
  color: #d32f2f;
  font-size: 16px;
  text-align: center;
`;


const DateRangePickerContainer = styled.div`
  /* 특별한 스타일 불필요 */
`;

const TabsWrapper = styled.div`
  margin-top: 15px;
`;

const CMSTitle = styled.h1<{ $themeMode: ThemeMode }>`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0;
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.titleColor : THEME_COLORS.dark.titleColor)};
`;

const NavButton = styled.button<{ $themeMode: ThemeMode }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#FFFFFF" : THEME_COLORS.dark.secondary)};
  color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.text)};
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.8;
    border-color: ${({ $themeMode }) => ($themeMode === "light" ? "#999" : "#AAAAAA")};
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#f8f8f8" : "#424451")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${({ $themeMode }) => ($themeMode === "light" ? "#EEEEEE" : "#555555")};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#AAAAAA" : "#777777")};
  }
`;
