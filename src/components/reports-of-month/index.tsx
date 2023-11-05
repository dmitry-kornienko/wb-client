import React from "react";
import { useGetAllReportsQuery } from "../../app/services/reports";
import { Loader } from "../loader";
import { Report } from "../../types";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";
import styles from "./index.module.css";

type ExtendedType = Omit<
    Report,
    "realizationreport_id" | "_id" | "date_from" | "date_to"
> & { month: string, year: string };

const columns: ColumnsType<ExtendedType> = [
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


    const dataForTable: ExtendedType[] = [];

    for (let i = 1; i <= 12; i++) {
            const monthStr = i < 10 ? '0' + i : String(i);
            const reportsOfMonth = data?.filter(
                (item) => item.date_to.slice(5, 7) === monthStr
            );

            if (reportsOfMonth?.length === 0) {
                continue
            }
            
            if (reportsOfMonth) {
                const report: ExtendedType = {
                    month: months[i-1],
                    year: reportsOfMonth[reportsOfMonth.length-1].date_to.slice(0, 4),
                    retail_amount: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.retail_amount;
                        },
                        0
                    ),
                    ppvz_for_pay: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.ppvz_for_pay;
                        },
                        0
                    ),
                    cost_price: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.cost_price;
                        },
                        0
                    ),
                    delivery_rub: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.delivery_rub;
                        },
                        0
                    ),
                    penalty: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.penalty;
                        },
                        0
                    ),
                    storage_cost: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.storage_cost;
                        },
                        0
                    ),
                    other_deductions: reportsOfMonth?.reduce(
                        (accumulator, currentObject) => {
                            return accumulator + currentObject.other_deductions;
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
                                count: row.count,
                                return_count: row.return_count,
                                cost_price_of_one: row.cost_price_of_one,
                                ppvz_for_pay_for_article: row.ppvz_for_pay_for_article
                            })
                        } else {
                            const compositionItemIndex = report.composition.findIndex(i => i.article === row.article);
                            report.composition[compositionItemIndex].cost_price_of_one += row.cost_price_of_one;
                            report.composition[compositionItemIndex].count += row.count;
                            report.composition[compositionItemIndex].ppvz_for_pay_for_article += row.ppvz_for_pay_for_article;
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
                // rowKey={(report) => report._id}
                // onRow={(report) => {
                //     return {
                //         onClick: () =>
                //             navigate(`${Paths.report}/${report._id}`),
                //     };
                // }}
            />
        </Card>
    );
};
