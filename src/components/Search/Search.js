import "./Search.scss";

export default function Search() {
  return (
    <section className="search">
      <div className="search__container">
        <div className="search__top">
          <input
            className="search__bar"
            placeholder="Find your mentor"
            name="search"
          ></input>
          <img className="search__avatar" />
        </div>
      </div>
    </section>
  );
}
