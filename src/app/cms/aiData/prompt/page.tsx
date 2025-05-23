'use client';
import React, { useCallback, useMemo, useRef, useState } from 'react'; // useRef 추가

import GenericListUI, {
  FetchParams,
  FetchResult,
} from '@/components/CustomList/GenericListUI';
import { ColumnDefinition } from '@/components/CustomList/GenericDataTable';
import { promptGetList } from '@/lib/api/admin/adminApi';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { THEME_COLORS } from '@/styles/theme_colors';
import ActionButton from '@/components/ActionButton';
import CmsPopup from '@/components/CmsPopup';
import { TextField } from '@/components/TextField';
import SelectionField from '@/components/selectionField';
import { AppColors } from '@/styles/colors';
import { Validators } from '@/lib/utils/validators';
import { toast, ToastContainer } from 'react-toastify';
import { adminCreate } from '@/lib/api/admin';
import Switch from '@/components/Switch';
import { SwitchInput } from '@/components/SwitchInput';
import { devLog } from '@/lib/utils/devLogger';
import SimpleGenericList from '@/components/CustomList/\bSimpleGenericList';
import PromptPopup from './popup';

type Prompt = {
  index: number;
  key: string;
  category: string;
  label: string;
  description: string;
  descricreatedIdption: string;
  content: string;
  updateId: string;
  createdTime: string | null;
  updateTime: string | null;
};

const PopupFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const FooterButton = styled.button`
  width: 120px;
  height: 48px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  border: none;
`;

const CancelButton = styled(FooterButton)`
  background-color: #ffffff;
  color: ${AppColors.onSurface};
  border: 1px solid ${AppColors.border};
`;

const SaveButton = styled(FooterButton)`
  background-color: ${AppColors.primary};
  color: ${AppColors.onPrimary};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 22px;
  justify-content: space-evenly;
`;

const RegisterButton = styled(ActionButton)<{ $themeMode: 'light' | 'dark' }>`
  background: ${({ $themeMode }) =>
    $themeMode === 'light'
      ? THEME_COLORS.light.primary
      : THEME_COLORS.dark.buttonText};
  color: ${({ $themeMode }) =>
    $themeMode === 'light' ? '#f8f8f8' : THEME_COLORS.dark.primary};
  border: none;
  &:hover:not(:disabled) {
    background-color: ${({ $themeMode }) =>
      $themeMode === 'light' ? '#e8e8e8' : '#424451'};
  }
`;

// const SwitchButton = styled.div<{ checked: boolean; readOnly?: boolean }>`
//   display: inline-block;
//   margin: 0 auto;
//   width: 40px;
//   height: 20px;
//   background-color: ${({ checked }) => (checked ? '#4EFF63' : '#D2D3D7')};
//   border-radius: 20px;
//   position: relative;
//   cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};
//   transition: background-color 0.3s;
//   &::before {
//     content: '';
//     position: absolute;
//     top: 2px;
//     left: ${({ checked }) => (checked ? '20px' : '2px')};
//     width: 16px;
//     height: 16px;
//     background-color: white;
//     border-radius: 50%;
//     transition: left 0.3s;
//   }
// `;

const PromptPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Partial<Prompt> | null>(
    null
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const listRef = useRef<{ refetch: () => void }>(null);


  const handleHeaderButtonClick = () => {
    setIsPopupOpen(true);
  };

  const handleRowClick = (item: Prompt) => {
    setSelectedItem(item); // index 저장
    setIsPopupOpen(true);
  };
  

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  const fetchData = useCallback(
    async (params: FetchParams): Promise<FetchResult<Prompt>> => {
      const raw = await promptGetList({ keyword: params.keyword ?? '' });
      const wrapper = raw?.[0];
      const data = wrapper?.data ?? [];
      const totalItems = wrapper?.metadata?.totalCnt ?? data.length;
      const allItems = wrapper?.metadata?.allCnt ?? totalItems;
      return { data, totalItems, allItems };
    },
    []
  );


  const columns: ColumnDefinition<Prompt>[] = useMemo(
    () => [
      { header: 'No', accessor: 'no' },
      {
        header: '최종수정일',
        accessor: 'updateTime',
        formatter: (value) => (value ? dayjs(value).format('YYYY-MM-DD') : '-'),
      },
      {
        header: '최종수정자',
        accessor: 'updateId',
      },
      {
        header: '작성자',
        accessor: 'createdId',
      },
      {
        header: '카테고리',
        accessor: 'category',
        sortable: true,
        formatter: (value) => value ?? '-',
      },
      {
        header: '프롬프트명항목',
        accessor: 'label',
        sortable: true,
        formatter: (value) => value ?? '-',
      },
      {
        header: '프롬프트설명설명',
        accessor: 'description',
        sortable: true,
        formatter: (value) => value ?? '-',
      },
    ],
    []
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 10000 }}
      ></ToastContainer>
      <GenericListUI<Prompt>
        ref={listRef}
        title="AI 프롬프트 관리"
        excelFileName="PromptList"
        columns={columns}
        fetchData={fetchData}
        enableSearch
        enableDateFilter={false}
        searchPlaceholder="프롬프트 검색"
        onRowClick={handleRowClick}
        themeMode="light"
      />

<PromptPopup
  index={selectedItem?.index ? Number(selectedItem.index) : 0}
  isOpen={isPopupOpen}
  onClose={closePopup}
  firstCreatedTime={
    selectedItem?.createdTime
      ? dayjs(selectedItem.createdTime).format('YYYY-MM-DD')
      : ''
  }
  firstContent={
    selectedItem?.content ?? ''
  }
/>

    </>
  );
};

export default PromptPage;
