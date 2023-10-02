import { PlusCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { SendOperation } from '../../types';
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { getDate } from "../../utils/get-date-format";
import styles from './index.module.css';
import { useGetAllSendOperationsQuery } from "../../app/services/send-operations";

const columns: ColumnsType<SendOperation> = [
    {
        title: 'Дата отправки',
        dataIndex: 'sendingData',
        render: (_, record) => getDate(record.sendingData),
        key: 'sendingData',
        width: 30,
        sorter: (a, b) => {
            const aDateNumber = Number(a.sendingData.split('-').join(''));
            const bDateNumber = Number(b.sendingData.split('-').join(''));
            return bDateNumber - aDateNumber;
        }
    },
    {
        title: 'Состав поставки',
        dataIndex: 'composition',
        key: 'composition',
        render: (_, record) => record.composition.map(item => (
            <div>{item.complect.article} - {item.count} шт.</div>
        )),
        width: 160
    },
    {
        title: 'Кол-во коробов',
        dataIndex: 'partCount',
        key: 'partCount',
        width: 70
    },
    {
        title: 'Вес',
        dataIndex: 'weight',
        key: 'weight',
        width: 70
    },
    {
        title: 'Склад',
        dataIndex: 'warehous',
        key: 'warehous',
        width: 30,
    },
    {
        title: 'Номер поставки',
        render: (_, record) => {
            if (record.sendNumberMP) return record.sendNumberMP
            if (!record.sendNumberMP) return 'Не указан'
        },
        key: 'sendNumberMP',
        width: 30,
    },
    {
        title: 'Упаковано',
        dataIndex: 'isPacked',
        render: (_, record) => record.isPacked ? 'Да' : 'Нет',
        key: 'isPacked',
        width: 30,
        sorter: (a, b) => String(a.isPacked).length - String(b.isPacked).length,
        filters: [
            {
              text: 'Да',
              value: true,
            },
           {
              text: 'Нет',
              value: false,
            },
        ],
        onFilter(value, record) {
            return record.isPacked === value
        },
    },
    {
        title: 'Отправлено',
        dataIndex: 'isSended',
        render: (_, record) => {
            if (record.isSended) return 'Да';
            if (!record.isSended) return 'Нет';
        },
        key: 'isSended',
        width: 30,
        sorter: (a, b) => String(a.isSended).length - String(b.isSended).length,
        filters: [
            {
              text: 'Да',
              value: true,
            },
           {
              text: 'Нет',
              value: false,
            },
        ],
        onFilter(value, record) {
            return record.isSended === value
        },
    },
    {
        title: 'Накладная ТК',
        dataIndex: 'invoiceNumber',
        render: (_, record) => {
            if (record.invoiceNumber) return record.invoiceNumber
            if (!record.invoiceNumber) return 'Не указана'
        },
        key: 'invoiceNumber',
        width: 100,
    },
    {
        title: 'Дата приемки',
        dataIndex: 'acceptDate',
        render: (_, record) => getDate(record.acceptDate),
        key: 'acceptDate',
        width: 30,
        sorter: (a, b) => {
            const aDateNumber = Number(a.acceptDate.split('-').join(''));
            const bDateNumber = Number(b.acceptDate.split('-').join(''));
            return bDateNumber - aDateNumber;
        }
    },
    {
        title: 'Согласовано',
        dataIndex: 'isAgreed',
        render: (_, record) => {
            if (record.isAgreed) return 'Да';
            if (!record.isAgreed) return 'Нет';
        },
        key: 'isAgreed',
        width: 30,
        sorter: (a, b) => String(a.isAgreed).length - String(b.isAgreed).length,
        filters: [
            {
              text: 'Да',
              value: true,
            },
           {
              text: 'Нет',
              value: false,
            },
        ],
        onFilter(value, record) {
            return record.isAgreed === value
        },
    },
    {
        title: 'Принято',
        dataIndex: 'isAccepted',
        render: (_, record) => {
            if (record.isAccepted) return 'Да';
            if (!record.isAccepted) return 'Нет';
        },
        key: 'isAccepted',
        width: 30,
        sorter: (a, b) => String(a.isAccepted).length - String(b.isAccepted).length,
        filters: [
            {
              text: 'Да',
              value: true,
            },
           {
              text: 'Нет',
              value: false,
            },
        ],
        onFilter(value, record) {
            return record.isAccepted === value
        },
    },
]

export const SendOperations = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetAllSendOperationsQuery();

    const goToaddSendOperation = () => navigate(Paths.sendOperationAdd);

    return (
        <Card className={styles.tableTitle} title='Поставки'>
            <CustomButton type="primary" onClick={goToaddSendOperation} icon={<PlusCircleOutlined />}>
                Добавить
            </CustomButton>
            <Table
                loading={isLoading}
                dataSource={data}
                size="small"
                scroll={{ x: 1300 }}
                columns={columns}
                rowKey={(operation) => operation._id}
                onRow={(operation) => {
                    return {
                        onClick: () => navigate(`${Paths.sendOperation}/${operation._id}`)
                    }
                }}
            />
        </Card>
    )
}
