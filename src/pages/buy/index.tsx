import { BuyOperations } from "../../components/buy-operations";
import { Layout } from "../../components/layout";
import styles from './index.module.css';

export const Buy = () => {

  return (
    <Layout>
      <div className={ styles.buyPage }>
        <BuyOperations />
      </div>
    </Layout>
  )
}
