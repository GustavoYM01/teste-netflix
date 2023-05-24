import React from "react";
import styled from "styled-components";

export default function Footer() {
  return (
    <Container>
      <p id="questions">
        Dúvidas? Ligue <span id="tel">0800 591 8942</span>
      </p>
      <div id="containerInfos">
        <div className="infosFooter">
          <ul>
            <li>
              <a href="https://help.netflix.com/support/412">
                Perguntas frequentes
              </a>
            </li>
            <li>
              <a href="http://ir.netflix.com/">Relações com investidores</a>
            </li>
            <li>
              <a href="https://www.netflix.com/watch">Formas de assistir</a>
            </li>
            <li>
              <a href="https://help.netflix.com/legal/corpinfo">
                Informações corporativas
              </a>
            </li>
            <li>
              <a href="https://www.netflix.com/br/browse/genre/839338">
                Só na Netflix
              </a>
            </li>
          </ul>
        </div>
        <div className="infosFooter">
          <ul>
            <li>
              <a href="https://help.netflix.com/">Central de Ajuda</a>
            </li>
            <li>
              <a href="https://jobs.netflix.com/jobs">Carreiras</a>
            </li>
            <li>
              <a href="https://help.netflix.com/legal/termsofuse">
                Termos de Uso
              </a>
            </li>
            <li>
              <a href="https://help.netflix.com/contactus">Entre em contato</a>
            </li>
          </ul>
        </div>
        <div className="infosFooter">
          <ul>
            <li>
              <a href="https://www.netflix.com/youraccount">Conta</a>
            </li>
            <li>
              <a href="https://www.netflix.com/redeem">
                Resgatar cartão pré-pago
              </a>
            </li>
            <li>
              <a href="https://help.netflix.com/legal/privacy">Privacidade</a>
            </li>
            <li>
              <a href="https://fast.com/">Teste de velocidade</a>
            </li>
          </ul>
        </div>
        <div className="infosFooter">
          <ul>
            <li>
              <a href="https://media.netflix.com/">Media Center</a>
            </li>
            <li>
              <a href="https://www.netflix.com/gift-cards">
                Comprar cartão pré-pago
              </a>
            </li>
            <li>
              <a href="https://www.netflix.com/br/title/80184067#">
                Preferências de cookies
              </a>
            </li>
            <li>
              <a href="https://help.netflix.com/legal/notices">Avisos legais</a>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.footer`
  max-width: 90%;
  padding-bottom: 5rem;
  margin: 0 auto;
  position: relative;
  top: calc(100vh + 55vh);
  color: #737373;
  #questions {
    font-size: 1.2rem;
  }
  #tel {
    cursor: pointer;
    &:hover {
      border-bottom: 1px solid #737373;
    }
  }
  #containerInfos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 2rem;
    .infosFooter ul li {
      margin-bottom: 1rem;
      list-style: none;
    }
    .infosFooter ul li a {
      color: #737373;
      text-decoration: none;
      &:hover {
        border-bottom: 1px solid #737373;
      }
    }
  }
`;
