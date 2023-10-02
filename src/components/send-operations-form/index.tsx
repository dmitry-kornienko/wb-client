import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useGetAllComplectsQuery } from "../../app/services/complects";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { SendOperation } from "../../types";

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    sendOperation?: T;
    editForm?: boolean;
    btnLoading?: boolean;
};

const { Option } = Select;

export const SendOperationForm: React.FC<Props<SendOperation>> = ({
    onFinish,
    title,
    btnText,
    error,
    sendOperation,
    editForm,
    btnLoading
}) => {
    const navigate = useNavigate();

    const { data } = useGetAllComplectsQuery();

    return (
        <Card title={title} style={{ width: "30rem", margin: "10px 0" }}>
            <Form
                name="sendOperation-form"
                onFinish={onFinish}
                initialValues={sendOperation}
            >
                <Space align="baseline">
                    <Typography>Дата отправки</Typography>
                    <CustomInput name="sendingData" type="date" placeholder="Дата отправки" />
                </Space>
                <Space align="baseline">
                    <Typography>Склад отгрузки</Typography>
                    <Form.Item name='warehous'>
                        <Select placeholder='Склад' style={{ width: "150px" }}>
                            <Option value='Электросталь'>Электросталь</Option>
                            <Option value='Коледино'>Коледино</Option>
                            <Option value='Казань'>Казань</Option>
                            <Option value='Краснодар'>Краснодар</Option>
                            <Option value='Невинномысск'>Невинномысск</Option>
                        </Select>
                    </Form.Item>
                </Space>
                {
                    editForm ? (
                        <>
                            <Space align="baseline">
                                <Typography>Номер поставки WB</Typography>
                                <CustomInput name="sendNumberMP" placeholder="Номер поставки WB" />
                            </Space>
                            <Space align="baseline">
                                <Typography>Номер накладной</Typography>
                                <CustomInput name="invoiceNumber" placeholder="Номер накладной ТК" />
                            </Space>
                            <Space align="baseline">
                                <Typography>Вес</Typography>
                                <CustomInput name="weight" placeholder="Вес" type="number" />
                            </Space>
                            <Form.Item name='isPacked' label='Упаковано'>
                                <Select style={{ width: '70px' }}>
                                    <Option value={true}>Да</Option>
                                    <Option value={false}>Нет</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name='isSended' label='Отправленно'>
                                <Select style={{ width: '70px' }}>
                                    <Option value={true}>Да</Option>
                                    <Option value={false}>Нет</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name='isAgreed' label='Согласованно'>
                                <Select style={{ width: '70px' }}>
                                    <Option value={true}>Да</Option>
                                    <Option value={false}>Нет</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name='isAccepted' label='Принято'>
                                <Select style={{ width: '70px' }}>
                                    <Option value={true}>Да</Option>
                                    <Option value={false}>Нет</Option>
                                </Select>
                            </Form.Item>
                        </>  
                    ) : null
                }
                <Space align="baseline">
                    <Typography>Количество коробок</Typography>
                    <CustomInput name="partCount" type="number"  placeholder="Количество коробок" />
                </Space>
                <Space align="baseline">
                    <Typography>Дата премки</Typography>
                    <CustomInput name="acceptDate" type="date" placeholder="Дата приемки" />
                </Space>
                <Typography.Title level={ 4 }>Состав:</Typography.Title>
                <Form.List name="composition">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{ display: "flex", marginBottom: 8 }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, "complect"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Обязательное поле",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Артикул комплекта">
                                            {data?.map((complect) => (
                                                <Select.Option
                                                    value={complect._id}
                                                    key={complect._id}
                                                >
                                                    {complect.article}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "count"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Укажите количество",
                                            },
                                        ]}
                                    >
                                        <Input
                                            suffix='шт.'
                                            placeholder="Количество"
                                            type="number"
                                        />
                                    </Form.Item>
                                    {
                                        editForm ? null : <MinusCircleOutlined onClick={() => remove(name)}/>
                                    }
                                    
                                </Space>
                            ))}
                            <Form.Item>
                                <Button
                                    disabled={editForm}
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Добавить комплект
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Space>
                    <CustomButton htmlType="submit" loading={btnLoading}>{btnText}</CustomButton>
                    <CustomButton onClick={() => navigate(-1)}>
                        Отмена
                    </CustomButton>
                    <ErrorMessage message={error} />
                </Space>
            </Form>
            {
                editForm ? null : (
                    <Typography.Text>
                        Нет нужного комплекта?
                        <Link to={Paths.complectAdd}>Добавить</Link>
                    </Typography.Text>
                )
            }
        </Card>
    );
};
