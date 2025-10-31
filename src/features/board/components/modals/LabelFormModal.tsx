import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { ArrowLeftOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";

interface LabelFormModalProps {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  mode: "create" | "edit";
  labelData?: { title: string; color: string };
}

const LabelFormModal: React.FC<LabelFormModalProps> = ({
  visible,
  onClose,
  onBack,
  mode,
  labelData,
}) => {
  const [title, setTitle] = useState(labelData?.title || "");
  const [selectedColor, setSelectedColor] = useState(labelData?.color || "");

  const colors = [
    "#C6F6D5", "#FEF3C7", "#FDE68A", "#FECACA", "#E9D5FF",
    "#34D399", "#FBBF24", "#FB923C", "#F87171", "#A78BFA",
  ];

  const handleSubmit = () => {
    console.log(mode === "create" ? "🟢 Create label" : "✏️ Edit label", {
      title,
      color: selectedColor,
    });
    onClose();
  };

  const handleDelete = () => {
    console.log("❌ Delete label");
    onClose();
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
        height: "350px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined
            onClick={onBack}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          />
          <h2 className="text-base font-semibold text-gray-700">
            {mode === "create" ? "Create label" : "Edit label"}
          </h2>
        </div>
        <CloseOutlined
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
        />
      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter label title"
          className="h-[36px] text-sm"
        />
      </div>

      {/* Select color */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Select a color</p>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className="w-[40px] h-[32px] rounded cursor-pointer relative"
              style={{
                backgroundColor: color,
                border:
                  selectedColor === color ? "2px solid #2563EB" : "1px solid #E5E7EB",
              }}
            >
              {selectedColor === color && (
                <CheckOutlined
                  className="absolute text-green-600"
                  style={{ top: "6px", left: "10px", fontSize: "14px" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-auto pt-2 border-t border-gray-200 flex gap-2 justify-between">
        {mode === "create" ? (
          <Button
            type="primary"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            Create
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 w-[48%]"
            >
              Save
            </Button>
            <Button
              danger
              onClick={handleDelete}
              className="w-[48%] bg-red-600 hover:bg-red-700 text-white"
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
