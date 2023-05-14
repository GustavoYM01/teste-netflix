import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import ReactPlayer from "react-player";
import { AiFillStar } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

export default React.memo(function AboutMovie({
  nome,
  srcVideo,
  votos,
  isModalOpen,
}) {
  const decimalFixed = (string) => {
    return Number(string).toFixed(1);
  };

  return (
    <Container isModalOpen={isModalOpen}>
      {!srcVideo?.includes("undefined") ? (
        <div>
          <ReactPlayer url={srcVideo} controls playing />
        </div>
      ) : (
        <div id="noVideo">
          <p>Sem pré-visualização</p>
        </div>
      )}
      <p className="movieInfo">{nome}</p>
      <div id="tools">
        <AiFillStar />
        <p className="movieInfo">{decimalFixed(votos)}</p>
        <BiPlus id="btnAdd" />
      </div>
    </Container>
  );
});

const Container = styled.div`
  font-weight: bold;
  position: absolute;
  top: 1.7rem;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  opacity: ${({ isModalOpen }) => (isModalOpen ? 1 : 0)};
  animation: ${({ isModalOpen }) => (isModalOpen ? zoomIn : zoomOut)} 0.1s
    ease-in-out;
  animation-fill-mode: both;
  #noVideo {
    p {
      margin-left: 0.5rem;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }
  .movieInfo {
    font-size: 1rem;
    margin-left: 0.5rem;
  }
  div {
    max-width: 100%;
    max-height: 11rem;
  }
  #tools {
    margin-left: 0.5rem;
    display: flex;
    gap: 0.3rem;
    align-items: center;
    #btnAdd {
      cursor: pointer;
      margin-left: 3rem;
    }
  }
  @media (max-width: 1000px) {
    top: 0;
    right: 0;
    left: 0;
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const zoomOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
`;
