"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { THEME_COLORS, ThemeMode } from "@/styles/theme_colors";

type RangeType = "금월" | "지난달" | "1년" | "지정";

interface GenericDateRangePickerProps {
  initialFromDate: string;
  initialToDate: string;
  onDateChange: (fromDate: string, toDate: string) => void;
  initialSelectedRange?: RangeType;
  themeMode?: ThemeMode;
}

const GenericDateRangePicker: React.FC<GenericDateRangePickerProps> = ({
  initialFromDate,
  initialToDate,
  onDateChange,
  initialSelectedRange = "금월",
  themeMode = "dark",
}) => {
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [selectedRange, setSelectedRange] = useState<RangeType>(initialSelectedRange);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dateBoxRef = useRef<HTMLDivElement>(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleRangeClick = (range: RangeType) => {
    const today = dayjs();
  
    if (range === "지정") {
      setSelectedRange("지정");
      setShowDatePicker(true);
      setIsSelectingFromDate(true);
      return;
    }
  
    if (range === "금월") {
      const from = today.startOf("month");
      const newFromDate = from.format("YYYY-MM-DD");
      const newToDate = today.format("YYYY-MM-DD");
  
      setFromDate(newFromDate);
      setToDate(newToDate);
      setSelectedRange(range);
      onDateChange(newFromDate, newToDate);
      return;
    }
  
    if (range === "지난달") {
      const from = today.subtract(1, "month").startOf("month");
      const to = today.subtract(1, "month").endOf("month");
      const newFromDate = from.format("YYYY-MM-DD");
      const newToDate = to.format("YYYY-MM-DD");
  
      setFromDate(newFromDate);
      setToDate(newToDate);
      setSelectedRange(range);
      onDateChange(newFromDate, newToDate);
      return;
    }
  
    if (range === "1년") {
      const from = today.subtract(1, "year");
      const newFromDate = from.format("YYYY-MM-DD");
      const newToDate = today.format("YYYY-MM-DD");
  
      setFromDate(newFromDate);
      setToDate(newToDate);
      setSelectedRange(range);
      onDateChange(newFromDate, newToDate);
      return;
    }
  };
  

  const handleDateBoxClick = () => {
    setShowDatePicker((prev) => !prev);
    if (!showDatePicker) {
      setIsSelectingFromDate(true);
    }
  };

  const handleDateChange = (dates: any) => {
    const formatted = dayjs(dates).format("YYYY-MM-DD");

    if (isSelectingFromDate) {
      setFromDate(formatted);
      setIsSelectingFromDate(false);
    } else {
      if (dayjs(formatted).isBefore(dayjs(fromDate))) {
        setFromDate(formatted);
        setToDate(fromDate);
        onDateChange(formatted, fromDate);
      } else {
        setToDate(formatted);
        onDateChange(fromDate, formatted);
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
        {(["금월", "지난달", "1년", "지정"] as RangeType[]).map((range) => (
          <RangeButton
            key={range}
            selected={selectedRange === range}
            onClick={() => handleRangeClick(range)}
            $themeMode={themeMode}
          >
            {range}
          </RangeButton>
        ))}
      </RangeButtonGroup>
    </DateContainer>
  );
};

export default GenericDateRangePicker;

// Styled Components
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
    ${({ $themeMode }) => ($themeMode === "light" ? "#E0E0E0" : THEME_COLORS.dark.borderColor)};
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

  .react-datepicker__day--in-range {
    background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#e0e0e0" : "#424451")};
    color: ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.text : THEME_COLORS.dark.inputText)};
  }

  .react-datepicker__day--today {
    font-weight: bold;
    border: 1px solid ${({ $themeMode }) => ($themeMode === "light" ? THEME_COLORS.light.accent : "#888888")};
    border-radius: 50%;
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
`;

const StyledDatePicker = styled(DatePicker as any)``;
