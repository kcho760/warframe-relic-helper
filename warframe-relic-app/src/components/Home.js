import React, { useState } from 'react';
import './Home.css';
import RelicList from './RelicList';
import CheckboxGroup from './CheckboxGroup';
import ActiveFissures from './ActiveFissures';

function Home() {
  const [allTiersSelected, setAllTiersSelected] = useState(true);
  const [checkedItems, setCheckedItems] = useState({
    missionType: [],
    tier: [],
    steelPath: 'both', // Possible values: 'true', 'false', 'both'
    isStorm: false,
  });
  

  const missionTypes = [
    { name: 'Extermination', label: 'Extermination' },
    { name: 'Capture', label: 'Capture' },
    { name: 'Hijack', label: 'Hijack' },
    { name: 'Mobile Defense', label: 'Mobile Defense' },
    { name: 'Rescue', label: 'Rescue' },
    { name: 'Sabotage', label: 'Sabotage' },
    { name: 'Hive', label: 'Hive' },
    { name: 'Spy', label: 'Spy' },
  ];

  const endlessMissionTypes = [
    { name: 'Defense', label: 'Defense' },
    { name: 'Excavation', label: 'Excavation' },
    { name: 'Interception', label: 'Interception' },
    { name: 'Survival', label: 'Survival' },
  ];

  // const specialFissureTypes = [
  //   { name: 'isHard', label: 'Steel Path' },
  //   // { name: 'isStorm', label: 'Void Storm' },
  // ];

  const handleSteelPathChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      steelPath: event.target.value,
    });
  };

  const relicTypes = [
    { name: 'Lith', label: 'Lith' },
    { name: 'Meso', label: 'Meso' },
    { name: 'Neo', label: 'Neo' },
    { name: 'Axi', label: 'Axi' },
    { name: 'Requiem', label: 'Requiem'}
  ];

  const handleTierChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems(prev => {
      const newTiers = checked
        ? [...prev.tier, name]
        : prev.tier.filter(tier => tier !== name);
      
      setAllTiersSelected(newTiers.length === 0);
      return { ...prev, tier: newTiers };
    });
  };
  

  return (
    <div className="Home">
      <div className="top-half">
        <RelicList filters={checkedItems} />
      </div>
      <div className="bottom-half">
        <CheckboxGroup
          groupName="Mission Type"
          items={missionTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="Endless Mission"
          items={endlessMissionTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <div>
          <label>
            <input
              type="radio"
              name="steelPath"
              value="both"
              checked={checkedItems.steelPath === 'both'}
              onChange={handleSteelPathChange}
            />
            Both
          </label>
          <label>
            <input
              type="radio"
              name="steelPath"
              value="true"
              checked={checkedItems.steelPath === 'true'}
              onChange={handleSteelPathChange}
            />
            Steel Path Only
          </label>
          <label>
            <input
              type="radio"
              name="steelPath"
              value="false"
              checked={checkedItems.steelPath === 'false'}
              onChange={handleSteelPathChange}
            />
            Non-Steel Path Only
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="allTiers"
              checked={allTiersSelected}
              onChange={(e) => {
                setAllTiersSelected(e.target.checked);
                if (e.target.checked) {
                  setCheckedItems(prev => ({ ...prev, tier: [] }));
                }
              }}
            />
            All Tiers
          </label>
          {relicTypes.map((relicType) => (
            <label key={relicType.name}>
              <input
                type="checkbox"
                name={relicType.name}
                checked={checkedItems.tier.includes(relicType.name)}
                onChange={handleTierChange}
                // disabled={allTiersSelected} // Disable if all tiers are selected
              />
              {relicType.label}
            </label>
          ))}
        </div>
      </div>
        <ActiveFissures filters={checkedItems}/>
    </div>
  );
}

export default Home;