import React from 'react';

// CheckboxGroup component handles rendering of checkboxes and a "Select All" option
const CheckboxGroup = ({ groupName, items, checkedItems, setCheckedItems }) => {
  // Handle individual checkbox change
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems({ ...checkedItems, [name]: checked });
  };

  // Check if all checkboxes are checked
  const isAllChecked = items.every(item => checkedItems[item.name]);

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    const allOrNone = items.reduce((acc, item) => ({
      ...acc,
      [item.name]: checked,
    }), {});
    setCheckedItems({ ...checkedItems, ...allOrNone });
  };

  return (
    <div className={`${groupName}-group`}>
      <label>
        <input
          type="checkbox"
          name={`all-${groupName}`}
          checked={isAllChecked}
          onChange={handleSelectAllChange}
        />
        All {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
      </label>
      <div className={`${groupName}-types`}>
        {items.map(item => (
          <label key={item.name}>
            <input
              type="checkbox"
              name={item.name}
              checked={checkedItems[item.name] || false}
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
