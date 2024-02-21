import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import axios from 'axios';

const RelicList = ({ filters }) => {
  const [relics, setRelics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFissures, setActiveFissures] = useState([]);
  const [flippedCardIds, setFlippedCardIds] = useState(new Set());

  useEffect(() => {
    const fetchRelics = async () => {
      setLoading(true);
      console.log(filters);
      try {
        const querySnapshot = await getDocs(collection(db, 'relics'));
        let relicsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        relicsData = applyFilters(relicsData, filters, activeFissures);
        // Sort based on the selected refinement level TEV, falling back to default TEV if not available
        relicsData.sort((a, b) => (b[filters.refinementLevel] || b.TEV) - (a[filters.refinementLevel] || a.TEV));
        console.log(relicsData)
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
        const response = await axios.get('https://warframe-relic-app.onrender.com/api/void-fissures/active-fissures');
        if (Array.isArray(response.data)) {
          setActiveFissures(response.data);
        } else {
          console.error('Expected an array, but received:', response.data);
          setError('Data format error: Active fissures data is not an array.');
        }
      } catch (error) {
        console.error('Failed to fetch active fissures:', error);
        setError('Failed to fetch active fissures');
      }
    };
  
    fetchActiveFissures();
  }, []);

  const applyFilters = (relicsData, filters, activeFissures) => {
    // Debug object to store reasons for relic inclusion
    let debugInfo = {};
  
    const activeFissureTiers = new Set(activeFissures
      .filter(fissure => {
        const matchesMissionType = filters.missionType.length === 0 || filters.missionType.includes(fissure.missionType);
        const matchesSteelPath = filters.steelPath === 'both' || String(fissure.isHard) === filters.steelPath;
        return matchesMissionType && matchesSteelPath;
      })
      .map(fissure => {
        // Add debug info for active fissure tiers
        debugInfo[fissure.tier] = `Included due to active fissure with mission type: ${fissure.missionType}, Steel Path: ${fissure.isHard}`;
        return fissure.tier;
      })
    );
  
    const filteredRelics = relicsData.filter(relic => {
      const isActiveFissureTier = activeFissureTiers.has(relic.Tier);
      const matchesTierFilter = filters.tier.length === 0 || filters.tier.includes(relic.Tier);
  
      // Add reasons for relic inclusion
      if (isActiveFissureTier && matchesTierFilter) {
        debugInfo[relic.id] = `Relic included. Tier: ${relic.Tier}, Active Fissure Tier: ${isActiveFissureTier}, Matches Tier Filter: ${matchesTierFilter}`;
      } else {
        debugInfo[relic.id] = `Relic excluded. Tier: ${relic.Tier}, Active Fissure Tier: ${isActiveFissureTier}, Matches Tier Filter: ${matchesTierFilter}`;
      }
  
      return isActiveFissureTier && matchesTierFilter;
    });
  
    // Log the debug info
    console.log(debugInfo);
  
    return filteredRelics;
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
              <h2>{relic.Name}</h2>
              <p>Tier: {relic.Tier}</p>
              {/* Display TEV for each selected refinement level or Intact TEV as default */}
              {filters.refinementLevel.length > 0 ? (
                filters.refinementLevel.map(level => (
                  <p key={level}>TEV ({level}): {relic[`${level}TEV`] || 'N/A'}p</p>
                ))
              ) : (
                // Display IntactTEV as the default value
                <p>TEV (Intact): {relic.IntactTEV || 'N/A'}p</p>
              )}
            </div>
            <div className="relic-item-back">
              {/* Label Row */}
              <div className="relic-item-labels">
                <span className="relic-item-label1">Item</span>
                <span className="relic-item-label2">Price</span>
                <span className="relic-item-label3">7-day Avg Vol</span>
              </div>
              {/* Back content (e.g., Drops) */}
              {relic.Drops.map((drop, index) => (
                <div key={index} className="relic-item-drop">
                  <span className="relic-item-drop-name">{`${drop.Item} ${drop.Part}`}</span>
                  <span className="relic-item-drop-platinum">{drop.MarketData ? `${drop.MarketData.platinumPrice}p` : 'N/A'}</span>
                  <span className="relic-item-drop-volume">{drop.MarketData ? `${drop.MarketData['7DayVolumeAverage']}` : 'N/A'}</span>
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