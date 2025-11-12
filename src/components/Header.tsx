import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            height: '10vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            찬모날씨
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;