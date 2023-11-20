import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Loader } from '../../components/loader';
import { Descriptions, Divider, Modal, Space, Table } from 'antd';
import { CustomButton } from '../../components/custom-button';
import { DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../components/error-message';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useGetComplectQuery, useRemoveComplectMutation } from '../../app/services/complects';
import { ColumnsType } from 'antd/es/table';
import { Complect as ComplectModel, Component } from '../../types';
import styles from './index.module.css';
import { Layout } from '../../components/layout';

const tableColumns: ColumnsType<{ name: string, article: string, count: number, price: number }> = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        width: 50,
    },
    {
        title: 'Артикул',
        dataIndex: 'article',
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
    },
]

export const Complect = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const params = useParams<{id: string}>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useGetComplectQuery(params.id || '');
    const [ removeComplect ] = useRemoveComplectMutation();
    const user = useSelector(selectUser);

    if (isLoading) {
        return <Loader />
    }

    if (!data) {
        return <Navigate to='/' />
    }
    
    const componentsArr: { name: string, article: string, count: number, price: number }[] = [];
    
    data.composition.forEach((item: { component: Component, count: number }) => {
        const row = {
            name: item.component.name,
            article: item.component.article,
            count: item.count,
            price: item.component.price,
        }
        componentsArr.push(row)
    })

    const showModal = () => {
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }

    const handleDeleteComplect = async () => {
        hideModal();

        try {
            await removeComplect(data._id).unwrap();

            navigate(`${Paths.status}/deleted`);
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError('Неисвестная ошибка');
            }
        }
    };

    const getComplectCost = (complect: ComplectModel): number => {

        let sum = 0;

        complect.composition.forEach(item => {
            sum += item.component.price * item.count
        });
        return sum;
    };

  return (
    <Layout>
        <div className={ styles.desc }>
            <Descriptions title='Информация о комплекте' size='small' bordered style={{ padding: '5px' }}>
                <Descriptions.Item label='Название' span={ 3 } style={{ width: '150px'}}>
                    { `${data.name}` }
                </Descriptions.Item>
                <Descriptions.Item label='Артикул' span={ 3 }>
                    { `${data.article}` }
                </Descriptions.Item>
                <Descriptions.Item label='Количество' span={ 3 }>
                    { `${data.count}` }
                </Descriptions.Item>
                <Descriptions.Item label='Состав' span={ 3 }>
                    <Table
                        bordered
                        dataSource={ componentsArr }
                        columns={ tableColumns }
                        size="small"
                        pagination={ false }
                    />
                </Descriptions.Item>
                <Descriptions.Item label='Себестоимость' span={ 3 }>
                    { `${getComplectCost(data)} руб.` }
                </Descriptions.Item>
                <Descriptions.Item label='Цена закупки' span={ 3 }>
                    { `${data.costPrice} руб.` }
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
                            <Link to={`/complect/edit/${data._id}`}>
                                <CustomButton
                                    shape='round'
                                    type='default'
                                    icon={ <EditOutlined />}
                                >
                                    Редактировать
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
                onOk={ handleDeleteComplect }
                onCancel={ hideModal }
                okText='Подтвердить'
                cancelText='Отменить'
            >
                Действительно хотите удалить комплект из таблицы?    
            </Modal>
        </div>
    </Layout>
  )
}
