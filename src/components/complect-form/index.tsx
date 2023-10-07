import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { Link, useNavigate } from "react-router-dom";
import { Complect } from "../../types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetAllComponentsQuery } from "../../app/services/components";
import { Paths } from "../../paths";

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    complect?: T
    editForm?: boolean,
    btnLoading?: boolean;
};

export const ComplectForm: React.FC<Props<Complect>> = ({
    onFinish,
    title,
    btnText,
    error,
    complect,
    editForm,
    btnLoading
}) => {

    const navigate = useNavigate();

    const { data } = useGetAllComponentsQuery();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="complect-form" onFinish={ onFinish } initialValues={ complect }>
                <CustomInput type="text" name="name" placeholder="Название" />
                <CustomInput type="text" name="article" placeholder="Артикул" />
                <CustomInput type="number" name="count" placeholder="Кол-во" />
                <Typography.Title level={ 4 }>Состав:</Typography.Title>
                <Form.List name="composition">
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={ editForm ? [name, 'component', 'name'] : [name, 'component']}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                >
                                    <Select
                                        placeholder='Название компонента'
                                    >
                                        {
                                            data?.map(component => ( <Select.Option value={ component._id } key={ component._id }>{component.name}</Select.Option> ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'count']}
                                    rules={[{ required: true, message: 'Укажите количество' }]}
                                >
                                    <Input placeholder="Количество" type='number' />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Добавить компонент
                            </Button>
                        </Form.Item>
                        </>
                    )}
                </Form.List>
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
                Нет нужного компонента? <Link to={ Paths.componentAdd }>Добавить</Link>
            </Typography.Text>
        </Card>
    )
}
