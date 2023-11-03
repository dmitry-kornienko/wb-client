import { useNavigate } from "react-router-dom";
import { Row } from "antd";
import { Paths } from "../../paths";
import { EditTokenForm } from "../../components/token-form";

type DataFromForm = {
    tokenWB: string
}

export const EditToken = () => {

    const navigate= useNavigate();

    const handleEditToken =  (data: DataFromForm) => {
        localStorage.setItem('tokenWB', data.tokenWB);
        navigate(Paths.report)
    }

    return (
        <Row align='middle' justify='center'>
            <EditTokenForm
                title="Редактирование токена WB"
                btnText="Сохранить"
                onFinish={ handleEditToken }
            />
        </Row>
    )
}
