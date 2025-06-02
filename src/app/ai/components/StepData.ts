// src/app/ai/components/StepData.ts
// 다국어 지원을 위한 stepData 정의
import { aiChatDictionary } from '@/lib/i18n/aiChat';

// ChatDictionary 타입 정의
export type ChatDictionary =
  (typeof aiChatDictionary)[keyof typeof aiChatDictionary] & {
    // estimateModal 타입을 명시적으로 추가하거나, aiChatDictionary의 기본 타입에 포함되도록 해야 합니다.
    // 예시로 추가합니다. 실제 aiChatDictionary 구조에 맞게 조정 필요
    estimateModal?: {
      titlePlaceholder: string;
      description: string;
      confirmButton: string;
      cancelButton: string;
    };
    lang: 'ko' | 'en';
  };

// stepData를 함수로 정의하여 현재 언어에 맞는 데이터 반환
export const getStepData = (t: ChatDictionary) => [
  // Step 1: 플랫폼 선택 (Platform Selection)
  {
    id: 'platform',
    title: t.profileName,
    subtitle: `${
      t.lang === 'ko'
        ? `안녕하세요, AI 견적상담사 ${t.profileName}입니다.\n제작을 원하시는 플랫폼을 선택해주세요.`
        : `Hello, I'm ${t.profileName}, your AI consultant.\nPlease select the platform you want to develop.`
    }`,
    selectionTitle: t.chatQuestion.platformSelect,
    options: [
      { id: 'pc', label: 'PC Web' },
      { id: 'mobile', label: 'Mobile Web' },
      { id: 'AOS', label: 'AOS (Android)' },
      { id: 'IOS', label: 'IOS (iPhone)' },
      { id: 'Windows', label: 'Windows (PC)' },
    ],
    gridColumns: 5,
    selectionMode: 'multiple' as const,
    showWebAppComponent: false, // 이 단계에서는 WEB/APP 없음
    infoText: `${t.chatQuestion.info.accuracy}\n${t.chatQuestion.info.confirmation}`,
    progress: {
      title: t.progressBar.steps.platformSelect.title,
      description: t.progressBar.steps.platformSelect.description,
    },
  },
  // Step 2: 개발 분량 선택 (Development Volume)
  {
    id: 'volume',
    title: t.profileName,
    subtitle:
      t.lang === 'ko'
        ? '개발 분량을 선택해주세요.'
        : 'Please select the development volume.',
    selectionTitle: t.chatQuestion.pageSelect,
    options: [
      { id: 'lt5', label: t.lang === 'ko' ? '5장 미만' : 'Less than 5 pages' },
      {
        id: 'lt10',
        label: t.lang === 'ko' ? '10장 미만' : 'Less than 10 pages',
      },
      {
        id: 'lt20',
        label: t.lang === 'ko' ? '20장 미만' : 'Less than 20 pages',
      },
      {
        id: 'lt30',
        label: t.lang === 'ko' ? '30장 미만' : 'Less than 30 pages',
      },
      {
        id: 'lt40',
        label: t.lang === 'ko' ? '40장 미만' : 'Less than 40 pages',
      },
      {
        id: 'lt50',
        label: t.lang === 'ko' ? '50장 미만' : 'Less than 50 pages',
      },
      {
        id: 'lt70',
        label: t.lang === 'ko' ? '70장 미만' : 'Less than 70 pages',
      },
      {
        id: 'lt90',
        label: t.lang === 'ko' ? '90장 미만' : 'Less than 90 pages',
      },
      {
        id: 'gt100',
        label: t.lang === 'ko' ? '100장 이상' : '100 pages or more',
      },
    ],
    gridColumns: 3,
    selectionMode: 'single' as const,
    showWebAppComponent: false, // 이 단계에서는 WEB/APP 없음
    infoText: `${t.chatQuestion.info.pageCount}\n${t.chatQuestion.info.estimatedCount}`,
    progress: {
      title: t.progressBar.steps.volumeSelect.title,
      description: t.progressBar.steps.volumeSelect.description,
    },
  },
  // Step 3: 개발 카테고리 선택 (Development Category)
  {
    id: 'category',
    title: t.profileName,
    subtitle:
      t.lang === 'ko'
        ? '개발 카테고리를 선택해주세요.'
        : 'Please select the development category.',
    selectionTitle: t.chatQuestion.categorySelect,
    options: [
      {
        id: 'travel',
        label: t.lang === 'ko' ? '여행/교통' : 'Travel/Transport',
      },
      { id: 'iot', label: 'IoT' + (t.lang === 'ko' ? '앱' : ' App') },
      { id: 'health', label: t.lang === 'ko' ? '건강/의료' : 'Health/Medical' },
      { id: 'finance', label: t.lang === 'ko' ? '금융/펀드' : 'Finance/Fund' },
      { id: 'food', label: t.lang === 'ko' ? '식음료' : 'Food & Beverage' },
      { id: 'community', label: t.lang === 'ko' ? '커뮤니티' : 'Community' },
      {
        id: 'shopping',
        label: t.lang === 'ko' ? '쇼핑(의류)' : 'Shopping(Clothing)',
      },
      {
        id: 'reverse_auction',
        label: t.lang === 'ko' ? '역경매' : 'Reverse Auction',
      },
      {
        id: 'used_trade',
        label: t.lang === 'ko' ? '중고거래' : 'Used Trading',
      },
      { id: 'o2o', label: 'O2O' },
      { id: 'solution', label: t.lang === 'ko' ? '솔루션' : 'Solution' },
      { id: 'platform', label: t.lang === 'ko' ? '플랫폼' : 'Platform' },
      { id: 'erp', label: t.lang === 'ko' ? '전산' : 'ERP System' },
      {
        id: 'manufacturing',
        label: t.lang === 'ko' ? '제조' : 'Manufacturing',
      },
      { id: 'drone', label: t.lang === 'ko' ? '드론' : 'Drone' },
      { id: 'quote_sys', label: t.lang === 'ko' ? '견적Sys' : 'Quote System' },
      { id: 'ai', label: 'AI' },
      { id: 'etc', label: t.lang === 'ko' ? '기타' : 'Others' },
    ],
    gridColumns: 3,
    selectionMode: 'single' as const,
    showWebAppComponent: false, // 필요시 true로 변경하여 WEB/APP 섹션 표시 가능
    infoText: t.chatQuestion.info.similarCategory,
    progress: {
      title: t.progressBar.steps.categorySelect.title,
      description: t.progressBar.steps.categorySelect.description,
    },
  },
];
