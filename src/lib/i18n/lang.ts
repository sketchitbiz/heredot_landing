import { m } from 'framer-motion';

export const dictionary = {
  ko: {
    departure: '출발',
    eventBlock: {
      title: 'HereDot R&D로 탄생한 실제 프로젝트',
      description: '우리가 직접 만든 프로젝트, 기술력과 기획력의 결과입니다',
    },
       adModal: {
      line1: '견적서 3분이면 끝!',
      line2: '여기닷의 견적 AI에게\n 부담없이 물어보세요.',
      buttonText: 'AI 견적 받기',
    },

    aiBlock: {
      title: '이제는 제대로 시작해야할 때',
      description: '이유 있는 견적, AI에게 부담없이 물어보아요',
      buttonTitle: 'AI 견적서 바로가기',
      buttonLink: '/ai',
      buttonHeader: '복잡한 견적은 NO!',
      buttonDescription: 'AI 견적서로 간편하게',
    },
    arrival: '도착',
    nav: ['포트폴리오', '팀원소개', '기획전','AI 견적서' ,'문의하기'],
    customNavigator: {
      community: '창업커뮤니티',
      portpolio: '포트폴리오',
      member: '팀원소개',
      review: '고객후기',
      event: '기획전',
      ai: 'AI 견적서',
      contact: '연락',
      technology: 'AI 기술력',
    },
    aitechBlock: {
      title: '기업 프로젝트에 적용 가능한 AI 기술력',
      description: 'AI 분석, 챗봇, 자동화 등 실제 프로젝트에 활용되는 기술을 직접 개발합니다',
    },
    contract: {
      title: '프로젝트 문의가 있다면',
      description: '망설이지 말고 지금 "여기닷"에게 연락 주세요',
    },
    preTitle: 'IT 혁신의 시작, 플랫폼·솔루션·\n기업전산·AI개발 전문 외주 개발사',
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
      title: '기업 맞춤 IT 아웃소싱 · 앱·웹 개발 전문팀',
      description: '기업 맞춤 앱·웹 개발과 IT 아웃소싱으로 성과를 만듭니다',
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
      downloadText: '사업제안서 미리보기',
    },
    consulting: {
      title: `여기닷은 "기능명세"를\n 최적화 용도로 활용합니다`,
      descriptions: [
        '1. 견적 단계에서 분량 및 기능정리',
        '2. IT서비스 최적 설계 지원',
        '3. 일정관리 (WBS)로 활용해요',
      ],
      downloadText: '기능명세 미리보기',
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
      title: '외주 개발부터 운영까지,\n기업 프로젝트에 최적화된 전문팀',
      description: '경험 많은 전문가 팀이 기업 맞춤 외주 개발을 책임집니다',
    },
    memberTabs: ['팀원 역량', '전산 구축', '플랫폼 웹 구축', '앱 개발 구축'],
    memberCards: {
      '1': {
        name: '개발자 Sun',
        messages: {
          '팀원 역량': 'KT DS 기업 SI 8년 경력,\n 대규모 SI 프로젝트 다수 수행',
          '전산 구축': '관제·경영 솔루션 구축 20+회,\n 전산 최적화 전문가',
          '플랫폼 웹 구축': '수십만 동시접속\n웹 아키텍처 전문가',
          '앱 개발 구축': '국내 메이저 야구단\n 앱 개발 참여',
        },
      },
      '2': {
        name: 'CEO Martin',
        messages: {
      '팀원 역량': 'LG전자 IT PM 11년, ​\n글로벌 프로젝트 리딩 경험',
          '전산 구축': 'LG전자 ERP·WMS·CRM PM\n대형 프로젝트 리딩',
          '플랫폼 웹 구축': '웹서비스 기획 및\n대형 플랫폼 프로젝트 총괄',
          '앱 개발 구축': 'LG 그룹웨어 앱​\n기획 참여 다수​',
        },
      },
      '3': {
        name: '이사 Max',
        messages: {
      '팀원 역량': '포스코 철강 재무관리​\n10년, 재무·ERP 통합 전문가',
          '전산 구축': '경영·재무 PI 프로젝트, \n전산 통합 관리 경험',
          '플랫폼 웹 구축': null,
          '앱 개발 구축': null,
        },
      },
      '4': {
        name: '기획자 K',
        messages: {
            '팀원 역량': '플랫폼 매출 100억 달성 출신,​\n서비스 성장 전략가',
          '전산 구축': '쇼핑몰 정산 시스템 구축​\n서비스 기획·운영 경험​',
          '플랫폼 웹 구축': 'B2B SaaS 플랫폼 기획 및 \n서비스 고도화 경험',
          '앱 개발 구축': '스타트업 플랫폼 BIZ​\n10회 이상 경험​',
        },
      },
      '5': {
        name: '개발자 Dony',
        messages: {
        '팀원 역량': 'Flutter, React.js​\n화면 개발 전문​',
          '전산 구축': '기업 그룹웨어·전산 등​\n기업 앱 구축 경험​​',
          '플랫폼 웹 구축': '대규모 결제·정산 시스템\n안정화·최적화 경험',
          '앱 개발 구축': '누적 100만​\n다운로드 앱 개발',
        },
      },
      '6': {
        name: '개발자 Day',
        messages: {
   '팀원 역량': 'Java·Python·Node ​\n서버 개발 전문​',
          '전산 구축': '빅데이터, 데이터 Flow​\n설계 등 DB 전문가​​​',
          '플랫폼 웹 구축': '글로벌 다국어 웹 플랫폼\n구축·운영 경험',
          '앱 개발 구축': '대용량 트레픽​\n분산 처리​',
        },
      },
      '7': {
        name: '디자이너 Sien',
        messages: {
      '팀원 역량': '전산·플랫폼·UX/UI 디자인\n사용자 친화적 인터페이스 제작​',
          '전산 구축': '기업전산·솔루션​\n디자인 전문​​​​',
          '플랫폼 웹 구축': null,
          '앱 개발 구축': null,
        },
      },
      '9': {
        name: '개발자 Jaxon',
        messages: {
        '팀원 역량': '풀스택 개발자, ​\n웹·앱 통합 구축 및 운영 경험​​',
          '전산 구축': '기업 전산 고도화 개발​\n웹·앱 통합 구축 및 운영 경험​',
          '플랫폼 웹 구축': '하이브리드 앱​ 크로스 플랫폼 앱​ \n10회 이상 경험​',
          '앱 개발 구축': '하이브리드 앱​\n크로스 플랫폼 앱​ 10회 이상 경험',
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
      downloadText: '디자인 제안서 미리보기',
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
      title: '책임감 있는 진행으로\n처음부터 끝까지 안심할 수 있습니다',
      description: "프로젝트 일정, 품질, 소통 고객들이 직접 증명한 신뢰입니다",
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
contactPopup: {
  title1: '당신의 여정',
  title2: '여기닷이 끝까지 함께합니다',
  namePlaceholder: '성함을 입력해주세요',
  phonePlaceholder: '휴대폰 번호를 적어주세요',
  budgetPlaceholder: '(숫자만 입력) 예산 규모를 기입해주세요',
  contentPlaceholder:
    '개발하고 싶은 서비스, 궁금한 기능, 구현에 대한 고민 등 자유롭게 적어주세요\nex) MVP 견적, 기능정의서 요청, 기존 서비스 개선 컨설팅 등',
  submitButton: '문의하기',
  nameRequired: '이름을 입력해주세요.',
  phoneInvalid: '전화번호를 정확히 입력해주세요. (예: 01012345678)',
  budgetRequired: '예산을 입력해주세요.',
  descRequired: '문의 내용을 입력해주세요.',
  submitSuccess: '영업일 기준 1일내 연락드리겠습니다',
  submitFail: '제출에 실패했습니다. 다시 시도해주세요.',
  unknownError: '오류가 발생했습니다. 관리자에게 문의해주세요.',
   privacyNotice: '문의 접수시 개인정보 수집에 동의한것으로 간주 합니다',
   completeTitle: '견적을 문의해주셔서 감사드립니다!',
  completeSubtitle: '순차적으로 연락드리겠습니다.',
  completeButton: '메인으로 돌아가기',
},
    contactSection: {
      emailTitle: '프로젝트 문의',
      emailInfo: '영업일 1일내 (24시간) 연락',
      emailButton: '접수하기',
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
      ceo: '대표자명 : 강태원 heredot83@heredotcorp.com',
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
      title: 'Real Projects Born from HereDot R&D',
      description: 'Projects we directly created, results of our technology and planning capabilities',
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
    nav: ['Portfolio', 'Team', 'Solution','AI Estimate' ,'Contact'],
    customNavigator: {
      community: 'Startup Community',
      member: 'Team',
      portpolio: 'Portfolio',
      review: 'Reviews',
      event: 'Events',
      ai: 'AI Estimate',
      contact: 'Contact',
      technology: 'AI Technology',
    },
    aitechBlock: {
      title: 'AI Technology Applicable to Corporate Projects',
      description: 'We directly develop technologies used in real projects such as AI analysis, chatbots, and automation',
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
      title: 'Corporate IT Outsourcing · App & Web Development Specialists',
      description: 'We deliver results through customized app & web development and IT outsourcing for businesses',
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
    preTitle: 'The beginning of IT innovation, a professional outsourcing development company for platforms, solutions, corporate computing, and AI development',
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
      title: 'You can feel secure from start to finish with our responsible project management',
      description: 'Trust proven directly by customers in project schedules, quality, and communication',
    },
    membersSection: {
      title: 'From Outsourced Development to Operations, Professional Team Optimized for Corporate Projects',
      description: 'Our experienced team of specialists takes full responsibility for customized outsourced development for businesses',
    },
    memberTabs: [
      'Team Expertise',
      'Enterprise Systems',
      'Web Platform Development',
      'Mobile App Development',
    ],
    memberCards: {
      '1': {
        name: 'Developer Sun',
        messages: {
          'Team Expertise': '8 years KT DS enterprise SI experience,\nMultiple large-scale SI projects',
          'Enterprise Systems': '20+ control & management solutions built,\nEnterprise optimization specialist',
          'Web Platform Development': 'Expert in web architecture for\nhundreds of thousands concurrent users',
          'Mobile App Development': 'Participated in major domestic\nbaseball team app development',
        },
      },
      '2': {
        name: 'CEO Martin',
        messages: {
          'Team Expertise': '11 years LG Electronics IT PM,\nGlobal project leadership experience',
          'Enterprise Systems': 'LG Electronics ERP·WMS·CRM PM\nLarge project leadership',
          'Web Platform Development': 'Web service planning and\nlarge platform project management',
          'Mobile App Development': 'Multiple LG groupware app\nplanning participation',
        },
      },
      '3': {
        name: 'Director Max',
        messages: {
          'Team Expertise': '10 years POSCO steel financial management,\nFinance·ERP integration specialist',
          'Enterprise Systems': 'Management·Finance PI projects,\nEnterprise system integration experience',
          'Web Platform Development': null,
          'Mobile App Development': null,
        },
      },
      '4': {
        name: 'Planner K',
        messages: {
          'Team Expertise': 'Platform revenue 10B KRW achiever,\nService growth strategist',
          'Enterprise Systems': 'E-commerce settlement system development\nService planning & operation experience',
          'Web Platform Development': 'B2B SaaS platform planning and\nservice enhancement experience',
          'Mobile App Development': 'Startup platform business\n10+ times experience',
        },
      },
      '5': {
        name: 'Developer Dony',
        messages: {
          'Team Expertise': 'Flutter, React.js\nFrontend development specialist',
          'Enterprise Systems': 'Enterprise groupware & systems\nCorporate app development experience',
          'Web Platform Development': 'Large-scale payment & settlement systems\nStabilization & optimization experience',
          'Mobile App Development': 'Cumulative 1M+\ndownload app development',
        },
      },
      '6': {
        name: 'Developer Day',
        messages: {
          'Team Expertise': 'Java·Python·Node\nServer development specialist',
          'Enterprise Systems': 'Big data, data flow design\nDatabase specialist',
          'Web Platform Development': 'Global multilingual web platform\ndevelopment & operation experience',
          'Mobile App Development': 'High-traffic\ndistributed processing',
        },
      },
      '7': {
        name: 'Designer Sien',
        messages: {
          'Team Expertise': 'Enterprise·Platform·UX/UI design\nUser-friendly interface creation',
          'Enterprise Systems': 'Corporate systems & solutions\nDesign specialist',
          'Web Platform Development': null,
          'Mobile App Development': null,
        },
      },
      '9': {
        name: 'Developer Jaxon',
        messages: {
          'Team Expertise': 'Full-stack developer,\nWeb·App integrated development & operation',
          'Enterprise Systems': 'Enterprise system advancement development\nWeb·App integrated development & operation',
          'Web Platform Development': 'Hybrid app, cross-platform app\n10+ times experience',
          'Mobile App Development': 'Hybrid app\nCross-platform app 10+ times experience',
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
contactPopup: {
  title1: 'We’re here to start your journey',
  title2: 'with Heredot.',
  namePlaceholder: 'Enter your name',
  phonePlaceholder: 'Enter your phone number',
  budgetPlaceholder: 'Enter your estimated budget',
  contentPlaceholder:
    'Feel free to describe your project, desired features, or concerns.\ne.g. MVP quote, request for functional specs, improving existing services, etc.',
  submitButton: 'Submit',
  nameRequired: 'Please enter your name',
  phoneInvalid: 'Please enter a valid phone number (e.g. 01012345678)',
  budgetRequired: 'Please enter your budget',
  descRequired: 'Please enter your inquiry',
  submitSuccess: 'We will contact you within 1 business day',
  submitFail: 'Submission failed. Please try again',
  unknownError: 'An error occurred. Please contact the administrator',
    privacyNotice: 'By submitting an inquiry, you are deemed to have agreed to the collection of personal information',
  completeTitle: 'Thank you for your inquiry',
  completeSubtitle: 'We will contact you in order',
  completeButton: 'Return to Home',
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
  emailTitle: 'Project Inquiry',
emailInfo: 'Reply within 1 business day',
  emailButton: 'Submit',
      phoneTitle: 'Phone Inquiry',
      phoneInfo: '+82 31-8039-7981',
      phoneButton: 'Call Now',
      kakaoTitle: 'KakaoTalk Chat',
      kakaoInfo: 'Kakao',
      kakaoLink: 'https://open.kakao.com/o/smVyiMig',
      kakaoButton: 'Join Chat',
    },
        adModal: {
line1: 'Done in 3 minutes!',
line2: 'Ask Heredot’s Quote AI\nwithout any pressure.',
      buttonText: 'Get AI Estimate',
    },
    footer: {
      companyName: 'Company Name: Heredot Corp',
      ceo: 'CEO: Taewon Kang heredot83@heredotcorp.com',
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
