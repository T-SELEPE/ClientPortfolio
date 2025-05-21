import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const SplashWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeOut} 0.8s ease 1.7s forwards;
`;

const SplashImg = styled.img`
  width: 350px;
  max-width: 80vw;
  filter: drop-shadow(0 0 30px #000a);
`;

export default function SplashScreen() {
  return (
    <SplashWrapper>
      <SplashImg src={process.env.PUBLIC_URL + '/splash-thando.png'} alt="Thando Splash" />
    </SplashWrapper>
  );
} 