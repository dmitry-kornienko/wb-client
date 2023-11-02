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
            config.tokenWB = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NJRCI6ImUxNmQ4ODU0LThlOGQtNDk3Ni04ZmUwLThmNzU3NGZmYTU3OSJ9.NcHNBz1KT6y48moGIDD1Bt_ggbOFL17tzYofetA33rI'
            await addReport(config).unwrap();

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
