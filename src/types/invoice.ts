export interface InvoiceFeatureItem {
  id: string;
  feature: string;
  description: string;
  amount: number | string;
  duration?: string;
  category?: string;
  pages?: number | string;
  note?: string;
}

export interface InvoiceGroup {
  category: string;
  items: InvoiceFeatureItem[];
}

export interface InvoiceTotal {
  amount: number;
  duration?: number;
  pages?: number;
  totalConvertedDisplay?: string;
}

export interface InvoiceDataType {
  project: string;
  invoiceGroup: InvoiceGroup[];
  total: InvoiceTotal;
}

export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string;
  fileType?: string;
  invoiceData?: InvoiceDataType;
}

export interface MessageProps extends Omit<Message, 'id'> {
  onActionClick: (action: string, data?: { featureId?: string }) => void;
  calculatedTotalAmount?: number;
  calculatedTotalDuration?: number;
  calculatedTotalPages?: number;
  currentItems?: Array<
    InvoiceDataType['invoiceGroup'][number]['items'][number] & {
      isDeleted: boolean;
    }
  >;
  lang: string;
}

export interface InvoiceDetails {
  parsedJson?: InvoiceDataType; // PDF 내용의 기본 데이터
  items: Array<
    InvoiceDataType['invoiceGroup'][number]['items'][number] & {
      isDeleted: boolean;
    }
  >; // 실제 표시될 아이템 목록 (삭제 여부 포함)
  currentTotal: number; // 현재 총액 (계산된 값)
  currentTotalDuration: number; // 총 예상 기간 (일 단위 숫자, 계산된 값)
  currentTotalPages: number; // 총 예상 페이지 수 (숫자, 계산된 값)
  userName?: string | null; // PDF에 표시될 고객명
  userPhone?: string | null; // PDF에 표시될 고객 전화번호
  userEmail?: string | null; // PDF에 표시될 고객 이메일
}
