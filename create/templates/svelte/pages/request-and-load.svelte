<Page>
  <Navbar title={`${user.firstName} ${user.lastName}`} backLink="Back" />
  <Block strong>
    {user.about}
  </Block>
  <List>
    {#each user.links as link}
      <ListItem
        link={link.url}
        title={link.title}
        external
        target="_blank"
      />
    {/each}
  </List>
</Page>
<script>
  import { Page, Navbar, Block, List, ListItem } from 'techno4-svelte';

  export let user;
</script>
