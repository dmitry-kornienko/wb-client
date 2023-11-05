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
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from "dayjs";

export const AddReport = () => {
    
    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState('');
    const navigate= useNavigate();
    const user = useSelector(selectUser);
    const [addReport] = useAddReportMutation();
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [navigate, user]);
    
    const customWeekStartEndFormat: DatePickerProps['format'] = (value) => {
        const startDate = dayjs(value).startOf('week').add(1, 'day');
        const endDate = dayjs(value).endOf('week').add(1, 'day');

        return `${startDate.format('YYYY-MM-DD')} ~ ${endDate.format('YYYY-MM-DD')}`;
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current > dayjs().endOf('day').subtract(1, 'week');
    };

    const handleDateChange = (date: any, dateString: string) => {
        setSelectedWeek(dateString);
    };

    const handleAddReport = async () => {
        try {
            setBtnLoading(true);

            const dateFrom = selectedWeek.slice(0, 10);
            const dateTo = selectedWeek.slice(13);
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
        <Card title='Запрос недельного отчета' style={{ width: '30rem', margin: '10px auto'}}>
            <Form name="report-form" onFinish={ handleAddReport }>
                <Form.Item>
                    <DatePicker
                        format={customWeekStartEndFormat}
                        onChange={handleDateChange}
                        picker='week'
                        placeholder='Неделя'
                        disabledDate={disabledDate}
                    />
                </Form.Item>
                <ErrorMessage message={ error } />
                <Space>
                    <CustomButton htmlType="submit" loading={btnLoading}>
                        Добавить
                    </CustomButton>
                    <CustomButton onClick={ () => navigate(-1)}>
                        Отмена
                    </CustomButton>
                </Space>
            </Form>
        </Card>
    )
}