import { Row } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { SendOperationForm } from '../../components/send-operations-form';
import { SendOperation } from '../../types';
import { useAddSendOperationMutation } from '../../app/services/send-operations';

export const AddSendOperation = () => {

    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addSendOperation] = useAddSendOperationMutation();

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    const handleAddSendOperation = async (sendOperation: SendOperation) => {
        try {
            setBtnLoading(true);

            sendOperation.partCount = Number(sendOperation.partCount);
            sendOperation.composition.forEach(item => {
                item.count = Number(item.count);
            });

            await addSendOperation(sendOperation);
            setBtnLoading(false);
            navigate(Paths.send);

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
            <SendOperationForm title='Добавление поставки' btnText='Сохранить' onFinish={handleAddSendOperation} error={error} btnLoading={btnLoading} />
        </Row>
    )
}
