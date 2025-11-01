import React, { useEffect } from "react";
import { Menu, Divider } from "antd";
import {
  AppstoreOutlined,
  StarOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setFilterType, setCurrentBoardId } from "../../features/board/BoardSlice";
import "./layout.css";
import logo from "../../assets/logo/trello-logo-full.png.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const filterType = useSelector((state: any) => state.boards.filterType);
  const boards = useSelector((state: any) => state.boards.boards);
  const currentBoardId = useSelector((state: any) => state.boards.currentBoardId);

  // Check if we're in BoardView
  const isBoardView = location.pathname.includes("/board/");

  // Extract boardId from URL
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const boardId = pathParts[pathParts.length - 1];
    if (isBoardView && boardId) {
      dispatch(setCurrentBoardId(boardId));
    }
  }, [location, dispatch, isBoardView]);

  const handleMenuClick = (key: string) => {
    if (key === "1") {
      dispatch(setFilterType("all"));
      navigate("/dashboard");
      onClose();
    } else if (key === "2") {
      dispatch(setFilterType("starred"));
      navigate("/dashboard");
      onClose();
    } else if (key === "3") {
      dispatch(setFilterType("closed"));
      navigate("/dashboard");
      onClose();
    }
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    onClose();
  };

  const handleSignOutClick = () => {
    console.log("Sign out clicked");
    // Add sign out logic here
    onClose();
  };

  return (
    <>
      {/* Overlay đen khi sidebar mở (mobile) */}
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={logo} alt="Trello" />
          <br />
        </div>

        {/* Tiêu đề Your Workspaces */}
        <div className="sidebar-section-title">Your Workspaces</div>

        {/* Menu chính - Workspaces */}
        <Menu
          mode="inline"
          selectedKeys={
            isBoardView ? [] : [filterType === "all" ? "1" : filterType === "starred" ? "2" : "3"]
          }
          className="menu"
          onClick={(e) => handleMenuClick(e.key)}
        >
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            Boards
          </Menu.Item>
          <Menu.Item key="2" icon={<StarOutlined />}>
            Starred Boards
          </Menu.Item>
          <Menu.Item key="3" icon={<FolderOpenOutlined />}>
            Closed Boards
          </Menu.Item>
        </Menu>

        {/* Divider */}
        <Divider style={{ margin: "12px 0" }} />

        {/* Your boards section - only show in BoardView */}
        {isBoardView && (
          <>
            <div className="sidebar-section-title">Your Boards</div>
            <div className="sidebar-boards-list">
              {boards.map((board: any) => (
                <div
                  key={board.id}
                  className={`sidebar-board-item ${
                    currentBoardId === board.id ? "active" : ""
                  }`}
                  onClick={() => {
                    navigate(`/board/${board.id}`);
                    onClose();
                  }}
                >
                  <div
                    className="board-color"
                    style={{ backgroundColor: board.color || "#0079BF" }}
                  />
                  <span className="board-name">{board.title}</span>
                </div>
              ))}
            </div>
            <Divider style={{ margin: "12px 0" }} />
          </>
        )}

        {/* Settings + Sign out - Only show if NOT in BoardView */}
        {!isBoardView && (
          <Menu mode="inline" className="menu">
            <Menu.Item key="4" icon={<SettingOutlined />} onClick={handleSettingsClick}>
              Settings
            </Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleSignOutClick}>
              Sign out
            </Menu.Item>
          </Menu>
        )}
      </div>
    </>
  );
};

export default Sidebar;