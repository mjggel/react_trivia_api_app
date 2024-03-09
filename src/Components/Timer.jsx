import React, { useState, useEffect } from 'react';
import { BiTime } from 'react-icons/bi';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';

export default function Timer({ onTimeUp, timeIsUp, resetTimer }) {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (resetTimer) {
      setSeconds(30);
    }
    const timer = setInterval(() => {
      if (seconds > 0 && !timeIsUp) {
        setSeconds(seconds - 1);
      } else {
        onTimeUp();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, timeIsUp, resetTimer]);

  const timerStyle = () => {
    if (seconds <= 15) {
      return { color: 'red' };
    }
    return { color: 'black' };
  };

  return (
    <Container>
      <h2 style={timerStyle()} data-testid='timer'>
        {seconds} s<BiTime size={40} style={timerStyle()} />
      </h2>
    </Container>
  );
}

Timer.propTypes = {
  onTimeUp: PropTypes.func.isRequired,
  timeIsUp: PropTypes.bool.isRequired,
  resetTimer: PropTypes.bool.isRequired,
};
