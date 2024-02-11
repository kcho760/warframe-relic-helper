import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './relics.css';

const Relic = ({ relic }) => (
  <div className="carousel-item">
    <h2>{relic.Name}</h2>
    <p>TEV: {relic.TEV}</p>
  </div>
);

const RelicList = () => {
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

          // Sort relics by TEV from highest to lowest
          relicsData = relicsData.sort((a, b) => b.TEV - a.TEV);

          setRelics(relicsData);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch relics');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRelics();
    }, []);
  
    if (loading) {
      return <p>Loading relics...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
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
