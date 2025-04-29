export const dictionary = {
  ko: {
    departure: '출발',
    arrival: '도착',
    nav: ['핵심강점', '포트폴리오', '팀원소개', '기획전', 'AI 견적'],
    customNavigator: {
      review: '고객후기',
      event: '기획전',
      contact: '연락',
    },
    headerTitle: '출발과 도착의 여정',
    headerSubtitle: '여기닷에서',
    download: '기업 소개서',
    firstMap: {
      label: '전략 파트너', // ✅ 추가
    },
    secondMap: {
    label: '여기닷',
    },
    portfolio: {
      title: "여기닷에서 만든 대표 프로젝트!",
      description: "다양한 산업과 분야에서 성과를 이끌어낸 프로젝트 소개해요!",
    },
    portfolioCards: {
      "1": "안티드론 솔루션",
      "2": "명품 역경매",
      "3": "링구 - 링크간편구독",
      "4": "테이블오더",
      "5": "엑시토",
      "6": "윌체어",
      "7": "FMG - 골프홀인원",
      "8": "동네친구들 - 야식레이드",
      "9": "엉따 - IoT",
      "10": "로켓업 - 지원사업 컨설팅",
      "11": "식자재발주시스템",
      "12": "2차전지관제솔루션",
    },
    partner: {
      title1: '여기닷은',
      title2: '창업자의 전략 파트너입니다',
      subtitle: '여기닷은 고객사의 사업 전반적인 내용을 이해하고 시장에 조기 안착할 수 있도록 다양한 사업을 제안합니다.',
      tabs: ['안티드론', '명품역경매', '무역플랫폼', '테이블오더'],
      slides: [
        {
          title: '안티드론 솔루션',
          image: '/assets/partner_1.png',
          subtitle: '글로벌 세일즈 관련 수행 방안 제안',
          description: '고객사가 엔지니어 중심 조직 구조인 점을 고려하여,<br /> 제품 런칭 이후 기술 외에도 세일즈 관점에서의 사업 전략을 제안',
        },
        {
          title: '명품 역경매',
          image: '/assets/partner_2.png',
          subtitle: 'AI를 활용한 시세 조회 방안 제안',
          description: '제품 촬영한 이미지를 AI를 통해 식별 및 인식 하여<br /> 시세를 예측하여 고객 유입 활성 방안 제안',
        },
        {
          title: '무역플랫폼',
          image: '/assets/partner_3.png',
          subtitle: '복잡한 프로세스 No! 절차 개선 제안',
          description: '무역업 특성상 많은 이해 관계자들이 협업 해야 되는 구조를<br /> 정확하게 인지 및 각 구간별 불필요 절차 개선 방안 제안',
        },
        {
          title: '테이블오더',
          image: '/assets/partner_4.png',
          subtitle: '테이블오더 시장 안착 전략 제안',
          description: '시중에 나와 있는 테이블 오더 제품과의 경쟁에서 살아 남기 위한<br /> 고객사만의 기능과 사업전략을 이해하고 프로젝트 킥오프 제안',
        },
      ],
      downloadText: '사업제안서 다운로드',
    },
    consulting: {
      title: `여기닷은 "기능·설계·비용"\n최적화 목적으로 활용합니다`, // ✅ 줄바꿈은 \n
      descriptions: [
        '1. 견적 단계에서 분량 및 기능정리',
        '2. IT서비스 최적 설계 지원',
        '3. 일정관리 (WBS)로 활용해요',
      ],
      downloadText: '기능명세 다운로드',
      gridHeaders: ['항목', '고객요구사항', '여기닷 제안', '효과'],
      gridContents: [
        ['로그인', '보안강화목적<br /> USB로 로그인', '구글 OTP<br /> 2Factor 인증', '기존 윈도우 Only<br /> 접속 기기 다변화 수용'],
        ['핵심/편의기능<br /> 구분', '한정된 예산 내<br /> 전체 기능 요구', '핵심/편의 기능 분리<br /> 단계별 개발 가이드', '예산에 맞춘<br /> 사업성장 최적화 지원'],
        ['개인정보수집', '모든 정보 수집', '개인정보법, 정보통신법 안내<br /> 법적기준 개발 가이드', '준법 RISK 최소화'],
      ],
    },
    membersSection: {
      title: "일감을 주세요!",
      description: "아래 버튼을 클릭하여 직원들에게 일을 맡겨보아요!",
    },
    memberTabs: ["채팅 앱", "스트리밍 웹", "구독 플랫폼", "점심시간"],
    memberCards: {
      "1": {
        name: "개발자 Liam",
        messages: {
          "채팅 앱": "푸시는 앱 상태마다 다르게요",
          "스트리밍 웹": null,
          "구독 플랫폼": "등록이죠?\n 인증은 안 하나요?",
          "점심시간": "배고파서 코드 안 짜짐",
        },
      },
      "2": {
        name: "CEO Martin",
        messages: {
          "채팅 앱": "채팅앱 계약됐어요!",
          "스트리밍 웹": "유튜브처럼 만들어 주세요!",
          "구독 플랫폼": "구독 결제 서비스 계약됐어요!",
          "점심시간": "밥 먹고 합시다.",
        },
      },
      "3": {
        name: "이사 Max",
        messages: {
          "채팅 앱": null,
          "스트리밍 웹": null,
          "구독 플랫폼": null,
          "점심시간": "영수증 챙기셨어요?",
        },
      },
      "4": {
        name: "기획자 K",
        messages: {
          "채팅 앱": "1:N이면\n 부방장 기능도 필요하죠.",
          "스트리밍 웹": null,
          "구독 플랫폼": "잔액 부족 시 재결제는요?",
          "점심시간": "요구사항? 일단 고기",
        },
      },
      "5": {
        name: "개발자 Dony",
        messages: {
          "채팅 앱": null,
          "스트리밍 웹": "버퍼링 구현 방식도\n 정해야죠.",
          "구독 플랫폼": null,
          "점심시간": "꼬르륵...",
        },
      },
      "6": {
        name: "개발자 Day",
        messages: {
          "채팅 앱": "트래픽 과금\n 미리 조율해야 해요.",
          "스트리밍 웹": "용량 부족하면\n 가용성 문제 생겨요.",
          "구독 플랫폼": "PG사 먼저 확인 필요해요.",
          "점심시간": "API보다 급한 건 칼국수",
        },
      },
      "7": {
        name: "디자이너 Sien",
        messages: {
          "채팅 앱": null,
          "스트리밍 웹": "화질 자동 전환 고려하셨어요?",
          "구독 플랫폼": null,
          "점심시간": "햄버거 버튼 말고 햄버거 줘요",
        },
      },
      "9": {
        name: "개발자 Jaxon",
        messages: {
          "채팅 앱": "help...",
          "스트리밍 웹": null,
          "구독 플랫폼": "I debug, therefore I am.",
          "점심시간": "503 Service Unavailable (No Lunch)",
        },
      },
    },
    bannerSection: {
      title: "특별 프로모션 지금 바로 클릭!",
      description: "선착순으로 제공되는 상품으로 조기 종료될 수 있습니다.",
    },
    
    design: {
      tabs: ['레퍼런스 조사', '트렌드 파악', '컬러제안', 'UI/UX 제안', '고객의사결정'],
      tabNumbers: ['01', '02', '03', '04', '05'],
      title: '여기닷은 모든 프로젝트에\n 디자인 전략을 제안합니다',
      slides: [
        { title: '시장/레퍼런스 조사', image: '/assets/design/design_1.png' },
        { title: '트렌드 파악', image: '/assets/design/design_2.png' },
        { title: '컬러제안', image: '/assets/design/design_3.png' },
        { title: 'UI/UX 제안', image: '/assets/design/design_4.png' },
        { title: '고객의사결정', image: '/assets/design/design_5.png' },
      ],
    },
    reviewSection: {
      title: "사업가들이 말하는 여기닷",
      description: "대표님들은 '여기닷'을 이렇게 기억합니다.",
    },
    appBlock: {
      title: `여기닷은 레고 디자인 시스템으로\n차곡차곡 쌓아 빠르고 안정적으로 개발합니다.`,
      description: `화면을 작은 단위부터 체계적으로 설계해\n디자인과 개발을 일관된 구조로 개발하며,\n완성도는 물론 추후 코드 이관과 유지보수도 간편합니다.`,
    },
    contactSection: {
      emailTitle: '이메일 문의',
      emailInfo: 'heredot83@heredotcorp.com',
      emailButton: '메일 보내기',
      phoneTitle: '전화 문의',
      phoneInfo: '031-8039-7981',
      phoneButton: '전화 연결',
      kakaoTitle: '카카오톡 채팅 상담',
      kakaoInfo: 'Kakao',
      kakaoLink: 'https://open.kakao.com/o/smVyiMig', // 실제 오픈채팅 링크
      kakaoButton: '채팅방 연결',
    },
    footer: {
      companyName: '상호명 : 주식회사 여기닷',
      ceo: '대표자명 : 강태원',
      businessNumber: '사업자등록번호 : 289-86-03278',
      address: '사업장주소 : 경기 성남시 수정구 대왕판교로 815 777호 (주) 여기닷',
      customerService: '고객센터 : 031-8039-7981',
      copyright: 'Copyright ⓒ 2025 여기닷 All right reserved.',
    },
  },
  en: {
    departure: 'Departure',
    arrival: 'Arrival',
    nav: ['Key Value', 'Portfolio', 'Team', 'Market', 'AI Estimate'],
    customNavigator: {
      review: 'Reviews',
      event: 'Events',
      contact: 'Contact',
    },
    portfolio: {
      title: "Top Projects by HereDot!",
      description: "Introducing projects that led success across various industries!",
    },
    portfolioCards: {
      "1": "Anti-Drone Solution",
      "2": "Luxury Reverse Auction",
      "3": "Ring9 - Easy Subscription",
      "4": "Table Order System",
      "5": "Exito",
      "6": "Wheelchair Platform",
      "7": "FMG - Golf Hole-in-One",
      "8": "Dongne Friends - Night Raid",
      "9": "Eongdda - IoT Heating",
      "10": "RocketUp - Grant Consulting",
      "11": "Ingredient Ordering System",
      "12": "Battery Monitoring Solution",
    },
    headerTitle: 'Journey of Start and Destination',
    headerSubtitle: 'With Heredot',
    download: 'Company Brochure',
    firstMap: {
      label: 'Strategic Partner', // ✅ 추가
    },
    secondMap: {
    label: 'Heredot',
    },
    reviewSection: {
      title: "What Entrepreneurs Say About Heredot",
      description: "Here's how CEOs remember 'Heredot'.",
    },
    membersSection: {
      title: "Give us tasks!",
      description: "Click the buttons below to assign work to employees!",
    },
    memberTabs: ["Chat App", "Streaming Web", "Subscription Platform", "Lunch Time"],
    memberCards: {
      "1": {
        name: "Developer Liam",
        messages: {
          "Chat App": "Push notifications should depend on app state",
          "Streaming Web": null,
          "Subscription Platform": "Registration only?\n No verification?",
          "Lunch Time": "Too hungry to code",
        },
      },
      "2": {
        name: "CEO Martin",
        messages: {
          "Chat App": "Chat app project signed!",
          "Streaming Web": "Please make it like YouTube!",
          "Subscription Platform": "Subscription service deal closed!",
          "Lunch Time": "Let's eat first.",
        },
      },
      "3": {
        name: "Director Max",
        messages: {
          "Chat App": null,
          "Streaming Web": null,
          "Subscription Platform": null,
          "Lunch Time": "Did you bring the receipt?",
        },
      },
      "4": {
        name: "Planner K",
        messages: {
          "Chat App": "If it's 1:N, need sub-admin function too.",
          "Streaming Web": null,
          "Subscription Platform": "What about retrying payment if balance is low?",
          "Lunch Time": "Requirement? First, BBQ.",
        },
      },
      "5": {
        name: "Developer Dony",
        messages: {
          "Chat App": null,
          "Streaming Web": "We need to decide on buffering mechanism too.",
          "Subscription Platform": null,
          "Lunch Time": "*rumbling stomach noises*",
        },
      },
      "6": {
        name: "Developer Day",
        messages: {
          "Chat App": "We must discuss traffic billing beforehand.",
          "Streaming Web": "If capacity runs low, availability problems arise.",
          "Subscription Platform": "Need to check payment gateway first.",
          "Lunch Time": "More urgent than API is noodles!",
        },
      },
      "7": {
        name: "Designer Sien",
        messages: {
          "Chat App": null,
          "Streaming Web": "Have you considered automatic quality switching?",
          "Subscription Platform": null,
          "Lunch Time": "Don't want hamburger menu, want hamburger.",
        },
      },
      "9": {
        name: "Developer Jaxon",
        messages: {
          "Chat App": "help...",
          "Streaming Web": null,
          "Subscription Platform": "I debug, therefore I am.",
          "Lunch Time": "503 Service Unavailable (No Lunch)",
        },
      },
    },
    
    partner: {
      title1: 'Heredot is',
      title2: 'a Strategic Partner for Founders',
      subtitle: 'Heredot understands the overall business of clients and proposes various strategies for early market settlement.',
      tabs: ['Anti-Drone', 'Luxury Auction', 'Trade Platform', 'Table Order'],
      slides: [
        {
          title: 'Anti-Drone Solution',
          image: '/assets/partner_1.png',
          subtitle: 'Proposal for Global Sales Execution',
          description: 'Considering the client\'s engineer-centered structure,<br /> we propose business strategies beyond technology after product launch.',
        },
        {
          title: 'Luxury Reverse Auction',
          image: '/assets/partner_2.png',
          subtitle: 'Proposal for AI-based Price Inquiry',
          description: 'Identify products with AI from photos<br /> and predict prices to attract customers.',
        },
        {
          title: 'Trade Platform',
          image: '/assets/partner_3.png',
          subtitle: 'No Complex Process! Procedure Improvement Proposal',
          description: 'Understanding the collaborative structure in trade business,<br /> we propose ways to improve unnecessary procedures in each section.',
        },
        {
          title: 'Table Order',
          image: '/assets/partner_4.png',
          subtitle: 'Table Order Market Penetration Strategy',
          description: 'Understanding client\'s unique features and strategies<br /> to survive in the table order market.',
        },
      ],
      downloadText: 'Download Proposal',
    },
    consulting: {
      title: `Heredot is used for "Function, Design, and Cost" Optimization`,
      descriptions: [
        '1. Organizing quantity and functions at the estimate stage',
        '2. Supporting optimal IT service design',
        '3. Utilizing it for schedule management (WBS)',
      ],
      downloadText: 'Download Specification',
      gridHeaders: ['Item', 'Customer Requirement', 'Heredot Proposal', 'Effect'],
      gridContents: [
        ['Login', 'Login via USB for enhanced security', 'Google OTP<br /> 2-Factor Authentication', 'Support for diverse devices beyond Windows Only'],
        ['Core/Convenience<br /> Features', 'Requesting all functions within limited budget', 'Separate core/convenience functions<br /> Develop step by step', 'Optimize business growth according to budget'],
        ['Personal Information Collection', 'Collect all personal information', 'Guide development based on privacy laws<br /> and communication laws', 'Minimize compliance risks'],
      ],
    },
    bannerSection: {
      title: "Click Now for Special Promotions!",
      description: "Limited offers available on a first-come, first-served basis.",
    },
    
    design: {
      tabs: ['Reference Research', 'Trend Analysis', 'Color Proposal', 'UI/UX Proposal', 'Customer Decision'],
      tabNumbers: ['01', '02', '03', '04', '05'],
      title: 'Heredot Design Strategy', 
      slides: [
        { title: 'Market/Reference Research', image: '/assets/design/design_1.png' },
        { title: 'Trend Analysis', image: '/assets/design/design_2.png' },
        { title: 'Color Proposal', image: '/assets/design/design_3.png' },
        { title: 'UI/UX Proposal', image: '/assets/design/design_4.png' },
        { title: 'Customer Decision', image: '/assets/design/design_5.png' },
      ],
    },
    appBlock: {
      title: `HereDot builds fast and reliable products\nwith a LEGO-style design system.`,
      description: `We design each screen from the smallest units,\nensuring a consistent structure across design and development.\nThis approach not only boosts quality, but also makes future code handovers and maintenance seamless.`,
    },
    contactSection: {
      emailTitle: 'Email Inquiry',
      emailInfo: 'heredot83@heredotcorp.com',
      emailButton: 'Send Email',
      phoneTitle: 'Phone Inquiry',
      phoneInfo: '031-8039-7981',
      phoneButton: 'Call Now',
      kakaoTitle: 'KakaoTalk Chat Support',
      kakaoInfo: 'Kakao',
      kakaoLink: 'https://open.kakao.com/o/smVyiMig',
      kakaoButton: 'Join Chat',
    },
    footer: {
      companyName: 'Company Name: Heredot Corp.',
      ceo: 'CEO: Taewon Kang',
      businessNumber: 'Business Registration Number: 289-86-03278',
      address: 'Address: 777, 815 Daewangpangyo-ro, Sujeong-gu, Seongnam-si, Gyeonggi-do, South Korea',
      customerService: 'Customer Service: 031-8039-7981',
      copyright: 'Copyright ⓒ 2025 Heredot. All rights reserved.',
    },
    
    
  },
};
