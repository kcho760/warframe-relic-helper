import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Assuming your CSS is in Home.css

const ActiveFissures = ({ filters }) => {
  const [activeFissures, setActiveFissures] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActiveFissures = async () => {
      try {
        const response = await axios.get('https://warframe-relic-app.onrender.com/api/void-fissures/active-fissures');
        let fissures = response.data;

        // Filter the fissures based on the filters passed in
        fissures = fissures.filter(fissure => {
          const missionTypeMatch = !filters.missionType.length || filters.missionType.includes(fissure.missionType);
          const tierMatch = !filters.tier.length || filters.tier.includes(fissure.tier);
          const isHardMatch = filters.steelPath === 'both' || fissure.isHard === (filters.steelPath === 'true');
          const isStormMatch = filters.isStorm === undefined || fissure.isStorm === filters.isStorm;
          
          return missionTypeMatch && tierMatch && isHardMatch && isStormMatch;
        });

        setActiveFissures(fissures);
      } catch (error) {
        console.error('Failed to fetch active fissures:', error);
        setError('Failed to fetch active fissures');
      }
    };

    fetchActiveFissures();
  }, [filters]); // Re-fetch active fissures when filters change

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Active Void Fissures</h2>
      <div className="carousel-container">
        {activeFissures.length > 0 ? (
          activeFissures.map(fissure => (
            <div className="fissure-card" key={fissure.id}>
              <p>Node: {fissure.node}</p>
              <p>Mission Type: {fissure.missionType}</p>
              <p>Enemy: {fissure.enemy}</p>
              <p>Tier: {fissure.tier}</p>
              <p>ETA: {fissure.eta}</p>
              <p>Steel Path?: {fissure.isHard ? 'Yes' : 'No'}</p>
            </div>
          ))
        ) : (
          <p>No active fissures match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveFissures;
