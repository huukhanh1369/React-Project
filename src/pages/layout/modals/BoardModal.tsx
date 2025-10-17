import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import "./boardModal.css";

interface BoardData {
  title?: string;
  background?: string;
  color?: string;
}

interface BoardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (board: BoardData) => void;
  mode?: "create" | "edit";
  initialData?: BoardData;
}

const BoardModal: React.FC<BoardModalProps> = ({
  visible,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedBg, setSelectedBg] = useState(initialData?.background || "");
  const [selectedColor, setSelectedColor] = useState(initialData?.color || "");

  const backgrounds = [
    "/images/Board1.png",
    "/images/Board2.png",
    "/images/Board3.png",
    "/images/Board4.png",
  ];

  const colors = ["#ff6f00", "#7b1fa2", "#00c853", "#2196f3", "#ffc107", "#e91e63"];

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error("Please provide a valid board title.");
      return;
    }

    const board = { title, background: selectedBg, color: selectedColor };
    onSubmit(board);
    message.success(mode === "create" ? "Board created!" : "Board updated!");
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={498}
      style={{ height: 514 }}
      title={mode === "create" ? "Create board" : "Edit board"}
    >
      {/* Background */}
      <div className="modal-section">
        <h4>Background</h4>
        <div className="bg-list">
          {backgrounds.map((bg) => (
            <div
              key={bg}
              className={`bg-item ${selectedBg === bg ? "active" : ""}`}
              style={{ backgroundImage: `url(${bg})` }}
              onClick={() => setSelectedBg(bg)}
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
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && <div className="checkmark">✓</div>}
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Title */}
      <div className="modal-section">
        <h4>
          Board title <span className="required">*</span>
        </h4>
        <Input
          placeholder="E.g. Shopping list for birthday..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {!title.trim() && (
          <p className="error-text">👋 Please provide a valid board title.</p>
        )}
      </div>

      {/* Footer buttons */}
      <div className="modal-footer">
        <Button onClick={onClose} className="close-btn">
          Close
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default BoardModal;
