import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  StarOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./layout.css";
import logo from "../../assets/logo/trello-logo-full.png.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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

        {/* Menu chính */}
        <Menu mode="inline" defaultSelectedKeys={["1"]} className="menu">
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            Boards
          </Menu.Item>
          <Menu.Item key="2" icon={<StarOutlined />}>
            Starred Boards
          </Menu.Item>
          <Menu.Item key="3" icon={<FolderOpenOutlined />}>
            Closed Boards
          </Menu.Item>
          <hr></hr>
          {/* Settings + Sign out nằm ngay dưới */}
          <Menu.Item key="4" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />}>
            Sign out
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

export default Sidebar;
