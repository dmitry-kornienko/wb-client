import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { Link, useNavigate } from "react-router-dom";
import { BuyOperation } from "../../types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetAllComponentsQuery } from "../../app/services/components";
import { Paths } from "../../paths";

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    buyOperation?: T;
    editForm?: boolean;
    btnLoading?: boolean;
};

export const BuyOperationForm: React.FC<Props<BuyOperation>> = ({
    onFinish,
    title,
    btnText,
    error,
    buyOperation,
    editForm,
    btnLoading
}) => {

    const navigate = useNavigate();

    const { data } = useGetAllComponentsQuery();

    return (
        <Card title={ title } style={{ width: '30rem', margin: '10px 0'}}>
            <Form name="buyOperation-form" onFinish={ onFinish } initialValues={ buyOperation }>
                <CustomInput type="date" name="date" placeholder="Дата" />
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
                                        disabled={ editForm }
                                        style={{ minWidth: "200px" }}
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
                                    <Input placeholder="Кол-во" type='number' />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    rules={[{ required: true, message: 'Укажите цену' }]}
                                >
                                    <Input suffix='руб.' placeholder="Цена" type='number' />
                                </Form.Item>
                                {
                                    editForm ? null : <MinusCircleOutlined onClick={() => remove(name)} />
                                }
                            </Space>
                        ))}
                        {
                            editForm ? null :
                                <Form.Item>
                                    <Button disabled={editForm} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Добавить компонент
                                    </Button>
                                </Form.Item>
                        }
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
