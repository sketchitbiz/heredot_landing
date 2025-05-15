"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { THEME_COLORS, ThemeMode } from "@/styles/theme_colors";

interface GenericDateRangePickerProps {
  initialFromDate: string;
  initialToDate: string;
  onDateChange: (fromDate: string, toDate: string) => void;
  initialSelectedRange?: "6개월" | "1년" | "2년";
  themeMode?: ThemeMode;
}

const GenericDateRangePicker: React.FC<GenericDateRangePickerProps> = ({
  initialFromDate,
  initialToDate,
  onDateChange,
  initialSelectedRange = "6개월",
  themeMode = "dark",
}) => {
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [selectedRange, setSelectedRange] = useState(initialSelectedRange);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dateBoxRef = useRef<HTMLDivElement>(null);

  // Update local state if initial props change
  useEffect(() => {
    setFromDate(initialFromDate);
    setToDate(initialToDate);
  }, [initialFromDate, initialToDate]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node) &&
      dateBoxRef.current &&
      !dateBoxRef.current.contains(event.target as Node)
    ) {
      setShowDatePicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleRangeClick = (range: "6개월" | "1년" | "2년") => {
    const today = dayjs();
    let from;
    if (range === "6개월") from = today.subtract(6, "month");
    else if (range === "1년") from = today.subtract(1, "year");
    else if (range === "2년") from = today.subtract(2, "year");
    else return; // Should not happen with defined types

    const newFromDate = from.format("YYYY-MM-DD");
    const newToDate = today.format("YYYY-MM-DD");

    setFromDate(newFromDate);
    setToDate(newToDate);
    setSelectedRange(range);
    onDateChange(newFromDate, newToDate); // Notify parent
  };

  const handleDateBoxClick = () => {
    setShowDatePicker((prevShow) => !prevShow);
    if (!showDatePicker) {
      setIsSelectingFromDate(true);
    }
  };

  const handleDateChange = (dates: any, event?: any) => {
    if (!dates) return;

    const formattedDate = dayjs(dates).format("YYYY-MM-DD");

    if (isSelectingFromDate) {
      setFromDate(formattedDate);
      setIsSelectingFromDate(false);
    } else {
      if (dayjs(formattedDate).isBefore(dayjs(fromDate))) {
        const currentFrom = fromDate;
        setFromDate(formattedDate);
        setToDate(currentFrom);
        onDateChange(formattedDate, currentFrom);
      } else {
        setToDate(formattedDate);
        onDateChange(fromDate, formattedDate);
      }
      setShowDatePicker(false);
    }
  };

  return (
    <DateContainer $themeMode={themeMode}>
      <DateBox ref={dateBoxRef} onClick={handleDateBoxClick} $themeMode={themeMode}>
        {fromDate} ~ {toDate}
        <img src="/icon_burger.png" alt="달력" width="10" height="16" style={{ transform: "rotate(270deg)" }} />
      </DateBox>
      {showDatePicker && (
        <DatePickerWrapper ref={datePickerRef} $themeMode={themeMode}>
          <StyledDatePicker
            selected={isSelectingFromDate ? dayjs(fromDate).toDate() : dayjs(toDate).toDate()}
            onChange={handleDateChange}
            dateFormat="YYYY-MM-DD"
            showPopperArrow={false}
            calendarClassName="custom-calendar"
            inline
            selectsStart={!isSelectingFromDate}
            selectsEnd={isSelectingFromDate}
            startDate={dayjs(fromDate).toDate()}
            endDate={dayjs(toDate).toDate()}
          />
        </DatePickerWrapper>
      )}
      <RangeButtonGroup $themeMode={themeMode}>
        <RangeButton
          selected={selectedRange === "6개월"}
          onClick={() => handleRangeClick("6개월")}
          $themeMode={themeMode}>
          6개월
        </RangeButton>
        <RangeButton selected={selectedRange === "1년"} onClick={() => handleRangeClick("1년")} $themeMode={themeMode}>
          1년
        </RangeButton>
        <RangeButton selected={selectedRange === "2년"} onClick={() => handleRangeClick("2년")} $themeMode={themeMode}>
          2년
        </RangeButton>
      </RangeButtonGroup>
    </DateContainer>
  );
};

export default GenericDateRangePicker;

// --- Styled Components (Keep as they were in the original DateRangePicker) ---
const DateContainer = styled.div<{ $themeMode: ThemeMode }>`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const DateBox = styled.div<{ $themeMode: ThemeMode }>`
  padding: 11px 14px;
  background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#E0E0E0" : THEME_COLORS.dark.inputBackground)};
  color: ${({ $themeMode }) => ($themeMode === "light" ? "black" : THEME_COLORS.dark.inputText)};
  font-weight: 500;
  border-radius: 0px;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? "#E0E0E0" /* 배경색과 동일하게 */ : THEME_COLORS.dark.borderColor)};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
`;

const RangeButtonGroup = styled.div<{ $themeMode: ThemeMode }>`
  display: flex;
`;

const RangeButton = styled.button<{ selected: boolean; $themeMode: ThemeMode }>`
  width: 60px;
  padding: 12px 12px;
  margin: 0;
  background-color: ${({ selected, $themeMode }) =>
    selected
      ? $themeMode === "light"
        ? THEME_COLORS.light.primary
        : THEME_COLORS.dark.primary
      : $themeMode === "light"
      ? "#E0E0E0"
      : "#707281"};
  color: ${({ selected, $themeMode }) =>
    selected
      ? $themeMode === "light"
        ? THEME_COLORS.light.buttonText
        : THEME_COLORS.dark.buttonText
      : $themeMode === "light"
      ? THEME_COLORS.light.text
      : "#8c8e96"};
  border: 1px solid ${({ $themeMode }) => ($themeMode === "light" ? "#E6E7E9" : THEME_COLORS.dark.borderColor)};
  border-left: none;
  border-radius: 0px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:first-child {
    border-left: 1px solid ${({ $themeMode }) => ($themeMode === "light" ? "#E6E7E9" : THEME_COLORS.dark.borderColor)};
  }
`;

const DatePickerWrapper = styled.div<{ $themeMode: ThemeMode }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  z-index: 1000;

  .custom-calendar {
    background-color: ${({ $themeMode }) =>
      $themeMode === "light" ? THEME_COLORS.light.tableBackground : THEME_COLORS.dark.inputBackground};
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.inputText)};
    border: 1px solid
      ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.inputText)};
    width: 2em;
    line-height: 2em;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.primary : "#666666")};
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.buttonText : "#FFFFFF")};
    border-radius: 50%;
  }

  .react-datepicker__day--in-selecting-range {
    background-color: transparent;
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.inputText)};
    border-radius: 0;
  }

  .react-datepicker__day--in-range {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#e0e0e0" : "#424451")};
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.inputText)};
    border-radius: 0;
  }

  .react-datepicker__day--range-start.react-datepicker__day--range-end,
  .react-datepicker__day--selected.react-datepicker__day--in-selecting-range {
    border-radius: 50%;
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.primary : "#666666")};
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.buttonText : "#FFFFFF")};
  }

  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.primary : "#666666")};
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.buttonText : "#FFFFFF")};
    border-radius: 50%;
  }

  .react-datepicker__day:hover {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#d0d0d0" : "#555555")};
    border-radius: 50%;
  }

  .react-datepicker__day--today {
    font-weight: bold;
    border: 1px solid ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.accent : "#888888")};
    border-radius: 50%;
  }

  .react-datepicker__day--outside-month {
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#AAAAAA" : "#666666")};
  }

  .react-datepicker__header {
    background-color: ${({ $themeMode }) =>
      $themeMode === "light" ? "#F0F0F0" : THEME_COLORS.dark.tableHeaderBackground};
    border-bottom: 1px solid
      ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.borderColor : THEME_COLORS.dark.borderColor)};
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: ${({ $themeMode }) =>
      $themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.tableHeaderText};
  }

  .react-datepicker__navigation-icon::before {
    border-color: ${({ $themeMode }) =>
      $themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.inputText};
  }
`;

const StyledDatePicker = styled(DatePicker as any)``;
