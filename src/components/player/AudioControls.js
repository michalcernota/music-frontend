import {Row} from "react-bootstrap";

const AudioControls = ({
                           isPlaying,
                           onPlayPauseClick,
                           onPrevClick,
                           onNextClick
                       }) => (
    <Row className="mt-2">
        <button
            type="button"
            className="prev"
            aria-label="Previous"
            onClick={onPrevClick}
        >
            Prev
        </button>
        {isPlaying ? (
            <button
                type="button"
                className="pause"
                onClick={() => onPlayPauseClick(false)}
                aria-label="Pause"
            >
                Pause
            </button>
        ) : (
            <button
                type="button"
                className="play"
                onClick={() => onPlayPauseClick(true)}
                aria-label="Play"
            >
                Play
            </button>
        )}
        <button
            type="button"
            className="next"
            aria-label="Next"
            onClick={onNextClick}
        >
            Next
        </button>
    </Row>
);

export default AudioControls;