import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import "./boardModal.css";

interface BoardData {
  id?: string;
  title: string;
  background?: string;
  color?: string;
  userId?: number;
  createdAt?: string;
}

interface BoardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (board: BoardData) => void;
  mode?: "create" | "edit";
  initialData?: BoardData | null;
}

const backgrounds = [
  "/images/Board1.png",
  "/images/Board2.png",
  "/images/Board3.png",
  "/images/Board4.png",
];

const colors = [
  "#ff6f00",
  "#7b1fa2",
  "#00c853",
  "#2196f3",
  "#ffc107",
  "#e91e63",
];

const BoardModal: React.FC<BoardModalProps> = ({
  visible,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}) => {
  const [form] = Form.useForm();
  const [selectedBg, setSelectedBg] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  // ✅ Khi mở modal → nạp dữ liệu đúng (chỉ 1 loại: bg hoặc color)
  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({ title: initialData.title });

      if (initialData.background) {
        setSelectedBg(initialData.background);
        setSelectedColor("");
      } else if (initialData.color) {
        setSelectedColor(initialData.color);
        setSelectedBg("");
      } else {
        setSelectedBg("");
        setSelectedColor("");
      }
    } else if (visible && mode === "create") {
      form.resetFields();
      setSelectedBg("");
      setSelectedColor("");
    }
  }, [visible, initialData, form, mode]);

  // ✅ Chỉ chọn 1 trong 2
  const handleSelectBackground = (bg: string) => {
    setSelectedBg(bg);
    setSelectedColor("");
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    setSelectedBg("");
  };

  // ✅ Gửi dữ liệu ra Dashboard
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedBg && !selectedColor) {
        message.warning("Vui lòng chọn Background hoặc Color!");
        return;
      }

      const newBoard: BoardData = {
        id: initialData?.id || String(Date.now()),
        title: values.title.trim(),
        background: selectedBg || undefined,
        color: selectedColor || undefined,
        userId: initialData?.userId || 1,
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };

      // ✅ Bảo đảm chỉ lưu 1 trường: hoặc bg hoặc color
      if (selectedColor) delete newBoard.background;
      if (selectedBg) delete newBoard.color;

      onSubmit(newBoard);
      message.success(
        mode === "edit" ? "Cập nhật board thành công!" : "Tạo board thành công!"
      );
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
        setSelectedBg("");
        setSelectedColor("");
      }}
      footer={null}
      width={498}
      title={mode === "create" ? "Create board" : "Edit board"}
    >
      <Form form={form} layout="vertical">
        {/* Background */}
        <div className="modal-section">
          <h4>Background</h4>
          <div className="bg-list">
            {backgrounds.map((bg) => (
              <div
                key={bg}
                className={`bg-item ${selectedBg === bg ? "active" : ""}`}
                style={{ backgroundImage: `url(${bg})` }}
                onClick={() => handleSelectBackground(bg)}
              >
                {selectedBg === bg && <div className="checkmark">✓</div>}
              </div>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* Color */}
        <div className="modal-section">
          <h4>Color</h4>
          <div className="color-list">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-item ${selectedColor === color ? "active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => handleSelectColor(color)}
              >
                {selectedColor === color && <div className="checkmark">✓</div>}
              </div>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* Title */}
        <div className="modal-section">
          <Form.Item
            name="title"
            label={
              <h4>
                Board title <span className="required">*</span>
              </h4>
            }
            rules={[
              { required: true, message: "Please provide a valid board title." },
            ]}
          >
            <Input placeholder="E.g. Shopping list for birthday..." />
          </Form.Item>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button onClick={onClose} className="close-btn">
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default BoardModal;
