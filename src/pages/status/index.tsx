import { Button, Result, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const Statuses: Record<string, string> = {
    created: 'Компонент создан',
    updated: 'Компонент изменен',
    deleted: 'Компонент удален',
    complectCreated: 'Комплект создан',
    complectDeleted: 'Комплект удален',
    complectUpdated: 'Комплект изменен',
    operationCreated: 'Операция успешно проведена',
    operationUpdated: 'Операция изменена',
    operationDeleted: 'Операция удалена',
}

export const Status = () => {

    const { status } = useParams();
    const navigate = useNavigate();

    return (
        <Row align='middle' justify='center' style={{ width: '100%' }}>
            <Result
                status={ status ? 'success' : 404 } 
                title={ status ? Statuses[status] : 'Не найдено' }
                extra={
                    <Button key='dashboard' onClick={ () => navigate('/') }>
                        На главную
                    </Button>
                }
            />
        </Row>
    )
}
