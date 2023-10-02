import { Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { BuyOperation } from "../../types";
import { useAddBuyOperationMutation } from "../../app/services/buy-operations";
import { BuyOperationForm } from "../../components/buyOperation-form";

export const AddBuyOperation = () => {
    const [error, setError] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addBuyOperation] = useAddBuyOperationMutation();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [navigate, user]);

    const handleAddBuyOperation = async (buyOperation: BuyOperation) => {
        try {
            setBtnLoading(true);

            buyOperation.composition.forEach(async (item) => {
                item.count = Number(item.count);
                item.price = Number(item.price);
            });

            await addBuyOperation(buyOperation).unwrap();

            setBtnLoading(false);

            navigate(Paths.buy);
        } catch (err) {
            const maybeError = isErrorWithMessage(err);

            if (maybeError) {
                setError(err.data.message);
            } else {
                setError("Неизвестная ошибка");
            }

            setBtnLoading(false);
        }
    };

    return (
        <Row align="middle" justify="center">
            <BuyOperationForm
                title="Добавление операции"
                btnText="Добавить"
                onFinish={handleAddBuyOperation}
                error={error}
                btnLoading={btnLoading}
            />
        </Row>
    );
};
