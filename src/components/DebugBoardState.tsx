import React, { useState } from "react";
import { Button, Collapse, Tag } from "antd";
import { useSelector } from "react-redux";

const DebugBoardState: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const lists = useSelector((state: any) => state.lists);
  const tasks = useSelector((state: any) => state.tasks);
  const tags = useSelector((state: any) => state.tags);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          backgroundColor: "#FF6B6B",
          color: "white",
        }}
      >
        🔍 Debug
      </Button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        maxHeight: "500px",
        zIndex: 9999,
        backgroundColor: "white",
        border: "2px solid #FF6B6B",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        overflowY: "auto",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
        <Button size="small" onClick={() => setIsVisible(false)}>
          Close
        </Button>
        <Button
          size="small"
          onClick={() => {
            debugAPIConnection();
          }}
        >
          Test API
        </Button>
      </div>

      <Collapse
        items={[
          {
            key: "lists",
            label: (
              <span>
                Lists{" "}
                <Tag color="blue">{lists?.items?.length || 0}</Tag>
              </span>
            ),
            children: (
              <pre style={{ fontSize: "11px", maxHeight: "150px" }}>
                {JSON.stringify(lists, null, 2)}
              </pre>
            ),
          },
          {
            key: "tasks",
            label: (
              <span>
                Tasks{" "}
                <Tag color="green">{tasks?.items?.length || 0}</Tag>
              </span>
            ),
            children: (
              <pre style={{ fontSize: "11px", maxHeight: "150px" }}>
                {JSON.stringify(tasks, null, 2)}
              </pre>
            ),
          },
          {
            key: "tags",
            label: (
              <span>
                Tags{" "}
                <Tag color="orange">{tags?.items?.length || 0}</Tag>
              </span>
            ),
            children: (
              <pre style={{ fontSize: "11px", maxHeight: "150px" }}>
                {JSON.stringify(tags, null, 2)}
              </pre>
            ),
          },
        ]}
      />

      <div style={{ marginTop: "12px", fontSize: "11px", color: "#666" }}>
        <p>
          <strong>Lists Loading:</strong> {lists?.loading ? "🔄" : "✅"}
        </p>
        <p>
          <strong>Tasks Loading:</strong> {tasks?.loading ? "🔄" : "✅"}
        </p>
        <p>
          <strong>Lists Error:</strong> {lists?.error || "None"}
        </p>
        <p>
          <strong>Tasks Error:</strong> {tasks?.error || "None"}
        </p>
      </div>
    </div>
  );
};

// Helper function
const debugAPIConnection = async () => {
  try {
    console.log("🔍 Testing API connections...");
    const res1 = await fetch("http://localhost:3001/lists");
    const res2 = await fetch("http://localhost:3001/tasks");
    console.log("✅ API Lists:", await res1.json());
    console.log("✅ API Tasks:", await res2.json());
  } catch (error) {
    console.error("❌ API Error:", error);
  }
};

export default DebugBoardState;