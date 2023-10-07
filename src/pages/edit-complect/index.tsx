import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/loader";
import { Row } from "antd";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useEditComplectMutation, useGetComplectQuery } from "../../app/services/complects";
import { Complect } from "../../types";
import { ComplectForm } from "../../components/complect-form";
import { useGetAllComponentsQuery } from "../../app/services/components";

export const EditComplect = () => {

    const navigate= useNavigate();
    const params = useParams<{ id: string }>();
    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const { data, isLoading } = useGetComplectQuery(params.id || '');
    const components = useGetAllComponentsQuery();
    const [editComplect] = useEditComplectMutation();

    if (isLoading) {
        return <Loader />
    }

    const handleEditComplect = async (complect: Complect) => {
        try {
            setBtnLoading(true);

            complect.composition.forEach(item => {
                const currenComponent = components.data?.find(component => component._id === item.component.name);

                if (currenComponent) {
                    item.component = currenComponent
                }
            })
  
            const editedComplect = {
                ...data,
                ...complect
            };

            editedComplect.count = Number(editedComplect.count);
            
            editedComplect.composition.forEach(item => {
                item.count = Number(item.count);
            });

            await editComplect(editedComplect).unwrap();

            setBtnLoading(false);

            navigate(`${Paths.status}/complectUpdated`);
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
            <ComplectForm
                title="Редактирование комплекта"
                btnText="Сохранить"
                onFinish={handleEditComplect}
                error={error}
                complect={data}
                editForm={true}
                btnLoading={btnLoading}
            />
        </Row>
    )
}
