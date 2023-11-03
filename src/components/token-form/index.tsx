import { Card, Form, Space } from "antd";
import { CustomInput } from "../custom-input";
import { CustomButton } from "../custom-button";
import { useNavigate } from "react-router-dom";

type Props = {
    onFinish: (data: { tokenWB: string }) => void;
    btnText: string;
    title: string;
}

export const EditTokenForm: React.FC<Props> = ({
    onFinish,
    title,
    btnText,
}) => {

    const navigate = useNavigate();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="token-form" onFinish={ onFinish }>
                <CustomInput type="text" name="tokenWB" placeholder="Токен WB" />
                <Space>
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
