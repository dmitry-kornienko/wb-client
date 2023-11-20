import { Space } from "antd";
import { CalculateComponents } from "../../components/calculate-components";
import { PackedOperations } from "../../components/packed-operations";
import styles from './index.module.css';
import { Layout } from "../../components/layout";

export const Packed = () => {
  return (
    <Layout>
      <Space align="start" className={ styles.packedPage }>
        <PackedOperations />
        <CalculateComponents />
      </Space>
    </Layout>
  )
}
