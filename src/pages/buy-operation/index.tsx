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
import { ColumnsType } from 'antd/es/table';
import {Component } from '../../types';
import { useGetBuyOperationQuery, useRemoveBuyOperationMutation } from '../../app/services/buy-operations';
import styles from './index.module.css';
import { getDate } from '../../utils/get-date-format';

const tableColumns: ColumnsType<{ component: Component, count: number, price: number }> = [
    {
        title: 'Название',
        dataIndex: 'name',
        render: (_, record) => record.component.name,
        key: 'name',
        width: 50,
    },
    {
        title: 'Артикул',
        dataIndex: 'article',
        render: (_, record) => record.component.article,
        key: 'article',
        width: 50,
        fixed: 'left'
    },
    {
        title: 'Кол-во',
        dataIndex: 'count',
        key: 'count',
        width: 30
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        width: 30
    }
]

export const BuyOperation = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const params = useParams<{id: string}>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useGetBuyOperationQuery(params.id || '');
    const [ removeOperation ] = useRemoveBuyOperationMutation();
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

    const handleDeleteBuyOperation = async () => {
        hideModal();

        try {
            
            await removeOperation(data._id).unwrap();
        
            navigate(`${Paths.status}/operationDeleted`);
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError('Неисвестная ошибка');
            }
        }
    };

  return (
    <div className={ styles.desc }>
        <Descriptions title='Информация о операции закупки' size='small' bordered style={{ padding: '5px' }}>
            <Descriptions.Item label='Дата' span={ 3 } style={{ width: '150px'}}>
                { getDate(data.date) }
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
            <Descriptions.Item label='Итого' span={ 3 }>
                { `${data.composition.reduce((sum, elem) => (sum + (elem.count * elem.component.price)), 0)} руб.` }
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
                        {/* <Link to={`/buy-operation/edit/${data._id}`}>
                            <CustomButton
                                shape='round'
                                type='default'
                                icon={ <EditOutlined />}
                            >
                                Редактировать
                            </CustomButton>
                        </Link> */}
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
            onOk={ handleDeleteBuyOperation }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Действительно хотите удалить комплект из таблицы?    
        </Modal>
    </div>
  )
}
