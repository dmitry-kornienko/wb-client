import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { BuyOperation } from '../../types';
import { useEditBuyOperationMutation, useGetBuyOperationQuery } from '../../app/services/buy-operations';
import { BuyOperationForm } from '../../components/buyOperation-form';
import { Loader } from '../../components/loader';
import { Layout } from '../../components/layout';

export const EditBuyOperation = () => {

    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const user = useSelector(selectUser);
    const { data, isLoading } = useGetBuyOperationQuery(params.id || '');
    const [editBuyOperation] = useEditBuyOperationMutation();

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    if (isLoading) return <Loader />

    const handleEditBuyOperation = async (buyOperation: BuyOperation) => {
        try {
            setBtnLoading(true);

            const editedOperation = {
                ...data,
                ...buyOperation
            };
            editedOperation.composition.forEach(async item => {
                item.count = Number(item.count);
                item.price = Number(item.price);
            });

            await editBuyOperation(editedOperation);

            setBtnLoading(false);

            navigate(Paths.buy);
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
                <BuyOperationForm
                    title='Редактирование операции'
                    btnText='Сохранить'
                    onFinish={handleEditBuyOperation}
                    error={error}
                    buyOperation={data}
                    editForm={true}
                    btnLoading={btnLoading}
                />
            </Row>
        </Layout>
    )
}
