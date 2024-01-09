import { Card, DatePicker, DatePickerProps, Form, Space } from 'antd'
import { CustomButton } from '../../components/custom-button';
import { ErrorMessage } from '../../components/error-message';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useAddReportMutation } from '../../app/services/reports';
import { Layout } from '../../components/layout';

export const AddReport = () => {
    
    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const navigate= useNavigate();
    const user = useSelector(selectUser);
    const [addReport] = useAddReportMutation();
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [navigate, user]);

    const onChangeDateFrom: DatePickerProps['onChange'] = (date, dateString) => {
        setDateFrom(dateString);
    };
    const onChangeDateTo: DatePickerProps['onChange'] = (date, dateString) => {
        setDateTo(dateString);
    };

    const handleAddReport = async () => {
        try {
            setBtnLoading(true);

            const tokenWB = localStorage.getItem('tokenWB');

            if (tokenWB) {
                await addReport({dateFrom, dateTo, tokenWB}).unwrap();
            } else {
                throw new Error('Неактуальный токен Wildberries');
            }

            setBtnLoading(false);

            navigate(Paths.report);
        } catch (err) {
            const maybeError = isErrorWithMessage(err);

            if (maybeError) {
                setError(err.data.message);
            } else {
                setError('Неизвестная ошибка');
            }

            setBtnLoading(false);
        }
    }

    return (
        <Layout>
            <Card title='Запрос недельного отчета' style={{ width: '30rem', margin: '10px auto'}}>
                <Form name="report-form" onFinish={ handleAddReport }>
                    <Form.Item label='Дата начала'>
                        <DatePicker
                            onChange={onChangeDateFrom}
                        />
                    </Form.Item>
                    <Form.Item label='Дата конца'>
                        <DatePicker
                            onChange={onChangeDateTo}
                        />
                    </Form.Item>
                    <ErrorMessage message={ error } />
                    <Space>
                        <CustomButton htmlType="submit" loading={btnLoading} disabled={dateFrom && dateTo ? false : true}>
                            Добавить
                        </CustomButton>
                        <CustomButton onClick={ () => navigate(-1)}>
                            Отмена
                        </CustomButton>
                    </Space>
                </Form>
            </Card>
        </Layout>
    )
}