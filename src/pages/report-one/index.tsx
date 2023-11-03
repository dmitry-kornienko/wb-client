import React, { useState } from 'react'
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
import styles from './index.module.css';

const tableColumns: ColumnsType<{
    article: string,
    count: number,
    return_count: number,
    cost_price_of_one: number,
    ppvz_for_pay_for_article: number
}> = [
    {
        title: 'Артикул',
        dataIndex: 'article',
        key: 'article',
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: 'Возвраты',
        dataIndex: 'return_count',
        key: 'return_count',
    },
    {
        title: 'Цена за единицу',
        dataIndex: 'cost_price_of_one',
        key: 'cost_price_of_one',
    },
    {
        title: 'Полная цена',
        render: (_, record) => record.count*record.cost_price_of_one
    },
    {
        title: 'К оплате за артикул',
        dataIndex: 'ppvz_for_pay_for_article',
        key: 'ppvz_for_pay_for_article',
    },
    {
        title: 'ROI, %',
        render: (_, record) => <div>{(((record.ppvz_for_pay_for_article - record.count*record.cost_price_of_one))/(record.count*record.cost_price_of_one)*100).toFixed(2)} %</div>,
    }
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
            <Descriptions.Item label='Оборот' span={ 1 }>
                { `${data.retail_amount}` }
            </Descriptions.Item>
            <Descriptions.Item label='Себестоимость' span={ 1 }>
                { `${data.cost_price}` }
            </Descriptions.Item>
            <Descriptions.Item label='Логистика' span={ 1 }>
                { `${data.delivery_rub}` }
            </Descriptions.Item>
            <Descriptions.Item label='Хранение' span={ 1 }>
                { `${data.storage_cost}` }
            </Descriptions.Item>
            <Descriptions.Item label='Удержания' span={ 1 }>
                { `${data.other_deductions}` }
            </Descriptions.Item>
            <Descriptions.Item label='Штрафы' span={ 3 }>
                { `${data.penalty}` }
            </Descriptions.Item>
            <Descriptions.Item label='К оплате' span={ 1 }>
                { `${(data.ppvz_for_pay -
                    data.delivery_rub -
                    data.penalty -
                    data.other_deductions -
                    data.storage_cost).toFixed(2)}` }
            </Descriptions.Item>
            <Descriptions.Item label='Доход' span={ 1 }>
                { `${(data.ppvz_for_pay -
                data.cost_price -
                data.retail_amount*0.07 -
                data.delivery_rub -
                data.penalty -
                data.other_deductions -
                data.storage_cost).toFixed(2)}` }
            </Descriptions.Item>
            <Descriptions.Item label='Маржинальность' span={ 1 }>
                { `${(((data.ppvz_for_pay -
                    data.cost_price -
                    data.retail_amount*0.07 -
                    data.delivery_rub -
                    data.penalty -
                    data.other_deductions -
                    data.storage_cost)
                    /
                    (data.ppvz_for_pay -
                    data.delivery_rub -
                    data.penalty -
                    data.other_deductions -
                    data.storage_cost))*100).toFixed(2)} %` }
            </Descriptions.Item>
            <Descriptions.Item label='Состав' span={ 3 }>
                <Table
                    bordered
                    dataSource={ data.composition }
                    columns={ tableColumns }
                    size="small"
                    pagination={ false }
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
  )
}
