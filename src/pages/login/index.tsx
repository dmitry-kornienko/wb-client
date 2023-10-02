import { useState } from 'react';
import { CustomInput } from '../../components/custom-input';
import { Row, Card, Form, Space, Typography } from 'antd';
import { PasswordInput } from '../../components/password-input';
import { CustomButton } from '../../components/custom-button';
import { Link, useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { UserData, useLoginMutation } from '../../app/services/auth';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { ErrorMessage } from '../../components/error-message';

export const Login = () => {

  const navigate = useNavigate();

  const [loginUser, loginUserResult] = useLoginMutation();
  const [ error, setError ] = useState('');

  const login = async (data: UserData) => {
    try {
      await loginUser(data).unwrap();

      navigate('/');
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
    <Row align='middle' justify='center' style={{ marginTop: '10px' }}>
      <Card title='Войдите' style={{ width: '30rem' }}>
        <Form onFinish={ login }>
          <CustomInput name='email' placeholder='Email' type='email' />
          <PasswordInput name='password' placeholder='Пароль' />
          <CustomButton type='primary' htmlType='submit'>
            Войти
          </CustomButton>
        </Form>
        <Space direction='vertical' size='large'>
          <Typography.Text>
            Нет аккаунта? <Link to={ Paths.register }>Зарегистрируйтесь</Link>
          </Typography.Text>
          <ErrorMessage message={ error } />
        </Space>
      </Card>
    </Row>
  )
}
