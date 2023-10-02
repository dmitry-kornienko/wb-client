import { PlusCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Component } from '../../types';
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useGetAllBuyOperationsQuery } from "../../app/services/buy-operations";
import { getDate } from "../../utils/get-date-format";
import styles from './index.module.css';

const columns: ColumnsType<{ _id: string, date: string, composition: { component: Component, count: number }[]}> = [
    {
        title: 'Дата',
        dataIndex: 'date',
        render: (_, record) => getDate(record.date),
        key: 'date',
        width: 100
    },
    {
        title: 'Позиции',
        dataIndex: 'composition',
        key: 'composition',
        render: (_, record) => record.composition.map(item => (
            <div>
                {
                    item.component.name.includes('лента') ?
                        `${item.component.name} - ${item.count} м.`
                        :
                        `${item.component.name} - ${item.count} шт.`
                }
            </div>
        )),
        width: 170
    },
    {
        title: 'Сумма',
        render: (_, record) => record.composition.reduce((sum, elem) => (sum + (elem.count * elem.component.price)), 0),
        key: 'sum',
        width: 100,
    },
]

export const BuyOperations = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetAllBuyOperationsQuery();

    const goToaddBuyOperation = () => navigate(Paths.buyOperationAdd);

    return (
        <Card className={styles.tableTitle} title='Закупки'>
            <CustomButton type="primary" onClick={goToaddBuyOperation} icon={<PlusCircleOutlined />}>
                Добавить
            </CustomButton>
            <Table
                loading={isLoading}
                dataSource={data}
                size="small"
                pagination={false}
                columns={columns}
                rowKey={(operation) => operation._id}
                onRow={(operation) => {
                    return {
                        onClick: () => navigate(`${Paths.buyOperation}/${operation._id}`)
                    }
                }}
            />
        </Card>
    )
}
