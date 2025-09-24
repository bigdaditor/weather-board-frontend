import styles from '../css/Main.module.css'
import cn from 'classnames'
import {Link} from 'react-router-dom'
import Button from "@mui/material/Button"


function MainPage() {
    return (
        <>
            <Button component={Link} to={"/sales"} className={cn(styles.gridButton, styles.leftButton)} variant="contained">
                <h1>매출 입력</h1>
            </Button>
            <Button component={Link} to={"/stats"} className={cn(styles.gridButton, styles.rightButton)} variant="contained">
                <h1>통계 확인</h1>
            </Button>
        </>
    )
}

export default MainPage