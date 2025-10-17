import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Dropdown, Menu } from "antd";
import {
  ShareAltOutlined,
  DownloadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { authService } from "../../services/auth/auth.service";
import type { User } from "../../types/user.types";
import Sidebar from "../../pages/layout/sidebar";
import Navbar from "../../pages/layout/navbar";
import "./dashboard.css";
import BoardModal from "../../pages/layout/modals/BoardModal";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user: User | null = authService.getCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">This week</Menu.Item>
      <Menu.Item key="2">This month</Menu.Item>
      <Menu.Item key="3">All time</Menu.Item>
    </Menu>
  );

  const workspaceBoards = [
    { id: 1, image: "/images/Board1.png" },
    { id: 2, image: "/images/Board2.png" },
    { id: 3, image: "/images/Board3.png" },
    { id: 4, image: "/images/Board4.png" },
  ];

  const starredBoards = [
    { id: 3, image: "/images/Starred1.png" },
    { id: 4, image: "/images/Starred2.png" },
  ];

  return (
    <div className="dashboard">
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main-content">
        <Navbar onToggleSidebar={handleToggleSidebar} />

        {/* SHARE / EXPORT / THIS WEEK */}
        <div className="dashboard-header">
          <h2 className="section-title">Your Workspaces</h2>

          <div className="header-buttons">
            <Button icon={<ShareAltOutlined />} className="share-btn">
              Share
            </Button>
            <Button icon={<DownloadOutlined />} className="export-btn">
              Export
            </Button>
            <Dropdown overlay={menu}>
              <Button className="thisweek-btn">
                This week <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className="content">
          {/* Workspaces */}
          <div className="section">
            <div className="board-grid">
              {workspaceBoards.map((board) => (
                <Card
                  key={board.id}
                  className="board-card"
                  cover={<img src={board.image} />}
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  <div className="board-overlay">
                    <Button type="primary" size="small">
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}

              {/* CREATE NEW BOARD CARD */}
              <Card
                className="board-card create-card"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="create-content">
                  <div className="create-icon">+</div>
                  <span className="create-text">Create new board</span>
                </div>
              </Card>

              <BoardModal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(board) => console.log("Created:", board)}
                mode="create"
              />
            </div>
          </div>

          {/* Starred Boards */}
          <div className="section">
            <h2 className="section-title starred">★ Starred Boards</h2>
            <div className="board-grid">
              {starredBoards.map((board) => (
                <Card
                  key={board.id}
                  className="board-card"
                  cover={<img src={board.image} />}
                >
                  <div className="board-overlay starred"></div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
