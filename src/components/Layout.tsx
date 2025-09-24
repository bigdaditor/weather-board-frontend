import {Outlet} from "react-router-dom";
import Header from "./Header.tsx";
import styles from "../css/Main.module.css";

function Layout() {
    return (
        <div className={styles.container}>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout;