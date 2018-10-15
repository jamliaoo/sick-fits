import Items from '../components/Items';

const Home = ({ page }) => {
  return (
    <div>
      <Items page={parseFloat(page) || 1} />
    </div>
  );
};

export default Home;
