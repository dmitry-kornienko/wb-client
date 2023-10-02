import { Component } from '../../types';
import { Card, Form, Space } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { useNavigate } from "react-router-dom";

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    component?: T
}

export const ComponentForm: React.FC<Props<Component>> = ({
    onFinish,
    title,
    btnText,
    error,
    component
}) => {

    const navigate = useNavigate();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="component-form" onFinish={ onFinish } initialValues={ component }>
                <CustomInput type="text" name="name" placeholder="Название" />
                <CustomInput type="text" name="article" placeholder="Артикул" />
                <CustomInput type="number" name="count" placeholder="Кол-во" />
                <CustomInput type="number" name="price" placeholder="Цена" />
                <CustomInput type="text" name="desc" placeholder="Описание" />
                <Space>
                    <ErrorMessage message={ error } />
                    <CustomButton htmlType="submit">
                        { btnText }
                    </CustomButton>
                    <CustomButton onClick={ () => navigate(-1)}>
                        Отмена
                    </CustomButton>
                </Space>
            </Form>
        </Card>
    )
}
