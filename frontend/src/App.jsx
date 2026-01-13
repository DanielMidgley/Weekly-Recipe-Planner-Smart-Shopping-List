import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import WeeklyPlanner from './components/WeeklyPlanner';
import ShoppingList from './components/ShoppingList';
import './App.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <header>
      <div className="container">
        <nav>
          <h1>Recipe Planner</h1>
          <div>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Recipes</Link>
            <Link to="/plan" className={location.pathname === '/plan' ? 'active' : ''}>Weekly Plan</Link>
            <Link to="/shopping-list" className={location.pathname === '/shopping-list' ? 'active' : ''}>Shopping List</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/plan" element={<WeeklyPlanner />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
