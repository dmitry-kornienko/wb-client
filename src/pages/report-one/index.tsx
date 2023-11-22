import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Loader } from '../../components/loader';
import { Descriptions, Divider, Modal, Space, Table } from 'antd';
import { CustomButton } from '../../components/custom-button';
import { DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../components/error-message';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useGetReportQuery, useRemoveReportMutation } from '../../app/services/reports';
import { ColumnsType } from 'antd/es/table';
import { Layout } from '../../components/layout';
import { addSpacesToNumberWithDecimal } from '../../utils/add-spaces-to-number';
import styles from './index.module.css';

const tableColumns: ColumnsType<{
    article: string,
    cost_price: number, // Себестоимость единицы
    retail_amount: number, // Продано ВБ
    sale_count: number, // Кол-во продаж
    return_count: number, // Кол-во возвратов
    sale_sum: number, // Сумма продаж (ppvz_for_pay)
    return_sum: number, // Сумма возвратов
    delivery: number,
}> = [
    {
        title: 'Артикул',
        dataIndex: 'article',
        key: 'article',
    },
    {
        title: 'Себестоимость ед.',
        dataIndex: 'cost_price',
        key: 'cost_price',
    },
    {
        title: 'Продажи, шт',
        dataIndex: 'sale_count',
        key: 'sale_count',
    },
    {
        title: 'Возвраты, шт',
        dataIndex: 'return_count',
        key: 'return_count',
    },
    {
        title: 'Продажи, руб',
        dataIndex: 'sale_sum',
        render: (_, record) => addSpacesToNumberWithDecimal(record.sale_sum),
        key: 'sale_sum',
    },
    {
        title: 'Логистика',
        dataIndex: 'delivery',
        key: 'delivery',
    },
    {
        title: 'Налог',
        render: (_, record) => addSpacesToNumberWithDecimal(record.retail_amount * 0.07)
    },
    {
        title: 'Доход',
        render: (_, record) => addSpacesToNumberWithDecimal((record.sale_sum - record.return_sum) - (record.cost_price * record.sale_count) - record.delivery - (record.retail_amount * 0.07))
    },
    {
        title: 'Доход на единицу',
        render: (_, record) => addSpacesToNumberWithDecimal(((record.sale_sum - record.return_sum) - (record.cost_price * record.sale_count) - record.delivery - (record.retail_amount * 0.07)) / record.sale_count)
    },
]

export const ReportOne = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const params = useParams<{id: string}>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useGetReportQuery(params.id || '');
    const [ removeReport ] = useRemoveReportMutation();
    const user = useSelector(selectUser);

    if (isLoading) {
        return <Loader />
    }

    if (!data) {
        return <Navigate to='/' />
    }

    const showModal = () => {
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }

    const handleDeleteReport = async () => {
        hideModal();

        try {
            await removeReport(data._id).unwrap();

            navigate(Paths.report);
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError('Неисвестная ошибка');
            }
        }
    }

  return (
    <Layout>
        <div className={ styles.desc }>
            <Descriptions title='Детализация отчета' size='small' bordered style={{ padding: '5px' }}>
                <Descriptions.Item label='ID отчета' span={ 1 } style={{ width: '150px'}}>
                    { `${data.realizationreport_id}` }
                </Descriptions.Item>
                <Descriptions.Item label='Дата начала' span={ 1 }>
                    { `${data.date_from}` }
                </Descriptions.Item>
                <Descriptions.Item label='Дата конца' span={ 1 }>
                    { `${data.date_to}` }
                </Descriptions.Item>
                <Descriptions.Item label='Продажа' span={ 1 }>
                    { `${addSpacesToNumberWithDecimal(data.sale)}` }
                </Descriptions.Item>
                <Descriptions.Item label='Себестоимость' span={ 1 }>
                    { `${addSpacesToNumberWithDecimal(data.cost_price_sum)}` }
                </Descriptions.Item>
                <Descriptions.Item label='Логистика' span={ 1 }>
                    { `${addSpacesToNumberWithDecimal(data.delivery_sum)}` }
                </Descriptions.Item>
                <Descriptions.Item label='Хранение' span={ 1 }>
                    { `${addSpacesToNumberWithDecimal(data.storage)}` }
                </Descriptions.Item>
                <Descriptions.Item label='Удержания' span={ 1 }>
                    { `${addSpacesToNumberWithDecimal(data.other_deductions)}` }
                </Descriptions.Item>
                <Descriptions.Item label='Штрафы' span={ 3 }>
                    { `${addSpacesToNumberWithDecimal(data.penalty)}` }
                </Descriptions.Item>
                <Descriptions.Item label='К оплате' span={ 1 }>
                    { addSpacesToNumberWithDecimal(data.total_payment) }
                </Descriptions.Item>
                <Descriptions.Item label='Доход' span={ 1 }>
                    { addSpacesToNumberWithDecimal(data.net_profit) }
                </Descriptions.Item>
                <Descriptions.Item label='Рентабельность' span={ 1 }>
                    { `${data.investment_return.toFixed(2)} %` }
                </Descriptions.Item>
                <Descriptions.Item label='Состав' span={ 3 }>
                    <Table
                        bordered
                        dataSource={ data.composition }
                        columns={ tableColumns }
                        size="small"
                        pagination={ false }
                        scroll={{ x: 1000 }}
                    />
                </Descriptions.Item>
            </Descriptions>
            {
                user ? (
                    <>
                        <Divider orientation='left'>Действия</Divider>
                        <Space>
                            <CustomButton type='dashed' icon={ <LeftOutlined /> } onClick={ () => navigate(-1)}>
                                    Назад
                            </CustomButton>
                            <Link to={`/report/edit/${data._id}`}>
                                <CustomButton
                                    shape='round'
                                    type='default'
                                    icon={ <EditOutlined />}
                                >
                                    Внести недостающие данные
                                </CustomButton>
                            </Link>
                            <CustomButton
                                shape='round'
                                danger
                                onClick={ showModal }
                                icon={ <DeleteOutlined /> }
                            >
                                Удалить
                            </CustomButton>
                        </Space>
                    </>
                ) :         
                <CustomButton type='dashed' icon={ <LeftOutlined /> } onClick={ () => navigate(-1)}>
                    Назад
                </CustomButton>
            }
            <ErrorMessage message={ error } />
            <Modal
                title='Подтвердите удаление'
                open={ isModalOpen }
                onOk={ handleDeleteReport }
                onCancel={ hideModal }
                okText='Подтвердить'
                cancelText='Отменить'
            >
                Действительно хотите удалить отчет из таблицы?    
            </Modal>
        </div>
    </Layout>
  )
}
