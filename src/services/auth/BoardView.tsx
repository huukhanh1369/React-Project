import React, { useState } from "react";
import { Button, Card, Dropdown, Menu, Space, Typography } from "antd";
import { EllipsisOutlined, PlusOutlined, FilterOutlined, StarOutlined, NumberOutlined, TableOutlined } from "@ant-design/icons";
// import useNotify from "../../hooks/useNotify";
// import { useTranslation } from "react-i18next";
import ModalCloseBoard from "./board/ModalCloseBoard";
import FilterBoard from "./board/FilterBoard";

const { Title, Text } = Typography;

const BoardView: React.FC = () => {
    //modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const { notify, contextHolder } = useNotify();
    // const { t } = useTranslation();

    const showModal = () => setIsModalOpen(true);

    const handleOk = () => {
        setIsModalOpen(false);
        alert("thanh cong")
        // notify(true, ("deleted-successfully"));
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //filter
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);


    
    //
    const lists = [
        {
            id: "todo",
            title: "Todo",
            cards: ["Thuê DJ", "Lên kịch bản chương trình", "Chuẩn bị kịch", "Kịch bản", "Thuê MC"],
        },
        { id: "inprogress", title: "In-progress", cards: [] },
    ];

    const menu = (
        <Menu>
            <Menu.Item key="1">{("edit")}</Menu.Item>
            <Menu.Item key="2">{("close")}</Menu.Item>
        </Menu>
    );

    return (
        <>
            {/* {contextHolder} */}
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-full mx-auto">
                    <div className="flex items-center justify-between mb-6 m-[-48px] bg-gray-200 p-5">
                        <div className="flex items-center gap-4">
                            <Title level={4} className="!m-0">
                                Tổ chức sự kiện Year-end party !
                            </Title>

                            <Space size={8} className="ml-2">
                                <Button size="small" icon={<StarOutlined />}></Button>
                                <Button size="small" icon={<NumberOutlined />}>
                                    {("boar")}
                                </Button>
                                <Button size="small" icon={<TableOutlined />}>
                                    {" "}
                                    {("table")}
                                </Button>
                                <Button size="small" danger onClick={showModal}>
                                    {("close-this-board")}
                                </Button>
                            </Space>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button icon={<FilterOutlined />} size="small" onClick={openFilter}>
                                {("filter")}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6">
                        {lists.map((list) => (
                            <div key={list.id} className="w-72 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-sm p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Text strong>{list.title}</Text>
                                        <Dropdown overlay={menu} trigger={["click"]}>
                                            <Button type="text" size="small" icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    </div>

                                    <div className="space-y-3">
                                        {list.cards.map((c, idx) => (
                                            <Card key={idx} size="small" className="rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                                    <div>{c}</div>
                                                </div>
                                            </Card>
                                        ))}

                                        {list.id !== "add" && (
                                            <Button type="text" className="w-full text-left text-gray-500" icon={<PlusOutlined />}>
                                                {("add-a-card")}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="w-72 flex-shrink-0">
                            <div className="bg-gray-200 rounded-lg h-16 flex items-center px-3">
                                <Button type="text" icon={<PlusOutlined />}>
                                    {("add-another-list")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalCloseBoard open={isModalOpen} onCancel={handleCancel} onOk={handleOk} />
            <FilterBoard open={isFilterOpen} onClose={closeFilter}/>

            
        </>
    );
};

export default BoardView;