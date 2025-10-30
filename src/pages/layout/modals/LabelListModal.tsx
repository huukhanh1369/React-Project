import React, { useState } from "react";
import { Modal, Button, Checkbox } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import LabelFormModal from "./LabelFormModal";

interface Label {
  id: number;
  title: string;
  color: string;
}

interface LabelListModalProps {
  visible: boolean;
  onClose: () => void;
}

const LabelListModal: React.FC<LabelListModalProps> = ({ visible, onClose }) => {
  // Danh sách label giả lập
  const [labels, setLabels] = useState<Label[]>([
    { id: 1, title: "done", color: "#34D399" },
    { id: 2, title: "urgent", color: "#FB923C" },
    { id: 3, title: "todo", color: "#F87171" },
    { id: 4, title: "in-progress", color: "#A78BFA" },
  ]);

  const [checkedLabels, setCheckedLabels] = useState<number[]>([]);
  const [isLabelFormVisible, setIsLabelFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  // Mở modal tạo mới
  const handleCreateNew = () => {
    setFormMode("create");
    setSelectedLabel(null);
    setIsLabelFormVisible(true);
  };

  // Mở modal chỉnh sửa
  const handleEditLabel = (label: Label) => {
    setFormMode("edit");
    setSelectedLabel(label);
    setIsLabelFormVisible(true);
  };

  // Toggle chọn label
  const handleCheck = (id: number) => {
    setCheckedLabels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* --- Modal chính (danh sách label) --- */}
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={350}
        centered
        closable
        closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
        bodyStyle={{
          padding: "16px 20px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <h2 className="text-center text-[15px] font-semibold text-gray-700 mb-3">
          Labels
        </h2>

        {/* Danh sách label */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          <p className="text-xs font-medium text-gray-600 mb-1">Labels</p>
          {labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center justify-between rounded"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checkedLabels.includes(label.id)}
                  onChange={() => handleCheck(label.id)}
                />
                <div
                  className="h-8 rounded flex items-center px-3 text-sm font-medium text-white"
                  style={{ backgroundColor: label.color, width: "200px" }}
                >
                  {label.title}
                </div>
              </div>

              {/* Nút edit */}
              <EditOutlined
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => handleEditLabel(label)}
              />
            </div>
          ))}
        </div>

        {/* Nút tạo mới */}
        <div className="pt-3 border-t border-gray-200">
          <Button
            type="default"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={handleCreateNew}
          >
            Create a new label
          </Button>
        </div>
      </Modal>

      {/* --- Modal con (Create/Edit label) --- */}
      <LabelFormModal
        visible={isLabelFormVisible}
        onClose={() => setIsLabelFormVisible(false)}
        onBack={() => setIsLabelFormVisible(false)}
        mode={formMode}
        labelData={selectedLabel || undefined}
      />
    </>
  );
};

export default LabelListModal;
