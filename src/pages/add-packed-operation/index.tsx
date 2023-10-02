import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { PackedOperation } from '../../types';
import { useAddPackedOperationMutation } from '../../app/services/packed-operations';
import { PackedOperationForm } from '../../components/packedOperation-form';

export const AddPackedOperation = () => {

    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addPackedOperation] = useAddPackedOperationMutation();

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    const handleAddPackedOperation = async (packedOperation: PackedOperation) => {
        try {
            setBtnLoading(true);

            packedOperation.count = Number(packedOperation.count);
            
            await addPackedOperation(packedOperation).unwrap();

            setBtnLoading(false);
            navigate(Paths.packed);
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
            <PackedOperationForm title='Добавление операции' btnText='Сохранить' onFinish={handleAddPackedOperation} error={error} btnLoading={btnLoading} />
        </Row>
    )
}
