import { Button, Card, Form, Input, Select, Space, Table } from "antd";
import { useGetAllComplectsQuery } from "../../app/services/complects";
import { Loader } from "../loader";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import { useGetAllComponentsQuery } from "../../app/services/components";
import { ColumnsType } from "antd/es/table";
import { Component } from '../../types';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addCalculatedComponents, clearFormCalculated } from "../../features/calculated-components/calculatedComponentsSlice";

type FormData = {
    composition: {
        article: string;
        count: number;
    }[];
};

const columns: ColumnsType<Component> = [
    {
        title: "Название",
        dataIndex: "name",
        key: "name",
        width: 200,
    },
    {
        title: "Артикул",
        dataIndex: "article",
        key: "article",
        width: 130,
    },
    {
        title: "Недостающее кол-во",
        dataIndex: "count",
        key: "count",
        width: 30,
    },
    {
        title: "Цена",
        dataIndex: "price",
        key: "price",
        width: 30,
    },
];

export const CalculateComponents = () => {
    const { data, isLoading } = useGetAllComplectsQuery();
    const components = useGetAllComponentsQuery();

    const dispatch = useAppDispatch();
    const calculatedComponents = useAppSelector(state => state.calculatedComponents.list);

    if (isLoading) {
        return <Loader />;
    }

    const arrForTable: Component[] = []

    const goToCount = (formData: FormData) => {

        if (formData.composition) {
            formData.composition.forEach(item => {
                item.count = Number(item.count);
    
                const complect = data?.find(complect => complect.article === item.article);
    
                complect?.composition.forEach(compositionItem => {
    
                    // const component = components.data?.find(elem => elem.article === compositionItem.article);
    
                    // if (component) {
                        
                    //     const remaindCOunAfterPacked = component?.count - (item.count * compositionItem.count)
    
                    //     if (remaindCOunAfterPacked < 0) {
    
                    //         const isContainsInArr = arrForTable.find(pos => pos.article === component.article);
    
                    //         if (isContainsInArr) {
                    //             isContainsInArr.count += compositionItem.count * item.count;
                    //         } else {
                    //             arrForTable.push({ ...component, count: Math.abs(remaindCOunAfterPacked) })
                    //         }
                    //     }
                    // }
                })
            });

            dispatch(addCalculatedComponents(arrForTable));
        }
    };

    return (
        <Card
            title="Расчет необходимого количества компонентов"
            style={{ margin: "10px 0" }}
        >
            <Form name="calculate-form" onFinish={goToCount}>
                <Form.List name="composition" prefixCls="1">
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
                                        name={[name, "article"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Обязательное поле",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Название компонента">
                                            {data?.map((complect) => (
                                                <Select.Option
                                                    value={complect.article}
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
                                            placeholder="Количество"
                                            type="number"
                                        />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                    />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Добавить комплект для расчета
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Space>
                    <CustomButton htmlType="submit">Рассчитать</CustomButton>
                    {
                        calculatedComponents.length > 0 ? (
                            <CustomButton danger onClick={() => dispatch(clearFormCalculated())}>
                                Очистить поля
                            </CustomButton>
                        ) : null
                    }
                </Space>
            </Form>
            <Table
                dataSource={calculatedComponents}
                columns={columns}
                size="small"
                pagination={false}
            />
        </Card>
    );
};
