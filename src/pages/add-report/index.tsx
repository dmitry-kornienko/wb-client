import { Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useAddReportMutation } from '../../app/services/reports';
import { ReportForm } from '../../components/report-form';

type Config = {
    dateFrom: string,
    dateTo: string,
    tokenWB: string
}

export const AddReport = () => {

    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate= useNavigate();
    const user = useSelector(selectUser);
    const [addReport] = useAddReportMutation();
    
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    const handleAddReport = async (config: Config) => {
        
        try {
            setBtnLoading(true);
            const tokenWB = localStorage.getItem('tokenWB');

            if (tokenWB) {
                config.tokenWB = tokenWB;
                await addReport(config).unwrap();
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
        <Row align='middle' justify='center'>
            <ReportForm title='Запрос нового отчета' btnText='Добавить' onFinish={ handleAddReport } error={ error } btnLoading={btnLoading} />
        </Row>
    )
}