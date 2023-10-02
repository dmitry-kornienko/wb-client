import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useEditComponentMutation, useGetComponentQuery } from "../../app/services/components";
import { Loader } from "../../components/loader";
import { Row } from "antd";
import { ComponentForm } from "../../components/component-form";
import { Component } from '../../types';
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";

export const EditComponent = () => {

    const navigate= useNavigate();
    const params = useParams<{ id: string }>();
    const [error, setError] = useState('');
    const { data, isLoading } = useGetComponentQuery(params.id || '');
    const [editComponent] = useEditComponentMutation();

    if (isLoading) {
        return <Loader />
    }

    const handleEditComponent = async (component: Component) => {
        try {
            const editedComponent = {
                ...data,
                ...component
            };

            editedComponent.count = Number(editedComponent.count);
            editedComponent.price = Number(editedComponent.price);

            await editComponent(editedComponent).unwrap();

            navigate(`${Paths.status}/updated`);
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
            <ComponentForm
                title="Редактирование компанента"
                btnText="Сохранить"
                onFinish={ handleEditComponent }
                error={ error }
                component={ data }
            />
        </Row>
    )
}
