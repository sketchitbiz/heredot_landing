import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient'; // apiClient 경로가 맞는지 확인 필요

export interface CurrencyData {
  code: string; // 통화 코드 (예: "USD", "JPY")
  currency: number; // 1 KRW 대비 환율
  // 필요에 따라 다른 필드 추가 (예: 국가명, 통화 기호 등)
}

interface UseCurrencyReturn {
  currencyList: CurrencyData[];
  loading: boolean;
  error: Error | null;
  fetchCurrencies: () => Promise<void>;
  getExchangeRate: (targetCode: string) => number | null;
}

const useCurrency = (): UseCurrencyReturn => {
  const [currencyList, setCurrencyList] = useState<CurrencyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // API 요청 시 빈 객체 {}를 body로 전달 (사용자 요청 기반)
      const response = await apiClient.post<{ data: CurrencyData[] }>(
        '/ai/currency/get-list',
        {}
      );
      // API 응답 구조가 { data: CurrencyData[] } 형태라고 가정
      if (response.data && Array.isArray(response.data.data)) {
        setCurrencyList(response.data.data);
      } else {
        // 예상치 못한 응답 구조 처리
        console.warn(
          '[useCurrency] Unexpected API response structure:',
          response.data
        );
        setCurrencyList([]); // 또는 이전 상태 유지
        // setError(new Error('Unexpected API response structure'));
      }
    } catch (err) {
      console.error('[useCurrency] Error fetching currency data:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch currency data')
      );
    }
    setLoading(false);
  }, []);

  // 특정 통화 코드에 대한 환율 가져오기 (1 KRW 기준)
  const getExchangeRate = useCallback(
    (targetCode: string): number | null => {
      const found = currencyList.find((c) => c.code === targetCode);
      return found ? found.currency : null;
    },
    [currencyList]
  );

  // 컴포넌트 마운트 시 또는 필요에 따라 환율 정보를 자동으로 가져오려면 useEffect 사용
  // useEffect(() => {
  //   fetchCurrencies();
  // }, [fetchCurrencies]);

  return {
    currencyList,
    loading,
    error,
    fetchCurrencies,
    getExchangeRate,
  };
};

export default useCurrency;
