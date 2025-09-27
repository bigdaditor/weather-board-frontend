import {Outlet} from "react-router-dom";
import Header from "./Header.tsx";

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default Layout;