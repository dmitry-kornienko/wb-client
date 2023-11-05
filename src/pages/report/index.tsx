import { useNavigate } from "react-router-dom";
import { Reports } from "../../components/reports";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { Modal } from "antd";
import { Paths } from "../../paths";
import { ReportsOfMonth } from "../../components/reports-of-month";

export const ReportPage = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    useEffect(() => {
        if (!user || user.email !== "dima.korn1996@gmail.com") {
            showModal();
        }
    }, [navigate, user]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
        navigate(Paths.home);
    };

    return (
        <div>
            <Reports />
            <ReportsOfMonth />
            <Modal
                title="Доступ закрыт"
                open={isModalOpen}
                onOk={hideModal}
                onCancel={() => navigate(Paths.login)}
                cancelText="Войти под другим аккаунтом"
                okText="На главную"
            >
                К сожалению, данный раздел не доступен для вашего аккаунта
            </Modal>
        </div>
    );
};
