import { Card, Table } from "antd";
import React from "react";
import { CustomButton } from "../custom-button";
import { useNavigate } from "react-router-dom";
import { useGetAllReportsQuery } from "../../app/services/reports";
import { Paths } from "../../paths";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Report } from "../../types";
import { getDate } from "../../utils/get-date-format";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";
import styles from "./index.module.css";

const columns: ColumnsType<Report> = [
    {
        title: "Номер отчета",
        dataIndex: "realizationreport_id",
        key: "realizationreport_id",
    },
    {
        title: "Дата начала",
        dataIndex: "date_from",
        render: (_, record) => getDate(record.date_from),
        key: "date_from",
    },
    {
        title: "Дата конца",
        dataIndex: "date_to",
        render: (_, record) => getDate(record.date_to),
        key: "date_to",
    },
    {
        title: "Оборот",
        dataIndex: "retail_amount",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.retail_amount)}</div>,
        key: "retail_amount",
    },
    {
        title: "Себестоимость",
        dataIndex: "cost_price",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.cost_price)}</div>,
        key: "cost_price",
    },
    {
        title: "Логистика",
        dataIndex: "delivery_rub",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.delivery_rub)}</div>,
        key: "delivery_rub",
    },
    {
        title: "Хранение",
        dataIndex: "storage_cost",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.storage_cost)}</div>,
        key: "storage_cost",
    },
    {
        title: "Удержания",
        dataIndex: "other_deductions",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.other_deductions)}</div>,
        key: "other_deductions",
    },
    {
        title: "Штрафы",
        dataIndex: "penalty",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.penalty)}</div>,
        key: "penalty",
    },
    {
        title: "К оплате",
        render: (_, record) => (
            <div>
                {addSpacesToNumberWithDecimal(record.ppvz_for_pay -
                    record.delivery_rub -
                    record.penalty -
                    record.other_deductions -
                    record.storage_cost)}
            </div>
        ),
    },
    {
        title: "Доход",
        render: (_, record) => (
            <div className={
                record.ppvz_for_pay -
                record.cost_price -
                record.retail_amount*0.07 -
                record.delivery_rub -
                record.penalty -
                record.other_deductions -
                record.storage_cost < 0 ?
                styles.bad : ''
            }>
                {addSpacesToNumberWithDecimal(record.ppvz_for_pay -
                record.cost_price -
                record.retail_amount*0.07 -
                record.delivery_rub -
                record.penalty -
                record.other_deductions -
                record.storage_cost)}
            </div>
        ),
    },
    {
        title: "Марж-ть",
        render: (_, record) => (
            <div>
                {`${(((record.ppvz_for_pay -
                    record.cost_price -
                    record.retail_amount*0.07 -
                    record.delivery_rub -
                    record.penalty -
                    record.other_deductions -
                    record.storage_cost)
                    /
                    (record.ppvz_for_pay -
                    record.delivery_rub -
                    record.penalty -
                    record.other_deductions -
                    record.storage_cost))*100).toFixed(2)} %`}
            </div>
        ),
    },
];

export const Reports = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useGetAllReportsQuery();

    const goToAddReport = () => navigate(Paths.reportAdd);

    return (
        <Card className={styles.tableTitle} title="Еженедельные отчеты">
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
