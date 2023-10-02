import { PlusCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { Card, Table } from "antd";
import { useGetAllComponentsQuery } from "../../app/services/components";
import { ColumnsType } from "antd/es/table";
import { Component } from '../../types';
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import styles from './index.module.css';

const columns: ColumnsType<Component> = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        width: 250
    },
    {
        title: 'Артикул',
        dataIndex: 'article',
        key: 'article',
        width: 120
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
        width: 80
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price'
    }
]

export const Components = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetAllComponentsQuery();

    const goToaddComponent = () => navigate(Paths.componentAdd);

    return (
        <Card className={styles.tableTitle} title='Компоненты'>
            <CustomButton type="primary" onClick={goToaddComponent} icon={<PlusCircleOutlined />}>
                Добавить
            </CustomButton>
            <Table
                loading={isLoading}
                dataSource={data}
                size="small"
                pagination={false}
                columns={columns}
                rowKey={(component) => component._id}
                onRow={(component) => {
                    return {
                        onClick: () => navigate(`${Paths.component}/${component._id}`)
                    }
                }}
            />
        </Card>
    )
}
