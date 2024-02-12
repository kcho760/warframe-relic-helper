import React, { useState } from 'react';
import './Home.css';
import RelicList from './relics';
import CheckboxGroup from './CheckboxGroup';
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

  return (
    <div className="Home">
      <div className="top-half">
        <RelicList />
      </div>
      <div className="bottom-half">
        <CheckboxGroup
          groupName="normal-mission"
          items={normalMissionTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="endless-mission"
          items={endlessMissionTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="special-fissures"
          items={specialFissureTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
        <CheckboxGroup
          groupName="relics"
          items={relicTypes}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
        />
      </div>
    </div>
  );
}

export default Home;
