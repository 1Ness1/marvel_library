import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMassage/ErrorMessage";
import mjolnir from "../../resources/img/mjolnir.png";
import "./randomChar.scss";

class RandomChar extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    character: {},
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateCurrentChar();
  }

  _getRandomCharacterId = () => {
    return Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
  };

  onErrorLoaded = () => {
    this.setState({ loading: false, error: true });
  };

  onCharacterLoaded = (character) => {
    this.setState({ character, loading: false });
  };

  onCharacterLoading = () => {
    this.setState({ loading: true });
  };

  updateCurrentChar = () => {
    const id = this._getRandomCharacterId();
    this.onCharacterLoading();
    this.marvelService
      .getCertainCharacterFromMarvel(id)
      .then(this.onCharacterLoaded)
      .catch(this.onErrorLoaded);
  };

  render() {
    const { character, loading, error } = this.state;
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
            onClick={this.updateCurrentChar}
            className="button button__main"
          >
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
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
