import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import AboutMovie from "./AboutMovie";
import topt1 from "../assets/top10/1.svg";
import topt2 from "../assets/top10/2.svg";
import topt3 from "../assets/top10/3.svg";
import topt4 from "../assets/top10/4.svg";
import topt5 from "../assets/top10/5.svg";
import topt6 from "../assets/top10/6.svg";
import topt7 from "../assets/top10/7.svg";
import topt8 from "../assets/top10/8.svg";
import topt9 from "../assets/top10/9.svg";
import topt10 from "../assets/top10/10.svg";

export default React.memo(function TopTrending({ top10 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mathValue, setMathValue] = useState(0);
  const [urlVideos, setUrlVideos] = useState({});
  const [votesAverage, setVotesAverage] = useState({});
  const [classification, setClassification] = useState({});
  const [genres, setGenres] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  const [btnIsVisible, setBtnIsVisible] = useState(true);

  const bests = top10?.slice(0, 10);

  const itemCount = bests?.length;

  const baseURL = "https://api.themoviedb.org/3";

  const imageImports = [
    topt1,
    topt2,
    topt3,
    topt4,
    topt5,
    topt6,
    topt7,
    topt8,
    topt9,
    topt10,
  ];

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    getGenres(id);
    getVideo(id);
    getClassification(id);
    getVotesAverage(id);
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
    setVotesAverage((prevVotesAverage) => ({
      ...prevVotesAverage,
      [id]: null,
    }));
    setClassification((prevClassifications) => ({
      ...prevClassifications,
      [id]: null,
    }));
  };

  const getVideo = async (id) => {
    const response = await fetch(
      `${baseURL}/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&append_to_response=videos`
    )
      .then((res) => res.json())
      .then((res) => {
        const trailerIndex = res?.videos?.results?.findIndex(
          (element) => element?.type === "Trailer"
        );
        const trailerURL = `https://www.youtube.com/embed/${res?.videos?.results[trailerIndex]?.key}`;
        return trailerURL;
      });

    setUrlVideos((prevUrlVideos) => ({
      ...prevUrlVideos,
      [id]: response,
    }));
  };

  const getClassification = async (id) => {
    const response = await fetch(
      `${baseURL}/movie/${id}/release_dates?api_key=${process.env.REACT_APP_TMDB_KEY}`
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

  const getVotesAverage = async (id) => {
    const response = await fetch(
      `${baseURL}/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&append_to_response=videos`
    )
      .then((res) => res.json())
      .then((res) => res?.vote_average);

    setVotesAverage((prevVotesAverage) => ({
      ...prevVotesAverage,
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
    } else {
      setIsMobile(false);
      setMathValue(130);
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
        <h2>Top 10 em tendências da semana</h2>
      </div>
      <Slider translateValue={currentIndex * -(mathValue / itemCount)}>
        {bests?.map((filme, i) => {
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
                  votos={votesAverage[filme?.id]}
                  classificacao={classification[filme?.id]}
                  isModalOpen={isModalOpen}
                  type="topTrending"
                />
              )}
              {!isMobile &&
              (window.innerWidth <= 768 || window.innerWidth > 768) ? (
                <img className="topNumber" src={`${imageImports[i]}`} alt="" />
              ) : null}
              <img
                id="movieBG"
                src={`https://image.tmdb.org/t/p/original/${filme?.poster_path}`}
                alt="Capa do filme"
              />
            </Container>
          );
        })}
      </Slider>
      <Button
        id="btnPrev"
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
        id="btnNext"
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
});

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  #movieBG {
    height: 16rem;
  }
  &:last-child {
    .topNumber {
      object-fit: cover;
      margin-right: -3rem;
    }
  }
  p {
    color: #fff;
    font-size: 14rem;
    margin-right: -2rem;
  }
  img {
    max-width: 11rem;
    object-fit: fill;
  }
  .topNumber {
    height: 90%;
    margin-right: -1rem;
  }
  @media (max-width: 450px) {
    max-width: 100%;
    #classification {
      display: none;
    }
  }
`;

const SliderContainer = styled.div`
  overflow: hidden;
  max-width: 90vw;
  margin-top: 3rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  div h2 {
    position: absolute;
    left: -2.5rem;
    top: 0.5rem;
  }

  h2 {
    color: #fff;
  }

  @media (max-width: 769px) {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    max-width: 80vw;
    margin-top: 3rem;
    div h2 {
      position: absolute;
      left: -2.5rem;
      top: 0.5rem;
    }
  }

  @media (max-width: 450px) {
    max-width: 60vw;
    h2 {
      font-size: 1rem;
    }
  }
`;

const Slider = styled.div`
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
    id === "btnPrev" &&
    css`
      position: absolute;
      z-index: 999;
      top: 5rem;
      left: -4rem;
    `}

  ${({ id }) =>
    id === "btnNext" &&
    css`
      position: absolute;
      z-index: 999;
      top: 5rem;
      right: 0;
      left: calc(100vw - 115px);
      @media (max-width: 450px) {
        left: calc(100vw - 6rem);
      }
    `}
`;
