import React, { useState } from 'react';
import './Home.css';
import RelicList from './relics';

function Home() {
  const [checkedItems, setCheckedItems] = useState({});

  const normalMissionTypes = [
    { name: 'exterminate', label: 'Exterminate' },
    { name: 'capture', label: 'Capture' },
    { name: 'hijack', label: 'Hijack' },
    { name: 'mobileDefense', label: 'Mobile Defense' },
    { name: 'rescue', label: 'Rescue' },
    { name: 'sabotage', label: 'Sabotage' },
    { name: 'hive', label: 'Hive' },
    { name: 'spy', label: 'Spy' },
  ];

  const endlessMissionTypes = [
    { name: 'defense', label: 'Defense' },
    { name: 'excavation', label: 'Excavation' },
    { name: 'interception', label: 'Interception' },
    { name: 'survival', label: 'Survival' },
  ];

  const specialFissureTypes = [
    { name: 'steel-path', label: 'Steel Path' },
    { name: 'void-storm', label: 'Void Storm' },
  ];

  const relicTypes = [
    { name: 'lith', label: 'Lith' },
    { name: 'meso', label: 'Meso' },
    { name: 'neo', label: 'Neo' },
    { name: 'axi', label: 'Axi' },
  ];

  const handleCheckboxChange = (event, category) => {
    const { name, checked } = event.target;

    if (name.startsWith("all")) {
      const allOrNone = (category === 'relicTypes' ? relicTypes : category).reduce((acc, item) => ({
        ...acc,
        [item.name]: checked,
      }), {});
      setCheckedItems({ ...checkedItems, ...allOrNone });
    } else {
      setCheckedItems({ ...checkedItems, [name]: checked });
    }
  };

  const isAllChecked = (category) => {
    // If category is an array, use it; otherwise, find the correct array by its name.
    const itemList = Array.isArray(category) ? category : {
      'normalMissionTypes': normalMissionTypes,
      'endlessMissionTypes': endlessMissionTypes,
      'specialFissureTypes': specialFissureTypes,
      'relicTypes': relicTypes
    }[category] || [];
  
    return itemList.every(item => checkedItems[item.name]);
  };
  
  return (
    <div className="Home">
      <div className="top-half">
        {/* Replace placeholder cards with RelicList component */}
        <RelicList />
      </div>

      <div className="bottom-half">
        <div className='normal-mission'>
          <label>
            <input
              type="checkbox"
              name="all-normal"
              checked={isAllChecked(normalMissionTypes)}
              onChange={(e) => handleCheckboxChange(e, normalMissionTypes)}
            /> All Normal Missions
          </label>
          {/* Normal Mission Types */}
          <div className="normal-mission-types">
            {normalMissionTypes.map(mission => (
              <label key={mission.name}>
                <input
                  type="checkbox"
                  name={mission.name}
                  checked={checkedItems[mission.name] || false}
                  onChange={(e) => handleCheckboxChange(e, normalMissionTypes)}
                /> {mission.label}
              </label>
            ))}
          </div>
        </div>

        <div className='endless-mission'>
            <label>
              <input
                type="checkbox"
                name="all-endless"
                checked={isAllChecked(endlessMissionTypes)}
                onChange={(e) => handleCheckboxChange(e, endlessMissionTypes)}
              /> All Endless Missions
            </label>
          </div>
        {/* Endless Mission Types */}
        <div className="endless-mission-types">
          {endlessMissionTypes.map(mission => (
            <label key={mission.name}>
              <input
                type="checkbox"
                name={mission.name}
                checked={checkedItems[mission.name] || false}
                onChange={(e) => handleCheckboxChange(e, endlessMissionTypes)}
              /> {mission.label}
            </label>
          ))}
        </div>

        <div className='special-fissures'>
          <label>
          <input
            type="checkbox"
            name="all-special-fissures"
            checked={isAllChecked(specialFissureTypes) || false}
            onChange={(e) => handleCheckboxChange(e, specialFissureTypes)}
          />
          All Special Fissures
          </label>
          <div className="special-fissure-types">
            {specialFissureTypes.map(fissure => (
              <label key={fissure.name}>
                <input
                  type="checkbox"
                  name={fissure.name}
                  checked={checkedItems[fissure.name] || false}
                  onChange={(e) => handleCheckboxChange(e, specialFissureTypes)}
                /> {fissure.label}
              </label>
            ))}
          </div>
        </div>

        <div className='relics'>
          <label>
            <input
              type="checkbox"
              name="all-relics"
              checked={isAllChecked('relicTypes')}
              onChange={(e) => handleCheckboxChange(e, 'relicTypes')}
            /> All Relics
          </label>
        </div>
        {/* Relic Types */}
        <div className="relic-types">
          {relicTypes.map(relic => (
            <label key={relic.name}>
              <input
                type="checkbox"
                name={relic.name}
                checked={checkedItems[relic.name] || false}
                onChange={(e) => handleCheckboxChange(e, 'relicTypes')}
              /> {relic.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
