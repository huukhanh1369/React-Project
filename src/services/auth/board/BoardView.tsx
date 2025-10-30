import React, { useState } from "react";
import { Button, Dropdown, Menu, Card, Typography } from "antd";
import {
  StarOutlined,
  FilterOutlined,
  FileTextOutlined,
  TableOutlined,
  PlusOutlined,
  EllipsisOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import Sidebar from "../../../pages/layout/sidebar";
import Navbar from "../../../pages/layout/navbar";
import ConfirmModal from "../../../pages/layout/modals/ConfirmModal"; // ✅ sửa import
import FilterBoard from "../../../pages/layout/modals/FilterBoard";
import CardEditModal from "../../../pages/layout/modals/CardEditModal";
import "./boardview.css";

const { Title, Text } = Typography;

const BoardView: React.FC = () => {
  // ===== STATE QUẢN LÝ MODAL =====
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCloseBoardVisible, setIsCloseBoardVisible] = useState(false); // ✅ tên nhất quán
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  // ===== HANDLE SIDEBAR =====
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // ===== HANDLE CLOSE BOARD =====
  const handleOpenCloseBoard = () => setIsCloseBoardVisible(true);
  const handleCloseBoard = () => {
    setIsCloseBoardVisible(false);
    console.log("✅ Board closed!");
  };

  // ===== HANDLE FILTER BOARD =====
  const handleOpenFilter = () => setIsFilterOpen(true);
  const handleCloseFilter = () => setIsFilterOpen(false);

  // ===== DỮ LIỆU GIẢ =====
  const todoCards = [
    { id: 1, text: "Thuê DJ", completed: true, description: "Liên hệ DJ cho sự kiện." },
    { id: 2, text: "Lên kịch bản chương trình", completed: true, description: "Viết timeline chi tiết cho MC." },
    { id: 3, text: "Chuẩn bị kịch bản", completed: false, description: "Soạn kịch bản cho từng tiết mục." },
    { id: 4, text: "Kịch bản", completed: true, description: "Kịch bản tổng duyệt." },
    { id: 5, text: "Thuê MC", completed: false, description: "Liên hệ MC chính cho sự kiện." },
  ];

  const inProgressCards = [
    { id: 6, text: "Setup sân khấu", completed: false, description: "Dựng sân khấu, âm thanh, ánh sáng." },
  ];

  const lists = [
    { id: "todo", title: "Todo", cards: todoCards },
    { id: "inprogress", title: "In-progress", cards: inProgressCards },
  ];

  const listMenu = (
    <Menu>
      <Menu.Item key="1">Edit list</Menu.Item>
      <Menu.Item key="2">Archive list</Menu.Item>
    </Menu>
  );

  // ===== XỬ LÝ CLICK CARD =====
  const handleCardClick = (card: any) => setSelectedCard(card);
  const handleCloseDetailModal = () => setSelectedCard(null);

  return (
    <div className="board-view-wrapper">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className="board-view-main">
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Board content */}
        <div className="board-content-wrapper">
          {/* Header */}
          <div className="board-header">
            <div className="board-header-left">
              <Title level={2} className="board-title">
                Tổ chức sự kiện Year-end party!
              </Title>

              <div className="board-actions-group">
                <Button size="large" icon={<StarOutlined />} className="board-btn" />
                <Button
                  size="large"
                  className="board-btn"
                  icon={<FileTextOutlined />}
                  style={{ backgroundColor: "#00000080", color: "#FFFFFF" }}
                >
                  Board
                </Button>
                <Button size="large" icon={<TableOutlined />} className="board-btn">
                  Table
                </Button>
                <Button
                  size="large"
                  icon={<CloseSquareOutlined />}
                  className="board-btn board-btn-close"
                  onClick={handleOpenCloseBoard}
                  style={{ backgroundColor: "#00000080", color: "#FFFFFF" }}
                >
                  Close this board
                </Button>
              </div>
            </div>

            <div className="board-header-right">
              <Button
                size="large"
                icon={<FilterOutlined />}
                className="board-btn"
                style={{ backgroundColor: "#00000080", color: "#FFFFFF" }}
                onClick={handleOpenFilter}
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Lists container */}
          <div className="lists-container">
            {lists.map((list) => (
              <div key={list.id} className="list-card">
                <div className="list-card-header">
                  <Text strong className="list-title">
                    {list.title}
                  </Text>
                  <Dropdown overlay={listMenu} trigger={["click"]}>
                    <Button type="text" size="small" icon={<EllipsisOutlined />} className="list-menu-btn" />
                  </Dropdown>
                </div>

                <div className="cards-scroll-container">
                  {list.cards.map((card) => (
                    <Card
                      key={card.id}
                      size="small"
                      className="card-item"
                      hoverable
                      onClick={() => handleCardClick(card)} // ✅ mở modal chi tiết
                    >
                      <div className="card-content">
                        {card.completed && <span className="card-check-icon">✓</span>}
                        <span className={`card-text ${card.completed ? "completed" : ""}`}>
                          {card.text}
                        </span>
                      </div>
                    </Card>
                  ))}

                  <Button type="text" icon={<PlusOutlined />} className="add-card-btn">
                    Add a card
                  </Button>
                </div>
              </div>
            ))}

            {/* Add another list */}
            <div className="list-card add-list-card">
              <Button type="text" icon={<PlusOutlined />} className="add-list-btn">
                Add another list
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ConfirmModal tái sử dụng */}
      <ConfirmModal
        open={isCloseBoardVisible}
        onCancel={() => setIsCloseBoardVisible(false)}
        onConfirm={handleCloseBoard}
        title="Are you sure?"
        message="You won't be able to reopen this board easily."
        confirmText="Yes, close it!"
        confirmType="primary"
        iconColor="#FAAD14"
      />

      {/* 🔹 Drawer Filter Board */}
      <FilterBoard open={isFilterOpen} onClose={handleCloseFilter} />

      {/* 🔹 Modal chi tiết card */}
      {selectedCard && (
        <CardEditModal
          visible={!!selectedCard}
          onClose={handleCloseDetailModal}
          card={selectedCard}
        />
      )}
    </div>
  );
};

export default BoardView;
