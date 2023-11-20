import { Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { ComponentForm } from '../../components/component-form'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { useAddComponentMutation } from '../../app/services/components';
import { Component } from '../../types';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { Layout } from '../../components/layout';

export const AddComponent = () => {

    const [error, setError] = useState('');
    const navigate= useNavigate();
    const user = useSelector(selectUser);
    const [addComponent] = useAddComponentMutation();
    
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    const handleAddComponent = async (data: Component) => {
        
        try {
            data.price = Number(data.price);
            data.count = Number(data.count);

            await addComponent(data).unwrap();

            navigate(`${Paths.status}/created`);
        } catch (err) {
            const maybeError = isErrorWithMessage(err);

            if (maybeError) {
                setError(err.data.message);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    }

    return (
        <Layout>
            <Row align='middle' justify='center'>
                <ComponentForm title='Добавление компонента' btnText='Добавить' onFinish={ handleAddComponent } error={ error } />
            </Row>
        </Layout>
    )
}
