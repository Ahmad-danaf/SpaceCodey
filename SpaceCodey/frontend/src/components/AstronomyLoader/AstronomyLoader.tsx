import React from "react";
import styled, { keyframes } from "styled-components";

interface AstronomyLoaderProps {
  message?: string;
  text?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const orbit = keyframes`
  from {
    transform: translateX(-50%) translateY(-50%) rotate(0deg) translateX(60px) rotate(0deg);
  }
  to {
    transform: translateX(-50%) translateY(-50%) rotate(360deg) translateX(60px) rotate(-360deg);
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  width: 100%;
  min-height: 200px;
  position: relative;
`;

const PlanetSystem = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
`;

const Star = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: #fff;
  border-radius: 50%;
  animation: ${twinkle} 1.5s infinite ease-in-out;

  &:nth-child(1) {
    top: 10%;
    left: 15%;
    animation-delay: 0.3s;
  }

  &:nth-child(2) {
    top: 20%;
    right: 20%;
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    bottom: 25%;
    left: 10%;
    animation-delay: 0.7s;
  }

  &:nth-child(4) {
    bottom: 15%;
    right: 15%;
    animation-delay: 0.2s;
  }

  &:nth-child(5) {
    top: 40%;
    left: 80%;
    animation-delay: 0.1s;
  }
`;

const Planet = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #0a2463, #3e92cc);
  box-shadow: 0 0 20px rgba(62, 146, 204, 0.6);
  animation: ${rotate} 20s linear infinite;

  &::after {
    content: "";
    position: absolute;
    top: 10px;
    left: 15px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Moon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #ececec;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: ${orbit} 8s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 1rem;
  color: #ececec;
  text-align: center;
`;

const AstronomyLoader: React.FC<AstronomyLoaderProps> = ({
  message = "Calculating optimal shoot times...",
  text,
}) => {
  const displayMessage = text || message;

  return (
    <LoaderContainer>
      <PlanetSystem>
        <Star />
        <Star />
        <Star />
        <Star />
        <Star />
        <Planet />
        <Moon />
      </PlanetSystem>
      <LoadingText>{displayMessage}</LoadingText>
    </LoaderContainer>
  );
};

export default AstronomyLoader;
