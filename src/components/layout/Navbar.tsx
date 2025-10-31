import React, { useState } from "react";
import { Input, Button } from "antd";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import "./navbar.css";
import logo from "../../assets/logo/trello-logo-full.png.png"; // ✅ logo Trello

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [search, setSearch] = useState("");

  return (
    <nav className="navbar">
      {/* Logo + tên bên trái */}
      <div className="navbar-left">
        <img src={logo} alt="Trello" className="navbar-logo" />
      </div>

      {/* Thanh tìm kiếm + menu ở mobile */}
      <div className="navbar-right">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="navbar-search"
        />
        <Button
          type="text"
          icon={<MenuOutlined />}
          className="navbar-menu-btn"
          onClick={onToggleSidebar}
        />
      </div>
    </nav>
  );
};

export default Navbar;
