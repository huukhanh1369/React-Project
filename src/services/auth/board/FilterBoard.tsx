import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {  Drawer, Input, Checkbox, Select, Divider } from "antd";
// import React from "react";
// import { useTranslation } from "react-i18next";

type PropsType = {
    open: boolean,
    onClose: () => void   
}

const FilterBoard = ({open, onClose}: PropsType) => {
    // const {t} = useTranslation()
    return (
        <Drawer title={('filter')} placement="right" onClose={onClose} open={open} width={360}>
            <div className="space-y-4">
                <div>
                    <p className="font-bold">{('keyword')}</p>
                    <Input className="mt-2" placeholder={('enter-a-keyword')} />
                </div>

                <Divider />

                <div>
                    <p className="font-bold">{('card-status')}</p>
                    <div className="mt-3 space-y-2">
                        <Checkbox>{('marked-as-complete')}</Checkbox>
                        <Checkbox>{('not-marked-as-complete')}</Checkbox>
                    </div>
                </div>

                <Divider />

                <div>
                    <p className="font-bold">{"Due date"}</p>
                    <div className="mt-3 space-y-2 text-sm flex flex-col">
                        <Checkbox>
                            <CalendarOutlined className="mr-2" /> {('no-dates')}
                        </Checkbox>
                        <Checkbox>
                            <ClockCircleOutlined style={{ color: "#ff4d4f" }} className="mr-2" /> {('overdue')}
                        </Checkbox>
                        <Checkbox>
                            <ClockCircleOutlined style={{ color: "#faad14" }} className="mr-2" /> {('due-in-the-next-day')}
                        </Checkbox>
                    </div>
                </div>

                <Divider />

                <div>
                    <p className="font-bold">{"Labels"}</p>
                    <div className="mt-3 space-y-2">
                        <Checkbox>{('no-labels')}</Checkbox>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="flex items-center gap-3">
                                <Checkbox />
                                <span className="flex-1 h-6 bg-green-400 rounded" />
                            </label>

                            <label className="flex items-center gap-3">
                                <Checkbox />
                                <span className="flex-1 h-6 bg-yellow-400 rounded" />
                            </label>

                            <label className="flex items-center gap-3">
                                <Checkbox />
                                <span className="flex-1 h-6 bg-orange-400 rounded" />
                            </label>
                        </div>

                        <Select placeholder={('select-labels')} className="w-full mt-2" />
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default FilterBoard;
