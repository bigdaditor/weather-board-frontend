import {Outlet} from "react-router-dom";
import Header from "./Header.tsx";
import { Box, Container, CssBaseline } from '@mui/material';

function Layout() {
    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100dvh',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                }}
            >
                <Header />
                <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 3 } }}>
                    <Container maxWidth="md">
                        <Outlet />
                    </Container>
                </Box>
                <Box
                    component="footer"
                    sx={{
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        py: 2,
                    }}
                >
                    <Container
                      maxWidth="md"
                      sx={{
                        display: 'flex',
                        textAlign: 'center',
                        color: 'text.secondary',
                        typography: 'caption',
                        height: '5vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                        © {new Date().getFullYear()} Weather Board
                    </Container>
                </Box>
            </Box>
        </>
    );
}

export default Layout;