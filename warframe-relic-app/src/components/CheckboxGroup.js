import React from 'react';

const CheckboxGroup = ({ groupName, items, checkedItems, setCheckedItems }) => {
  // Determine if the group is handling boolean values or arrays based on groupName
  const isBooleanGroup = groupName === 'specialFissure';

  // Handle individual checkbox change
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (!isBooleanGroup) {
      // Handling arrays for missionType, endlessMission, and tier
      const updatedItems = checked 
        ? [...(checkedItems[groupName] || []), name] 
        : (checkedItems[groupName] || []).filter(item => item !== name);
      setCheckedItems({ ...checkedItems, [groupName]: updatedItems });
    } else {
      // Handling boolean values for isHard and isStorm
      setCheckedItems({ ...checkedItems, [name]: checked });
    }
  };

  // Compute if all checkboxes are checked
  const isAllChecked = items.length > 0 && items.every(item => checkedItems[groupName]?.includes(item.name));

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    const allOrNone = checked ? items.map(item => item.name) : [];
    setCheckedItems({ ...checkedItems, [groupName]: allOrNone });
  };

  // Adjust rendering logic for checkboxes based on category
  const isChecked = (name) => {
    return checkedItems[groupName]?.includes(name) || false;
  };

  return (
    <div className={`${groupName}-group`}>
      {!isBooleanGroup && (
        <label>
          <input
            type="checkbox"
            name={`all-${groupName}`}
            checked={isAllChecked}
            onChange={handleSelectAllChange}
          />
          All {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
        </label>
      )}
      <div className={`${groupName}-types`}>
        {items.map(item => (
          <label key={item.name}>
            <input
              type="checkbox"
              name={item.name}
              checked={isChecked(item.name)}
              onChange={handleCheckboxChange}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
