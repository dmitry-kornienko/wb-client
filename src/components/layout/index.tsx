import React, { useState } from 'react';
import { Layout as AntLayout, Menu, MenuProps } from 'antd';
import styles from '../layout/index.module.css';
import { Header } from '../header';
import Sider from 'antd/es/layout/Sider';
import { useLocation, useNavigate } from 'react-router-dom';
import { DropboxOutlined, HomeOutlined, ZoomInOutlined, SendOutlined, DollarOutlined } from '@ant-design/icons';

type Props = {
    children: React.ReactNode 
}

export const Layout: React.FC<Props> = ({ children }) => {

    const menuProps = [
      {
        lable: 'Склад',
        icon: <HomeOutlined />,
        key: ''
      },
      {
        lable: 'Закупки',
        icon: <ZoomInOutlined />,
        key: 'buy'
      },
      {
        lable: 'Упаковка',
        icon: <DropboxOutlined />,
        key: 'packed'
      },
      {
        lable: 'Поставки',
        icon: <SendOutlined />,
        key: 'send'
      },
      // {
      //   lable: 'Статистика',
      //   icon: <LineChartOutlined />,
      //   key: 'statistic'
      // },
      {
        lable: 'Отчеты',
        icon: <DollarOutlined />,
        key: 'report'
      },
    ]
    const { pathname } = useLocation();

    const [current, setCurrent] = useState(`${pathname.slice(1)}`);
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {
      navigate(`/${e.key}`)
      setCurrent(e.key);
    };

    return (
      <div className={ styles.main }>
      <AntLayout>
        <Header />
          <AntLayout>
            <Sider
              theme='light'
              breakpoint="lg"
            >
              <Menu
                theme="light"
                mode="inline"
                onClick={ onClick }
                selectedKeys={[current]}
                items={menuProps.map(
                  (item) => ({
                    key: item.key,
                    label: item.lable,
                    icon: item.icon
                  }),
                )}
              />
            </Sider>
          <AntLayout.Content style={{ height: '100%' }}>
              { children }
          </AntLayout.Content>
        </AntLayout>
      </AntLayout>
    </div>
  )
}
