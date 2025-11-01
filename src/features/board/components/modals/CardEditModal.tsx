import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Select, Button, message } from "antd";
import {
  AlignLeftOutlined,
  TagOutlined,
  ClockCircleOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../../../task/taskSlice";
import MoveCardModal from "./MoveCardModal";
import LabelListModal from "./LabelListModal";
import DatePickerModal from "./DatePickerModal";
import ConfirmModal from "./ConfirmModal"; // ✅ import modal xác nhận

interface CardEditModalProps {
  visible: boolean;
  onClose: () => void;
  card: any;
  lists: any[];
}

const CardEditModal: React.FC<CardEditModalProps> = ({
  visible,
  onClose,
  card,
  lists,
}) => {
  const dispatch = useDispatch();

  // Default states
  const [cardTitle, setCardTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listId, setListId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // các modal con
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [isLabelModalVisible, setIsLabelModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // ✅ modal xác nhận xóa

  const editorRef = useRef<any>(null);

  // Update states khi mở modal
  useEffect(() => {
    if (visible && card) {
      setCardTitle(card.title || "");
      setDescription(card.description || "");
      setListId(card.listId || "");
    }
  }, [visible, card?.id]);

  // --- SAVE CARD ---
  const handleSave = async () => {
    if (!cardTitle.trim()) {
      message.warning("Please enter a card title");
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateTask({
          id: card.id,
          title: cardTitle.trim(),
          description: description,
          listId: listId,
        }) as any
      );
      message.success("Card saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving card:", error);
      message.error("Failed to save card");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE CONFIRM LOGIC ---
  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteTask(card.id) as any);
      message.success("Card deleted successfully!");
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Error deleting card:", error);
      message.error("Failed to delete card");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  // --- MODALS CON ---
  const handleOpenMoveModal = () => setIsMoveModalVisible(true);
  const handleCloseMoveModal = () => setIsMoveModalVisible(false);

  const handleOpenLabelModal = () => setIsLabelModalVisible(true);
  const handleCloseLabelModal = () => setIsLabelModalVisible(false);

  const handleMove = (newListId: string, newPosition: string) => {
    setListId(newListId);
    console.log("🔦 Card moved to:", newListId, "position:", newPosition);
  };

  if (!card) return null;

  return (
    <>
      {/* --- Modal chính (Card Edit) --- */}
      <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={768}
        centered
        className="card-edit-modal"
        destroyOnClose
      >
        <div className="space-y-4">
          {/* Tiêu đề card */}
          <div className="flex items-center gap-2 !h-[36px]">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0 cursor-pointer hover:border-gray-600"></div>
            <div className="flex-1">
              <Input
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="text-xl font-bold border-0 !p-0 !h-[36px]"
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  outline: "none",
                  lineHeight: "24px",
                }}
                bordered={false}
              />
            </div>
          </div>

          {/* In list section */}
          <div className="flex items-center gap-2 !ml-8">
            <span className="text-sm text-gray-600">in list</span>
            <div onClick={handleOpenMoveModal} className="cursor-pointer">
              <Select
                value={listId}
                open={false}
                className="w-fit"
                style={{ minWidth: "120px" }}
                suffixIcon={<span>▼</span>}
                options={
                  lists && lists.length > 0
                    ? lists.map((list) => ({
                        label: list.title,
                        value: list.id,
                      }))
                    : []
                }
                onChange={(value) => {
                  setListId(value);
                  handleOpenMoveModal();
                }}
              />
            </div>
          </div>

          {/* --- Description section --- */}
          <div className="flex gap-4">
            {/* Left: Editor */}
            <div className="flex gap-3 flex-1">
              <div className="flex-shrink-0 pt-1">
                <AlignLeftOutlined className="text-gray-700 text-lg" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-3">Description</h3>

                <div
                  className="border border-gray-300 rounded overflow-hidden"
                  style={{ width: "512px", height: "275px" }}
                >
                  <Editor
                    ref={editorRef}
                    apiKey="d8mcjgbaqq34egwt7tjvydhnjyz8ac3gfkakx9yn1f3d9ej2"
                    value={description}
                    onEditorChange={(content) => setDescription(content)}
                    init={{
                      height: 275,
                      menubar: false,
                      plugins: [
                        "lists",
                        "link",
                        "image",
                        "code",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | bold italic underline | bullist numlist | link image | alignleft aligncenter alignright | outdent indent | code",
                      toolbar_mode: "floating",
                      branding: false,
                      content_style:
                        "body { font-family: Segoe UI, Helvetica, Arial, sans-serif; font-size:14px; }",
                    }}
                  />
                </div>

                {/* Save/Cancel buttons */}
                <div className="flex gap-2 mt-5">
                  <Button
                    type="primary"
                    onClick={handleSave}
                    loading={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 w-[60px] !h-[32px] !text-[14px]"
                  >
                    Save
                  </Button>
                  <Button
                    className="w-[70px] !h-[32px] !text-[14px]"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* --- Right sidebar --- */}
            <div className="flex flex-col gap-2" style={{ width: "168px" }}>
              {/* Labels button */}
              <button
                onClick={handleOpenLabelModal}
                className="w-full h-8 bg-gray-100 hover:bg-gray-200 transition px-3 rounded text-left flex items-center gap-2"
              >
                <TagOutlined className="!ml-2 text-gray-600 text-base flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">
                  Labels
                </span>
              </button>

              {/* Dates button */}
              <button
                onClick={() => setIsDateModalVisible(true)}
                className="w-full h-8 bg-gray-100 hover:bg-gray-200 transition px-3 rounded text-left flex items-center gap-2"
              >
                <ClockCircleOutlined className="!ml-2 text-gray-600 text-base flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">Dates</span>
              </button>

              {/* Delete button */}
              <button
                onClick={handleDelete}
                className="w-full h-8 bg-red-600 hover:bg-red-700 transition px-3 rounded flex items-center gap-2"
              >
                <MinusOutlined className="!ml-2 text-base flex-shrink-0 text-white" />
                <span className="text-sm font-medium text-white">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- Modal con: Move Card --- */}
      {isMoveModalVisible && (
        <MoveCardModal
          visible={isMoveModalVisible}
          onClose={handleCloseMoveModal}
          card={card}
          lists={lists}
          currentListId={listId}
          onMove={handleMove}
        />
      )}

      {/* --- Modal con: Label List --- */}
      {isLabelModalVisible && (
        <LabelListModal
          visible={isLabelModalVisible}
          onClose={handleCloseLabelModal}
          taskId={card.id}
        />
      )}

      {/* --- Modal con: Date Picker --- */}
      {isDateModalVisible && (
        <DatePickerModal
          visible={isDateModalVisible}
          onClose={() => setIsDateModalVisible(false)}
        />
      )}

      {/* --- Confirm Delete Modal --- */}
      <ConfirmModal
        open={isConfirmOpen}
        title="Are you sure?"
        message="You won't be able to revert this!"
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        confirmType="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default CardEditModal;
