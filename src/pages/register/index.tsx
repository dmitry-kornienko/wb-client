import { CustomInput } from '../../components/custom-input';
import { Row, Card, Form, Space, Typography } from 'antd';
import { PasswordInput } from '../../components/password-input';
import { CustomButton } from '../../components/custom-button';
import { Link, useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { useState } from 'react';
import { useRegisterMutation } from '../../app/services/auth';
import { User } from '../../types';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { ErrorMessage } from '../../components/error-message';
import { Layout } from '../../components/layout';

type RegisterData = Omit<User, 'id'> & { confirmPassword: string }

export const Register = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [registerUser] = useRegisterMutation();

  const register =  async(data: RegisterData) => {
    try {
      await registerUser(data).unwrap();

      navigate('/');
    } catch (error) {
      const maybeError = isErrorWithMessage(error);

      if (maybeError) {
        setError(error.data.message);
      } else {
        setError('Неизвестная ошибка');
      }
    }
  }

  return (
    <Layout>
      <Row align='middle' justify='center' style={{ marginTop: '10px' }}>
        <Card title='Регистрация сотрудника' style={{ width: '30rem' }}>
          <Form onFinish={ register }>
            <CustomInput name='firstName' placeholder='Имя' />
            <CustomInput name='lastName' placeholder='Фамилия' />
            <CustomInput name='email' placeholder='Email' type='email' />
            <PasswordInput name='password' placeholder='Пароль' />
            <PasswordInput name='confirmPassword' placeholder='Повторите пароль' />
            <CustomButton type='primary' htmlType='submit'>
              Зарегистрировать
            </CustomButton>
          </Form>
          <Space direction='vertical' size='large'>
            <Typography.Text>
              Уже зарегистрированы? <Link to={ Paths.login }>Войдите</Link>
            </Typography.Text>
            <ErrorMessage message={ error } />
          </Space>
        </Card>
      </Row>
    </Layout>
  )
}
