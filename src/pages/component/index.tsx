import React, { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useGetComponentQuery, useRemoveComponentMutation } from '../../app/services/components';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Loader } from '../../components/loader';
import { Descriptions, Divider, Modal, Space } from 'antd';
import { CustomButton } from '../../components/custom-button';
import { DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../components/error-message';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import styles from './index.module.css';

export const Component = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const params = useParams<{id: string}>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useGetComponentQuery(params.id || '');
    const [ removeComponent ] = useRemoveComponentMutation();
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

    const handleDeleteComponent = async () => {
        hideModal();

        try {
            await removeComponent(data._id).unwrap();

            navigate(`${Paths.status}/deleted`);
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
        <Descriptions title='Информация о компоненте' size='small' bordered style={{ padding: '5px' }}>
            <Descriptions.Item label='Название' span={ 3 } style={{ width: '150px'}}>
                { `${data.name}` }
            </Descriptions.Item>
            <Descriptions.Item label='Артикул' span={ 3 }>
                { `${data.article}` }
            </Descriptions.Item>
            <Descriptions.Item label='Количество' span={ 3 }>
                { `${data.count}` }
            </Descriptions.Item>
            <Descriptions.Item label='Цена' span={ 3 }>
                { `${data.price}` }
            </Descriptions.Item>
            <Descriptions.Item label='Описание' span={ 3 }>
                { `${data.desc}` }
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
                        <Link to={`/component/edit/${data._id}`}>
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
            onOk={ handleDeleteComponent }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Действительно хотите удалить компонент из таблицы?    
        </Modal>
    </div>
  )
}
