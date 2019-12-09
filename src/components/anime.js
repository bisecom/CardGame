import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { slideOutRight } from 'react-animations';


const Bounce = styled.div`animation: 4s ${keyframes`${slideOutRight}`} infinite`;

export default class ReactAnimations extends Component {
    render() {
        return (
            <Bounce><h1>Hello Animation Bounce</h1></Bounce>
        );
    }
}