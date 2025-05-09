import { Schema } from "firebase/vertexai";

export const FEATURE_SCHEMA = Schema.object({
  properties: {
    feature: Schema.string({
      description: "<DATA>에 있는 기능명과 동일해야 합니다.",
    }),
    description: Schema.string({
      description: "기능에 대한 설명입니다.",
    }),
    amount: Schema.string({
      description: "기능에 대한 금액입니다. 설정되지 않은 경우 '별도 문의' 또는 '관리자 문의'로 설정하세요.",
    }),
    duration: Schema.string({
      description: "기능에 소요되는 기간입니다. 설정되지 않은 경우 '별도 문의' 또는 '관리자 문의'로 설정하세요.",
    }),
    category: Schema.string({
      description: "기능의 카테고리입니다.",
    }),
    pages: Schema.number({
      description:
        "기능에 필요한 페이지 수입니다. 설정되지 않은 경우 '별도 문의' 또는 '관리자 문의'와 같은 문자열 처리가 필요할 수 있으나, 스키마는 숫자 타입입니다. (실제 구현 시 instruction.ts 참고)",
    }),
  },
});

export const GROUP_FEATURE_SCHEMA = Schema.object({
  description: "프로젝트에 포함된 카테고리 또는 카테고리별 기능 목록입니다.",
  properties: {
    category: Schema.string({
      description: "프로젝트에 포함된 기능들의 카테고리 또는 공통 카테고리입니다.",
    }),
    items: Schema.array({
      description: "공통 카테고리에 속하는 하나 이상의 기능 목록입니다.",
      items: FEATURE_SCHEMA,
    }),
  },
});

export const INVOICE_SCHEMA = Schema.object({
  properties: {
    project: Schema.string({
      description: "프로젝트의 이름입니다.",
    }),
    invoiceGroup: Schema.array({
      description: "프로젝트에 포함된 기능 목록입니다.",
      items: GROUP_FEATURE_SCHEMA,
    }),

    total: Schema.object({
      properties: {
        amount: Schema.number({
          description: "프로젝트의 총 금액입니다.",
        }),
        duration: Schema.number({
          description: "프로젝트의 총 소요 기간입니다 (일 단위 숫자).",
        }),
        pages: Schema.number({
          description: "프로젝트의 총 페이지 수입니다.",
        }),
      },
    }),
  },
});

export const FILE_FEATURE_SCHEMA = Schema.object({
  properties: {
    feature: Schema.string({
      description: "기능의 이름입니다.",
    }),
    description: Schema.string({
      description: "기능에 대한 설명입니다.",
    }),
    category: Schema.string({
      description: "기능의 카테고리입니다.",
    }),
  },
});

export const GROUP_FILE_FEATURE_SCHEMA = Schema.array({
  description: "공통 카테고리에 속하는 하나 이상의 기능 목록입니다.",
  items: FILE_FEATURE_SCHEMA,
});

export const FILE_EXTRACTION_SCHEMA = Schema.object({
  properties: {
    features: Schema.array({
      description: "파일에서 추출된 식별된 기능 목록입니다.",
      items: GROUP_FILE_FEATURE_SCHEMA,
    }),

    missing_features: Schema.array({
      description: "웹 애플리케이션을 향상시킬 수 있는 제안된 추가 기능 목록입니다.",
      items: GROUP_FILE_FEATURE_SCHEMA,
    }),
  },
});
