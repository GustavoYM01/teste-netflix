import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import TopTrending from "./TopTrending";

export default function Main() {
  const [tendencia, setTendencia] = useState(null);
  const [top10, setTop10] = useState(null);

  const baseURL = "https://api.themoviedb.org/3";

  async function carregarTendencias() {
    await fetch(
      `${baseURL}/trending/all/week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`
    )
      .then((response) => response.json())
      .then(async (response) => {
        const t =
          response?.results[
            Math.floor(Math.random() * response?.results.length)
          ];
        setTendencia(t);
      });
  }

  async function carregarTop10() {
    await fetch(
      `${baseURL}/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((res) => {
        setTop10(res?.results);
        console.log(top10[0]?.poster_path);
      })
      .catch((err) => console.log(err));
  }

  useMemo(() => {
    carregarTendencias().catch((err) => console.log(err));
    carregarTop10().catch((err) => console.log(err));
  }, []);

  /* URLs dos flimes/séries/documentários:
    tendencias: `${baseURL}/trending/all/week?api_key=${apiKEY}&language=pt-BR`,
    originalNetflix: `${baseURL}/discover/movie/week?api_key=${apiKEY}&with_networks=213`,
    maisVotados: `${baseURL}/movie/top_rated?api_key=${apiKEY}&language=pt-BR`,
    filmesAcao: `${baseURL}/discover/movie?api_key=${apiKEY}&language=pt-BR&with_genres=28`,
    filmesComedia: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=35`,
    filmesTerror: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=27`,
    filmesRomance: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=10749`,
    documentarios: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=99`,
  */
  return (
    <Container>
      <img
        className="capaPrincipal"
        src={`https://image.tmdb.org/t/p/original/${tendencia?.backdrop_path}`}
        alt="Capa do Filme"
      />
      <div id="desc">
        <h2>{tendencia?.title || tendencia?.name}</h2>
      </div>
      <div className="btns">
        <div id="play">
          <FaPlay /> Assistir
        </div>
        <div id="info">
          <AiOutlineInfoCircle size={25} /> Mais informações
        </div>
      </div>
      <ContainerTopTrending>
        <TopTrending top10={top10} />
      </ContainerTopTrending>
    </Container>
  );
}

const Container = styled.section`
  position: relative;
  max-width: 100vw;
  height: 10rem;
  .capaPrincipal {
    width: 100vw;
    height: 100vh;
    filter: brightness(0.4);
    object-fit: cover;
  }
  #desc {
    position: absolute;
    top: 70vh;
    left: 4rem;
    color: #ffffff;

    h2 {
      font-size: 2.5rem;
    }

    p {
      font-size: 1.5rem;
      max-width: 50%;
    }
  }
  .btns {
    position: absolute;
    display: flex;
    gap: 1rem;
    top: 82vh;
    left: 4rem;

    #play {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #ffffff;
      padding: 0.8rem 2rem;
      border-radius: 0.3rem;
      font-weight: bold;
    }

    #info {
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(200, 200, 200, 0.363);
      padding: 0.8rem 2rem;
      border-radius: 0.3rem;
      font-weight: bold;
    }
  }
  @media (max-width: 769px) {
    #desc {
      max-width: 90%;
      left: 1rem;
      top: 75vh;
      h2 {
        font-size: 1.5rem;
      }
    }
    .btns {
      left: 1rem;
      #play,
      #info {
        padding: 0.8rem 1rem;
      }
    }
  }
  @media (max-width: 450px) {
    #desc {
      top: 70vh;
    }
    .btns {
      #play,
      #info {
        padding: 0.5rem;
      }
    }
  }
`;

const ContainerTopTrending = styled.div`
  position: absolute;
  left: 4rem;
`;
