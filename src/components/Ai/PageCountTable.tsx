import styled from 'styled-components';
import { AppColors } from '@/styles/colors'; // AppColors 경로가 맞는지 확인 필요

interface PageCountTableProps {
  isMobile: boolean;
}

const TableContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem; // OptionsGrid 와의 간격과 유사하게 설정
  border: 1px solid #4e4e53;
  border-radius: 0.375rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #08080f; // 사용자 요청 배경색 유지
  border: 1px solid #4e4e53;
  border-radius: 0.375rem; // 전체 테이블에 대한 radius
  overflow: hidden; // radius 적용을 위해 추가
`;

const TableHead = styled.thead`
  background-color: #2a2a3a;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #4e4e53;
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th<{ width?: string }>`
  padding: 0.75rem 0.75rem; // 사용자 요청 패딩 유지
  text-align: left;
  color: ${AppColors.onBackground};
  font-weight: 600;
  border-right: 1px solid #4e4e53;
  width: ${(props) => props.width || 'auto'};
  &:last-child {
    border-right: none;
  }
`;

const TableCell = styled.td<{ width?: string }>`
  padding: 0.5rem 0.75rem;
  text-align: left;
  color: ${AppColors.onBackground};
  font-weight: 300;
  border-right: 1px solid #4e4e53;
  width: ${(props) => props.width || 'auto'};
  &:last-child {
    border-right: none;
  }
  // 모바일 환경에서 줄바꿈을 위해 white-space 추가
  white-space: pre-wrap;
`;

const tableData = [
  {
    pages: '5장',
    description: '간단한 랜딩페이지또는 소개형 회사 홈페이지',
  },
  { pages: '30장', description: '모바일 기반 일반 서비스플랫폼 수준' },
  { pages: '50장', description: 'PC 기반 전용 웹 솔루션(내부 업무용 등)' },
  {
    pages: '100장',
    description: '쇼핑몰, ERP 등 복합 기능포함 대형 시스템',
  },
];

// 모바일일 때 설명 문구 줄바꿈 처리 함수
const formatDescription = (description: string, isMobile: boolean) => {
  if (isMobile) {
    return description
      .replace(/페이지/g, '페이지<br />')
      .replace(/서비스/g, '서비스<br />')
      .replace(/솔루션/g, '솔루션<br />')
      .replace(/복합 기능/g, '복합 기능<br />');
  }
  return description;
};

export const PageCountTable: React.FC<PageCountTableProps> = ({ isMobile }) => {
  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell width="25%">페이지 수</TableHeaderCell>
            <TableHeaderCell width="75%">
              설명 문구 (관리자 Page 수 포함)
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell width="25%">{row.pages}</TableCell>
              <TableCell
                width="75%"
                dangerouslySetInnerHTML={{
                  __html: formatDescription(row.description, isMobile),
                }}
              />
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default PageCountTable;
