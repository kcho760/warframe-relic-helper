import React, { useState } from 'react';
import './Home.css';
import RelicList from './RelicList';
import CheckboxGroup from './CheckboxGroup';
import ActiveFissures from './ActiveFissures';

function Home() {
  const [checkedItems, setCheckedItems] = useState({
    missionType: [],
    tier: [],
    isHard: false,
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

  const specialFissureTypes = [
    { name: 'isHard', label: 'Steel Path' },
    { name: 'isStorm', label: 'Void Storm' },
  ];

  const relicTypes = [
    { name: 'Lith', label: 'Lith' },
    { name: 'Meso', label: 'Meso' },
    { name: 'Neo', label: 'Neo' },
    { name: 'Axi', label: 'Axi' },
  ];

  return (
    <div className="Home">
      <div className="top-half">
        <RelicList filters={checkedItems} />
      </div>
      <div className="bottom-half">
        <CheckboxGroup
          groupName="missionType"
          items={missionTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="endlessMission"
          items={endlessMissionTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="specialFissure"
          items={specialFissureTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="tier"
          items={relicTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
      </div>
        <ActiveFissures filters={checkedItems}/>
    </div>
  );
}

export default Home;
