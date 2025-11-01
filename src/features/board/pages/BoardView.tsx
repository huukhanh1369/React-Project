import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Menu, Card, Typography, Input, message } from "antd";
import DebugBoardState from "../../../components/DebugBoardState";
import {
  StarOutlined,
  StarFilled,
  FilterOutlined,
  FileTextOutlined,
  TableOutlined,
  PlusOutlined,
  EllipsisOutlined,
  CloseSquareOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import ConfirmModal from "../components/modals/ConfirmModal";
import FilterBoard from "../components/modals/FilterBoard";
import CardEditModal from "../components/modals/CardEditModal";
import {
  fetchListsByBoardId,
  createList,
  updateList,
} from "../../../features/list/listSlice";
import {
  fetchTasksByListId,
  createTask,
  toggleTaskCompletion,
} from "../../../features/task/taskSlice";
import { fetchBoards, updateBoard } from "../../../features/board/BoardSlice";
import "./boardview.css";

const { Title, Text } = Typography;

const BoardView: React.FC<{ boardId?: string }> = ({ boardId = "board_1" }) => {
  <DebugBoardState />;
  const dispatch = useDispatch();
  const lists = useSelector((state: any) => state.lists.items);
  const listLoading = useSelector((state: any) => state.lists.loading);
  const tasks = useSelector((state: any) => state.tasks.items);

  console.log("Current lists:", lists);
  console.log("Current tasks:", tasks);
  console.log("List loading:", listLoading);

  // Debug: log tasks khi thay đổi
  useEffect(() => {
    console.log("📊 Tasks state updated. Total tasks:", tasks.length);
    console.log("   Tasks by list:");
    const tasksByList = lists.map((list: any) => ({
      listId: list.id,
      listName: list.title,
      count: tasks.filter((t: any) => t.listId === list.id).length,
    }));
    console.table(tasksByList);
  }, [tasks]);
  const boards = useSelector((state: any) => state.boards.boards);

  // ===== STATE QUẢN LÍ MODAL =====
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCloseBoardVisible, setIsCloseBoardVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [boardTitle, setBoardTitle] = useState(
    "Tổ chức sự kiện Year-end party!"
  );
  const [isStarred, setIsStarred] = useState(false);

  // ===== STATE CHO ADD CARD =====
  const [addingCardToList, setAddingCardToList] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const addCardInputRef = useRef<any>(null);

  // ===== STATE CHO ADD LIST =====
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const addListInputRef = useRef<any>(null);

  // ===== STATE CHO EDIT LIST =====
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editListName, setEditListName] = useState("");
  const editListInputRef = useRef<any>(null);

  // ===== LOAD BOARDS AND LISTS ON MOUNT =====
    useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔄 Starting to load board data for boardId:", boardId);

        // Load boards
        const userId = 1;
        const boardsResult = await dispatch(fetchBoards(userId) as any);

        // Từ allBoards (bao gồm cả closed), tìm board hiện tại
        const allBoards = boardsResult.payload;
        if (allBoards && Array.isArray(allBoards)) {
          const currentBoard = allBoards.find(
            (b: any) => b.id === boardId
          );
          if (currentBoard) {
            console.log("✅ Found board:", currentBoard.title);
            setBoardTitle(currentBoard.title);
            setIsStarred(currentBoard.starred || false);
          } else {
            console.warn("⚠️ Board not found:", boardId);
          }
        }

        // Load lists
        console.log("📋 Fetching lists for board:", boardId);
        const listsResult = await dispatch(fetchListsByBoardId(boardId) as any);

        if (
          listsResult &&
          listsResult.payload &&
          Array.isArray(listsResult.payload)
        ) {
          console.log(
            "✅ Lists loaded:",
            listsResult.payload.map((l: any) => ({ id: l.id, title: l.title }))
          );

          // Load tasks cho từng list tuần tự
          for (const list of listsResult.payload) {
            console.log(
              `📥 Fetching tasks for list: ${list.id} (${list.title})`
            );
            await dispatch(fetchTasksByListId(list.id) as any);
            // Thêm delay nhỏ để Redux update kịp
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          console.log("✅ All tasks loaded!");
        }
      } catch (error) {
        console.error("❌ Error loading board:", error);
      }
    };

    loadData();
  }, [dispatch, boardId]);

  // ===== Focus input khi thêm card =====
  useEffect(() => {
    if (addingCardToList && addCardInputRef.current) {
      addCardInputRef.current.focus();
    }
  }, [addingCardToList]);

  // ===== Focus input khi thêm list =====
  useEffect(() => {
    if (addingList && addListInputRef.current) {
      addListInputRef.current.focus();
    }
  }, [addingList]);

  // ===== Focus input khi edit list =====
  useEffect(() => {
    if (editingListId && editListInputRef.current) {
      editListInputRef.current.focus();
      editListInputRef.current.select();
    }
  }, [editingListId]);

  // ===== HANDLE SIDEBAR =====
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // ===== HANDLE CLOSE BOARD =====
  const handleOpenCloseBoard = () => setIsCloseBoardVisible(true);

  // ===== HANDLE FILTER BOARD =====
  const handleOpenFilter = () => setIsFilterOpen(true);
  const handleCloseFilter = () => setIsFilterOpen(false);

  // ===== HANDLE STAR BOARD =====
  // ===== HANDLE STAR BOARD =====
  const handleToggleStar = async () => {
    try {
      const currentBoard = boards.find((b: any) => b.id === boardId);
      if (currentBoard) {
        const newStarredStatus = !isStarred;
        
        // Dispatch update to Redux
        await dispatch(
          updateBoard({
            ...currentBoard,
            starred: newStarredStatus,
          }) as any
        );
        
        // Update local state
        setIsStarred(newStarredStatus);
        
        // Show success message
        message.success(
          newStarredStatus ? "⭐ Board starred!" : "☆ Star removed from board!"
        );
        
        console.log(`✅ Board starred status updated to: ${newStarredStatus}`);
      }
    } catch (error) {
      console.error("Error updating star status:", error);
      message.error("Failed to update star status");
    }
  };

  // ===== HANDLE CLOSE BOARD =====
  const handleCloseBoard = async () => {
    try {
      const currentBoard = boards.find((b: any) => b.id === boardId);
      if (currentBoard) {
        // Dispatch update to close board
        await dispatch(
          updateBoard({
            ...currentBoard,
            closed: true,
          }) as any
        );
        
        // Show success message
        message.success("Board closed successfully!");
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
        
        console.log(`✅ Board ${boardId} closed`);
      }
    } catch (error) {
      console.error("Error closing board:", error);
      message.error("Failed to close board");
    }
  };

  // ===== HANDLE ADD CARD =====
  const handleAddCardClick = (listId: string) => {
    setAddingCardToList(listId);
    setNewCardTitle("");
  };

  const handleSaveCard = async () => {
    if (newCardTitle.trim() && addingCardToList) {
      try {
        await dispatch(
          createTask({
            title: newCardTitle.trim(),
            listId: addingCardToList,
          }) as any
        );
        message.success("Card added successfully!");
        setAddingCardToList(null);
        setNewCardTitle("");
      } catch (error) {
        message.error("Failed to add card");
      }
    }
  };

  const handleCancelAddCard = () => {
    setAddingCardToList(null);
    setNewCardTitle("");
  };

  const handleKeyDownCard = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveCard();
    } else if (e.key === "Escape") {
      handleCancelAddCard();
    }
  };

  // ===== HANDLE ADD LIST =====
  const handleAddListClick = () => {
    setAddingList(true);
    setNewListName("");
  };

  const handleSaveList = async () => {
    if (newListName.trim()) {
      try {
        await dispatch(
          createList({
            title: newListName.trim(),
            boardId,
          }) as any
        );
        message.success("List added successfully!");
        setAddingList(false);
        setNewListName("");
      } catch (error) {
        message.error("Failed to add list");
      }
    }
  };

  const handleCancelAddList = () => {
    setAddingList(false);
    setNewListName("");
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveList();
    } else if (e.key === "Escape") {
      handleCancelAddList();
    }
  };

  // ===== HANDLE EDIT LIST =====
  const handleEditListDoubleClick = (listId: string, currentName: string) => {
    setEditingListId(listId);
    setEditListName(currentName);
  };

  const handleSaveListEdit = async () => {
    if (editListName.trim() && editingListId) {
      try {
        await dispatch(
          updateList({
            id: editingListId,
            title: editListName.trim(),
          }) as any
        );
        message.success("List updated successfully!");
        setEditingListId(null);
        setEditListName("");
      } catch (error) {
        message.error("Failed to update list");
      }
    }
  };

  const handleCancelEditList = () => {
    setEditingListId(null);
    setEditListName("");
  };

  const handleKeyDownEditList = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveListEdit();
    } else if (e.key === "Escape") {
      handleCancelEditList();
    }
  };

  // ===== HANDLE CARD CLICK =====
  const handleCardClick = (card: any) => {
    console.log("Card clicked:", card);
    setSelectedCard(card);
  };
  const handleCloseDetailModal = () => setSelectedCard(null);

  // ===== HANDLE TOGGLE TASK COMPLETION =====
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await dispatch(
        toggleTaskCompletion({
          taskId,
          completed: !completed,
        }) as any
      );
    } catch (error) {
      message.error("Failed to update task");
    }
  };

  // ===== GET TASKS BY LIST - MEMOIZED =====
  const getTasksByListId = (listId: string) => {
    const result = tasks.filter((task: any) => task.listId === listId);
    return result;
  };

  const listMenu = (listId: string, listName: string) => (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => handleEditListDoubleClick(listId, listName)}
      >
        Edit list
      </Menu.Item>
      <Menu.Item key="2">Archive list</Menu.Item>
    </Menu>
  );

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
                {boardTitle}
              </Title>

              <div className="board-actions-group">
                <Button
                  size="large"
                  icon={isStarred ? <StarFilled /> : <StarOutlined />}
                  className="board-btn"
                  onClick={handleToggleStar}
                  style={
                    isStarred ? { color: "#FAAD14" } : { color: "inherit" }
                  }
                />
                <Button
                  size="large"
                  className="board-btn"
                  icon={<FileTextOutlined />}
                  style={{ backgroundColor: "#00000080", color: "#FFFFFF" }}
                >
                  Board
                </Button>
                <Button
                  size="large"
                  icon={<TableOutlined />}
                  className="board-btn"
                >
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

          {/* Loading State */}
          {listLoading && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading lists...
            </div>
          )}

          {/* Lists container */}
          {!listLoading && (
            <div className="lists-container">
              {lists && lists.length > 0 ? (
                <>
                  {lists.map((list: any) => {
                    const listTasks = getTasksByListId(list.id);
                    return (
                      <div key={list.id} className="list-card">
                        {/* List Header */}
                        <div className="list-card-header">
                          {editingListId === list.id ? (
                            <Input
                              ref={editListInputRef}
                              value={editListName}
                              onChange={(e) => setEditListName(e.target.value)}
                              onBlur={handleSaveListEdit}
                              onKeyDown={handleKeyDownEditList}
                              className="list-title-input"
                              placeholder="Enter list name..."
                            />
                          ) : (
                            <Text
                              strong
                              className="list-title"
                              onDoubleClick={() =>
                                handleEditListDoubleClick(list.id, list.title)
                              }
                            >
                              {list.title}
                            </Text>
                          )}
                          <Dropdown
                            overlay={listMenu(list.id, list.title)}
                            trigger={["click"]}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<EllipsisOutlined />}
                              className="list-menu-btn"
                            />
                          </Dropdown>
                        </div>

                        <div className="cards-scroll-container">
                          {listTasks && listTasks.length > 0
                            ? listTasks.map((card: any) => (
                                <Card
                                  key={card.id}
                                  size="small"
                                  className="card-item"
                                  hoverable
                                  onClick={() => handleCardClick(card)}
                                >
                                  <div className="card-content">
                                    <input
                                      type="checkbox"
                                      checked={card.completed || false}
                                      onChange={(e) =>
                                        handleToggleTask(
                                          card.id,
                                          card.completed
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="card-checkbox"
                                    />
                                    <span
                                      className={`card-text ${
                                        card.completed ? "completed" : ""
                                      }`}
                                    >
                                      {card.title}
                                    </span>
                                  </div>
                                </Card>
                              ))
                            : null}

                          {/* Add Card Section */}
                          {addingCardToList === list.id ? (
                            <div className="add-card-form">
                              <Input
                                ref={addCardInputRef}
                                placeholder="Enter a title or paste a link"
                                value={newCardTitle}
                                onChange={(e) =>
                                  setNewCardTitle(e.target.value)
                                }
                                onKeyDown={handleKeyDownCard}
                                className="add-card-input"
                              />
                              <div className="add-card-actions">
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={handleSaveCard}
                                >
                                  Add card
                                </Button>
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<CloseOutlined />}
                                  onClick={handleCancelAddCard}
                                />
                              </div>
                            </div>
                          ) : (
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              className="add-card-btn"
                              onClick={() => handleAddCardClick(list.id)}
                            >
                              Add a card
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div style={{ padding: "20px" }}>No lists found</div>
              )}

              {/* Add another list */}
              {addingList ? (
                <div className="list-card add-list-form">
                  <div className="add-list-content">
                    <Input
                      ref={addListInputRef}
                      placeholder="Enter list name..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyDown={handleKeyDownList}
                      className="add-list-input"
                    />
                    <div className="add-list-actions">
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleSaveList}
                      >
                        Add list
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={handleCancelAddList}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="list-card add-list-card">
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    className="add-list-btn"
                    onClick={handleAddListClick}
                  >
                    Add another list
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
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

      {/* Filter Board */}
      <FilterBoard open={isFilterOpen} onClose={handleCloseFilter} />

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardEditModal
          visible={!!selectedCard}
          onClose={handleCloseDetailModal}
          card={selectedCard}
          lists={lists}
        />
      )}
    </div>
  );
};

export default BoardView;
