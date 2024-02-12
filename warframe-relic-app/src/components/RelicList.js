import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Relic = ({ relic }) => (
  <div className="carousel-item">
    <h2>{relic.Name}</h2>
    <p>TEV: {relic.TEV}</p>
  </div>
);

const RelicList = ({ filters }) => {
    const [relics, setRelics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRelics = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'relics'));
          let relicsData = querySnapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
          }));

          // Apply filters
          relicsData = applyFilters(relicsData, filters);

          setRelics(relicsData);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch relics');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRelics();
    }, [filters]); // Re-fetch relics when filters change
  
    const applyFilters = (relicsData, filters) => {
      // Filter relics based on selected relic types
      const filteredRelics = relicsData.filter(relic => filters[relic.Tier.toLowerCase()]); // Convert to lowercase to match filter options
      
      // Sort the filtered relics by TEV value
      filteredRelics.sort((a, b) => b.TEV - a.TEV); // Sort in descending order by TEV value
      
      return filteredRelics;
    };
    
  
    if (loading) {
      return <p>Loading relics...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }
  
    if (relics.length === 0) {
      return <p>No relics/fissures match filters.</p>;
    }
  
    return (
      <div className="carousel-container">
        {relics.map(relic => (
          <Relic key={relic.id} relic={relic} />
        ))}
      </div>
    );
  };

export default RelicList;
