import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

interface MoveCardModalProps {
  visible: boolean;
  onClose: () => void;
  card: any;
  lists: any[];
  currentListId: string;
  onMove?: (newList: string, newPosition: string) => void;
}

const MoveCardModal: React.FC<MoveCardModalProps> = ({
  visible,
  onClose,
  card,
  lists,
  currentListId,
  onMove,
}) => {
  const tasks = useSelector((state: any) => state.tasks.items);

  const [selectedList, setSelectedList] = useState(currentListId || "");
  const [selectedPosition, setSelectedPosition] = useState("1");
  const [taskCountInList, setTaskCountInList] = useState(0);

  const boardTitle = "Tổ chức sự kiện Year-end party!";

  // Khởi tạo khi modal mở
  useEffect(() => {
    if (visible && card) {
      setSelectedList(currentListId || card.listId || "");
      setSelectedPosition("1");
    }
  }, [visible, card?.id, currentListId]);

  // Cập nhật số tasks khi list thay đổi
  useEffect(() => {
    if (selectedList && tasks) {
      const tasksInList = tasks.filter((t: any) => t.listId === selectedList);
      setTaskCountInList(tasksInList.length);
      // Reset position khi thay đổi list
      setSelectedPosition("1");
    }
  }, [selectedList, tasks]);

  // Lấy danh sách tasks trong list được chọn
  const getTasksInList = (listId: string) => {
    if (!tasks) return [];
    return tasks.filter((t: any) => t.listId === listId);
  };

  // Tính số vị trí tối đa
  const getMaxPosition = () => {
    if (!selectedList) return 1;
    const tasksInList = getTasksInList(selectedList);
    return Math.max(tasksInList.length + 1, 1);
  };

  const positionOptions = Array.from(
    { length: getMaxPosition() },
    (_, i) => ({
      label: String(i + 1),
      value: String(i + 1),
    })
  );

  const handleMove = () => {
    if (onMove) {
      onMove(selectedList, selectedPosition);
    }
    onClose();
  };

  // Lấy tên list từ ID
  const getListName = (listId: string) => {
    if (!listId || !lists) return "Unknown";
    const list = lists.find((l) => l.id === listId);
    return list ? list.title : "Unknown";
  };

  if (!card) return null;

  return (
    <Modal
      title={
        <div className="text-center text-[15px] font-semibold text-gray-800">
          Move card
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      closeIcon={
        <CloseOutlined className="text-gray-500 hover:text-gray-700" />
      }
      centered
      destroyOnClose
      bodyStyle={{
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Select destination */}
        <div>
          <h3 className="text-xs font-medium text-gray-600 mb-1">
            Select destination
          </h3>
        </div>

        {/* Board */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Board
          </label>
          <Input
            value={boardTitle}
            disabled
            className="!w-[352px] !h-[40px] rounded-md"
            style={{ fontSize: "13px" }}
          />
        </div>

        {/* List & Position */}
        <div className="flex gap-2">
          <div className="flex-2 !w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              List
            </label>
            <Select
              value={selectedList}
              onChange={setSelectedList}
              className="w-full"
              style={{
                height: "32px",
                fontSize: "13px",
              }}
              dropdownStyle={{ minWidth: "120px" }}
              options={
                lists && lists.length > 0
                  ? lists.map((list) => ({
                      label: list.title,
                      value: list.id,
                    }))
                  : []
              }
            />
          </div>

          {/* Position */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Position
            </label>
            <Select
              value={selectedPosition}
              onChange={setSelectedPosition}
              className="w-full"
              style={{
                height: "32px",
                fontSize: "13px",
              }}
              dropdownStyle={{ minWidth: "80px" }}
              options={positionOptions}
            />
          </div>
        </div>

        {/* Info text */}
        <div className="text-xs text-gray-500 mt-2">
          <p>
            {taskCountInList} card{taskCountInList !== 1 ? "s" : ""} in{" "}
            <strong>{getListName(selectedList)}</strong>
          </p>
        </div>

        {/* Move button */}
        <Button
          type="primary"
          onClick={handleMove}
          className="w-full rounded-md mt-4"
          style={{
            width: "90px",
            height: "32px",
            fontSize: "14px",
            fontWeight: 500,
            backgroundColor: "#0052CC",
          }}
        >
          Move
        </Button>
      </div>
    </Modal>
  );
};

export default MoveCardModal;