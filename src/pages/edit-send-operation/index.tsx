import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { SendOperationForm } from '../../components/send-operations-form';
import { SendOperation } from '../../types';
import { useEditSendOperationMutation, useGetSendOperationQuery } from '../../app/services/send-operations';
import { Loader } from '../../components/loader';
import { Layout } from '../../components/layout';

export const EditSendOperation = () => {

    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const params = useParams<{ id: string }>();
    const { data, isLoading } = useGetSendOperationQuery(params.id || '');
    const [editSendOperation] = useEditSendOperationMutation();

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    if (isLoading) return <Loader />

    const handleEditSendOperation = async (sendOperation: SendOperation) => {
        try {
            setBtnLoading(true);
            sendOperation.composition.forEach(item => {
                item.count = Number(item.count);
            });
            sendOperation.weight = Number(sendOperation.weight);
            sendOperation.partCount = Number(sendOperation.partCount)

            const editedOperation = {
                ...data,
                ...sendOperation
            }

            await editSendOperation(editedOperation);
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
        <Layout>
            <Row align='middle' justify='center'>
                <SendOperationForm
                    sendOperation={ data }
                    editForm={true}
                    title='Добавление поставки'
                    btnText='Сохранить'
                    onFinish={handleEditSendOperation}
                    error={error}
                    btnLoading={btnLoading}
                />
            </Row>
        </Layout>
    )
}
