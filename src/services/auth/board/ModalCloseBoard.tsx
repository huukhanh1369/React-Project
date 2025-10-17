import { WarningFilled } from "@ant-design/icons";
import { Button, Modal } from "antd";
// import React from "react";
// import { useTranslation } from "react-i18next";

type PropsType = {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
};

const ModalCloseBoard = ({ open, onOk, onCancel }: PropsType) => {
    // const {t} = useTranslation()
    return (
        <Modal open={open} onCancel={onCancel} onOk={onOk} footer={null}>
            <div className="flex justify-center items-center flex-col">
                <WarningFilled className="!text-amber-400 text-[88px]" />
                <h1 className="font-semibold text-3xl my-5">{('are-you-sure')}</h1>
                <h2 className="text-xl font-light mb-5">{('you-wont-be-able-to-revert-this')}</h2>
                <div className="flex gap-2">
                    <Button color="primary" variant="solid" onClick={onOk}>{('yes-close-it')}</Button>
                <Button color="danger" variant="solid" onClick={onCancel}>{('cancel')}</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalCloseBoard;