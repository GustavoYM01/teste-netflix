import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ReactPlayer from "react-player";
import { AiFillStar } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import Pomba from "../assets/pombo.gif";

export default React.memo(function AboutMovie({
  nome,
  srcVideo,
  votos,
  classificacao,
  isModalOpen,
  type,
}) {
  const [isMobile, setIsMobile] = useState(null);

  const decimalFixed = (string) => {
    return Number(string).toFixed(1).toString();
  };

  useEffect(() => {
    window.innerWidth <= 450 ? setIsMobile(true) : setIsMobile(false);
  }, []);
  return (
    <Container isModalOpen={isModalOpen}>
      <img src={Pomba} alt="" style={{ height: "8rem", width: "100%" }} />
      {/* {!srcVideo?.includes("undefined") && !isMobile ? (
        <div id="trailerVideo">
          <ReactPlayer url={srcVideo} controls playing />
        </div>
      ) : isMobile ? null : (
        <div id="noVideo">
          <p>Sem pré-visualização</p>
        </div>
      )} */}
      <p className="movieInfo">{nome}</p>
      <div id="general">
        {classificacao ? (
          <p className="classification" type={type}>
            {classificacao}
          </p>
        ) : (
          <p className="classification" type={type}>
            L
          </p>
        )}
        <div id="tools">
          <AiFillStar />
          <p className="movieInfo">{decimalFixed(votos)}</p>
          <BiPlus id="btnAdd" />
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  font-weight: bold;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  opacity: ${({ isModalOpen }) => (isModalOpen ? 1 : 0)};
  animation: ${({ isModalOpen }) => (isModalOpen ? zoomIn : zoomOut)} 0.1s
    ease-in-out;
  animation-fill-mode: both;
  #general {
    display: flex;
    align-items: center;
    gap: 3rem;
  }
  #noVideo {
    p {
      margin-left: 0.5rem;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }
  .classification {
    text-align: center;
    font-size: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    border: 1px solid #fff;
    border-radius: 0.2rem;
    padding: 4px;
  }
  .movieInfo {
    max-width: 90%;
    font-size: 1rem;
    margin-left: 0.5rem;
  }
  div {
    max-width: 100%;
    max-height: 10rem;
  }
  #tools {
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    #btnAdd {
      cursor: pointer;
      margin-left: 3.5rem;
    }
  }
  @media (max-width: 450px) {
    #general {
      margin-top: 6%;
    }
    .classification {
      width: 18%;
    }
    #trailerVideo {
      display: none;
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
