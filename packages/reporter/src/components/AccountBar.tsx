import React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import AccountCard from './AccountCard';

const Row = styled(Grid)`
  display: flex;
  justify-content: center;
`;

interface AccountBarProps {
  successedCount: number;
  failedCount: number;
  runningCount: number;
}
const AccountBar: React.FC<AccountBarProps> = ({
  successedCount,
  failedCount,
  runningCount
}) => {
  return (
    <Grid container spacing={2}>
      <Row item xs={4}>
        <AccountCard icon={<ThumbUpIcon />} count={successedCount} title="成功数" color="success" />
      </Row>
      <Row item xs={4}>
        <AccountCard icon={<NotificationImportantIcon />} count={failedCount} title="失败数" color="primary" />
      </Row>
      <Row item xs={4}>
        <AccountCard icon={<HourglassFullIcon />} count={runningCount} title="运行中" color="warning" />
      </Row>
    </Grid>
  )
}

export default AccountBar;