import React, { useState } from 'react';
import './Home.css';
import RelicList from './RelicList';
import CheckboxGroup from './CheckboxGroup';
import ActiveFissures from './ActiveFissures';

function Home() {
  const [allTiersSelected, setAllTiersSelected] = useState(true);
  const [checkedItems, setCheckedItems] = useState({
    normalMissionTypes: [],
    endlessMission: [],
    tier: [],
    steelPath: 'both',
    isStorm: false,
    refinementLevel: [], // Add this new state field
  });
  
  const normalMissionTypes = [
    { name: 'Extermination', label: 'Extermination' },
    { name: 'Capture', label: 'Capture' },
    { name: 'Hijack', label: 'Hijack' },
    { name: 'Mobile Defense', label: 'Mobile Defense' },
    { name: 'Rescue', label: 'Rescue' },
    { name: 'Sabotage', label: 'Sabotage' },
    { name: 'Hive', label: 'Hive' },
    { name: 'Spy', label: 'Spy' },
  ];

  const endlessMissionTypes= [
    { name: 'Defense', label: 'Defense' },
    { name: 'Excavation', label: 'Excavation' },
    { name: 'Interception', label: 'Interception' },
    { name: 'Survival', label: 'Survival' },
    { name: 'Disruption', label: 'Disruption'}
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

  const refinementLevels = [
    { name: 'Intact', label: 'Intact' },
    { name: 'Exceptional', label: 'Exceptional' },
    { name: 'Flawless', label: 'Flawless' },
    { name: 'Radiant', label: 'Radiant' },
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

  const handleCheckboxChange = (event, groupName) => {
    const { name, checked } = event.target;

    // Handle arrays for missionType, endlessMission, and tier
    if (groupName !== 'specialFissure') {
      // For arrays (missionType, tier)
      const updatedItems = checked 
        ? [...(checkedItems[groupName] || []), name] 
        : (checkedItems[groupName] || []).filter(item => item !== name);
      setCheckedItems({ ...checkedItems, [groupName]: updatedItems });
    } else if(groupName === 'refinementLevel'){
      setCheckedItems(prev => ({
        ...prev,
        [groupName]: checked
          ? [...prev[groupName], name]
          : prev[groupName].filter(r => r !== name)
      }));
    } else {
      // For boolean values (isHard, isStorm)
      setCheckedItems({ ...checkedItems, [name]: checked });
    }
  };
  
  const combinedMissionTypes = [
    ...checkedItems.normalMissionTypes,
    ...checkedItems.endlessMission,
  ].filter(Boolean); // This removes any falsy values like empty strings

  // Update the filters object to include the combined mission types
  const combinedFilters = {
    ...checkedItems,
    missionType: combinedMissionTypes, // This now includes both regular and endless mission types
  };

  return (
    <div className="Home">
      <div className="top-half">
        <RelicList filters={combinedFilters} />
      </div>
      <div className="bottom-half">
        <div className="bottom-half-left">
          <div className="checkbox-group-container">
            <CheckboxGroup
              groupName="normalMissionTypes"
              items={normalMissionTypes}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
          <div className="checkbox-group-container">
            <CheckboxGroup
              groupName="endlessMission"
              items={endlessMissionTypes}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              handleCheckboxChange={(event) => handleCheckboxChange(event, 'endlessMission')}
            />
          </div>
        </div>
        <div className="bottom-half-right">
          <div className="checkbox-group-container">
            {/* Steel Path Radio Buttons */}
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
          </div>
          <div className="checkbox-group-container">
            <CheckboxGroup
              groupName="refinementLevel"
              items={refinementLevels}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              handleCheckboxChange={(event) => handleCheckboxChange(event, 'refinementLevel')}
            />
          </div>
          <div className="checkbox-group-container">
            {/* Relic Tiers Checkboxes */}
            <div>
              {/* <label>
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
              </label> */}
              {relicTypes.map((relicType) => (
                <label key={relicType.name}>
                  <input
                    type="checkbox"
                    name={relicType.name}
                    checked={checkedItems.tier.includes(relicType.name)}
                    onChange={handleTierChange}
                  />
                  {relicType.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ActiveFissures filters={combinedFilters}/>
    </div>
  );
  
}

export default Home;