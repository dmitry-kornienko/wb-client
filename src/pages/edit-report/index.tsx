import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/loader";
import { Row } from "antd";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useEditReportMutation, useGetReportQuery } from "../../app/services/reports";
import { EditReportForm } from "../../components/report-edit-form";
import { Layout } from "../../components/layout";

type DataFromForm = {
    storage: number,
    taking_payment: number,
    other_deductions: number,
    business_costs: number,
}

export const EditReport = () => {

    const navigate= useNavigate();
    const params = useParams<{ id: string }>();
    const [error, setError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const { data, isLoading } = useGetReportQuery(params.id || '');
    const [editReport] = useEditReportMutation();

    if (isLoading) {
        return <Loader />
    }

    const handleEditReport = async (dataFromForm: DataFromForm) => {
        try {
            setBtnLoading(true);
            
            if (data) {
                await editReport({id: data?._id, ...dataFromForm})
            }
            setBtnLoading(false);
            navigate(Paths.report)
        } catch (err) {
            const maybeError = isErrorWithMessage(err);
            
            if (maybeError) {
                setError(err.data.message);
            } else {
                setError('Неизвестная ошибка');
            }
            setBtnLoading(false);
        }
    }

    return (
        <Layout>
            <Row align='middle' justify='center'>
                <EditReportForm
                    title="Редактирование отчета"
                    btnText="Сохранить"
                    onFinish={ handleEditReport }
                    error={ error }
                    data={ data }
                    btnLoading={btnLoading}
                />
            </Row>
        </Layout>
    )
}
