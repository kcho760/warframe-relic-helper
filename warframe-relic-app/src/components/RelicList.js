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

        setRelics(relicsData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch relics');
      } finally {
        setLoading(false);
      }
    };

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
    // Ensure missionType and endlessMission are arrays before combining them
    const combinedMissionTypes = [
      ...(Array.isArray(filters.missionType) ? filters.missionType : []),
      ...(Array.isArray(filters.endlessMission) ? filters.endlessMission : [])
    ];
  
    // Adjusted filter logic
    return relicsData.filter(relic => {
      // If no tiers are selected, do not filter out based on tier
      const tierCondition = filters.tier.length === 0 || filters.tier.includes(relic.Tier);
  
      // Filtering based on active fissures and mission types
      const fissureCondition = activeFissures.some(fissure =>
        (combinedMissionTypes.length === 0 || combinedMissionTypes.includes(fissure.missionType)) &&
        (filters.tier.length === 0 || filters.tier.includes(fissure.tier)) &&
        (filters.isStorm === undefined || fissure.isStorm === filters.isStorm) &&
        (filters.isHard === undefined || fissure.isHard === filters.isHard)
      );
  
      return tierCondition && fissureCondition;
    });
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
        <p>No relics found</p>
        <p>Selected filters: {JSON.stringify(filters)}</p>
        <p>Active fissures: {JSON.stringify(activeFissures.map(fissure => ({
          missionType: fissure.missionType,
          tier: fissure.tier,
          isHard: fissure.isHard,
          isStorm: fissure.isStorm
        })))}</p>
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
