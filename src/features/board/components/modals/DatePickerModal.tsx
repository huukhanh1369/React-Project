import React, { useState } from "react";
import { Modal, Button, DatePicker, Checkbox } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (startDate: Dayjs | null, dueDate: Dayjs | null) => void;
  initialStartDate?: Dayjs | null;
  initialDueDate?: Dayjs | null;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSave,
  initialStartDate = null,
  initialDueDate = null,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [dueDate, setDueDate] = useState<Dayjs | null>(initialDueDate);
  const [isStartChecked, setIsStartChecked] = useState(!!initialStartDate);
  const [isDueChecked, setIsDueChecked] = useState(!!initialDueDate);

  // Chuyển tháng
  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Chọn ngày từ lịch
  const handleSelectDate = (date: Dayjs) => {
    if (isStartChecked) setStartDate(date);
    else if (isDueChecked) setDueDate(date);
  };

  // Lưu
  const handleSave = () => {
    onSave?.(startDate, dueDate);
    onClose();
  };

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfWeek = currentMonth.startOf("month").day();

  // Mảng ngày
  const daysArray = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array(daysInMonth)
      .fill(null)
      .map((_, i) => currentMonth.date(i + 1)),
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={300}
      centered
      closable
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
      bodyStyle={{
        padding: "16px 20px",
        height: "560px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <h2 className="text-center text-[15px] font-semibold text-gray-700 mb-3">
        Dates
      </h2>

      {/* Bộ chọn tháng */}
      <div className="flex justify-between items-center mb-2">
        <LeftOutlined
          className="cursor-pointer hover:text-gray-700 text-gray-500"
          onClick={handlePrevMonth}
        />
        <span className="font-medium text-gray-700">
          {currentMonth.format("MMMM YYYY")}
        </span>
        <RightOutlined
          className="cursor-pointer hover:text-gray-700 text-gray-500"
          onClick={handleNextMonth}
        />
      </div>

      {/* Lịch */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mb-4">
        {daysArray.map((day, index) => {
          const isSelected =
            (startDate && day?.isSame(startDate, "day")) ||
            (dueDate && day?.isSame(dueDate, "day"));
          return (
            <div
              key={index}
              className={`h-8 w-8 flex items-center justify-center rounded cursor-pointer transition ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 text-gray-800"
              }`}
              onClick={() => day && handleSelectDate(day)}
            >
              {day ? day.date() : ""}
            </div>
          );
        })}
      </div>

      {/* Start date */}
      <div className="flex items-center gap-2 mb-2">
        <Checkbox
          checked={isStartChecked}
          onChange={(e) => setIsStartChecked(e.target.checked)}
        />
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            Start date
          </label>
          <DatePicker
            className="w-full"
            format="M/D/YYYY"
            disabled={!isStartChecked}
            value={startDate}
            onChange={setStartDate}
          />
        </div>
      </div>

      {/* Due date */}
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          checked={isDueChecked}
          onChange={(e) => setIsDueChecked(e.target.checked)}
        />
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            Due date
          </label>
          <DatePicker
            className="w-full"
            showTime
            format="M/D/YYYY h:mm a"
            disabled={!isDueChecked}
            value={dueDate}
            onChange={setDueDate}
          />
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-col gap-2 mt-auto">
        <Button
          type="primary"
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button className="w-full bg-gray-100 hover:bg-gray-200">Remove</Button>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
