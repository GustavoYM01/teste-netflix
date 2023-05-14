import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import AboutMovie from "./AboutMovie";

export default React.memo(function TopRated({ top10 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urlVideos, setUrlVideos] = useState({});
  const [votesAverage, setVotesAverage] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const bests = top10?.slice(0, 10);

  const baseURL = "https://api.themoviedb.org/3";

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    getVideo(id);
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
  };

  // const handleNext = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex + 1 < bests?.length ? prevIndex + 1 : 0
  //   );
  // };

  // const handlePrev = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex - 1 >= 0 ? prevIndex - 1 : bests?.length - 1
  //   );
  // };

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
        <h2>Top 10 em filmes hoje</h2>
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
                isModalOpen={isModalOpen}
              />
            )}
            <p>{i + 1}</p>
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
  @media (max-width: 1000px) {
    p {
      font-size: 10rem;
      margin-right: -1rem;
    }
  }
`;

const SliderContainer = styled.div`
  max-width: 100%;
  overflow-x: hidden;

  h2 {
    color: #fff;
  }

  @media (max-width: 1000px) {
    max-width: 100vw;
    h2 {
      display: none;
    }
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
`;

const Slider = styled.div`
  display: flex;
  gap: 5rem;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => props.translateValue}%);
  p {
    &:last-child {
      margin-left: -3rem;
    }
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
      top: 5rem;
      left: -4rem;
    `}

  ${({ id }) =>
    id === "btnNext" &&
    css`
      position: absolute;
      top: 5rem;
      right: 0;
      left: calc(100vw - 10rem);
    `}
`;
