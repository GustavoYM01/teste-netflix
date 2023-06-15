import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import TopTrending from "./TopTrending";
import OriginalNetflix from "./OriginalNetflix";
import { AiOutlineClose } from "react-icons/ai";
import ReactPlayer from "react-player";
import ActionMovies from "./ActionMovies";

export default function Main() {
  const [tendencia, setTendencia] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [top10, setTop10] = useState(null);
  const [originalNetflix, setOriginalNetflix] = useState(null);
  const [filmesAcao, setFilmesAcao] = useState(null);
  const [classificacao, setClassificao] = useState("");
  const [srcVideo, setSrcVideo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [appear, setAppear] = useState(null);

  const baseURL = "https://api.themoviedb.org/3";

  async function obterGeneros(id) {
    try {
      const response = await fetch(
        `${baseURL}/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&append_to_response=videos`
      );

      if (!response.ok) {
        throw new Error("Erro ao obter os gêneros.");
      }

      const res = await response.json();
      const genresArray = res?.genres;

      let arrGenreName = [];
      genresArray?.forEach((item) => {
        const propName = item?.name;
        arrGenreName.push(propName);
      });

      setGeneros(arrGenreName);
    } catch (error) {
      console.log("Erro:", error.message);
    }
  }

  async function obterClassificacao(id) {
    await fetch(
      `${baseURL}/movie/${id ?? tendencia?.id}/release_dates?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        const resultBR = res?.results?.find(
          (result) => result?.iso_3166_1 === "BR"
        );
        setClassificao(resultBR?.release_dates[0]?.certification);
      })
      .catch((err) => console.log(err));
  }

  async function obterSrcDoVideo(id) {
    await fetch(
      `${baseURL}/movie/${id ?? tendencia?.id}?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&language=pt-BR&append_to_response=videos`
    )
      .then((res) => res.json())
      .then((res) => {
        const trailerIndex = res?.videos?.results?.findIndex(
          (element) => element?.type === "Trailer"
        );
        const trailerURL = `https://www.youtube.com/watch?v=${res?.videos?.results[trailerIndex]?.key}`;
        setSrcVideo(trailerURL);
        return trailerURL;
      });
  }

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
        if (t || tendencia) {
          await obterGeneros(t?.id ?? tendencia?.id);
          await obterClassificacao(t?.id ?? tendencia?.id);
          await obterSrcDoVideo(t?.id ?? tendencia?.id);
        }
      });
  }

  async function carregarTop10() {
    await fetch(
      `${baseURL}/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((res) => {
        setTop10(res?.results);
      })
      .catch((err) => console.log(err));
  }

  async function carregarOriginalNetflix() {
    await fetch(
      `${baseURL}/discover/tv?with_networks=213&language=pt-BR&api_key=${process.env.REACT_APP_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((res) => {
        setOriginalNetflix(res?.results);
      })
      .catch((err) => console.log(err));
  }

  async function carregarFilmesAcao() {
    await fetch(
      `${baseURL}/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&with_genres=28`
    )
      .then((res) => res.json())
      .then((res) => setFilmesAcao(res?.results))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    carregarTendencias().catch((err) => console.log(err));
    carregarTop10().catch((err) => console.log(err));
    carregarOriginalNetflix().catch((err) => console.log(err));
    carregarFilmesAcao();
  }, []);

  const screenSize = window.innerWidth;
  useEffect(() => {
    screenSize <= 450 ? setAppear(true) : setAppear(false);
  }, [screenSize]);

  /* URLs dos flimes/séries/documentários:
    tendencias: `${baseURL}/trending/all/week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`,
    originalNetflix: `${baseURL}/discover/tv?with_networks=213&language=pt-BR&api_key=${process.env.REACT_APP_TMDB_KEY}`,
    maisVotados: `${baseURL}/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`,
    filmesAcao: `${baseURL}/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&with_genres=28`,
    filmesComedia: `${baseURL}/discover/movie?week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&with_genres=35`,
    filmesTerror: `${baseURL}/discover/movie?week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&with_genres=27`,
    filmesRomance: `${baseURL}/discover/movie?week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&with_genres=10749`,
    documentarios: `${baseURL}/discover/movie?week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&with_genres=99`,
    {console.log(tendencia)}
  */
  return (
    <Container>
      {openModal ? (
        <div id="modalBackdrop" openModal={openModal}>
          <div id="closeBtn">
            <AiOutlineClose
              id="btn"
              size={30}
              color="#fff"
              onClick={() => setOpenModal(!openModal)}
            />
          </div>
          <div id="preView">
            {!srcVideo.includes("undefined") ? (
              <ReactPlayer
                id="playerPreview"
                url={srcVideo}
                playing
                controls
                style={{ margin: "0 auto" }}
              />
            ) : (
              "Sem pré-visualização"
            )}
          </div>
        </div>
      ) : null}
      <div className="image-container">
        <img
          className="capaPrincipal"
          src={
            !appear
              ? `https://image.tmdb.org/t/p/original/${tendencia?.backdrop_path}`
              : `https://image.tmdb.org/t/p/original/${tendencia?.poster_path}`
          }
          alt="Capa do Filme"
        />
      </div>
      <div id="desc">
        <h2>{tendencia?.title ?? tendencia?.name}</h2>
        {appear && (
          <div id="contCert">
            <p id="certificationMovie">{classificacao ? classificacao : "L"}</p>
          </div>
        )}
        {!appear && (
          <div id="basicInfos">
            <p id="relevance">
              {Number(tendencia?.vote_average).toFixed(1).split(".")}
              <span>% relevante</span>
            </p>
            <span>
              {tendencia?.release_date?.split("-")[0] ||
                tendencia?.first_air_date?.split("-")[0]}
            </span>
            <ul>
              {generos?.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="btns">
        <div
          id="play"
          onClick={() => {
            setOpenModal(!openModal);
          }}
        >
          <FaPlay /> Assistir
        </div>
        <div id="info">
          <AiOutlineInfoCircle size={25} /> Mais informações
        </div>
        {!appear && (
          <div id="contCert">
            <p id="certificationMovie">{classificacao ? classificacao : "L"}</p>
          </div>
        )}
      </div>
      <ContainerTopTrending>
        <TopTrending top10={top10} />
        <div id="containerActMovies">
          <ActionMovies actionMovies={filmesAcao} />
        </div>
        <div id="containerOrigNet">
          <OriginalNetflix originalNetflix={originalNetflix} />
        </div>
      </ContainerTopTrending>
    </Container>
  );
}

const Container = styled.section`
  position: relative;
  max-width: 100vw;
  #desc {
    position: absolute;
    top: 70vh;
    left: 4rem;
    color: #ffffff;
    font-weight: bold;

    #relevance {
      color: #00d900;
    }

    h2 {
      font-size: 2.5rem;
    }

    #contCert {
      background: #d50000;
      border-radius: 0.2rem;
      width: 2rem;
      #certificationMovie {
        text-align: center;
        font-weight: bold;
        color: #fff;
        padding: 0.2rem;
      }
    }
  }
  #modalBackdrop {
    width: 100vw;
    height: 100vh;
    position: absolute;
    background: #000000da;
    color: #fff;
    z-index: 999;
    left: 0;
    right: 0;
    #closeBtn {
      display: flex;
      align-items: center;
      margin: 1rem 1rem 0 95%;
      @media (max-width: 450px) {
        margin: 1rem 1rem 0 90%;
      }
      #btn {
        cursor: pointer;
      }
    }
    #preView {
      text-align: center;
      font-weight: bold;
      max-height: 2rem;
      @media (max-width: 450px) {
        #playerPreview {
          max-width: 90vw;
        }
      }
    }
  }
  #basicInfos {
    display: flex;
    gap: 0.5rem;
    ul {
      display: flex;
      list-style: none;
      li {
        margin-right: 0.5rem;
      }
    }
  }
  #containerActMovies {
    margin-top: 7.5rem;
    h2 {
      color: #fff;
    }
  }
  #containerOrigNet {
    margin-top: 6rem;
    h2 {
      color: #fff;
    }
  }
  #containerActMovies {
    h2 {
      color: #fff;
    }
  }
  .capaPrincipal {
    width: 100vw;
    height: 100vh;
    filter: brightness(0.4);
    object-fit: fill;
  }
  .btns {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 1rem;
    top: 82vh;
    left: 4rem;
    #contCert {
      position: absolute;
      left: 90vw;
      width: 2.5rem;
      background: #d50000;
      border-radius: 0.2rem;
      #certificationMovie {
        text-align: center;
        font-weight: bold;
        font-size: 1.3rem;
        color: #fff;
        padding: 0.5rem;
      }
    }
    #play {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #ffffff;
      padding: 0.8rem 2rem;
      border-radius: 0.3rem;
      font-weight: bold;
      transition: 0.1s ease-in-out;
      &:hover {
        opacity: 0.8;
      }
    }

    #info {
      cursor: pointer;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(200, 200, 200, 0.363);
      padding: 0.8rem 2rem;
      border-radius: 0.3rem;
      font-weight: bold;
      transition: 0.1s ease-in-out;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  @media (max-width: 1024px) {
    height: 20rem;
  }
  @media (max-width: 769px) {
    height: 35rem;
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
    height: 50rem;
    #desc {
      top: 70vh;
    }
    .btns {
      margin-top: 2rem;
      #play,
      #info {
        padding: 0.5rem;
      }
    }
    #contCert {
      #certificationMovie {
        margin-top: 0.5rem;
      }
    }
  }
`;

const ContainerTopTrending = styled.div`
  position: absolute;
  left: 4rem;
`;
