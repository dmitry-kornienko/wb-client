import { Spin } from 'antd';
import styles from './index.module.css';

export const Loader = () => {
  return (
    <div className={ styles.loader }>
        <Spin tip='loading' size='large' />
    </div>
  )
}
