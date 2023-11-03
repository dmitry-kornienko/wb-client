import { PlusCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Complect } from '../../types';
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useGetAllComplectsQuery } from "../../app/services/complects";
import styles from './index.module.css';

const columns: ColumnsType<Complect> = [
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
        width: 180
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
        width: 80
    }
]

export const Complects = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetAllComplectsQuery();

    const goToaddComplect = () => navigate(Paths.complectAdd);

    return (
        <Card className={styles.tableTitle} title='Комплекты'>
            <CustomButton type="primary" onClick={goToaddComplect} icon={<PlusCircleOutlined />}>
                Добавить
            </CustomButton>
            <Table
                loading={isLoading}
                dataSource={data}
                size="small"
                pagination={false}
                columns={columns}
                rowKey={(complect) => complect._id}
                onRow={(complect) => {
                    return {
                        onClick: () => navigate(`${Paths.complect}/${complect._id}`)
                    }
                }}
            />
        </Card>
    )
}
