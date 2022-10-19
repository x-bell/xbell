import React, { useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import Box from './MDBox';

interface VideoDialogProps {
  open: boolean;
  src: string;
  onClose?(): void;
}

const VideoContainer = styled(Box)({
  height: '502px',
  border: '1px solid #ccc',
});

const Container = styled(Box)({
  height: '550px',
  padding: '12px 24px',
  position: 'relative',
});

const TinyText = styled(Typography)({
  fontSize: 16,
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const StyledCloseButton = styled(IconButton)({
  position: 'absolute',
  top: '-6px',
  right: '-6px',
});

function formatDuration(value: number) {
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

const VideoDialog: React.FC<VideoDialogProps> = ({
  open,
  onClose = () => {},
  src,
}) => {
  const beforeStateRef = React.useRef({
    beforePlaying: false,
  });
  const canPlayTriggerFlagRef = React.useRef(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const handleLoadMetadata = () => {
    const durationMs = (videoRef.current?.duration ?? 0) * 1000 as number;
    setDuration(durationMs);
  }

  const handleCanPlay = () => {
    if (canPlayTriggerFlagRef.current) {
      return;
    }

    canPlayTriggerFlagRef.current = true;
    if (!playing) {
      setPlaying(true);
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime as number * 1000);
  }

  const handleSliderChange = (_: Event, value: number | number[]) => {
    beforeStateRef.current.beforePlaying = playing;
    if (playing) {
      setPlaying(false)
    };
    setCurrentTime(value as number);
    videoRef.current!.currentTime = value as number / 1000;
  }

  const handleSliderChangeCommitted = (_: React.SyntheticEvent | Event, value: number | number[]) => {
    setCurrentTime(value as number);
    videoRef.current!.currentTime = value as number / 1000;
    setPlaying(beforeStateRef.current.beforePlaying);
  };

  React.useEffect(() => {
    if (playing) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause();
    }
  }, [playing])

  React.useEffect(() => {
    if (open && canPlayTriggerFlagRef.current && !playing) {
      setPlaying(true);
    }
  }, [open]);

  return (
    <Dialog open={open} maxWidth="xl">
      <Container>
        <StyledCloseButton onClick={() => onClose()}>
          <CloseIcon />
        </StyledCloseButton>
        {React.useMemo(() => (
          <VideoContainer>
            <video
              height={500}
              ref={videoRef}
              src={src}
              onLoadedMetadata={handleLoadMetadata}
              onCanPlayThrough={handleCanPlay}
              onTimeUpdate={handleTimeUpdate}
            />
          </VideoContainer>
        ), [])}
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <IconButton size="medium" onClick={() => setPlaying(!playing)}>
            {playing ? <PauseRounded /> : <PlayArrowRounded />}
          </IconButton>
          <TinyText>{formatDuration(currentTime / 1000)}</TinyText>
          <Slider
            size="medium"
            max={duration}
            min={0}
            value={currentTime}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
          />
          <TinyText>
            {formatDuration((duration - currentTime) / 1000)}
          </TinyText>
        </Stack>
      </Container>
    </Dialog>
  );
}

export default VideoDialog;
