import { Row } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useAddComplectMutation } from '../../app/services/complects';
import { Complect } from '../../types';
import { ComplectForm } from '../../components/complect-form';

export const AddComplect = () => {

    const [error, setError] = useState('');
    const navigate= useNavigate();
    const user = useSelector(selectUser);
    const [addComplect] = useAddComplectMutation();
    
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user]);

    const handleAddComplect = async (complect: Complect) => {
        
        try {
            complect.count = Number(complect.count);

            complect.composition.forEach(item => {
                item.count = Number(item.count);
            });

            await addComplect(complect).unwrap();

            navigate(`${Paths.status}/complectCreated`);
        } catch (err) {
            const maybeError = isErrorWithMessage(err);

            if (maybeError) {
                setError(err.data.message);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    }

    return (
        <Row align='middle' justify='center'>
            <ComplectForm title='Добавление комплекта' btnText='Добавить' onFinish={ handleAddComplect } error={ error } />
        </Row>
    )
}
