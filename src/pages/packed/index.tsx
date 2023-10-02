import { Space } from "antd";
import { CalculateComponents } from "../../components/calculate-components";
import { PackedOperations } from "../../components/packed-operations";
import styles from './index.module.css';

export const Packed = () => {
  return (
    <Space align="start" className={ styles.packedPage }>
      <PackedOperations />
      <CalculateComponents />
    </Space>
  )
}
