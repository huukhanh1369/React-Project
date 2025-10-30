import React from "react";
import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: "primary" | "danger" | "default";
  iconColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  message = "You won't be able to revert this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmType = "primary",
  iconColor = "#FAAD14", // mặc định màu vàng cảnh báo
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={360}
      closeIcon={false}
    >
      <div className="flex flex-col items-center text-center px-2 py-4">
        <ExclamationCircleOutlined
          className="text-[88px] mb-2"
          style={{ color: iconColor }}
        />
        <h1 className="font-semibold text-xl mb-3">{title}</h1>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3">
          <Button
            type={confirmType === "danger" ? "primary" : confirmType}
            danger={confirmType === "danger"}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button onClick={onCancel}>{cancelText}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
