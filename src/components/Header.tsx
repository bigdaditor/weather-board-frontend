import cn from "classnames";
import styles from "../css/Main.module.css";

function Header() {
    return (
        <>
            <header className={cn(styles.headerArea)}>
                <h1 style={{margin: 0}}>찬모날씨</h1>
            </header>
        </>
    )
}

export default Header;