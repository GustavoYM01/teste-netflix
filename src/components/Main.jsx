import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import TopRated from "./TopRated";

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

  //https://api.themoviedb.org/3/movie/{movie_id}/release_dates
  // console.log(filme?.id);
  // console.log(filme?.id);
  //`${baseURL}/discover/movie/week?api_key=${apiKEY}&with_networks=213`
  // async function getTMDB() {
  //   const baseURL = "https://api.themoviedb.org/3";
  //   const apiKEY = "98def43abee228fc5dcae8ee5c2fddcc";
  //   const reqs = {
  //     tendencias: `${baseURL}/trending/all/week?api_key=${apiKEY}&language=pt-BR`,
  //     originalNetflix: `${baseURL}/discover/movie/week?api_key=${apiKEY}&with_networks=213`,
  //     maisVotados: `${baseURL}/movie/top_rated?api_key=${apiKEY}&language=pt-BR`,
  //     filmesAcao: `${baseURL}/discover/movie?api_key=${apiKEY}&language=pt-BR&with_genres=28`,
  //     filmesComedia: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=35`,
  //     filmesTerror: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=27`,
  //     filmesRomance: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=10749`,
  //     documentarios: `${baseURL}/discover/movie?week?api_key=${apiKEY}&language=pt-BR&with_genres=99`,
  //   };
  //   const [
  //     tendencias,
  //     originalNetflix,
  //     maisVotados,
  //     filmesAcao,
  //     filmesComedia,
  //     filmesTerror,
  //     filmesRomance,
  //     documentarios,
  //   ] = await Promise.all([
  //     fetch(reqs.tendencias).then((res) => res.json()),
  //     fetch(reqs.originalNetflix).then((res) => res.json()),
  //     fetch(reqs.maisVotados).then((res) => res.json()),
  //     fetch(reqs.filmesAcao).then((res) => res.json()),
  //     fetch(reqs.filmesComedia).then((res) => res.json()),
  //     fetch(reqs.filmesTerror).then((res) => res.json()),
  //     fetch(reqs.filmesRomance).then((res) => res.json()),
  //     fetch(reqs.documentarios).then((res) => res.json()),
  //   ]);
  // }
  // getTMDB();
  // useEffect(() => {
  // }, []);
  return (
    <Container>
      <img
        className="capaPrincipal"
        src={`https://image.tmdb.org/t/p/original/${tendencia?.backdrop_path}`}
        alt="Capa do Filme"
      />
      <div id="desc">
        <h2>{tendencia?.title || tendencia?.name}</h2>
        {/* <p>{truncarString(filme?.overview, 150)}</p> */}
      </div>
      <div className="btns">
        <div id="play">
          <FaPlay /> Assistir
        </div>
        <div id="info">
          <AiOutlineInfoCircle size={25} /> Mais informações
        </div>
      </div>
      <ContainerTopRated>
        <TopRated top10={top10} />
      </ContainerTopRated>
    </Container>
  );
}

const Container = styled.section`
  position: relative;
  max-width: 100%;
  height: 10rem;
  .capaPrincipal {
    width: 100%;
    height: 100vh;
    filter: brightness(0.4);
    object-fit: cover;
  }
  #desc {
    position: absolute;
    top: 28rem;
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
    top: 34rem;
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
  @media (max-width: 1000px) {
    #desc {
      max-width: 90%;
      left: 1rem;
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
`;

const ContainerTopRated = styled.div`
  position: absolute;
  left: 4rem;
  display: flex;
  gap: 5rem;
`;
