import { useState, useEffect } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMassage/ErrorMessage";
import mjolnir from "../../resources/img/mjolnir.png";
import "./randomChar.scss";

const RandomChar = () => {
  const [character, setCharacter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    updateCurrentChar();

    const timerId = setInterval(updateCurrentChar, 60000);

    return () => {
      clearInterval(timerId);
    }
  }, [])


  const _getRandomCharacterId = () => {
    return Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
  };

  const onErrorLoaded = () => {
    setLoading(false);
    setError(true);
  };

  const onCharacterLoaded = (character) => {
    setCharacter(character);
    setLoading(false);
  };

  const onCharacterLoading = () => {
    setLoading(true);
  };

  const updateCurrentChar = () => {
    const id = _getRandomCharacterId();
    onCharacterLoading();
    marvelService
      .getCertainCharacterFromMarvel(id)
      .then(onCharacterLoaded)
      .catch(onErrorLoaded);
  };

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View character={character} /> : null;
    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button
            onClick={updateCurrentChar}
            className="button button__main"
          >
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
}

const View = ({ character }) => {
  const { name, description, thumbnail, homepage, wiki } = character;
  const isCorrectThumbNail = thumbnail.includes("image_not_available");

  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        alt="Random character"
        style={
          isCorrectThumbNail ? { objectFit: "contain" } : { objectFit: "cover" }
        }
        className="randomchar__img"
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
