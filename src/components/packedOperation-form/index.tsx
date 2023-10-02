import { Card, Form, Input, Select, Space, Typography } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { PackedOperation } from '../../types';
import { useGetAllComplectsQuery } from "../../app/services/complects";

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    packedOperation?: T;
    btnLoading?: boolean;
};

export const PackedOperationForm: React.FC<Props<PackedOperation>> = ({
    onFinish,
    title,
    btnText,
    error,
    packedOperation,
    btnLoading
}) => {

    const navigate = useNavigate();

    const { data } = useGetAllComplectsQuery();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="packedOperation-form" onFinish={ onFinish } initialValues={ packedOperation }>
                <CustomInput type="date" name="date" placeholder="Дата" />
                <Space  style={{ marginBottom: '20px'}}>
                    <Form.Item name='complect'>
                        <Select placeholder='Артикул комплекта'>
                            {
                                data?.map(complect => ( <Select.Option value={ complect._id } key={ complect._id }>{complect.article}</Select.Option> ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='count'>
                        <Input suffix='шт.' placeholder="Кол-во" type='number' />
                    </Form.Item>
                </Space>
                <Space>
                    <CustomButton htmlType="submit" loading={btnLoading}>
                        { btnText }
                    </CustomButton>
                    <CustomButton onClick={ () => navigate(-1)}>
                        Отмена
                    </CustomButton>
                    <ErrorMessage message={ error } />
                </Space>
            </Form>
            <Typography.Text>
                Нет нужного комплекта? <Link to={ Paths.complectAdd }>Добавить</Link>
            </Typography.Text>
        </Card>
    )
}
