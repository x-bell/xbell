import React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Box from './MDBox';
import Badge from './MDBadge';
import VideoDialog from './VideoDialog';
import { XBellTestGroupRecord, XBellTestCaseRecord, XBellTestCaseStatus, XBellTestTaskRecord, XBellTestFileRecord } from '../../lib/index';
import MDTypography from './MDTypography';
const GroupRow = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;


const CaseContainer = styled('div')`
  padding-left: 48px;
`

const CaseItem = styled(Box)({
  height: '60px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0px 16px',
});

const CaseItemLeft = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

function getStatus(cases: XBellTestCaseRecord[]): XBellTestCaseStatus {
  if (cases.some(c => c.status === 'failed')) {
    return 'failed';
  }

  if (cases.some(c => c.status === 'running')) {
    return 'running';
  }

  return 'successed';
}

export const FileCard: React.FC<XBellTestFileRecord> = ({
  filename,
  tasks
}) => {
  const filepaths = filename.split('/');
  const file = filepaths.pop();
  const dir = filepaths.join('/') + '/';
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8 }}>
        <MDTypography>
          <span style={{ color: '#777' }}>{dir}</span>
          <span>{file}</span>
        </MDTypography>
      </div>
      <Stack spacing={2}>
        {tasks.map((task, index) => <TaskCard key={index} {...task} />)}
      </Stack>
    </div>
  )
}

const TaskCard: React.FC<XBellTestTaskRecord> = (task) => {
  if (task.type === 'case') {
    return <CaseCard {...task} />
  }

  return <GroupCard {...task} />
}


const GroupCard: React.FC<XBellTestGroupRecord> = ({
  groupDescription,
  cases
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
    <Box
        bgColor="light"
        variant="gradient"
        borderRadius="lg"
        shadow="lg"
        opacity={1}
        p={2}
      >
        <GroupRow>
          <div>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ?  <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
              {groupDescription}
          </div>
          {/* <div>成功{account.successed}个，失败{account.failed}个</div> */}
        </GroupRow>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CaseContainer>
          <Stack spacing={2}>
            {cases.map((task, index) => {
              return <TaskCard key={index} {...task} />
            })}
          </Stack>
        </CaseContainer>
      </Collapse>
    </>
  );
}

const CaseCard: React.FC<XBellTestCaseRecord> = ({
  videos,
  status,
  caseDescription
}) => {
  const videoSrc = videos?.[0];
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);

  const handleVideoClose = () => {
    setVideoModalOpen(false);
  };

  const handleVideoClick = () => {
    setVideoModalOpen(true);
  };

  const { color, icon } = status === 'failed'
    ? { color: 'primary', icon: <CloseIcon fontSize="small" /> }
    : status === 'successed'
        ? { color: 'success', icon: <DoneIcon fontSize="small" /> }
        : { color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> };

  return (
    <>
    <CaseItem
      variant="gradient"
      bgColor={color}
      coloredShadow={color}
      color="white"
      borderRadius="lg"
      opacity={1}
    >
      <CaseItemLeft>
        {icon}
        &nbsp;
        &nbsp;
        {caseDescription}
      </CaseItemLeft>
      <div>
        {/* <Badge color="info">
          Chrome
        </Badge> */}
        {/* <IconButton size="medium">
          <PhotoSizeSelectActualOutlinedIcon htmlColor="white" />
        </IconButton> */}
        {!!videoSrc && <IconButton size="medium" onClick={() => handleVideoClick()}>
          <PlayCircleFilledWhiteOutlinedIcon htmlColor="white" />
        </IconButton>}
      </div>
    </CaseItem>
    {!!videoSrc && <VideoDialog open={videoModalOpen} onClose={() => handleVideoClose()} src={videoSrc} />}
    </>
  );
}
