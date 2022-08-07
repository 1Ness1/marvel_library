class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = `apikey=${process.env.REACT_APP_API}`;
  _baseOffset = 210;

  getResourceFromMarvel = async (URL) => {
    const getFetchData = await fetch(URL);

    const { ok, status } = getFetchData;

    if (!ok) return new Error(`Could not fetch ${URL}, status: ${status}`);

    return await getFetchData.json();
  };

  getAllCharactersFromMarvel = async (offset = this._baseOffset) => {
    const result = await this.getResourceFromMarvel(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    );

    return result?.data?.results.map(this._transformCharacter);
  };

  getCertainCharacterFromMarvel = async (id) => {
    const result = await this.getResourceFromMarvel(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );

    return this._transformCharacter(result.data.results[0]);
  };

  _transformCharacter = (result) => {
    return {
      id: result?.id,
      name: result?.name,
      description: result?.description
        ? `${result.description.slice(0, 210)}...`
        : "There is no desctiption for this character...",
      thumbnail: `${result?.thumbnail.path}.${result?.thumbnail.extension}`,
      homepage: result?.urls[0].url,
      wiki: result?.urls[1].url,
      comics: result?.comics?.items,
    };
  };
}

export default MarvelService;
