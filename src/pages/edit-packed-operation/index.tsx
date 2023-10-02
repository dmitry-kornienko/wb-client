import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/loader";
import { Row } from "antd";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { PackedOperation } from '../../types';
import { useEditPackedOperationMutation, useGetPackedOperationQuery } from "../../app/services/packed-operations";
import { PackedOperationForm } from "../../components/packedOperation-form";

export const EditPackedOperation = () => {

    const navigate= useNavigate();
    const params = useParams<{ id: string }>();
    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const { data, isLoading } = useGetPackedOperationQuery(params.id || '');
    const [editOperation] = useEditPackedOperationMutation();

    if (isLoading) {
        return <Loader />
    }

    const handleEditPackedOperation = async (operation: PackedOperation) => {
        try {
            setBtnLoading(true);
  
            const editedOperation = {
                ...data,
                ...operation
            };

            editedOperation.count = Number(editedOperation.count);

            await editOperation(editedOperation).unwrap();

            setBtnLoading(false);

            navigate(Paths.packed);
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError('Неизвестная ошибка');
            }

            setBtnLoading(false);
        }
    }

    return (
        <Row align='middle' justify='center'>
            <PackedOperationForm
                title="Редактирование операции"
                btnText="Сохранить"
                onFinish={ handleEditPackedOperation }
                error={ error }
                packedOperation={ data }
                btnLoading={btnLoading}
            />
        </Row>
    )
}
