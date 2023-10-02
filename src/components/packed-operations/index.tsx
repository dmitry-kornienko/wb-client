import { PlusCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { PackedOperation } from '../../types';
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { getDate } from "../../utils/get-date-format";
import styles from './index.module.css';
import { useGetAllPackedOperationsQuery } from "../../app/services/packed-operations";

const columns: ColumnsType<PackedOperation> = [
    {
        title: 'Дата',
        dataIndex: 'date',
        render: (_, record) => getDate(record.date),
        key: 'date',
        width: 30,
    },
    {
        title: 'Артикул',
        dataIndex: 'complect',
        key: 'article',
        render: (_, record) => record.complect.article,
        width: 70
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
        width: 30,
    },
]

export const PackedOperations = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetAllPackedOperationsQuery();

    const goToaddPackedOperation = () => navigate(Paths.packedOperationAdd);

    // const modificateData: PackedOperation[] = [];

    // data?.forEach(item => {
    //     modificateData.push({
    //         ...item,
    //         date: getDate(item.date)
    //     })
    // })

    return (
        <Card className={styles.tableTitle} title='Операции упаковки'>
            <CustomButton type="primary" onClick={goToaddPackedOperation} icon={<PlusCircleOutlined />}>
                Добавить
            </CustomButton>
            <Table
                loading={isLoading}
                dataSource={ data }
                size="small"
                pagination={false}
                columns={columns}
                rowKey={(operation) => operation._id}
                onRow={(operation) => {
                    return {
                        onClick: () => navigate(`${Paths.packedOperation}/${operation._id}`)
                    }
                }}
            />
        </Card>
    )
}
