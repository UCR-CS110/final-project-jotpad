function StarRating({ rating = 0 }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += "★";
  }

  if (halfStar) {
    stars += "⯨";
  }

  while (stars.length < 5) {
    stars += "☆";
  }

  return (
    <div style={{ color: '#cfa635', fontSize: '25px' }}>
      {stars}
    </div>
  );
}

export default StarRating;