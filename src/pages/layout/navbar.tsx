// src/pages/layout/navbar.tsx
import React, { useState } from "react";
import { Input, Button } from "antd";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import "./navbar.css";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [search, setSearch] = useState("");

  return (
    <nav className="navbar">
      <div className="navbar-left">
      </div>

      {/* Chỉ hiện khi ở mobile */}
      <div className="navbar-right mobile-only">
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
