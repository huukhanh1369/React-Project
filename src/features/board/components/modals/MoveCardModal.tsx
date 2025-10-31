import React, { useState } from "react";
import { Modal, Input, Select, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface MoveCardModalProps {
  visible: boolean;
  onClose: () => void;
  currentList: string;
  onMove: (newList: string, newPosition: string) => void;
}

const MoveCardModal: React.FC<MoveCardModalProps> = ({
  visible,
  onClose,
  currentList,
  onMove,
}) => {
  const [selectedBoard, setSelectedBoard] = useState(
    "Tổ chức sự kiện Year-end party !"
  );
  const [selectedList, setSelectedList] = useState(currentList);
  const [selectedPosition, setSelectedPosition] = useState("1");

  const handleMove = () => {
    onMove(selectedList, selectedPosition);
    onClose();
  };

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
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="!w-[352px] !h-[40px] rounded-md"
            style={{ fontSize: "13px" }}
          />
        </div>

        {/* List & Position */}
        <div className="flex gap-2">
          <div className="flex-2 !w-[200px] !h-[40px]">
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
              options={[
                { label: "Todo", value: "TODO" },
                { label: "In-progress", value: "IN-PROGRESS" },
                { label: "Done", value: "DONE" },
              ]}
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
              options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
            />
          </div>
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
