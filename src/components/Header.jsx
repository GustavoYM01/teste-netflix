import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import logo from "../assets/netflix-logo.png";
import { BsSearch } from "react-icons/bs";
import { BiBell } from "react-icons/bi";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";

export default React.memo(function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTop, setIsTop] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const param = window.location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 0 ? setIsTop(true) : setIsTop(false);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 1000;
      setIsMobile(isMobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleProfile = () => {
    isVisible ? setIsVisible(false) : setIsVisible(true);
  };

  return (
    <Container isTop={isTop}>
      <div id="divLogo">
        <img src={logo} alt="Netflix logo" />
      </div>
      {isMobile && !isOpen ? (
        <RxHamburgerMenu
          size={30}
          color="#fff"
          onClick={() => setIsOpen(true)}
        />
      ) : isMobile ? (
        <AiOutlineClose
          size={30}
          color="#fff"
          onClick={() => setIsOpen(false)}
        />
      ) : null}
      {!isMobile ? (
        <Nav>
          <NavItem active={param === "/"}>Início</NavItem>
          <NavItem active={param.includes("/series")}>Séries</NavItem>
          <NavItem active={param.includes("/filmes")}>Filmes</NavItem>
          <NavItem active={param.includes("/top")}>Bombando</NavItem>
          <NavItem active={param.includes("/minhalista")}>Minha Lista</NavItem>
          <NavItem active={param.includes("/idiomas")}>
            Navegar por idiomas
          </NavItem>
        </Nav>
      ) : (
        <Nav isOpen={isOpen}>
          <NavItem active={param.includes("/series")}>Séries</NavItem>
          <NavItem active={param.includes("/filmes")}>Filmes</NavItem>
          <NavItem active={param.includes("/top")}>Bombando</NavItem>
          <NavItem active={param.includes("/minhalista")}>Minha Lista</NavItem>
          <NavItem active={param.includes("/idiomas")}>
            Navegar por idiomas
          </NavItem>
          <NavItem>Conta</NavItem>
          <NavItem>Gerenciar Perfil</NavItem>
          <NavItem>Sair</NavItem>
        </Nav>
      )}
      {!isMobile && (
        <>
          <div id="tools">
            <BsSearch size={20} />
            <BiBell size={20} />
            <Profile />
            <div id="arrows">
              {isVisible ? (
                <RiArrowUpSFill onClick={handleProfile} />
              ) : (
                <RiArrowDownSFill onClick={handleProfile} />
              )}
            </div>
          </div>
          <Modal isVisible={isVisible}>
            <p>Conta</p>
            <p>Gerenciar Perfil</p>
            <p>Sair</p>
          </Modal>
        </>
      )}
    </Container>
  );
});

const Container = styled.header`
  width: 100vw;
  position: fixed;
  z-index: 999;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in-out;
  ${(props) =>
    props.isTop
      ? css`
          background: #000;
        `
      : css`
          background: transparent;
        `}
  @media (max-width: 1000px) {
    background: #000;
    gap: calc(100% - 13rem);
  }
  #divLogo img {
    max-width: 10rem;
  }
  #tools {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-left: auto;
    margin-right: 4rem;
    color: #fff;
    @media (max-width: 1000px) {
      position: fixed;
      flex-direction: column;
    }
    #arrows {
      cursor: pointer;
      margin-left: -1.5rem;
    }
  }
`;

const Modal = styled.div`
  position: absolute;
  top: 5rem;
  right: 3rem;
  width: 10rem;
  background-color: #000000;
  color: #fff;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  ${(props) =>
    props.isVisible &&
    css`
      opacity: 1;
      visibility: visible;
    `}
  p {
    margin-bottom: 0.6rem;
    padding-left: 1rem;
    cursor: pointer;
    border-bottom: 2px solid #757575;
    opacity: 0.8;
    &:nth-child(3) {
      border: none;
    }
    &:hover {
      opacity: 1;
    }
  }
`;

const Profile = styled.div`
  width: 2rem;
  height: 2rem;
  background: #777777;
  border-radius: 0.5rem;
`;

const Nav = styled.nav`
  margin-left: 2rem;
  display: flex;
  gap: 1.5rem;
  @media (max-width: 1000px) {
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    transition: 0.2s ease-in-out;
    padding: 1rem;
    position: fixed;
    right: calc(100% - 100vw);
    top: 4.4rem;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.9);
  }
`;

const NavItem = styled.a`
  cursor: pointer;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  opacity: ${({ active }) => (active ? "1" : "0.7")};
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;
