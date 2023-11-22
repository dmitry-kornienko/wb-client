import { Card, Form, Space } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { useNavigate } from "react-router-dom";
import { Report } from "../../types";

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    data?: T;
    btnLoading?: boolean;
}

export const EditReportForm: React.FC<Props<Report>> = ({
    onFinish,
    title,
    btnText,
    error,
    data,
    btnLoading
}) => {

    const navigate = useNavigate();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="component-form" onFinish={ onFinish } initialValues={ data }>
                <label>Стоимость хранения</label>
                <CustomInput type="number" name="storage" placeholder="Стоимость хранения" />
                <label>Платная приемка</label>
                <CustomInput type="number" name="taking_payment" placeholder="Платная приемка" />
                <label>Прочие удержания</label>
                <CustomInput type="number" name="other_deductions" placeholder="Прочие удержания" />
                <label>Дополнительные расходы</label>
                <CustomInput type="number" name="business_costs" placeholder="Дополнительные расходы" />
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
