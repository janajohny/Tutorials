import React from 'react';  
import PropTypes from 'prop-types';
import { Button, ButtonToolbar} from 'react-bootstrap';
import styled from 'styled-components';

const Div = styled.div`
  width: 100%;
`;

const Input = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
`;

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: {},
      buttonText: 'Play',
      value: 0
    };

    this.handlePlay = this.handlePlay.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount(){
    //console.log('componentWillUnmount')
    clearInterval(this.intervalId);
    this.setTimeState(0, false);
  }

  timer() {
    //console.log('timer');
    //console.log(this.state.value);
    this.setTimeState(parseInt(this.state.value) + 1, false);

    if(this.state.value > this.props.max) { 
      clearInterval(this.intervalId);
      this.setTimeState(0, false);
      this.setState({buttonText: 'Play'});
    }
  }

  handlePlay(event) {
    //console.log('handlePlay');
    if (this.state.buttonText == 'Play') {
      this.setState({buttonText: 'Stop'});
      this.intervalId = setInterval(this.timer.bind(this), 1000);
    } else {
      this.setState({buttonText: 'Play'});
      clearInterval(this.intervalId);
      this.setTimeState(0, false);
      this.props.onStop();
    }
  }

  handleChange(event) {
    this.setTimeState(event.target.value, true);
  }

  setTimeState(time, clear) {
    //console.log('setTimeState');
    //console.log(time);
    this.setState({value: time});
    this.props.onTimeChange(time, clear);
  }

  render() {
    return (
      <Div>
        <Button bsStyle="primary" type="button" onClick={this.handlePlay}>{this.state.buttonText}</Button>
        <Input type="range" min={this.props.min} max={this.props.max} value={this.state.value} on onChange={this.handleChange}/>
        <p>Value: {this.state.value}</p>
      </Div>
    );
  }
}

RangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired
};

export default RangeSlider;