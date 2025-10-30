import React, { useEffect, useState } from "react";
import { Button, Card, Spin, message } from "antd";
import {
  EditOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../pages/layout/Sidebar";
import Navbar from "../../../pages/layout/Navbar";
import BoardModal from "../../../pages/layout/modals/BoardModal";
import { boardService } from "../../auth/board.service";
import type { Board } from "../../../types/board.types";
import "./dashboard.css";
import api from "../../apis/api";

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  const navigate = useNavigate();

  // ===== Fetch boards =====
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardService.getBoards(1); // userId = 1 (demo)
        setBoards(data);
      } catch {
        message.error("Không thể tải danh sách board");
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  // ===== Modal actions =====
  const handleCreateBoard = () => {
    console.log("📡 Sending to:", api.defaults.baseURL);
    setEditingBoard(null);
    setIsModalOpen(true);
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setIsModalOpen(true);
    console.log("🆔 Editing board ID:", board.id);
  };

  const handleSaveBoard = async (boardData: Board) => {
    try {
      if (editingBoard) {
        // ✅ Update board cũ
        if (!editingBoard.id) {
          console.error("❌ editingBoard.id is missing");
          return;
        }

        const updated = await boardService.updateBoard(editingBoard.id, boardData);
        setBoards((prev) =>
          prev.map((b) => (b.id === editingBoard.id ? { ...b, ...updated } : b))
        );
        message.success("Cập nhật board thành công");
      } else {
        // ✅ Create board mới
        const newBoard = await boardService.createBoard({
          ...boardData,
          userId: 1,
          createdAt: new Date().toISOString(),
        });
        setBoards((prev) => [...prev, newBoard]);
        message.success("Tạo board mới thành công");
      }
    } catch (err) {
      console.log(err);
      message.error("Có lỗi xảy ra khi lưu board");
    } finally {
      setIsModalOpen(false);
      setEditingBoard(null);
    }
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Nội dung chính */}
      <div className="main-content">
        {/* HEADER */}
        <div className="dashboard-header">
          <h2 className="section-title">Your Workspace</h2>
          <div className="header-buttons">
            <Button className="share-btn" icon={<ShareAltOutlined />}>
              Share
            </Button>
            <Button className="export-btn" icon={<DownloadOutlined />}>
              Export
            </Button>
            <Button className="thisweek-btn" icon={<CalendarOutlined />}>
              This Week
            </Button>
          </div>
        </div>

        {/* BOARD SECTION */}
        <div className="content">
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <div className="board-grid">
              {/* Các board hiện có */}
              {boards.map((board) => (
                <Card
                  key={board.id}
                  className="board-card"
                  hoverable
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  {board.background ? (
                    <img
                      src={board.background}
                      alt={board.title}
                      className="board-image"
                    />
                  ) : (
                    <div
                      style={{
                        backgroundColor: board.color || "#0079BF",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}
                  <div className="board-overlay">
                    <Button
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBoard(board);
                      }}
                    >
                      Edit this board
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Create new board */}
              <div className="create-card" onClick={handleCreateBoard}>
                <div className="create-content">
                  <span className="create-icon">+</span>
                  <span className="create-text">Create new board</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal tạo/sửa board */}
      <BoardModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveBoard}
        mode={editingBoard ? "edit" : "create"}
        initialData={editingBoard}
      />
    </div>
  );
};

export default Dashboard;
