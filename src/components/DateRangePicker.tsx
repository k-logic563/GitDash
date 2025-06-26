'use client';

import { useState, useRef, useEffect } from 'react';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = 400; // カレンダーの概算高さ
      
      // ボタンの下にカレンダーを表示するのに十分なスペースがあるかチェック
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        setDropdownPosition('bottom');
      } else {
        setDropdownPosition('top');
      }
    }
  }, [isOpen]);

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : '';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's trailing days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!value.startDate || !value.endDate) return false;
    return date >= value.startDate && date <= value.endDate;
  };

  const isDateSelected = (date: Date) => {
    if (!value.startDate && !value.endDate) return false;
    const dateStr = date.toDateString();
    return (value.startDate?.toDateString() === dateStr) || 
           (value.endDate?.toDateString() === dateStr);
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart || !value.startDate) {
      onChange({ startDate: date, endDate: null });
      setSelectingStart(false);
    } else {
      if (date < value.startDate) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getDisplayText = () => {
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    } else if (value.startDate) {
      return `${formatDate(value.startDate)} - 終了日を選択`;
    }
    return '期間を選択';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{getDisplayText()}</span>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${
            dropdownPosition === 'bottom' 
              ? 'top-full mt-1' 
              : 'bottom-full mb-1'
          } right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[300px]`}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-semibold">
              {currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((dayInfo, index) => {
              const isSelected = isDateSelected(dayInfo.date);
              const isInRange = isDateInRange(dayInfo.date);
              const isToday = dayInfo.date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(dayInfo.date)}
                  className={`
                    h-8 w-8 text-sm rounded transition-colors
                    ${!dayInfo.isCurrentMonth 
                      ? 'text-gray-300 hover:text-gray-400' 
                      : 'text-gray-900 hover:bg-blue-50'
                    }
                    ${isSelected 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : ''
                    }
                    ${isInRange && !isSelected 
                      ? 'bg-blue-100 text-blue-900' 
                      : ''
                    }
                    ${isToday && !isSelected 
                      ? 'bg-gray-100 font-semibold' 
                      : ''
                    }
                  `}
                >
                  {dayInfo.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between mt-4 pt-3 border-t">
            <button
              onClick={() => {
                onChange({ startDate: null, endDate: null });
                setSelectingStart(true);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              クリア
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}