import { Component, Report } from '../../types';
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
    report?: T;
    btnLoading?: boolean;
}

export const ReportForm: React.FC<Props<{ dateFrom: string, dateTo: string, tokenWB: string }>> = ({
    onFinish,
    title,
    btnText,
    error,
    report,
    btnLoading
}) => {

    const navigate = useNavigate();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="component-form" onFinish={ onFinish } initialValues={ report }>
                <label>Дата начала</label>
                <CustomInput type="date" name="dateFrom" placeholder="Дата начала" />
                <label>Дата конца</label>
                <CustomInput type="date" name="dateTo" placeholder="Дата конца" />
                <Space>
                    <ErrorMessage message={ error } />
                    <CustomButton htmlType="submit" loading={btnLoading}>
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
