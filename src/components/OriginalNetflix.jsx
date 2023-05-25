import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import AboutMovie from "./AboutMovie";
import Meliodas from "../assets/Meliodas.jpg";
import Jailson from "../assets/jailson.jpg";

export default function OriginalNetflix({ originalNetflix }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urlVideos, setUrlVideos] = useState({});
  // const [votesAverage, setVotesAverage] = useState({});
  const [mathValue, setMathValue] = useState(0);
  const [classification, setClassification] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  const [btnIsVisible, setBtnIsVisible] = useState(true);

  const items = originalNetflix?.slice(0, 10);

  const itemCount = items?.length;

  const baseURL = "https://api.themoviedb.org/3";

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    getVideo(id);
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
    // setVotesAverage((prevVotesAverage) => ({
    //   ...prevVotesAverage,
    //   [id]: null,
    // }));
    setClassification((prevClassifications) => ({
      ...prevClassifications,
      [id]: null,
    }));
  };
  //https://api.themoviedb.org/3/tv/119051/videos?api_key=98def43abee228fc5dcae8ee5c2fddcc&language=pt-BR
  const getVideo = async (id) => {
    const response = await fetch(
      `${baseURL}/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((res) => {
        const trailerIndex = res?.results?.findIndex(
          (element) => element?.type === "Trailer"
        );
        const trailerURL = `https://www.youtube.com/watch?v=${res?.results[trailerIndex]?.key}`;
        return trailerURL;
      });

    setUrlVideos((prevUrlVideos) => ({
      ...prevUrlVideos,
      [id]: response,
    }));
  };

  // const getCoisa = async (id) => {
  //   const response = await fetch(
  //     `${baseURL}/tv/${id}/content_ratings?language=pt-BR&api_key=${process.env.REACT_APP_TMDB_KEY}`
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const br = res?.results?.find((result) => result?.iso_3166_1 === "BR");
  //       return br?.rating;
  //     });
  // };

  const getClassification = async (id) => {
    const response = await fetch(
      `${baseURL}/tv/${id}/content_ratings?language=pt-BR&api_key=${process.env.REACT_APP_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((res) => {
        const br = res?.results?.find((result) => result?.iso_3166_1 === "BR");
        return br?.rating;
      })
      .catch((err) => console.log(err));
    setClassification((prevClassifications) => ({
      ...prevClassifications,
      [id]: response,
    }));
  };

  // const getVotesAverage = async (id) => {
  //   const response = await fetch(
  //     `${baseURL}/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=pt-BR&append_to_response=videos`
  //   )
  //     .then((res) => res.json())
  //     .then((res) => res?.vote_average);

  //   setVotesAverage((prevVotesAverage) => ({
  //     ...prevVotesAverage,
  //     [id]: response,
  //   }));
  // };

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
        <h2 id="origNetH">Original Netflix</h2>
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
                  nome={filme?.name || filme?.original_name}
                  srcVideo={urlVideos[filme?.id]}
                  votos={filme?.vote_average}
                  classificacao={classification[filme?.id]}
                  isModalOpen={isModalOpen}
                  type="originalNetflix"
                />
              )}
              <img
                src={Jailson}
                // src={`https://image.tmdb.org/t/p/original/${filme?.poster_path}`}
                alt="Capa do filme"
                style={{ maxWidth: "20rem", maxHeight: "40rem" }}
              />
            </Container>
          );
        })}
      </Slider>
      <Button
        id="btnSliderPrev"
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
        id="btnSliderNext"
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
  /* margin-top: 3rem; */
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  #origNetH {
    position: absolute;
    left: -2.5rem;
    top: 25rem;
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
    id === "btnSliderPrev" &&
    css`
      position: absolute;
      z-index: 999;
      top: 29rem;
      left: -4rem;
    `}

  ${({ id }) =>
    id === "btnSliderNext" &&
    css`
      position: absolute;
      z-index: 999;
      top: 29rem;
      right: 0;
      left: calc(100vw - 115px);
      @media (max-width: 450px) {
        left: calc(100vw - 6rem);
      }
    `}
`;
