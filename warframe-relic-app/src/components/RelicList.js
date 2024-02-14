import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import axios from 'axios';

const RelicList = ({ filters }) => {
  const [relics, setRelics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFissures, setActiveFissures] = useState([]);
  const [flippedCardIds, setFlippedCardIds] = useState(new Set()); // Use a Set to manage flipped cards

  useEffect(() => {
    const fetchRelics = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'relics'));
        let relicsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        relicsData = applyFilters(relicsData, filters, activeFissures);
        relicsData.sort((a, b) => b.TEV - a.TEV);

        setRelics(relicsData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch relics');
      } finally {
        setLoading(false);
      }
    };

    fetchRelics();
  }, [filters, activeFissures]);

  useEffect(() => {
    const fetchActiveFissures = async () => {
      try {
        const response = await axios.get('https://warframe-relic-app.web.app/api/void-fissures/active-fissures');
        setActiveFissures(response.data);
      } catch (error) {
        console.error('Failed to fetch active fissures:', error);
        setError('Failed to fetch active fissures');
      }
    };

    fetchActiveFissures();
  }, []);

  const applyFilters = (relicsData, filters, activeFissures) => {
    const missionTypes = [...filters.missionType, ...filters.endlessMission];
    const matchingFissures = activeFissures.filter(fissure =>
      (missionTypes.length === 0 || missionTypes.includes(fissure.missionType)) &&
      (filters.tier.length === 0 || filters.tier.includes(fissure.tier)) &&
      (filters.steelPath === 'both' || fissure.isHard.toString() === filters.steelPath)
    );

    if (matchingFissures.length === 0) {
      return [];
    }

    const matchingTiers = new Set(matchingFissures.map(fissure => fissure.tier));
    return relicsData.filter(relic => matchingTiers.has(relic.Tier));
  };

  const toggleCardFlip = (id) => {
    setFlippedCardIds(prevIds => {
      const newFlippedIds = new Set(prevIds);
      if (newFlippedIds.has(id)) {
        newFlippedIds.delete(id);
      } else {
        newFlippedIds.add(id);
      }
      return newFlippedIds;
    });
  };

  if (loading) {
    return <p>Loading relics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (relics.length === 0) {
    return <div><p>No relics found</p></div>;
  }

  return (
    <div className="carousel-container">
      {relics.map(relic => (
        <div key={relic.id} className={`relic-item ${flippedCardIds.has(relic.id) ? 'flipped' : ''}`} onClick={() => toggleCardFlip(relic.id)}>
          <div className="relic-item-flipper">
            <div className="relic-item-front">
              {/* Front content */}
              <h2>{relic.Name}</h2>
              <p>Tier: {relic.Tier}</p>
              <p>TEV: {relic.TEV}</p>
            </div>
            <div className="relic-item-back">
              {/* Back content (e.g., Drops) */}
              <div className="relic-item-back-header">
                <span>Name</span>
                <span>Platinum</span>
              </div>
              {relic.Drops.map((drop, index) => (
                <div key={index} className="relic-item-drop">
                  <span className="relic-item-drop-name">{`${drop.Item} ${drop.Part}`}</span>
                  <span className="relic-item-drop-platinum">{drop.MarketData ? `${drop.MarketData.platinumPrice}p` : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelicList;