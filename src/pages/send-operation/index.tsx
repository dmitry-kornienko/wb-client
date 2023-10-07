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
import styles from './index.module.css';
import { getDate } from '../../utils/get-date-format';
import { useGetSendOperationQuery, useRemoveSendOperationMutation } from '../../app/services/send-operations';
import { ColumnsType } from 'antd/es/table';
import { Complect } from '../../types';

const tableColumns: ColumnsType<{ complect: Complect, count: number }> = [
    {
        title: 'Название',
        render: (_, record) => record.complect.name,
        key: 'complectName',
        width: 50,
    },
    {
        title: 'Артикул',
        render: (_, record) => record.complect.article,
        key: 'complectArticle',
        width: 50,
        fixed: 'left'
    },
    {
        title: 'Кол-во',
        render: (_, record) => record.count,
        key: 'count',
        width: 30
    },
]

export const SendOperation = () => {

    const params = useParams<{id: string}>();
    const { data, isLoading } = useGetSendOperationQuery(params.id || '');
    const [ removeSendOperation ] = useRemoveSendOperationMutation();

    const user = useSelector(selectUser);

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleDeleteSendOperation = async () => {
        hideModal();

        try {

            await removeSendOperation(data._id).unwrap();

            navigate(Paths.send);
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
        <Descriptions title='Информация о поставке' size='small' bordered style={{ padding: '5px' }}>
            <Descriptions.Item label='Дата отправки' span={ 3 } style={{ width: '150px'}}>
                { getDate(data.sendingData) }
            </Descriptions.Item>
            <Descriptions.Item label='Комплекты' span={ 3 } style={{ width: '150px'}}>
                {
                    <Table 
                        bordered
                        dataSource={ data.composition }
                        columns={ tableColumns }
                        size="small"
                        pagination={ false }
                    />
                }
            </Descriptions.Item>
            <Descriptions.Item label='Склад' span={ 3 }>
                { `${data.warehous}` }
            </Descriptions.Item>
            <Descriptions.Item label='Упаковано' span={ 3 }>
                { data.isPacked ? 'Да' : 'Нет' }
            </Descriptions.Item>
            <Descriptions.Item label='Отправлено' span={ 3 }>
                { data.isSended ? 'Да' : 'Нет' }
            </Descriptions.Item>
            <Descriptions.Item label='Номер поставки' span={ 3 }>
                { data.sendNumberMP ? data.sendNumberMP : 'Номер не указан' }
            </Descriptions.Item>
            <Descriptions.Item label='Накладная' span={ 3 }>
                { data.invoiceNumber ? data.sendNumberMP : 'Номер не указан' }
            </Descriptions.Item>
            <Descriptions.Item label='Мест' span={ 3 }>
                { `${data.partCount}` }
            </Descriptions.Item>
            <Descriptions.Item label='Вес' span={ 3 }>
                { `${data.weight}` }
            </Descriptions.Item>
            <Descriptions.Item label='Дата приемки' span={ 3 } style={{ width: '150px'}}>
            { getDate(data.acceptDate) }
            </Descriptions.Item>
            <Descriptions.Item label='Согласовано' span={ 3 }>
                { data.isAgreed ? 'Да' : 'Нет' }
            </Descriptions.Item>
            <Descriptions.Item label='Принято' span={ 3 }>
                { data.isAccepted ? 'Да' : 'Нет' }
            </Descriptions.Item>
        </Descriptions>
        {
            user ? (
                <>
                    <Divider orientation='left'>Действия</Divider>
                    <ErrorMessage message={ error } />
                    <Space>
                        <CustomButton type='dashed' icon={ <LeftOutlined /> } onClick={ () => navigate(-1)}>
                            Назад
                        </CustomButton>
                        <Link to={`/send-operation/edit/${data._id}`}>
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
                            disabled={ data.isSended ? true : false }
                        >
                            { data.isSended ? 'Нельзя удалить отправленную поставку' : 'Удалить' }
                        </CustomButton>
                    </Space>
                </>
            ) :         
            <CustomButton type='dashed' icon={ <LeftOutlined /> } onClick={ () => navigate(-1)}>
                Назад
            </CustomButton>
        }
        <Modal
            title='Подтвердите удаление'
            open={ isModalOpen }
            onOk={ handleDeleteSendOperation }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Действительно хотите удалить поставку?    
        </Modal>
    </div>
  )
}
