import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { ArrowLeftOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";

interface LabelFormModalProps {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  mode: "create" | "edit";
  labelData?: { title: string; color: string };
  onSubmit: (data: { title: string; color: string }) => void;
  onDelete: () => void;
}

const LabelFormModal: React.FC<LabelFormModalProps> = ({
  visible,
  onClose,
  onBack,
  mode,
  labelData,
  onSubmit,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const colors = [
    "#C6F6D5", "#FEF3C7", "#FDE68A", "#FECACA", "#E9D5FF",
    "#34D399", "#FBBF24", "#FB923C", "#F87171", "#A78BFA",
  ];

  // Cập nhật form khi labelData thay đổi
  useEffect(() => {
    if (labelData) {
      setTitle(labelData.title);
      setSelectedColor(labelData.color);
    } else {
      setTitle("");
      setSelectedColor(colors[0]); // Mặc định color đầu tiên
    }
  }, [labelData, visible, mode]);

  const handleSubmit = () => {
    if (!title.trim()) {
      console.warn("⚠️ Title is required");
      return;
    }

    console.log(
      mode === "create" ? "🟢 Create label" : "✏️ Edit label",
      { title, color: selectedColor }
    );

    onSubmit({ title: title.trim(), color: selectedColor });
  };

  const handleDelete = () => {
    console.log("🗑️ Delete label");
    onDelete();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={300}
      centered
      closable={false}
      bodyStyle={{
        padding: "16px 20px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined
            onClick={onBack}
            className="cursor-pointer text-gray-600 hover:text-gray-800 transition"
          />
          <h2 className="text-base font-semibold text-gray-700">
            {mode === "create" ? "Create label" : "Edit label"}
          </h2>
        </div>
        <CloseOutlined
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-gray-700 transition"
        />
      </div>

      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Label name
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter label name"
          className="h-[36px] text-sm"
          maxLength={50}
        />
        <p className="text-xs text-gray-400 mt-1">{title.length}/50</p>
      </div>

      {/* Color Selector */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Select a color</p>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className="w-[40px] h-[40px] rounded cursor-pointer relative transition-all hover:scale-110"
              style={{
                backgroundColor: color,
                border:
                  selectedColor === color
                    ? "3px solid #2563EB"
                    : "2px solid #E5E7EB",
              }}
            >
              {selectedColor === color && (
                <CheckOutlined
                  className="absolute text-white font-bold"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "18px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {title && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <div
            className="h-8 rounded flex items-center px-3 text-sm font-medium text-white w-full"
            style={{ backgroundColor: selectedColor }}
          >
            {title}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto pt-3 border-t border-gray-200 flex gap-2 justify-between">
        {mode === "create" ? (
          <Button
            type="primary"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 w-full"
            size="large"
          >
            Create
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              size="large"
              style={{ flex: 1 }}
            >
              Save
            </Button>
            <Button
              danger
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="large"
              style={{ flex: 1 }}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LabelFormModal;