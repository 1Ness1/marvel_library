import { useState, useEffect, useRef } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMassage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [charEnded, setCharEnded] = useState(false);
  const [offset, setOffset] = useState(210);

  const marvelService = new MarvelService();

  useEffect(() => {
      onRequest();
  }, []);

  const onRequest = (offset) => {
    onCharListLoading();

    marvelService
      .getAllCharactersFromMarvel(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const onCharListLoading = () => setNewItemLoading(true);

  const onCharListLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) ended = true;

    setCharList(charList => [...charList, ...newCharList]);
    setLoading(loading => false);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharEnded(charEnded => ended);
  };


  const onError = () => {
    setError(true);
    setLoading(false);
  };


  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }


    // Этот метод создан для оптимизации,
  // чтобы не помещать такую конструкцию в метод render
  const renderItems = (arr) => {
    const items = arr.map((item, index) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          ref={(el) => itemRefs.current[index] = el}
          className="char__item"
          tabIndex={0}
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(index);
           }
          }
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === "Enter") {
              props.onCharSelected(item.id);
              focusOnItem(index);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return <ul className="char__grid">{items}</ul>;
  }


    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          disabled={newItemLoading}
          onClick={() => onRequest(offset)}
          style={{ display: charEnded ? "none" : "block" }}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
}

export default CharList;
