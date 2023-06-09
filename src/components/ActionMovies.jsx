import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import AboutMovie from "./AboutMovie";
import Jailson from "../assets/jailson.jpg";

export default function ActionMovies({ actionMovies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urlVideos, setUrlVideos] = useState({});
  const [genres, setGenres] = useState({});
  const [mathValue, setMathValue] = useState(0);
  const [classification, setClassification] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  const [btnIsVisible, setBtnIsVisible] = useState(true);

  const items = actionMovies?.slice(0, 10);

  const itemCount = items?.length;

  const baseURL = "https://api.themoviedb.org/3";

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    getVideo(id);
    getGenres(id);
    getClassification(id);
    // getCoisa(id);
    // getVotesAverage(id);
  };

  const handleMouseLeave = (id) => {
    setHoveredItem(null);
    setUrlVideos((prevUrlVideos) => ({
      ...prevUrlVideos,
      [id]: null,
    }));
    setGenres((prevGenres) => ({
      ...prevGenres,
      [id]: null,
    }));
    setClassification((prevClassifications) => ({
      ...prevClassifications,
      [id]: null,
    }));
  };
  //https://api.themoviedb.org/3/tv/119051/videos?api_key=98def43abee228fc5dcae8ee5c2fddcc&language=pt-BR
  const getVideo = async (id) => {
    const response = await fetch(
      `${baseURL}/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((res) => {
        const trailerIndex = res?.results?.findIndex(
          (element) => element?.type === "Trailer"
        );
        const trailerURL = `https://www.youtube.com/embed/${res?.results[trailerIndex]?.key}`;
        return trailerURL;
      });

    setUrlVideos((prevUrlVideos) => ({
      ...prevUrlVideos,
      [id]: response,
    }));
  };

  const getGenres = async (id) => {
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

      setGenres((prevGenres) => ({
        ...prevGenres,
        [id]: arrGenreName,
      }));
    } catch (error) {
      console.log("Erro:", error.message);
    }
  };

  const getClassification = async (id) => {
    const response = await fetch(
      `${baseURL}/movie/${id}/release_dates?language=pt-BR&api_key=${process.env.REACT_APP_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((res) => {
        const resultBR = res?.results.find(
          (result) => result?.iso_3166_1 === "BR"
        );
        if (resultBR !== null) {
          const releaseDates = resultBR?.release_dates;
          if (releaseDates?.length > 0) {
            const certification = releaseDates[0]?.certification;
            return certification;
          }
        }
      })
      .catch((err) => console.log(err));
    setClassification((prevClassifications) => ({
      ...prevClassifications,
      [id]: response,
    }));
  };

  const handleMouseEnter2 = () => {
    setModalOpen(true);
  };

  const handleMouseLeave2 = () => {
    setModalOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? itemCount - 1 : prevIndex - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === itemCount - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  };

  useEffect(() => {
    if (window.innerWidth <= 450) {
      setIsMobile(true);
      setMathValue(100);
    } else if (window.innerWidth <= 768) {
      setIsMobile(false);
      setMathValue(90);
    } else {
      setMathValue(80);
    }
    if (
      !(
        window.innerWidth <= 450 ||
        window.innerWidth <= 768 ||
        window.innerWidth <= 1280
      )
    ) {
      setTimeout(() => {
        setBtnIsVisible(!btnIsVisible);
      }, 3000);
    }
  }, [window.innerWidth]);

  return (
    <SliderContainer>
      <div>
        <h2 id="actionMovTitle">Filmes de Ação</h2>
      </div>
      <Slider translateValue={currentIndex * -(mathValue / itemCount)}>
        {items?.map((filme, i) => {
          return (
            <Container
              key={i}
              onMouseEnter={() => {
                handleMouseEnter2();
                handleMouseEnter(filme?.id);
              }}
              onMouseLeave={() => {
                handleMouseLeave2();
                handleMouseLeave(filme?.id);
              }}
            >
              {hoveredItem === filme?.id && (
                <AboutMovie
                  nome={filme?.title || filme?.original_title}
                  generos={genres[filme?.id]}
                  srcVideo={urlVideos[filme?.id]}
                  votos={filme?.vote_average}
                  classificacao={classification[filme?.id]}
                  isModalOpen={isModalOpen}
                  type="actionMovies"
                />
              )}
              <img
                src={`https://image.tmdb.org/t/p/original/${filme?.poster_path}`}
                alt="Capa do filme"
              />
            </Container>
          );
        })}
      </Slider>
      <Button
        id="CATAPIMBA"
        onClick={handlePrev}
        btnIsVisible={btnIsVisible}
        isMobile={isMobile}
        onMouseEnter={() => {
          if (
            !isMobile &&
            !(window.innerWidth <= 768) &&
            !(window.innerWidth <= 1280)
          )
            setBtnIsVisible(!btnIsVisible);
        }}
        onMouseLeave={() => {
          if (
            !isMobile &&
            !(window.innerWidth <= 768) &&
            !(window.innerWidth <= 1280)
          )
            setBtnIsVisible(!btnIsVisible);
        }}
      >
        &#8249;
      </Button>
      <Button
        id="CATAPIMBA123"
        onClick={handleNext}
        btnIsVisible={btnIsVisible}
        isMobile={isMobile}
        onMouseEnter={() => {
          if (
            !isMobile &&
            !(window.innerWidth <= 768) &&
            !(window.innerWidth <= 1280)
          )
            setBtnIsVisible(!btnIsVisible);
        }}
        onMouseLeave={() => {
          if (
            !isMobile &&
            !(window.innerWidth <= 768) &&
            !(window.innerWidth <= 1280)
          )
            setBtnIsVisible(!btnIsVisible);
        }}
      >
        &#8250;
      </Button>
    </SliderContainer>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  p {
    color: #fff;
    font-size: 14rem;
    margin-right: -2rem;
  }
  img {
    max-height: 16rem;
    object-fit: fill;
  }
  .topNumber {
    height: 10rem;
    margin-right: -0.5rem;
  }
  @media (max-width: 769px) {
    img {
      width: 16rem;
      max-height: 18rem;
    }
  }
  @media (max-width: 450px) {
    max-width: 100%;
    img {
      max-width: 50vw;
    }
    #classification {
      display: none;
    }
  }
`;

const SliderContainer = styled.div`
  overflow: hidden;
  max-width: 90vw;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  #actionMovTitle {
    position: absolute;
    left: -2.5rem;
    top: 24rem;
    @media (max-width: 450px) {
      top: 25rem;
    }
  }

  h2 {
    color: #fff;
  }

  @media (max-width: 769px) {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    max-width: 80vw;
  }

  @media (max-width: 450px) {
    max-width: 60vw;
    h2 {
      font-size: 1rem;
    }
  }
`;

const Slider = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => props.translateValue}%);
  @media (max-width: 769px) {
    gap: 2rem;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 6rem;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.2rem;
  transition: 0.2s ease-in-out;
  opacity: ${({ btnIsVisible, isMobile }) =>
    btnIsVisible || isMobile ? 1 : 0};

  ${({ id }) =>
    id === "CATAPIMBA" &&
    css`
      position: absolute;
      z-index: 999;
      top: 27rem;
      left: -4rem;
      @media (max-width: 769px) {
        top: 30rem;
      }
      @media (max-width: 450px) {
        top: 30rem;
      }
    `}

  ${({ id }) =>
    id === "CATAPIMBA123" &&
    css`
      position: absolute;
      z-index: 999;
      top: 27rem;
      right: 0;
      left: calc(100vw - 115px);
      @media (max-width: 769px) {
        top: 30rem;
      }
      @media (max-width: 450px) {
        top: 30rem;
        left: calc(100vw - 6rem);
      }
    `}
`;
