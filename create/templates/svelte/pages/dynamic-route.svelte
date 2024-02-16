<Page>
  <Navbar title="Dynamic Route" backLink="Back" />
  <Block strong>
    <ul>
      <li><b>Url:</b> {t4route.url}</li>
      <li><b>Path:</b> {t4route.path}</li>
      <li><b>Hash:</b> {t4route.hash}</li>
      <li><b>Params:</b>
        <ul>
          {#each Object.keys(t4route.params) as key}
            <li><b>{key}:</b> {t4route.params[key]}</li>
          {/each}
        </ul>
      </li>
      <li><b>Query:</b>
        <ul>
          {#each Object.keys(t4route.query) as key}
            <li><b>{key}:</b> {t4route.query[key]}</li>
          {/each}
        </ul>
      </li>
      <li><b>Route:</b> {t4route.route.path}</li>
    </ul>
  </Block>
  <Block strong>
    <Link onClick={() => t4router.back()}>Go back via Router API</Link>
  </Block>
</Page>
<script>
  import { Page, Navbar, Block, Link } from 'techno4-svelte';

  export let t4route;
  export let t4router;
</script>
