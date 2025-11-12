import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

function MainPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        bgcolor: 'background.default',
        height: '70dvh',
        p: 2,
      }}
    >
      <Button
        component={Link}
        to="/sales"
        variant="contained"
        color="primary"
        sx={{
          flex: 1,
          minWidth: { xs: '80%', sm: '45%' },
          minHeight: { xs: '40%', sm: '60%' },
          fontSize: '2.5rem',
          fontWeight: 800,
          borderRadius: 4,
        }}
      >
        매출 입력
      </Button>

      <Button
        component={Link}
        to="/stats"
        variant="contained"
        color="secondary"
        sx={{
          flex: 1,
          minWidth: { xs: '80%', sm: '45%' },
          minHeight: { xs: '40%', sm: '60%' },
          fontSize: '2.5rem',
          fontWeight: 800,
          borderRadius: 4,
        }}
      >
        통계 확인
      </Button>
    </Box>
  );
}

export default MainPage;