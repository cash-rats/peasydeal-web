export default function HorizontalGrid() {
  return (
    <div className="HorizontalGrid__wrapper">
      <div className="HorizontalGrid__image-container">
        <img
          alt="some alt"
          className="HorizontalGrid__image"
          src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/image_2020_08_27T13_55_21_523Z.png?v=1598596904"
        />
      </div>

      <div className="HorizontalGrid__desc-container">
        <div className="HorizontalGrid__desc" >
          <p className="HorizontalGrid__text"> head line </p>
          <span className="HorizontalGrid__price"> price </span>
        </div>
      </div>
    </div>
  );
}