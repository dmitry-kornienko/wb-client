import { Complects } from "../../components/complects";
import { Components } from "../../components/components";
import { Layout } from "../../components/layout";
import styles from "./index.module.css";

export const Home = () => {
    return (
        <Layout>
            <div className={styles.homePage}>
                <Components />
                <Complects />
            </div>
        </Layout>
    );
};
