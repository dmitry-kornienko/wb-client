import { Layout, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { TeamOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import styles from '../header/index.module.css';
import { CustomButton } from '../custom-button';
import { Paths } from '../../paths';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../features/auth/authSlice';

export const Header = () => {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLogoutClick = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login');
    }

  return (
    <Layout.Header className={ styles.header }>
        <Space>
            <TeamOutlined className={ styles.teamIcon } />
            <Link to={ Paths.home }>
                    <Typography.Title level={ 1 }>
                        WB Control
                    </Typography.Title>
            </Link>
        </Space>
        {
            user ? (
                <>
                    <div>
                        <Typography>{user.firstName} {user.lastName}</Typography>
                    </div>
                    <div>
                        <CustomButton type='text' icon={ <LogoutOutlined /> } onClick={ onLogoutClick }>
                            Выйти
                        </CustomButton>
                    </div>
                </>
            ) :
            <Space>
                <Link to={ Paths.register }>
                    <CustomButton type='text' icon={ <UserOutlined /> }>
                        Зарегистрироваться
                    </CustomButton>
                </Link>
                <Link to={ Paths.login }>
                    <CustomButton type='text' icon={ <LoginOutlined /> }>
                        Войти
                    </CustomButton>
                </Link>
            </Space>
        }
        
    </Layout.Header>
  )
}
