import { Card, Table } from "antd";
import React from "react";
import { CustomButton } from "../custom-button";
import { useNavigate } from "react-router-dom";
import { useGetAllReportsQuery } from "../../app/services/reports";
import { Paths } from "../../paths";
import { PlusCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { ColumnsType } from "antd/es/table";
import { Report } from "../../types";

const columns: ColumnsType<Report> = [
    {
        title: "Номер отчета",
        dataIndex: "realizationreport_id",
        key: "realizationreport_id",
    },
    {
        title: "Дата начала",
        dataIndex: "date_from",
        key: "date_from",
    },
    {
        title: "Дата конца",
        dataIndex: "date_to",
        key: "date_to",
    },
    {
        title: "Оборот",
        dataIndex: "retail_amount",
        render: (_, record) => <div>{record.retail_amount.toFixed(2)}</div>,
        key: "retail_amount",
    },
    {
        title: "Логистика",
        dataIndex: "delivery_rub",
        render: (_, record) => <div>{record.delivery_rub.toFixed(2)}</div>,
        key: "delivery_rub",
    },
    {
        title: "Штрафы",
        dataIndex: "penalty",
        key: "penalty",
    },
    {
        title: "Хранение",
        dataIndex: "storage_cost",
        key: "storage_cost",
    },
    {
        title: "Удержания",
        dataIndex: "other_deductions",
        key: "other_deductions",
    },
    {
        title: "Доход",
        render: (_, record) => (
            <div>
                {(record.ppvz_for_pay -
                    record.delivery_rub -
                    record.penalty -
                    record.other_deductions -
                    record.storage_cost).toFixed(2)}
            </div>
        ),
        key: "other_deductions",
    },
];

export const Reports = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useGetAllReportsQuery();

    const goToAddReport = () => navigate(Paths.reportAdd);

    return (
        <Card className={styles.tableTitle} title="Отчеты">
            <CustomButton
                type="primary"
                onClick={goToAddReport}
                icon={<PlusCircleOutlined />}
            >
                Добавить
            </CustomButton>
            <Table
                loading={isLoading}
                dataSource={data}
                size="small"
                // scroll={{ x: 1300 }}
                columns={columns}
                rowKey={(report) => report._id}
                onRow={(report) => {
                    return {
                        onClick: () =>
                            navigate(`${Paths.report}/${report._id}`),
                    };
                }}
            />
        </Card>
    );
};