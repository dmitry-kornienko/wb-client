import { Card, Table } from "antd";
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
        title: "Продажа",
        dataIndex: "sale",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.sale)}</div>,
        key: "sale",
    },
    {
        title: "Себестоимость",
        dataIndex: "cost_price_sum",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.cost_price_sum)}</div>,
        key: "cost_price_sum",
    },
    {
        title: "Комиссия",
        dataIndex: "comission_sum",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.comission_sum)}</div>,
        key: "comission_sum",
    },
    {
        title: "Логистика",
        dataIndex: "delivery_sum",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.delivery_sum)}</div>,
        key: "delivery_sum",
    },
    {
        title: "Хранение",
        dataIndex: "storage",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.storage)}</div>,
        key: "storage",
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
        dataIndex: "total_payment",
        render: (_, record) => (
            <div>{addSpacesToNumberWithDecimal(record.total_payment)}</div>
        ),
        key: "total_payment",
    },
    {
        title: "Налог",
        dataIndex: "tax_sum",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.tax_sum)}</div>,
        key: "tax_sum",
    },
    {
        title: "Доход",
        dataIndex: "net_profit",
        render: (_, record) => (
            <div>{addSpacesToNumberWithDecimal(record.net_profit)}</div>
        ),
        key: "net_profit",
    },
    {
        title: "Рентабельность",
        dataIndex: "investment_return",
        render: (_, record) => (
            <div>{addSpacesToNumberWithDecimal(record.final_profit / record.cost_price_sum * 100)} %</div>
        ),
        key: "investment_return",
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
                scroll={{ x: 1300 }}
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
