import { m } from 'framer-motion';

export const dictionary = {
  ko: {
    departure: '출발',
    eventBlock: {
      title: '사업가들에게 제안하는 여기닷 솔루션',
      description: '대표님의 사업을 지원하기 위한 최적 솔루션 소개해요',
    },

    aiBlock: {
      title: '이제는 재대로 시작해야할 때',
      description: '이유 있는 견적, AI에게 부담없이 물어보아요',
      buttonTitle: 'AI 견적서 바로가기',
      buttonLink: '/ai',
      buttonHeader: '복잡한 견적은 NO!',
      buttonDescription: 'AI 견적서로 간편하게',
    },
    arrival: '도착',
    nav: ['핵심강점', '포트폴리오', '팀원소개', 'AI 견적서', '기획전'],
    customNavigator: {
      community: '창업커뮤니티',
      portpolio: '포트폴리오',
      member: '팀원소개',
      review: '고객후기',
      event: '기획전',
      ai: 'AI 견적서',
      contact: '연락',
    },
    contract: {
      title: '프로젝트 문의가 있다면',
      description: '망설이지 말고 지금 "여기닷"에게 연락 주세요',
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
      title: '여기닷에서 만든 대표 프로젝트!',
      description: '다양한 산업과 분야에서 성과를 이끌어낸 프로젝트 소개해요!',
    },
    portfolioCards: {
      '1': '안티드론 솔루션',
      '2': '명품 역경매',
      '3': '링구 - 링크간편구독',
      '4': '테이블오더',
      '5': '엑시토',
      '6': '윌체어',
      '7': 'FMG - 골프홀인원',
      '8': '동네친구들 - 야식레이드',
      '9': '엉따 - IoT',
      '10': '로켓업 - 지원사업 컨설팅',
      '11': '식자재발주시스템',
      '12': '2차전지관제솔루션',
    },
    partner: {
      title1: '여기닷은',
      title2: '창업자의 전략 파트너입니다',
      subtitle:
        '여기닷은 고객사의 사업 전반적인 내용을 이해하고 시장에\n 조기 안착할 수 있도록 다양한 사업을 제안합니다.',
      tabs: ['안티드론', '명품역경매', '무역 플랫폼', '테이블오더'],
      slides: [
        {
          title: '안티드론 솔루션',
          image: '/assets/partner_1.webp',
          subtitle: '글로벌 세일즈 관련 수행 방안 제안',
          description:
            '고객사가 엔지니어 중심 조직 구조인 점을 고려하여,<br /> 제품 런칭 이후 기술 외에도 세일즈 관점에서의 사업 전략을 제안',
        },
        {
          title: '명품 역경매',
          image: '/assets/partner_2.webp',
          subtitle: 'AI를 활용한 시세 조회 방안 제안',
          description:
            '제품 촬영한 이미지를 AI를 통해 식별 및 인식 하여<br /> 시세를 예측하여 고객 유입 활성 방안 제안',
        },
        {
          title: '무역플랫폼',
          image: '/assets/partner_3.webp',
          subtitle: '복잡한 프로세스 No! 절차 개선 제안',
          description:
            '무역업 특성상 많은 이해 관계자들이 협업 해야 되는 구조를<br /> 정확하게 인지 및 각 구간별 불필요 절차 개선 방안 제안',
        },
        {
          title: '테이블오더',
          image: '/assets/partner_4.webp',
          subtitle: '테이블오더 시장 안착 전략 제안',
          description:
            '시중에 나와 있는 테이블 오더 제품과의 경쟁에서 살아 남기 위한<br /> 고객사만의 기능과 사업전략을 이해하고 프로젝트 킥오프 제안',
        },
      ],
      downloadText: '사업제안서 다운로드',
    },
    consulting: {
      title: `여기닷은 "기능명세"를\n 최적화 용도로 활용합니다`,
      descriptions: [
        '1. 견적 단계에서 분량 및 기능정리',
        '2. IT서비스 최적 설계 지원',
        '3. 일정관리 (WBS)로 활용해요',
      ],
      downloadText: '기능명세 다운로드',
      gridHeaders: ['항목', '고객요구사항', '여기닷 제안', '효과'],
      gridContents: [
        [
          '로그인',
          '보안강화목적<br /> USB로 로그인',
          '구글 OTP<br /> 2Factor 인증',
          '기존 윈도우 Only<br /> 접속 기기 다변화 수용',
        ],
        [
          '핵심/편의기능<br /> 구분',
          '한정된 예산 내<br /> 전체 기능 요구',
          '핵심/편의 기능 분리<br /> 단계별 개발 가이드',
          '예산에 맞춘<br /> 사업성장 최적화 지원',
        ],
        [
          '개인정보수집',
          '모든 정보 수집',
          '개인정보법, 정보통신법 안내<br /> 법적기준 개발 가이드',
          '준법 RISK 최소화',
        ],
      ],
    },
    membersSection: {
      title: '일감을 주세요!',
      description: '아래 버튼을 클릭하여 직원들에게 일을 맡겨보아요!',
    },
    memberTabs: ['채팅 앱', '스트리밍 웹', '구독 플랫폼', '점심시간'],
    memberCards: {
      '1': {
        name: '개발자 Sun',
        messages: {
          '채팅 앱': '푸시는 앱 상태마다 다르게요',
          '스트리밍 웹': null,
          '구독 플랫폼': '등록이죠?\n 인증은 안 하나요?',
          점심시간: '배고파서 코드 안 짜짐',
        },
      },
      '2': {
        name: 'CEO Martin',
        messages: {
          '채팅 앱': '채팅앱 계약됐어요!',
          '스트리밍 웹': '유튜브처럼 만들어 주세요!',
          '구독 플랫폼': '구독 결제 서비스 계약됐어요!',
          점심시간: '밥 먹고 합시다.',
        },
      },
      '3': {
        name: '이사 Max',
        messages: {
          '채팅 앱': null,
          '스트리밍 웹': null,
          '구독 플랫폼': null,
          점심시간: '영수증 챙기셨어요?',
        },
      },
      '4': {
        name: '기획자 K',
        messages: {
          '채팅 앱': '1:N이면\n 부방장 기능도 필요하죠.',
          '스트리밍 웹': null,
          '구독 플랫폼': '잔액 부족 시 재결제는요?',
          점심시간: '요구사항? 일단 고기',
        },
      },
      '5': {
        name: '개발자 Dony',
        messages: {
          '채팅 앱': null,
          '스트리밍 웹': '버퍼링 구현 방식도\n 정해야죠.',
          '구독 플랫폼': null,
          점심시간: '꼬르륵...',
        },
      },
      '6': {
        name: '개발자 Day',
        messages: {
          '채팅 앱': '트래픽 과금\n 미리 조율해야 해요.',
          '스트리밍 웹': '용량 부족하면\n 가용성 문제 생겨요.',
          '구독 플랫폼': 'PG사 먼저 확인 필요해요.',
          점심시간: 'API보다 급한 건 칼국수',
        },
      },
      '7': {
        name: '디자이너 Sien',
        messages: {
          '채팅 앱': null,
          '스트리밍 웹': '화질 자동 전환 고려하셨어요?',
          '구독 플랫폼': null,
          점심시간: '햄버거 버튼 말고 햄버거 줘요',
        },
      },
      '9': {
        name: '개발자 Jaxon',
        messages: {
          '채팅 앱': 'help...',
          '스트리밍 웹': null,
          '구독 플랫폼': 'I debug, therefore I am.',
          점심시간: '503 Service Unavailable (No Lunch)',
        },
      },
    },
    community: {
      title: '성공을 지원하는 많은 노하우와 네트워크',
      description:
        'IT 산업 분야 전문 컨설턴트로서, 100여개 기업과 함께 성장해왔습니다',
      section: {
        title: '750여명 규모의\n 창업 커뮤니티 운영 중',
        description: '전문가들과 함께 성장하는 창업 플랫폼 함께해요',
        buttonText: '창업커뮤니티 바로가기',
      },
    },
    bannerSection: {
      title: '특별 프로모션 지금 바로 클릭!',
      description: '선착순으로 제공되는 상품으로 조기 종료될 수 있습니다.',
    },

    design: {
      tabs: [
        '레퍼런스 조사',
        '트렌드 파악',
        '컬러제안',
        'UI/UX 제안',
        '고객의사결정',
      ],
      tabNumbers: ['01', '02', '03', '04', '05'],
      title: '여기닷은 모든 프로젝트에\n 디자인 전략을 제안합니다',
      downloadText: '디자인 제안서 다운로드',
      slides: [
        { title: '시장/레퍼런스 조사', image: '/assets/design/design_1.webp' },
        { title: '트렌드 파악', image: '/assets/design/design_2.webp' },
        { title: '컬러제안', image: '/assets/design/design_3.webp' },
        { title: 'UI/UX 제안', image: '/assets/design/design_4.webp' },
        { title: '고객의사결정', image: '/assets/design/design_5.webp' },
      ],
    },
    event: {
      title: '',
      description: '',
      buttonTitle: '바로가기 >',
      slides: [
        { image: '/assets/event/event_1.webp' },
        { image: '/assets/event/event_2.webp' },
      ],
    },
    reviewSection: {
      title: '사업가들이 말하는 여기닷',
      description: "대표님들은 '여기닷'을 이렇게 기억합니다.",
    },
    appBlock: {
      title: `여기닷은 레고 디자인 시스템으로\n차곡차곡 쌓아 빠르고·안정적 개발합니다.`,
      description: `화면을 작은 단위부터 체계적으로 설계해\n디자인과 개발을 일관된 구조로 개발하며,\n완성도는 물론 추후 코드 이관과 유지보수도 간편합니다.`,
    },
    landingBottomBox: {
      title: '추천',
      description: '직접 견적 받으시나요?\n더 빠른 길을 추천해드릴게요!',
      aiButton: 'AI 견적 받기',
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
      address: '사업장주소 : 경기 성남시 수정구 대왕판교로 815 777호',
      customerService: '고객센터 : 031-8039-7981',
      copyright: 'Copyright ⓒ 2025 여기닷 All right reserved.',
      businessLicense: '통신판매업신고증 : 2025-성남 수정-0138 호',
      moreButton: '더보기',
      terms: '이용약관',
      privacy: '개인정보 처리방침',
      companyInfo: '사업자 정보',

      moreInfo: [
        '여기닷은 판교에 위치한 IT 전문 기업으로, 웹사이트 제작, 모바일 앱 개발(외주), 맞춤형 플랫폼 및 솔루션 개발, IT 컨설팅과 아웃소싱 서비스를 제공합니다. React, Node.js, Flutter 등 다양한 기술 스택을 활용하여 고객의 비즈니스 성공을 돕습니다.',
        '커뮤니티, O2O, 쇼핑몰(이커머스), 예약 시스템, 솔루션 등 다양한 비즈니스 모델에 최적화된 맞춤형 웹/앱 플랫폼을 기획, 설계, 개발합니다. 확장성과 안정성을 고려한 아키텍처로 판교 및 경기 지역 기업의 성공적인 디지털 전환을 지원합니다.',
        'iOS 및 Android 네이티브 앱, Flutter/React Native 크로스플랫폼 앱 개발 외주 서비스를 제공합니다. 사용자 중심 UI/UX 설계와 안정적인 성능으로 병원, 교육, 커머스 등 다양한 산업 분야의 앱 개발 프로젝트를 수행합니다.',
        '반응형 웹사이트 제작, 기업용 웹 솔루션 개발, Node.js 기반 백엔드 시스템 구축 등 웹 기반 프로젝트 전문입니다. React, Vue 등 최신 프론트엔드 기술과 안정적인 백엔드 연동으로 최적의 사용자 경험을 제공하는 웹사이트를 제작합니다.',
        '신규 사업 기획, 기술 스택 선정, 개발 프로세스 최적화 등 IT 컨설팅을 제공하며, 프로젝트 단위 또는 장기적인 IT 개발 아웃소싱(프로젝트 수주)을 통해 기업의 개발 역량 강화를 지원합니다.',
      ],
    },
  },
  en: {
    eventBlock: {
      title: 'Heredot Solutions for Entrepreneurs',
      description:
        'Discover the ideal solution to support and grow your business',
    },
    aiBlock: {
      title: "It's time to start the right way",
      description: 'Ask AI about your quote without hesitation',
      buttonTitle: 'Go to AI Quote',
      buttonLink: '/ai',
      buttonHeader: 'No more complicated quotes!',
      buttonDescription: 'Get it done easily with AI',
    },
    departure: 'Departure',
    arrival: 'Arrival',
    nav: ['Key Value', 'Portfolio', 'Team', 'Promotion','AI Estimate'],
    customNavigator: {
      community: 'Startup Community',
      member: 'Team',
      portpolio: 'Portfolio',
      review: 'Reviews',
      event: 'Events',
      ai: 'AI Estimate',
      contact: 'Contact',
    },
    community: {
      title: 'Extensive Know-how and Network for Your Success',
      description:
        'We’ve grown alongside over 100 companies as IT industry consultants.',
      section: {
        title: 'Startup community with over 750 members',
        description: 'Join a platform where you grow with professionals.',
        buttonText: 'Go to Community',
      },
    },
    event: {
      title: '',
      description: '',
      buttonTitle: 'Go to Site >',
      slides: [
        { image: '/assets/event/event_1e.webp' },
        { image: '/assets/event/event_2e.webp' },
      ],
    },
    portfolio: {
      title: 'Top Projects by HereDot!',
      description:
        'Introducing projects that led success across various industries!',
    },
    portfolioCards: {
      '1': 'Anti-Drone Solution',
      '2': 'Luxury Reverse Auction',
      '3': 'Ring9 - Easy Subscription',
      '4': 'Table Order System',
      '5': 'Exito',
      '6': 'Wheelchair Platform',
      '7': 'FMG - Golf Hole-in-One',
      '8': 'Dongne Friends - Night Raid',
      '9': 'Eongdda - IoT Heating',
      '10': 'RocketUp - Grant Consulting',
      '11': 'Ingredient Ordering System',
      '12': 'Battery Monitoring Solution',
    },
    headerTitle: 'Journey of Start and Destination',
    headerSubtitle: 'With Heredot',
    download: 'Company Brochure',
    firstMap: {
      label: 'Strategic Partner', // ✅ 추가
    },
    landingBottomBox: {
      title: 'Recommendation',
      description: 'Getting a quote manually?\nLet us guide you a faster way!',
      aiButton: 'Get AI Quote',
    },

    secondMap: {
      label: 'Heredot',
    },
    reviewSection: {
      title: 'What Entrepreneurs Say About Heredot',
      description: "Here's how CEOs remember 'Heredot'.",
    },
    membersSection: {
      title: 'Give us tasks!',
      description: 'Click the buttons below to assign work to employees!',
    },
    memberTabs: [
      'Chat App',
      'Streaming Web',
      'Subscription Platform',
      'Lunch Time',
    ],
    memberCards: {
      '1': {
        name: 'Developer Sun',
        messages: {
          'Chat App': 'Push notifications should depend on app state',
          'Streaming Web': null,
          'Subscription Platform': 'Registration only?\n No verification?',
          'Lunch Time': 'Too hungry to code',
        },
      },
      '2': {
        name: 'CEO Martin',
        messages: {
          'Chat App': 'Chat app project signed!',
          'Streaming Web': 'Please make it like YouTube!',
          'Subscription Platform': 'Subscription service deal closed!',
          'Lunch Time': "Let's eat first.",
        },
      },
      '3': {
        name: 'Director Max',
        messages: {
          'Chat App': null,
          'Streaming Web': null,
          'Subscription Platform': null,
          'Lunch Time': 'Did you bring the receipt?',
        },
      },
      '4': {
        name: 'Planner K',
        messages: {
          'Chat App': "If it's 1:N, need sub-admin function too.",
          'Streaming Web': null,
          'Subscription Platform':
            'What about retrying payment if balance is low?',
          'Lunch Time': 'Requirement? First, BBQ.',
        },
      },
      '5': {
        name: 'Developer Dony',
        messages: {
          'Chat App': null,
          'Streaming Web': 'We need to decide on buffering mechanism too.',
          'Subscription Platform': null,
          'Lunch Time': '*rumbling stomach noises*',
        },
      },
      '6': {
        name: 'Developer Day',
        messages: {
          'Chat App': 'We must discuss traffic billing beforehand.',
          'Streaming Web': 'If capacity runs low, availability problems arise.',
          'Subscription Platform': 'Need to check payment gateway first.',
          'Lunch Time': 'More urgent than API is noodles!',
        },
      },
      '7': {
        name: 'Designer Sien',
        messages: {
          'Chat App': null,
          'Streaming Web': 'Have you considered automatic quality switching?',
          'Subscription Platform': null,
          'Lunch Time': "Don't want hamburger menu, want hamburger.",
        },
      },
      '9': {
        name: 'Developer Jaxon',
        messages: {
          'Chat App': 'help...',
          'Streaming Web': null,
          'Subscription Platform': 'I debug, therefore I am.',
          'Lunch Time': '503 Service Unavailable (No Lunch)',
        },
      },
    },
    contract: {
      title: 'Have a project inquiry?',
      description: 'Let’s connect and make it happen — contact HereDot today.',
    },
    partner: {
      title1: 'Heredot is',
      title2: 'a Strategic Partner for Founders',
      subtitle:
        'Heredot understands the overall business of clients and proposes various strategies for early market settlement.',
      tabs: ['Anti-Drone', 'Luxury Auction', 'Trade Platform', 'Table Order'],
      slides: [
        {
          title: 'Anti-Drone Solution',
          image: '/assets/partner_1.webp',
          subtitle: 'Proposal for Global Sales Execution',
          description:
            "Considering the client's engineer-centered structure,<br /> we propose business strategies beyond technology after product launch.",
        },
        {
          title: 'Luxury Reverse Auction',
          image: '/assets/partner_2.webp',
          subtitle: 'Proposal for AI-based Price Inquiry',
          description:
            'Identify products with AI from photos<br /> and predict prices to attract customers.',
        },
        {
          title: 'Trade Platform',
          image: '/assets/partner_3.webp',
          subtitle: 'No Complex Process! Procedure Improvement Proposal',
          description:
            'Understanding the collaborative structure in trade business,<br /> we propose ways to improve unnecessary procedures in each section.',
        },
        {
          title: 'Table Order',
          image: '/assets/partner_4.webp',
          subtitle: 'Table Order Market Penetration Strategy',
          description:
            "Understanding client's unique features and strategies<br /> to survive in the table order market.",
        },
      ],
      downloadText: 'Download Proposal',
    },
    consulting: {
      title: `Heredot uses "Function Specifications"\nfor Optimization Purposes`,
      descriptions: [
        '1. Organizing quantity and functions at the estimate stage',
        '2. Supporting optimal IT service design',
        '3. Utilizing it for schedule management (WBS)',
      ],
      downloadText: 'Download Specification',
      gridHeaders: [
        'Item',
        'Customer Requirement',
        'Heredot Proposal',
        'Effect',
      ],
      gridContents: [
        [
          'Login',
          'Login via USB<br /> for enhanced security',
          'Google OTP<br /> 2Factor authentication',
          'Expanded device support<br /> beyond Windows-only access',
        ],
        [
          'Core / Convenience Features<br /> Distinction',
          'Request for all features<br /> within limited budget',
          'Guidance for phased development<br /> by separating core and convenience features',
          'Optimized growth strategy<br /> within the given budget',
        ],
        [
          'Personal Information Collection',
          'Collecting all personal data',
          'Guidance on the Personal Information Protection Act and the Information and Communications Act<br /> Legal standards for compliant development',
          'Minimization of compliance risk',
        ],
      ],
    },
    bannerSection: {
      title: 'Click Now for Special Promotions!',
      description:
        'Limited offers available on a first-come, first-served basis.',
    },

    design: {
      tabs: [
        'Reference Research',
        'Trend Analysis',
        'Color Proposal',
        'UI/UX Proposal',
        'Customer Decision',
      ],
      tabNumbers: ['01', '02', '03', '04', '05'],
      title: 'Heredot Design Strategy',
      downloadText: 'Download Design Proposal',
      slides: [
        {
          title: 'Market/Reference Research',
          image: '/assets/design/design_1e.webp',
        },
        { title: 'Trend Analysis', image: '/assets/design/design_2e.webp' },
        { title: 'Color Proposal', image: '/assets/design/design_3e.webp' },
        { title: 'UI/UX Proposal', image: '/assets/design/design_4e.webp' },
        { title: 'Customer Decision', image: '/assets/design/design_5e.webp' },
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
      address:
        'Address: 777, 815 Daewangpangyo-ro, Sujeong-gu, Seongnam-si, Gyeonggi-do, South Korea',
      customerService: 'Customer Service: 031-8039-7981',
      copyright: 'Copyright ⓒ 2025 Heredot. All rights reserved.',
      businessLicense: 'E-commerce License: 2025-성남 수정-0138 호',
      moreButton: 'Read More',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',

      companyInfo: 'Company Info',

      moreInfo: [
        'Heredot is an IT company located in Pangyo, specializing in website development, outsourced mobile app development, custom platforms, IT consulting, and outsourcing. We use modern stacks such as React, Node.js, and Flutter to support client success.',
        'We plan, design, and develop custom web/app platforms optimized for business models like communities, O2O, e-commerce, booking systems, and solutions. Our scalable architecture supports digital transformation for companies in Pangyo and Gyeonggi areas.',
        'We offer native app development for iOS and Android as well as cross-platform apps using Flutter and React Native. Our projects span various industries including healthcare, education, and commerce with stable performance and user-centered UI/UX.',
        'We specialize in responsive website creation, enterprise web solutions, and backend systems using Node.js. Our expertise includes modern frontend frameworks like React and Vue to deliver optimal UX through stable backend integration.',
        'We provide IT consulting such as new business planning, tech stack selection, and development process optimization. We also support enterprise development through project-based or long-term outsourcing partnerships.',
      ],
    },
  },
};
