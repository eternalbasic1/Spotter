import { Link } from "react-router-dom";
import "./styles.css"; // Import CSS styles

const Home: React.FC = () => {
  return (
    <div className="card">
      <div className="card-content">
        <h1 className="title">Welcome to Trip Logger</h1>
        <p className="mt-4">Track your trips with ease.</p>
        <Link to="/trip">
          <button className="button mt-6">Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
