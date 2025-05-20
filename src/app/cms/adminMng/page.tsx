'use client';
import React, { useCallback, useMemo, useRef, useState } from 'react'; // useRef 추가

import GenericListUI, { FetchParams, FetchResult } from '@/components/CustomList/GenericListUI';
import { ColumnDefinition } from '@/components/CustomList/GenericDataTable';
import { adminGetList } from '@/lib/api/admin/adminApi';
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

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
`;

const SwitchLabel = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;



type AdminUser = {
  adminId: string;
  name: string;
  email: string;
  cellphone: string;
  lastLoginTime: string | null;
  createdTime: string | null;
  emailYn: 'Y' | 'N';
  smsYn: 'Y' | 'N';
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
  background: ${({ $themeMode }) => ($themeMode === 'light' ? THEME_COLORS.light.primary : THEME_COLORS.dark.buttonText)};
  color: ${({ $themeMode }) => ($themeMode === 'light' ? '#f8f8f8' : THEME_COLORS.dark.primary)};
  border: none;
  &:hover:not(:disabled) {
    background-color: ${({ $themeMode }) => ($themeMode === 'light' ? '#e8e8e8' : '#424451')};
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

const AdminMngPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Partial<AdminUser> | null>(null);

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [emailYn, setEmailYn] = useState<'Y' | 'N'>('Y');
  const [smsYn, setSmsYn] = useState<'Y' | 'N'>('Y');
  const [description, setDescription] = useState('');

  const [idError, setIdError] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [cellphoneError, setCellphoneError] = useState<string | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const listRef = useRef<{ refetch: () => void }>(null);


  const clearFormErrors = useCallback(() => {
    setIdError(null);
    setPwdError(null);
    setNameError(null);
    setEmailError(null);
    setCellphoneError(null);
  }, []);

  const resetForm = useCallback((initial?: Partial<AdminUser>) => {
    setSelectedUser(initial ?? null);
    setUserId(initial?.adminId ?? '');
    setPassword('');
    setName(initial?.name ?? '');
    setEmail(initial?.email ?? '');
    setCellphone(initial?.cellphone ?? '');
    setEmailYn(initial?.emailYn ?? 'Y');
    setSmsYn(initial?.smsYn ?? 'Y');
    clearFormErrors();
  }, [clearFormErrors]);

  const handleHeaderButtonClick = () => {
    resetForm(); // 신규 등록
    setIsPopupOpen(true);
  };

  const handleRowClick = (item: AdminUser) => {
    resetForm(item); // 수정
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSave = async () => {
    let valid = true;
  
    if (!Validators.required(userId) || !Validators.id(userId)) {
      setIdError('아이디는 영문자와 숫자를 포함한 6~20자여야 합니다.');
      valid = false;
    } else setIdError(null);
  
    if (!Validators.password(password)) {
      setPwdError('비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.');
      valid = false;
    } else setPwdError(null);
  
    if (!Validators.required(name)) {
      setNameError('이름을 입력해주세요.');
      valid = false;
    } else setNameError(null);
  
    if (!Validators.email(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      valid = false;
    } else setEmailError(null);
  
    if (!Validators.phone(cellphone)) {
      setCellphoneError('연락처는 숫자 11자리여야 합니다.');
      valid = false;
    } else setCellphoneError(null);
  
    if (!valid) return;
  
    try {
      const response = await adminCreate({
        adminId: userId,
        password,
        name,
        cellphone,
        description,
        email,
        emailYn,
        smsYn,
      });
  
      // 성공 메시지 확인
      if (response?.[0]?.message === 'success') {
        toast.success('관리자가 성공적으로 등록되었습니다.');
        setIsPopupOpen(false); // 팝업 닫기
        listRef.current?.refetch(); // 목록 리프레시
      } else {
        toast.error(response?.[0]?.message || '관리자 등록에 실패했습니다.');
      }
    } catch (error: any) {
      toast.error(error?.message || '관리자 등록에 실패했습니다.');
    }
  };
  

  const fetchData = useCallback(async (params: FetchParams): Promise<FetchResult<AdminUser>> => {
    const raw = await adminGetList({ keyword: params.keyword ?? '' });
    const wrapper = raw?.[0];
    const data = wrapper?.data ?? [];
    const totalItems = wrapper?.metadata?.totalCnt ?? data.length;
    const allItems = wrapper?.metadata?.allCnt ?? totalItems;
    return { data, totalItems, allItems };
  }, []);

  const handleDropdownChange = useCallback(
    (adminId: string, type: 'emailYn' | 'smsYn', newValue: 'Y' | 'N') => {
      console.log(`Changed ${type} for ${adminId} to ${newValue}`);
    },
    []
  );
  

  const columns: ColumnDefinition<AdminUser>[] = useMemo(
    () => [
      { header: 'No', accessor: 'no' },
      {
        header: '가입일',
        accessor: 'createdTime',
        sortable: true,
        formatter: (value) => value ? dayjs(value).format('YYYY-MM-DD') : '-',
      },
      {
        header: '최근접속',
        accessor: 'lastLoginTime',
        sortable: true,
        formatter: (value) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-',
      },
      { header: '이름', accessor: 'name' },
      { header: '아이디', accessor: 'adminId' },
      { header: '이메일', accessor: 'email' },
      { header: '전화번호', accessor: 'cellphone' },
      {
        header: 'SMS 수신',
        accessor: 'smsYn',
        formatter: (_value, row) => (
          <Switch
            checked={row.smsYn === 'Y'}
            onToggle={() =>
              handleDropdownChange(row.adminId, 'smsYn', row.smsYn === 'Y' ? 'N' : 'Y')
            }
          />
        ),
      },
      {
        header: '메일 수신',
        accessor: 'emailYn',
        formatter: (_value, row) => (
          <Switch
            checked={row.emailYn === 'Y'}
            onToggle={() =>
              handleDropdownChange(row.adminId, 'emailYn', row.emailYn === 'Y' ? 'N' : 'Y')
            }
          />
        ),
      },
      { header: '비고', accessor: 'description' },
   

    ],
    [handleDropdownChange]
  );

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
  ></ToastContainer>
      <GenericListUI<AdminUser>
        ref={listRef}
        title="관리자회원관리"
        excelFileName="AdminList"
        columns={columns}
        fetchData={fetchData}
        enableSearch
        enableDateFilter={false}
        searchPlaceholder="이름, 이메일, 아이디 검색"
        onRowClick={handleRowClick}
        themeMode="light"
        renderHeaderActionButton={() => (
          <RegisterButton $themeMode="light" onClick={handleHeaderButtonClick}>
            관리자 등록
          </RegisterButton>
        )}
      />

      <CmsPopup  title='관리자등록' isOpen={isPopupOpen} onClose={closePopup}>
        <FormContainer>
          <TextField radius='0' value={userId} label="* 아이디" autoComplete='off' $labelPosition="horizontal" labelColor="black" onChange={(e) => setUserId(e.target.value)} placeholder="영문자와 숫자를 포함한 6~20자" errorMessage={idError ?? undefined} />
          <TextField radius='0' value={password} showSuffixIcon = {true} label="* 비밀번호"  autoComplete="new-password" $labelPosition="horizontal" labelColor="black" onChange={(e) => setPassword(e.target.value)} placeholder="영문 + 숫자 + 특수문자 1개 포함 8자리 이상" isPasswordField ={true} errorMessage={pwdError ?? undefined} />
          <TextField radius='0' value={name} label="* 이름" $labelPosition="horizontal" labelColor="black" onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" errorMessage={nameError ?? undefined} />
          <TextField radius='0' value={email} label="* 이메일" $labelPosition="horizontal" labelColor="black" onChange={(e) => setEmail(e.target.value)} placeholder="이메일 형식으로 입력하세요" errorMessage={emailError ?? undefined} />
          <TextField
          radius='0'
  value={cellphone}
  label="* 연락처"
  $labelPosition="horizontal"
  labelColor="black"
  onChange={(e) => {
    const input = e.target.value;
    // 숫자만 허용
    if (/^\d*$/.test(input)) {
      setCellphone(input);
    }
  }}
  placeholder="- 제외 하고 입력하세요"
  errorMessage={cellphoneError ?? undefined}
/>
      
<SwitchInput
  label="이메일 수신"
  value={emailYn}
  onChange={setEmailYn}
  $labelPosition="horizontal"
  labelColor="black"
/>

<SwitchInput
  label="SMS 수신"
  value={smsYn}
  onChange={setSmsYn}
  $labelPosition="horizontal"
  labelColor="black"
/>

          <TextField
          radius='0'
  multiline
  minLines={4}
  maxLines={10}
  height="200px"
  value={description}
  label="비고"
  $labelPosition="horizontal"
  labelColor="black"
  onChange={(e) => setDescription(e.target.value)}
  placeholder="비고를 입력하세요"
/>

          <PopupFooter>
            <CancelButton onClick={closePopup}>닫기</CancelButton>
            <SaveButton onClick={handleSave}>저장</SaveButton>
          </PopupFooter>
        </FormContainer>
      </CmsPopup>
    </>
  );
};

export default AdminMngPage;
