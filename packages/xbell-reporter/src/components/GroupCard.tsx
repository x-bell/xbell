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
import { XBellGroupRecord, XBellCaseRecord, XBellCaseStatus } from '../../lib/index';


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
interface GroupCardProps extends XBellGroupRecord {

}

function getStatus(cases: XBellCaseRecord[]): XBellCaseStatus {
  if (cases.some(c => c.status === 'failed')) {
    return 'failed';
  }

  if (cases.some(c => c.status === 'running')) {
    return 'running';
  }

  return 'successed';
}

const GroupCard: React.FC<GroupCardProps> = ({
  groupName,
  env,
  cases,
}) => {
  const [open, setOpen] = React.useState(false);
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);
  const status = getStatus(cases);
  const [activeCase, setActiveCase] = React.useState<XBellCaseRecord>(null);
  const videoSrc = activeCase?.videoRecords[0]?.filepath;
  const account = cases.reduce((acc, c) => {
    if (c.status === 'failed') {
      acc.failed++;
    } else if (c.status === 'successed') {
      acc.successed++;
    } else if (c.status === 'running') {
      acc.running++;
    }
    return acc;
  }, {
    successed: 0,
    failed: 0,
    running: 0,
  })

  const handleVideoClick = (c: XBellCaseRecord) => {
    setActiveCase(c);
    setVideoModalOpen(true);
  }

  const handleVideoClose = () => {
    setVideoModalOpen(false);
    setActiveCase(null);
  }
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
              {groupName}
          </div>
          <div>成功{account.successed}个，失败{account.failed}个</div>
        </GroupRow>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CaseContainer>
          <Stack spacing={2}>
            {cases.map((c, caseIndex) => {
              const { color, icon } = c.status === 'failed'
                ? { color: 'primary', icon: <CloseIcon fontSize="small" /> }
                : c.status === 'successed'
                    ? { color: 'success', icon: <DoneIcon fontSize="small" /> }
                    : { color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> };
              return (
                <CaseItem
                  key={caseIndex}
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
                    {c.caseName}
                  </CaseItemLeft>
                  <div>
                    {/* <Badge color="info">
                      Chrome
                    </Badge> */}
                    {/* <IconButton size="medium">
                      <PhotoSizeSelectActualOutlinedIcon htmlColor="white" />
                    </IconButton> */}
                    {!!c.videoRecords.length && <IconButton size="medium" onClick={() => handleVideoClick(c)}>
                      <PlayCircleFilledWhiteOutlinedIcon htmlColor="white" />
                    </IconButton>}
                  </div>
                </CaseItem>
              )
            })}
            {/* <Box
              variant="gradient"
              bgColor="primary"
              coloredShadow="primary"
              color="white"
              borderRadius="lg"
              opacity={1}
              p={2}
              style={{ display: 'flex', }}
            >
              <CloseIcon fontSize="small" />
              &nbsp;
              登陆成功
            </Box> */}
          </Stack>
        </CaseContainer>
      </Collapse>
      {!!videoSrc && <VideoDialog open={videoModalOpen} onClose={() => handleVideoClose()} src={videoSrc} />}
   </>
  );
}

export default GroupCard;
