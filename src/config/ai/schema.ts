import { Schema } from 'firebase/vertexai';

export const FEATURE_SCHEMA = Schema.object({
  properties: {
    menu: Schema.string({
      description:
        "기능의 UI상 메뉴 그룹명입니다. AI는 다음 우선순위에 따라 이 값을 결정합니다: 1. <DATA>의 'featureType' 값이 명확하고 UI 메뉴로 적합한 경우 (예: '게시판 관리', '사용자 설정') 해당 값을 사용합니다. 단, 'featureType'이 '핵심기능', '부가기능'처럼 너무 일반적이거나 추상적인 경우 메뉴명으로 부적절하므로 다음 단계로 넘어갑니다. 2. 'featureType'이 부적절하거나 없을 경우, <DATA>의 'category' 값을 메뉴명으로 사용 고려합니다. 'category' 값도 UI 메뉴명으로 적절하지 않다고 판단되면 다음 단계로 넘어갑니다. 3. 위 두 정보가 모두 부적합할 경우, AI는 기능의 'feature'(이름), 'description'(설명) 및 instructionKR.ts에 제공된 플랫폼별 메뉴명 예시 등을 종합적으로 분석하여, 사용자에게 가장 직관적이고 해당 기능 그룹을 잘 나타낼 수 있는 메뉴명을 새롭게 생성합니다. 견적서 내 유사 기능 그룹에 대해서는 일관된 메뉴명 규칙을 적용해야 합니다.",
    }),
    feature: Schema.string({
      description: '<DATA>에 있는 기능명과 동일해야 합니다.',
    }),
    description: Schema.string({
      description: '기능에 대한 설명입니다.',
    }),
    amount: Schema.string({
      description:
        "기능에 대한 금액입니다. 설정되지 않은 경우 '별도 문의' 또는 '관리자 문의'로 설정하세요.",
    }),
    // duration: Schema.string({
    //   description: "기능에 소요되는 기간입니다. 설정되지 않은 경우 '별도 문의' 또는 '관리자 문의'로 설정하세요.",
    // }),
    // category: Schema.string({
    //   description: "기능의 카테고리입니다.",
    // }),
    pages: Schema.string({
      description:
        '(선택 사항) 기능에 필요한 예상 페이지 수입니다. 불필요하거나 알 수 없는 경우 생략하거나 "별도 문의"로 설정하세요.',
    }),
  },
});

export const GROUP_FEATURE_SCHEMA = Schema.object({
  description: '프로젝트에 포함된 카테고리 또는 카테고리별 기능 목록입니다.',
  properties: {
    category: Schema.string({
      description:
        '프로젝트에 포함된 기능들의 카테고리 또는 공통 카테고리입니다.',
    }),
    items: Schema.array({
      description: '공통 카테고리에 속하는 하나 이상의 기능 목록입니다.',
      items: FEATURE_SCHEMA,
    }),
  },
});

export const INVOICE_SCHEMA = Schema.object({
  properties: {
    project: Schema.string({
      description: '프로젝트의 이름입니다.',
    }),
    invoiceGroup: Schema.array({
      description: '프로젝트에 포함된 기능 목록입니다.',
      items: GROUP_FEATURE_SCHEMA,
    }),

    total: Schema.object({
      properties: {
        amount: Schema.number({
          description: '프로젝트의 총 금액입니다.',
        }),
        // duration: Schema.number({
        //   description: "프로젝트의 총 소요 기간입니다 (일 단위 숫자).",
        // }),
        // pages: Schema.number({
        //   description: "프로젝트의 총 페이지 수입니다.",
        // }),
      },
    }),
  },
});

export const FILE_FEATURE_SCHEMA = Schema.object({
  properties: {
    feature: Schema.string({
      description: '기능의 이름입니다.',
    }),
    description: Schema.string({
      description: '기능에 대한 설명입니다.',
    }),
    category: Schema.string({
      description: '기능의 카테고리입니다.',
    }),
  },
});

export const GROUP_FILE_FEATURE_SCHEMA = Schema.array({
  description: '공통 카테고리에 속하는 하나 이상의 기능 목록입니다.',
  items: FILE_FEATURE_SCHEMA,
});

export const FILE_EXTRACTION_SCHEMA = Schema.object({
  properties: {
    features: Schema.array({
      description: '파일에서 추출된 식별된 기능 목록입니다.',
      items: GROUP_FILE_FEATURE_SCHEMA,
    }),

    missing_features: Schema.array({
      description:
        '웹 애플리케이션을 향상시킬 수 있는 제안된 추가 기능 목록입니다.',
      items: GROUP_FILE_FEATURE_SCHEMA,
    }),
  },
});
