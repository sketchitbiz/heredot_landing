// src/lib/i18n/aiChat.ts
// AI 채팅 컴포넌트 관련 다국어 지원을 위한 번역 사전

export const aiChatDictionary = {
  ko: {
    profileName: '강유하',
    pageTitle: 'AI 견적상담',
    invoiceTitle: '프로젝트 견적',
    tableHeaders: {
      category: '구분',
      item: '항목',
      detail: '세부 내용',
      amount: '예상 금액',
      management: '관리',
    },
    buttons: {
      delete: '삭제',
      cancel: '취소',
      select: '선택',
      downloadPdf: 'PDF 견적서 다운',
      previous: '이전',
      next: '다음',
      login: '로그인',
      logout: '로그아웃',
      edit: '수정',
      search: '검색',
      estimate: '견적 요청',
    },
    estimateInfo: {
      totalSum: '총 합계',
      totalDuration: '총 예상 기간',
      totalPages: '총 예상 페이지 수',
      day: '일',
      page: '페이지',
      note: '참고',
      estimatedDuration: '예상 기간',
      estimatedPages: '예상 페이지',
    },
    discount: {
      title: '견적가 할인받기',
      description: '견적가의 할인을 원하시면 다음 옵션을 선택할 수 있습니다:',
      options: [
        '1. 개발 기간 8주 연장하고 20% 할인받기',
        '2. 핵심 보조 기능 일부 제거하고 할인받기 (AI가 제거할 기능을 제안합니다)',
      ],
    },
    pdf: {
      title: 'PDF로 저장',
    },
    loading: '페이지 로딩 중...',
    status: {
      generating: 'AI 응답을 생성 중입니다...',
      error: '오류:',
    },
    dragDrop: '파일을 여기에 놓으세요',
    fileSupport: {
      title: '다음과 같은 기능도 지원됩니다.',
      url: 'URL: 네이버, 다음 등 원하는 사이트 링크',
      urlExample: 'www.naver.com 같은 사이트를 만들고 싶어요',
      image: '이미지: 캡처, JPG 등 이미지 파일',
      pdf: 'PDF: 스토리보드 (설계/기획안) 등',
      unsupported: '(※ 파워포인트, 엑셀 파일은 첨부 불가)',
      message:
        '첨부와 함께 원하시는 내용을 설명해주시면 AI가 맞춤 견적을 제시해드립니다 😊',
    },
    input: {
      placeholder: 'AI 견적상담사에게 문의하기...',
    },

    // AiChatQuestion 컴포넌트 관련 번역
    chatQuestion: {
      platformSelect: '플랫폼 선택 (중복 가능)',
      pageSelect: '페이지 수 선택 (단일 선택)',
      categorySelect: '카테고리 선택 (단일 선택)',
      info: {
        accuracy: '• AI 견적서는 90%의 정확도를 가지고 있습니다.',
        confirmation: "• 확정 견적 문의는 '여기닷'으로 견적요청 바랍니다.",
        pageCount: '• 기획서 또는 화면 설계서 기준 페이지 수 입니다.',
        estimatedCount:
          '• 정확한 페이지 수를 모를 경우 예상 페이지 수를 선택해주세요.',
        similarCategory:
          '• 제작하려는 서비스와 가장 유사한 카테고리를 선택해주세요.',
      },
    },

    // AiNavigationBar 컴포넌트 관련 번역
    navigation: {
      login: {
        required: '로그인 필요',
        benefits: '로그인 시,\n저장된 대화기록을\n불러올 수 있습니다.',
      },
      period: {
        today: '오늘',
        lastWeek: '일주일 전',
        month: '3월',
      },
      estimate: '여기닷에게',
    },

    // AiProgressBar 컴포넌트 관련 번역
    progressBar: {
      steps: {
        platformSelect: {
          title: '개발 항목 선택',
          description: 'PC, 모바일 등\n개발 환경 선택',
        },
        volumeSelect: {
          title: '개발 분량 선택',
          description: '디자인 또는 기획서 기준\n페이지 수 선택',
        },
        categorySelect: {
          title: '개발 카테고리 선택',
          description: '세부 기능 또는\n산업군 선택',
        },
      },
    },
  },
  en: {
    profileName: 'AI Agent',
    pageTitle: 'AI Estimate Consultation',
    invoiceTitle: 'Project Estimate',
    tableHeaders: {
      category: 'Category',
      item: 'Item',
      detail: 'Details',
      amount: 'Estimated Cost',
      management: 'Manage',
    },
    buttons: {
      delete: 'Delete',
      cancel: 'Cancel',
      select: 'Select',
      downloadPdf: 'Download PDF Estimate',
      previous: 'Previous',
      next: 'Next',
      login: 'Login',
      logout: 'Logout',
      edit: 'Edit',
      search: 'Search',
      estimate: 'Request Estimate',
    },
    estimateInfo: {
      totalSum: 'Total Sum',
      totalDuration: 'Total Estimated Duration',
      totalPages: 'Total Estimated Pages',
      day: 'days',
      page: 'pages',
      note: 'Note',
      estimatedDuration: 'Estimated Duration',
      estimatedPages: 'Estimated Pages',
    },
    discount: {
      title: 'Get a Discount on the Estimate',
      description:
        'If you want a discount on the estimate, you can choose from the following options:',
      options: [
        '1. Extend development period by 8 weeks for a 20% discount',
        '2. Remove some non-essential features for a discount (AI will suggest features to remove)',
      ],
    },
    pdf: {
      title: 'Save as PDF',
    },
    loading: 'Loading page...',
    status: {
      generating: 'Generating AI response...',
      error: 'Error:',
    },
    dragDrop: 'Drop files here',
    fileSupport: {
      title: 'The following features are also supported:',
      url: 'URL: Reference websites like Google, etc.',
      urlExample: "I'd like to create a site like www.google.com",
      image: 'Images: Screenshots, JPG files, etc.',
      pdf: 'PDF: Storyboards, design plans, etc.',
      unsupported: '(※ PowerPoint and Excel files are not supported)',
      message:
        'Describe what you need along with attachments, and the AI will provide a customized estimate 😊',
    },
    input: {
      placeholder: 'Ask the AI consultant...',
    },

    // AiChatQuestion 컴포넌트 관련 번역
    chatQuestion: {
      platformSelect: 'Platform Selection (Multiple)',
      pageSelect: 'Page Count Selection (Single)',
      categorySelect: 'Category Selection (Single)',
      info: {
        accuracy: '• AI estimates have 90% accuracy.',
        confirmation:
          '• For confirmed quotes, please contact HereDot directly.',
        pageCount: '• Page count is based on planning or wireframe documents.',
        estimatedCount:
          "• If you're unsure of exact pages, select an estimated count.",
        similarCategory:
          '• Please select the category most similar to your service.',
      },
    },

    // AiNavigationBar 컴포넌트 관련 번역
    navigation: {
      login: {
        required: 'Login',
        benefits: 'After login,\nyou can access your\nsaved conversations.',
      },
      period: {
        today: 'Today',
        lastWeek: 'Last Week',
        month: 'March',
      },
      estimate: 'To HereDot',
    },

    // AiProgressBar 컴포넌트 관련 번역
    progressBar: {
      steps: {
        platformSelect: {
          title: 'Development Platform',
          description: 'PC, mobile, etc.\nSelect environment',
        },
        volumeSelect: {
          title: 'Development Volume',
          description: 'Based on design or plan\nSelect page count',
        },
        categorySelect: {
          title: 'Development Category',
          description: 'Detailed features or\nindustry selection',
        },
      },
    },
  },
};
