// src/utils/formatters.ts

// 각 국가 코드별 환율 정보 (2023년 기준)
export const exchangeRates = {
  USD: 1350, // 1 USD = 1,350 KRW
  JPY: 9, // 1 JPY = 9 KRW
  CNY: 190, // 1 CNY = 190 KRW
  EUR: 1450, // 1 EUR = 1,450 KRW
  GBP: 1700, // 1 GBP = 1,700 KRW
};

// 국가 코드별 통화 기호
export const currencySymbols = {
  KR: '₩',
  US: '$',
  JP: '¥',
  CN: '¥',
  GB: '£',
  EU: '€',
  default: '$',
};

// 국가 코드를 통화 코드로 변환
export const getCountryCurrency = (countryCode: string | null): string => {
  if (!countryCode) return 'USD';
  switch (countryCode) {
    case 'KR':
      return 'KRW';
    case 'US':
      return 'USD';
    case 'JP':
      return 'JPY';
    case 'CN':
      return 'CNY';
    case 'GB':
      return 'GBP';
    case 'DE':
    case 'FR':
    case 'IT':
    case 'ES':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'FI':
    case 'PT':
    case 'IE':
    case 'GR':
    case 'SK':
    case 'SI':
    case 'LU':
    case 'LV':
    case 'LT':
    case 'EE':
    case 'CY':
    case 'MT':
      return 'EUR';
    default:
      return 'USD';
  }
};

// 통화 심볼 가져오기
export const getCurrencySymbol = (countryCode: string | null): string => {
  if (!countryCode) return currencySymbols.default;
  const code = countryCode as keyof typeof currencySymbols;
  return currencySymbols[code] || currencySymbols.default;
};

// 금액 포맷 함수 - 통화 변환 및 표시 기능 추가
export const formatAmount = (
  amount: number | string,
  countryCode: string | null,
  forceDetailed: boolean = false
): string => {
  if (typeof amount !== 'number') return amount;
  if (forceDetailed || countryCode !== 'KR') {
    const localCurrency = getCountryCurrency(countryCode);
    const localSymbol = getCurrencySymbol(countryCode);
    let displaySymbol = currencySymbols.US;
    let convertedAmountForDisplay = Math.round(
      amount / (exchangeRates['USD'] || 1350)
    );
    if (countryCode !== 'KR') {
      displaySymbol = localSymbol;
      if (exchangeRates[localCurrency as keyof typeof exchangeRates]) {
        convertedAmountForDisplay = Math.round(
          amount / exchangeRates[localCurrency as keyof typeof exchangeRates]
        );
      } else if (localCurrency === 'KRW') {
        displaySymbol = currencySymbols.US;
        convertedAmountForDisplay = Math.round(
          amount / (exchangeRates['USD'] || 1350)
        );
      }
    }
    return `${displaySymbol}${convertedAmountForDisplay.toLocaleString()} (₩${amount.toLocaleString()})`;
  }
  return `${amount.toLocaleString()} 원`;
};

// PDF용 금액 포맷 함수
export const formatAmountForPdf = (
  amount: number | string,
  countryCodeFromUser: string,
  forceDetailed: boolean = true
): string => {
  if (typeof amount !== 'number') return amount;
  const effectiveCountryCode = countryCodeFromUser || 'KR';
  if (forceDetailed || effectiveCountryCode !== 'KR') {
    const localCurrencyForPdf = getCountryCurrency(effectiveCountryCode);
    const localSymbolForPdf = getCurrencySymbol(effectiveCountryCode);
    let displaySymbol = currencySymbols.US;
    let convertedAmountForDisplay = Math.round(
      amount / (exchangeRates['USD'] || 1350)
    );
    if (effectiveCountryCode !== 'KR') {
      displaySymbol = localSymbolForPdf;
      if (exchangeRates[localCurrencyForPdf as keyof typeof exchangeRates]) {
        convertedAmountForDisplay = Math.round(
          amount /
            exchangeRates[localCurrencyForPdf as keyof typeof exchangeRates]
        );
      } else if (localCurrencyForPdf === 'KRW') {
        displaySymbol = currencySymbols.US;
        convertedAmountForDisplay = Math.round(
          amount / (exchangeRates['USD'] || 1350)
        );
      }
    }
    return `${displaySymbol}${convertedAmountForDisplay.toLocaleString()} (₩${amount.toLocaleString()})`;
  }
  return `₩${amount.toLocaleString()}`;
};

// 날짜 포맷 함수 (YYYY-MM-DD HH:MM:SS)
export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')} ${String(
    date.getHours()
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
    date.getSeconds()
  ).padStart(2, '0')}`;
};
