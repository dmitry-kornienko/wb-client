import { useGetAllReportsQuery } from "../../app/services/reports";
import { Loader } from "../loader";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";
import styles from "./index.module.css";

type MonthReportType = {
    month: string,
    year: string,
    sale: number,
    ppvz_for_pay: number,
    cost_price_sum: number,
    delivery_sum: number,
    penalty: number,
    storage: number,
    other_deductions: number,
    total_payment: number,
    net_profit: number,
    final_profit: number,
    composition: {
        article: string,
        sale_count: number,
        return_count: number,
        cost_price: number,
        sale_sum: number,
        retail_amount: number,
        return_sum: number,
        delivery: number,
    }[]
}

const columns: ColumnsType<MonthReportType> = [
    {
        title: "Год",
        dataIndex: "year",
        key: "year",
    },
    {
        title: "Месяц",
        dataIndex: "month",
        key: "month",
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
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.total_payment)}</div>,
        key: "total_payment",
    },
    {
        title: "Доход",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.net_profit)}</div>,
    },
    {
        title: "Рентабельность",
        render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.final_profit / record.cost_price_sum * 100)} %</div>,
    },
];

export const ReportsOfMonth = () => {
    const { data, isLoading } = useGetAllReportsQuery();

    if (isLoading) {
        return <Loader />;
    }

    const months = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ];


    const dataForTable: MonthReportType[] = [];

    for (let i = 1; i <= 12; i++) {
            const monthStr = i < 10 ? '0' + i : String(i);
            const reportsOfMonth = data?.filter(
                (item) => item.date_to.slice(5, 7) === monthStr
            );

            if (reportsOfMonth?.length === 0) {
                continue
            }
            
            if (reportsOfMonth) {
                const report: MonthReportType = {
                    month: months[i-1],
                    year: reportsOfMonth[reportsOfMonth.length-1].date_to.slice(0, 4),
                    sale: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.sale;
                        },
                        0
                    ),
                    ppvz_for_pay: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.ppvz_for_pay;
                        },
                        0
                    ),
                    cost_price_sum: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.cost_price_sum;
                        },
                        0
                    ),
                    delivery_sum: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.delivery_sum;
                        },
                        0
                    ),
                    penalty: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.penalty;
                        },
                        0
                    ),
                    storage: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.storage;
                        },
                        0
                    ),
                    other_deductions: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.other_deductions;
                        },
                        0
                    ),
                    total_payment: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.total_payment;
                        },
                        0
                    ),
                    net_profit: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.net_profit;
                        },
                        0
                    ),
                    final_profit: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.final_profit;
                        },
                        0
                    ),
                    composition: []
                };
                reportsOfMonth.forEach(item => {
                    item.composition.forEach(row => {
                        if (!report.composition.find(i => i.article === row.article)) {
                            report.composition.push({
                                article: row.article,
                                sale_count: row.sale_count,
                                return_count: row.return_count,
                                cost_price: row.cost_price,
                                sale_sum: row.sale_sum,
                                retail_amount: row.retail_amount,
                                return_sum: row.return_sum,
                                delivery: row.delivery,
                            })
                        } else {
                            const compositionItemIndex = report.composition.findIndex(i => i.article === row.article);
                            report.composition[compositionItemIndex].cost_price += row.cost_price;
                            report.composition[compositionItemIndex].sale_count += row.sale_count;
                            report.composition[compositionItemIndex].sale_sum += row.sale_sum;
                            report.composition[compositionItemIndex].return_count += row.return_count;
                        }
                    })
                });
                dataForTable.push(report);
            }
    }
    
    return (
        <Card className={styles.tableTitle} title="Сводные отчеты по месяцам">
            <Table
                loading={isLoading}
                dataSource={dataForTable}
                size="small"
                columns={columns}
                pagination={false}
            />
        </Card>
    );
};
