import { MenuContent, MenuDivider } from '../../common/Menu';
import { MenuContentSection } from '../../common/Dropdown';
import ListActionsListItem from '../ListActionsListItem';
import CopyList from '../CopyList';
import MoveList from '../MoveList';
import MoveAllCards from '../MoveAllCards';
import ArchiveAllCards from '../ArchiveAllCards';
import ArchiveList from '../ArchiveList';

const MainMenuContent = (): JSX.Element => {
  return (
    <MenuContent>
      <MenuContentSection>
        <ul>
          <ListActionsListItem>Add card...</ListActionsListItem>

          <ListActionsListItem>
            <CopyList />
          </ListActionsListItem>

          <ListActionsListItem>
            <MoveList />
          </ListActionsListItem>
        </ul>
      </MenuContentSection>

      <MenuDivider />

      <MenuContentSection>
        <ul>
          <ListActionsListItem>Sort by...</ListActionsListItem>
        </ul>
      </MenuContentSection>

      <MenuDivider />

      <MenuContentSection>
        <ul>
          <ListActionsListItem>
            <MoveAllCards />
          </ListActionsListItem>

          <ListActionsListItem>
            <ArchiveAllCards />
          </ListActionsListItem>
        </ul>
      </MenuContentSection>

      <MenuDivider />

      <MenuContentSection>
        <ul>
          <ArchiveList />
        </ul>
      </MenuContentSection>
    </MenuContent>
  );
};

export default MainMenuContent;
