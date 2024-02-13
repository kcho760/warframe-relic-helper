import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import axios from 'axios'; // Import Axios for making HTTP requests

const RelicList = ({ filters }) => {
  const [relics, setRelics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFissures, setActiveFissures] = useState([]);

  useEffect(() => {
    const fetchRelics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'relics'));
        let relicsData = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
  
        // Apply filters to the relics data
        relicsData = applyFilters(relicsData, filters, activeFissures);
  
        // Sort relics by TEV from highest to lowest
        relicsData.sort((a, b) => b.TEV - a.TEV);
  
        setRelics(relicsData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch relics');
      } finally {
        setLoading(false);
      }
    };
    
    console.log('Filters:', filters); // Log the filters variable
    
    fetchRelics();
  }, [filters, activeFissures]); // Re-fetch relics when filters or activeFissures change
  
  useEffect(() => {
    const fetchActiveFissures = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/void-fissures/active-fissures');
        setActiveFissures(response.data);
      } catch (error) {
        console.error('Failed to fetch active fissures:', error);
        setError('Failed to fetch active fissures');
      }
    };

    fetchActiveFissures();
  }, []); // Fetch active fissures only once when the component mounts

  const applyFilters = (relicsData, filters, activeFissures) => {
    // Combine missionType and endlessMission arrays for filtering.
    const missionTypes = [...filters.missionType, ...filters.endlessMission];
  
    // Filter active fissures based on the selected mission types, tiers, and steel path.
    const matchingFissures = activeFissures.filter(fissure =>
      (missionTypes.length === 0 || missionTypes.includes(fissure.missionType)) &&
      (filters.tier.length === 0 || filters.tier.includes(fissure.tier)) &&
      (filters.steelPath === 'both' || fissure.isHard.toString() === filters.steelPath)
    );
  
    // If there are no matching active fissures, then no relics should be displayed.
    if (matchingFissures.length === 0) {
      return [];
    }
  
    // Otherwise, filter relics based on the tiers present in the matching active fissures.
    const matchingTiers = new Set(matchingFissures.map(fissure => fissure.tier));
  
    return relicsData.filter(relic =>
      matchingTiers.has(relic.Tier) // Tier match
    );
  };
  
  
  if (loading) {
    return <p>Loading relics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (relics.length === 0) {
    return (
      <div>
        <p>No combination found</p>
      </div>
    );
  }
  

  return (
    <div className="carousel-container">
      {relics.map(relic => (
        <div key={relic.id} className="relic-item">
          <h2>{relic.Name}</h2>
          <p>Tier: {relic.Tier}</p>
          <p>TEV: {relic.TEV}</p>
        </div>
      ))}
    </div>
  );
};

export default RelicList;
