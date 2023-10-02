import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Loader } from "../../components/loader";
import { Row } from "antd";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useEditComplectMutation, useGetComplectQuery } from "../../app/services/complects";
import { Complect, FullComplect } from "../../types";
import { ComplectForm } from "../../components/complect-form";
import { useGetAllComponentsQuery } from "../../app/services/components";

export const EditComplect = () => {

    const navigate= useNavigate();
    const params = useParams<{ id: string }>();
    const [error, setError] = useState('');
    const { data, isLoading } = useGetComplectQuery(params.id || '');
    const [editComplect] = useEditComplectMutation();
    const components = useGetAllComponentsQuery();

    if (isLoading) {
        return <Loader />
    }

    const handleEditComplect = async (complect: Complect) => {
        try {
  
            const editedComplect = {
                ...data,
                ...complect
            };

            editedComplect.count = Number(editedComplect.count);
            
            editedComplect.composition.forEach(item => {
                item.count = Number(item.count);

                // const currentComponent = components.data?.find(component => component.name === item.name);

                // if (currentComponent) {
                //     item.article = currentComponent.article
                // }
            });

            await editComplect(editedComplect).unwrap();

            navigate(`${Paths.status}/complectUpdated`);
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    }

    return (
        <Row align='middle' justify='center'>
            <ComplectForm
                title="Редактирование комплекта"
                btnText="Сохранить"
                onFinish={ handleEditComplect }
                error={ error }
                complect={ data }
            />
        </Row>
    )
}
