import React, { useEffect, useState } from "react";
import { Button, Card, Spin, message } from "antd";
import {
  EditOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import BoardModal from "../components/modals/BoardModal";
import { fetchBoards, addBoard, updateBoard } from "../../../features/board/BoardSlice";
import type { Board } from "../../../types/board.types";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const boards = useSelector((state: any) => state.boards.boards);
  const starredBoards = useSelector((state: any) => state.boards.starredBoards);
  const closedBoards = useSelector((state: any) => state.boards.closedBoards);
  const loading = useSelector((state: any) => state.boards.loading);
  const filterType = useSelector((state: any) => state.boards.filterType);

  // Local states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // ===== Fetch boards on mount =====
  useEffect(() => {
    dispatch(fetchBoards(1) as any); // userId = 1 (demo)
  }, [dispatch]);

  // ===== Determine which boards to display =====
  const displayedBoards = 
    filterType === "starred" 
      ? starredBoards 
      : filterType === "closed" 
      ? closedBoards 
      : boards;

  // ===== Modal actions =====
  const handleCreateBoard = () => {
    setEditingBoard(null);
    setIsModalOpen(true);
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setIsModalOpen(true);
  };

  const handleSaveBoard = async (boardData: Board) => {
    try {
      if (editingBoard) {
        // ✅ Update board cũ
        console.log("🔄 Updating board:", editingBoard.id);
        await dispatch(updateBoard(boardData) as any);
        message.success("Board updated successfully!");
      } else {
        // ✅ Create board mới
        console.log("✨ Creating new board");
        await dispatch(addBoard({
          title: boardData.title,
          background: boardData.background,
          color: boardData.color,
          userId: 1,
          createdAt: new Date().toISOString(),
          starred: false,
          closed: false,
        }) as any);
        message.success("Board created successfully!");
      }
    } catch (err) {
      console.error("Error saving board:", err);
      message.error("Failed to save board");
    } finally {
      setIsModalOpen(false);
      setEditingBoard(null);
    }
  };

  // ===== Get section title =====
  const getSectionTitle = () => {
    if (filterType === "starred") {
      return "⭐ Starred Boards";
    } else if (filterType === "closed") {
      return "🗂️ Closed Boards";
    }
    return "Your Workspace";
  };

  // ===== Get board background style =====
  const getBoardBackgroundStyle = (board: Board) => {
    if (board.background) {
      return {
        backgroundImage: `url(${board.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else if (board.color) {
      return {
        backgroundColor: board.color,
      };
    } else {
      return {
        backgroundColor: "#0079BF",
      };
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
          <h2 className="section-title">{getSectionTitle()}</h2>
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
              {displayedBoards && displayedBoards.length > 0 ? (
                displayedBoards.map((board: Board) => (
                  <div
                    key={board.id}
                    className="board-card"
                    style={getBoardBackgroundStyle(board)}
                    onClick={() => {
                      // Không navigate đến closed boards
                      if (!board.closed) {
                        navigate(`/board/${board.id}`);
                      }
                    }}
                  >
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
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px" }}>
                  <p style={{ fontSize: "16px", color: "#999" }}>
                    {filterType === "starred"
                      ? "No starred boards yet. Star a board to see it here!"
                      : filterType === "closed"
                      ? "No closed boards. Close a board to see it here!"
                      : "No boards found"}
                  </p>
                </div>
              )}

              {/* Create new board - only show on "all" view */}
              {filterType === "all" && (
                <div className="create-card" onClick={handleCreateBoard}>
                  <div className="create-content">
                    <span className="create-icon">+</span>
                    <span className="create-text">Create new board</span>
                  </div>
                </div>
              )}
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