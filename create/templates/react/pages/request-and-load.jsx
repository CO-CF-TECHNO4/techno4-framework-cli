import React from 'react';
import { Page, Navbar, Block, List, ListItem } from 'techno4-react';

const RequestAndLoad = (props) => {
  const { user } = props;

  return (
    <Page>
      <Navbar title={`${user.firstName} ${user.lastName}`} backLink="Back" />
      <Block strong>
        {user.about}
      </Block>
      <List>
        {user.links.map((link, index) => (
          <ListItem
            key={index}
            link={link.url}
            title={link.title}
            external
            target="_blank"
          ></ListItem>
        ))}
      </List>
    </Page>
  );
}

export default RequestAndLoad;
