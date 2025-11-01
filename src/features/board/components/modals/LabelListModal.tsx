import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, message } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import LabelFormModal from "./LabelFormModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchTagsByTaskId, createTag, updateTag, deleteTag } from "../../../tag/tagSlice";

interface Label {
  id: string;
  name: string;
  color: string;
  taskId?: string;
}

interface LabelListModalProps {
  visible: boolean;
  onClose: () => void;
  taskId: string;
}

const LabelListModal: React.FC<LabelListModalProps> = ({ visible, onClose, taskId }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const tags = useSelector((state: any) => state.tags.items);
  const tagsLoading = useSelector((state: any) => state.tags.loading);

  const [checkedLabels, setCheckedLabels] = useState<string[]>([]);
  const [isLabelFormVisible, setIsLabelFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  // Load tags khi modal mở
  useEffect(() => {
    if (visible && taskId) {
      console.log("📥 Fetching tags for task:", taskId);
      dispatch(fetchTagsByTaskId(taskId) as any);
    }
  }, [visible, taskId, dispatch]);

  // Cập nhật checked labels khi tags load
  useEffect(() => {
    if (tags && tags.length > 0) {
      const checkedIds = tags.map((tag: Label) => tag.id);
      setCheckedLabels(checkedIds);
      console.log("✅ Checked labels updated:", checkedIds);
    }
  }, [tags]);

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
  const handleCheck = (id: string) => {
    setCheckedLabels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Lưu các tag đã chọn
  const handleSaveTags = async () => {
    try {
      console.log("💾 Saving tags for task:", taskId);
      console.log("   Checked labels:", checkedLabels);

      // Các tag hiện tại trong DB
      const currentTagIds = tags.map((tag: Label) => tag.id);

      // Các tag bị unchecked (cần xóa)
      const toDelete = currentTagIds.filter((id: string) => !checkedLabels.includes(id));

      // Các tag được checked (cần tạo nếu chưa có)
      const toCreate = checkedLabels.filter((id: string) => !currentTagIds.includes(id));

      // Xóa các tag bị unchecked
      for (const tagId of toDelete) {
        await dispatch(deleteTag(tagId) as any);
        console.log("🗑️ Deleted tag:", tagId);
      }

      // Các tag mới được thêm từ LabelFormModal sẽ được tạo ở đó
      // Ở đây chỉ cần xóa các tag đã bị unchecked

      message.success("Tags saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving tags:", error);
      message.error("Failed to save tags");
    }
  };

  // Callback khi tạo hoặc cập nhật label từ LabelFormModal
  const handleLabelFormSubmit = async (labelData: { title: string; color: string }) => {
    try {
      if (formMode === "create") {
        // Tạo tag mới
        await dispatch(
          createTag({
            name: labelData.title,
            color: labelData.color,
            taskId: taskId,
          }) as any
        );
        console.log("✅ Created new tag:", labelData.title);
        message.success("Tag created successfully!");
        
        // Reload tags
        await dispatch(fetchTagsByTaskId(taskId) as any);
      } else if (formMode === "edit" && selectedLabel) {
        // Cập nhật tag hiện tại
        await dispatch(
          updateTag({
            id: selectedLabel.id,
            name: labelData.title,
            color: labelData.color,
          }) as any
        );
        console.log("✏️ Updated tag:", selectedLabel.id);
        message.success("Tag updated successfully!");
        
        // Reload tags
        await dispatch(fetchTagsByTaskId(taskId) as any);
      }

      setIsLabelFormVisible(false);
      setSelectedLabel(null);
    } catch (error) {
      console.error("Error submitting label form:", error);
      message.error("Failed to save tag");
    }
  };

  // Callback khi xóa label
  const handleLabelDelete = async () => {
    try {
      if (selectedLabel) {
        await dispatch(deleteTag(selectedLabel.id) as any);
        console.log("🗑️ Deleted tag:", selectedLabel.id);
        message.success("Tag deleted successfully!");
        
        // Reload tags
        await dispatch(fetchTagsByTaskId(taskId) as any);
      }

      setIsLabelFormVisible(false);
      setSelectedLabel(null);
    } catch (error) {
      console.error("Error deleting label:", error);
      message.error("Failed to delete tag");
    }
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
          height: "450px",
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
          <p className="text-xs font-medium text-gray-600 mb-1">
            {tags.length} Labels
          </p>
          {tagsLoading ? (
            <p className="text-center text-gray-500">Loading tags...</p>
          ) : tags.length > 0 ? (
            tags.map((label: Label) => (
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
                    style={{
                      backgroundColor: label.color,
                      width: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label.name}
                  </div>
                </div>

                {/* Nút edit */}
                <EditOutlined
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={() => handleEditLabel(label)}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tags available</p>
          )}
        </div>

        {/* Nút tạo mới */}
        <div className="pt-3 border-t border-gray-200 flex gap-2">
          <Button
            type="default"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={handleCreateNew}
          >
            Create a new label
          </Button>
          <Button
            type="primary"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveTags}
            loading={tagsLoading}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* --- Modal con (Create/Edit label) --- */}
      <LabelFormModal
        visible={isLabelFormVisible}
        onClose={() => setIsLabelFormVisible(false)}
        onBack={() => setIsLabelFormVisible(false)}
        mode={formMode}
        labelData={selectedLabel ? { title: selectedLabel.name, color: selectedLabel.color } : undefined}
        onSubmit={handleLabelFormSubmit}
        onDelete={handleLabelDelete}
      />
    </>
  );
};

export default LabelListModal;