import React, { useState } from "react";
import styled, { css } from "styled-components";
import AboutMovie from "./AboutMovie";

export default React.memo(function TopRated({ top10 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urlVideos, setUrlVideos] = useState({});
  const [votesAverage, setVotesAverage] = useState({});
  const [classification, setClassification] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const bests = top10?.slice(0, 10);

  const baseURL = "https://api.themoviedb.org/3";

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
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
        const trailerURL = `https://www.youtube.com/watch?v=${res?.videos?.results[trailerIndex]?.key}`;
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
          } else {
            console.log(
              "Não foram encontradas datas de lançamento no objeto 'resultBR'."
            );
          }
        } else {
          console.log(
            "Não foi encontrado um objeto 'results' com iso_3166_1 igual a 'BR'."
          );
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

  const [isModalOpen, setModalOpen] = useState(false);

  const handleMouseEnter2 = () => {
    setModalOpen(true);
  };

  const handleMouseLeave2 = () => {
    setModalOpen(false);
  };

  const itemCount = bests?.length;

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

  return (
    <SliderContainer>
      <div>
        <h2>Top 10 em tendências da semana</h2>
      </div>
      <Slider translateValue={currentIndex * -(100 / itemCount)}>
        {bests?.map((filme, i) => (
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
                srcVideo={urlVideos[filme?.id]}
                votos={votesAverage[filme?.id]}
                classificacao={classification[filme?.id]}
                isModalOpen={isModalOpen}
              />
            )}
            <p id="classification">{i + 1}</p>
            <img
              src={`https://image.tmdb.org/t/p/original/${filme?.poster_path}`}
              alt="Capa do filme"
            />
          </Container>
        ))}
      </Slider>
      <Button id="btnPrev" onClick={handlePrev}>
        &#8249;
      </Button>
      <Button id="btnNext" onClick={handleNext}>
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
  p {
    color: #fff;
    font-size: 14rem;
    margin-right: -2rem;
  }
  img {
    max-width: 12rem;
    max-height: 15rem;
    object-fit: fill;
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
    /* overflow: hidden; */
    max-width: 80vw;
    margin-top: 3rem;
    /* margin-left: -1.5rem; */
    div h2 {
      position: absolute;
      left: -2.5rem;
      top: 0.5rem;
    }
  }

  @media (max-width: 450px) {
    h2 {
      font-size: 1.1rem;
    }
  }
`;

const Slider = styled.div`
  display: flex;
  gap: 5rem;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => props.translateValue}%);
  @media (max-width: 769px) {
    gap: 2rem;
  }
`;

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 6rem;
  color: #fff;
  padding: 0.2rem;

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
      left: calc(100vw - 7rem);
    `}
`;
