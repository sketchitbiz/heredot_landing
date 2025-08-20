import { useState, useEffect } from 'react';

const DAILY_LIMIT = 11; // 비회원 일일 API 호출 제한 횟수
const STORAGE_KEY = 'apiCallLimit';

interface ApiLimitData {
  date: string;
  count: number;
}

const getCurrentDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const useApiLimit = (isLoggedIn: boolean) => {
  const [remainingCount, setRemainingCount] = useState<number>(DAILY_LIMIT);
  const [isLimitInitialized, setIsLimitInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn) {
      // 로그인 사용자는 제한 없음 (또는 서버에서 관리)
      setRemainingCount(Infinity); // 무제한으로 표시하거나, 다른 값을 사용할 수 있음
      setIsLimitInitialized(true);
      return;
    }

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const todayString = getCurrentDateString();

      if (storedData) {
        const parsedData: ApiLimitData = JSON.parse(storedData);
        if (parsedData.date === todayString) {
          setRemainingCount(parsedData.count);
        } else {
          // 날짜가 다르면 초기화
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date: todayString, count: DAILY_LIMIT })
          );
          setRemainingCount(DAILY_LIMIT);
        }
      } else {
        // 데이터가 없으면 새로 생성
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ date: todayString, count: DAILY_LIMIT })
        );
        setRemainingCount(DAILY_LIMIT);
      }
    } catch (error) {
      console.error('Error accessing localStorage for API limit:', error);
      // localStorage 접근 불가 시 기본값 사용
      setRemainingCount(DAILY_LIMIT);
    }
    setIsLimitInitialized(true);
  }, [isLoggedIn]);

  const decreaseCount = () => {
    if (isLoggedIn || !isLimitInitialized) return true; // 로그인 했거나 아직 초기화 안됐으면 차감 안함 (또는 항상 성공)

    if (remainingCount > 0) {
      const newCount = remainingCount - 1;
      setRemainingCount(newCount);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ date: getCurrentDateString(), count: newCount })
        );
      } catch (error) {
        console.error('Error updating localStorage for API limit:', error);
      }
      return true;
    } else {
      return false; // 횟수 소진
    }
  };

  const resetCount = () => {
    if (isLoggedIn) return;
    const todayString = getCurrentDateString();
    setRemainingCount(DAILY_LIMIT);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: todayString, count: DAILY_LIMIT })
      );
    } catch (error) {
      console.error('Error resetting localStorage for API limit:', error);
    }
  };

  return { remainingCount, decreaseCount, isLimitInitialized, resetCount };
};
