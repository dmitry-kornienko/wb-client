import React, { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Loader } from '../../components/loader';
import { Descriptions, Divider, Modal, Space } from 'antd';
import { CustomButton } from '../../components/custom-button';
import { DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../components/error-message';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useGetPackedOperationQuery, useRemovePackedOperationMutation } from '../../app/services/packed-operations';
import styles from './index.module.css';
import { getDate } from '../../utils/get-date-format';

export const PackedOperation = () => {

    const params = useParams<{id: string}>();
    const { data, isLoading } = useGetPackedOperationQuery(params.id || '');
    const [ removePackedOperation ] = useRemovePackedOperationMutation();

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

    const handleDeletePackedOperation = async () => {
        hideModal();

        try {

            await removePackedOperation(data._id).unwrap();

            navigate(Paths.packed);
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
        <Descriptions title='Информация о операции' size='small' bordered style={{ padding: '5px' }}>
            <Descriptions.Item label='Дата' span={ 3 } style={{ width: '150px'}}>
                { getDate(data.date) }
            </Descriptions.Item>
            <Descriptions.Item label='Артикул' span={ 3 }>
                { `${data.complect.article}` }
            </Descriptions.Item>
            <Descriptions.Item label='Количество' span={ 3 }>
                { `${data.count}` }
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
                        <Link to={`/packed-operation/edit/${data._id}`}>
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
            onOk={ handleDeletePackedOperation }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Действительно хотите удалить операцию?    
        </Modal>
    </div>
  )
}
