import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Menu, Card, Typography, Input, message } from "antd";
import DebugBoardState from "../../../components/DebugBoardState";
import {
  StarOutlined,
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
import "./boardview.css";

const { Title, Text } = Typography;

const BoardView: React.FC<{ boardId?: string }> = ({ boardId = "board_1" }) => {
  <DebugBoardState />
  const dispatch = useDispatch();
  const lists = useSelector((state: any) => state.lists.items);
  const listLoading = useSelector((state: any) => state.lists.loading);
  const tasks = useSelector((state: any) => state.tasks.items);

  // ===== STATE QUẢN LÍ MODAL =====
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCloseBoardVisible, setIsCloseBoardVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

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

  // ===== LOAD LISTS ON MOUNT =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await dispatch(fetchListsByBoardId(boardId) as any);
        // Load tasks cho tất cả lists
        if (result && result.payload) {
          result.payload.forEach((list: any) => {
            dispatch(fetchTasksByListId(list.id) as any);
          });
        }
      } catch (error) {
        console.error("Error loading board:", error);
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
  const handleCloseBoard = () => {
    setIsCloseBoardVisible(false);
    console.log("✅ Board closed!");
  };

  // ===== HANDLE FILTER BOARD =====
  const handleOpenFilter = () => setIsFilterOpen(true);
  const handleCloseFilter = () => setIsFilterOpen(false);

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
  const handleCardClick = (card: any) => setSelectedCard(card);
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

  // ===== GET TASKS BY LIST =====
  const getTasksByListId = (listId: string) => {
    return tasks.filter((task: any) => task.listId === listId);
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
                          {listTasks && listTasks.length > 0 ? (
                            listTasks.map((card: any) => (
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
                                      handleToggleTask(card.id, card.completed)
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
                          ) : null}

                          {/* Add Card Section */}
                          {addingCardToList === list.id ? (
                            <div className="add-card-form">
                              <Input
                                ref={addCardInputRef}
                                placeholder="Enter a title or paste a link"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
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
        />
      )}
    </div>
  );
};

export default BoardView;