import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/region">
        Region
      </MenuItem>
      <MenuItem icon="asterisk" to="/country">
        Country
      </MenuItem>
      <MenuItem icon="asterisk" to="/location">
        Location
      </MenuItem>
      <MenuItem icon="asterisk" to="/department">
        Department
      </MenuItem>
      <MenuItem icon="asterisk" to="/task">
        Task
      </MenuItem>
      <MenuItem icon="asterisk" to="/scientist">
        Scientist
      </MenuItem>
      <MenuItem icon="asterisk" to="/area">
        Area
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
