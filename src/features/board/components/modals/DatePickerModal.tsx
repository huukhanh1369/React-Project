import React, { useState, useEffect } from "react";
import { Modal, Button, DatePicker, Checkbox, message, Empty } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../task/taskSlice";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  taskId?: string;
  initialStartDate?: Dayjs | null;
  initialDueDate?: Dayjs | null;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  taskId,
  initialStartDate = null,
  initialDueDate = null,
}) => {
  const dispatch = useDispatch();

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [dueDate, setDueDate] = useState<Dayjs | null>(initialDueDate);
  const [isStartChecked, setIsStartChecked] = useState(!!initialStartDate);
  const [isDueChecked, setIsDueChecked] = useState(!!initialDueDate);
  const [errors, setErrors] = useState<string[]>([]);

  // Cập nhật dates khi modal mở
  useEffect(() => {
    if (visible) {
      setStartDate(initialStartDate);
      setDueDate(initialDueDate);
      setIsStartChecked(!!initialStartDate);
      setIsDueChecked(!!initialDueDate);
      setErrors([]);
    }
  }, [visible, initialStartDate, initialDueDate]);

  // Chuyển tháng
  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Chọn ngày từ lịch
  const handleSelectDate = (date: Dayjs) => {
    if (isStartChecked && !isDueChecked) {
      setStartDate(date);
    } else if (isDueChecked && !isStartChecked) {
      setDueDate(date);
    } else if (isStartChecked && isDueChecked) {
      // Nếu cả hai checked, logic: nếu ngày này trước startDate thì set startDate, ngược lại set dueDate
      if (date.isBefore(startDate)) {
        setStartDate(date);
      } else {
        setDueDate(date);
      }
    }
  };

  // Kiểm tra validate
  const validateDates = (): boolean => {
    const newErrors: string[] = [];
    const today = dayjs().startOf("day");

    // Kiểm tra start date
    if (isStartChecked && startDate) {
      if (startDate.isBefore(today)) {
        newErrors.push("❌ Start date must be today or in the future");
      }
    }

    // Kiểm tra due date
    if (isDueChecked && dueDate) {
      if (dueDate.isBefore(today)) {
        newErrors.push("❌ Due date must be today or in the future");
      }
    }

    // Kiểm tra due date không được sớm hơn start date
    if (isStartChecked && isDueChecked && startDate && dueDate) {
      if (dueDate.isBefore(startDate)) {
        newErrors.push("❌ Due date cannot be earlier than start date");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Lưu
  const handleSave = async () => {
    if (!validateDates()) {
      console.warn("⚠️ Validation failed:", errors);
      return;
    }

    try {
      if (taskId) {
        console.log("💾 Saving dates for task:", taskId);
        console.log("   Start date:", startDate?.format("YYYY-MM-DD"));
        console.log("   Due date:", dueDate?.format("YYYY-MM-DD HH:mm"));

        // Dispatch update task dengan dates
        await dispatch(
          updateTask({
            id: taskId,
            startDate: isStartChecked ? startDate?.format("YYYY-MM-DDTHH:mm:ss") : null,
            dueDate: isDueChecked ? dueDate?.format("YYYY-MM-DDTHH:mm:ss") : null,
          }) as any
        );

        message.success("Dates saved successfully!");
        console.log("✅ Dates saved!");
      }
    } catch (error) {
      console.error("Error saving dates:", error);
      message.error("Failed to save dates");
    }

    onClose();
  };

  // Xóa tất cả dates
  const handleRemoveAll = async () => {
    try {
      if (taskId) {
        console.log("🗑️ Removing all dates for task:", taskId);

        await dispatch(
          updateTask({
            id: taskId,
            startDate: null,
            dueDate: null,
          }) as any
        );

        message.success("Dates removed successfully!");
        setStartDate(null);
        setDueDate(null);
        setIsStartChecked(false);
        setIsDueChecked(false);
      }
    } catch (error) {
      console.error("Error removing dates:", error);
      message.error("Failed to remove dates");
    }

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

  const today = dayjs().startOf("day");

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={320}
      centered
      closable
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
      bodyStyle={{
        padding: "16px 20px",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <h2 className="text-center text-[15px] font-semibold text-gray-700 mb-3">
        📅 Dates
      </h2>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
          {errors.map((error, idx) => (
            <p key={idx} className="text-xs text-red-600 mb-1">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Bộ chọn tháng */}
      <div className="flex justify-between items-center mb-3">
        <LeftOutlined
          className="cursor-pointer hover:text-gray-700 text-gray-500 transition"
          onClick={handlePrevMonth}
        />
        <span className="font-medium text-gray-700">
          {currentMonth.format("MMMM YYYY")}
        </span>
        <RightOutlined
          className="cursor-pointer hover:text-gray-700 text-gray-500 transition"
          onClick={handleNextMonth}
        />
      </div>

      {/* Lịch */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mb-4 gap-1">
        {daysArray.map((day, index) => {
          const isSelected =
            (startDate && day?.isSame(startDate, "day")) ||
            (dueDate && day?.isSame(dueDate, "day"));
          const isPast = day && day.isBefore(today);
          const isToday = day && day.isSame(today, "day");

          return (
            <div
              key={index}
              className={`h-8 w-8 flex items-center justify-center rounded cursor-pointer transition ${
                isSelected
                  ? "bg-blue-600 text-white font-semibold"
                  : isPast
                  ? "text-gray-300 cursor-not-allowed"
                  : isToday
                  ? "border-2 border-blue-400 text-gray-800"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
              onClick={() => day && !isPast && handleSelectDate(day)}
            >
              {day ? day.date() : ""}
            </div>
          );
        })}
      </div>

      {/* Start date checkbox & input */}
      <div className="flex items-start gap-2 mb-3 p-2 border border-gray-200 rounded">
        <Checkbox
          checked={isStartChecked}
          onChange={(e) => setIsStartChecked(e.target.checked)}
          className="mt-1"
        />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Start date
          </label>
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            disabled={!isStartChecked}
            value={startDate}
            onChange={setStartDate}
            disabledDate={(current) => current && current.isBefore(today)}
            placeholder="Select start date"
          />
          {startDate && (
            <p className="text-xs text-gray-500 mt-1">
              {startDate.format("dddd, MMMM D, YYYY")}
            </p>
          )}
        </div>
      </div>

      {/* Due date checkbox & input */}
      <div className="flex items-start gap-2 mb-4 p-2 border border-gray-200 rounded">
        <Checkbox
          checked={isDueChecked}
          onChange={(e) => setIsDueChecked(e.target.checked)}
          className="mt-1"
        />
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Due date
          </label>
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY HH:mm"
            showTime
            disabled={!isDueChecked}
            value={dueDate}
            onChange={setDueDate}
            disabledDate={(current) => current && current.isBefore(today)}
            placeholder="Select due date"
          />
          {dueDate && (
            <p className="text-xs text-gray-500 mt-1">
              {dueDate.format("dddd, MMMM D, YYYY • h:mm A")}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {(startDate || dueDate) && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs font-medium text-blue-900">📋 Summary:</p>
          {startDate && (
            <p className="text-xs text-blue-800">
              • Start: {startDate.format("MMM D, YYYY")}
            </p>
          )}
          {dueDate && (
            <p className="text-xs text-blue-800">
              • Due: {dueDate.format("MMM D, YYYY • h:mm A")}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-200">
        <Button
          type="primary"
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          ✅ Save Dates
        </Button>
        <Button
          danger
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          icon={<DeleteOutlined />}
          onClick={handleRemoveAll}
        >
          🗑️ Remove All
        </Button>
      </div>
    </Modal>
  );
};

export default DatePickerModal;