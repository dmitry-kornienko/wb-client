import { Complects } from "../../components/complects";
import { Components } from "../../components/components";
import styles from './index.module.css';

export const Home = () => {
  return (
    <div className={ styles.homePage }>
      <Components />
      <Complects />
    </div>
  )
}