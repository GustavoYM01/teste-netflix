import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

export default function ModalInfos({ isOpened }) {
  const [isOpen, setIsOpen] = useState(isOpened);
  useEffect(() => {
    console.log("modal info: ", isOpen);
  }, [isOpen]);
  return (
    <Container isOpen={isOpen}>
      <div id="btnClose">
        <AiOutlineClose
          id="close"
          size={30}
          color={`${isOpen ? "#fff" : "transparent"}`}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 101vh;
  margin: 0 auto;
  position: absolute;
  z-index: 9999;
  left: 0;
  right: 0;
  transform: translateY(-100%);
  background: #000000da;
  ${({ isOpen }) =>
    isOpen
      ? css`
          background: #000000da;
          z-index: 9999;
        `
      : css`
          background: transparent;
          z-index: -20;
        `}
  #close {
    cursor: pointer;
  }
  #btnClose {
    margin: 2rem 0.5rem 0 95%;
  }
  /* #btnClose {
    display: flex;
    justify-content: end;
  } */
`;
