import React from 'react';
import { Page, Navbar, Block, Link } from 'techno4-react';

const DynamicRoutePage = (props) => {
  const { t4route, t4router } = props;
  return (
    <Page>
      <Navbar title="Dynamic Route" backLink="Back" />
      <Block strong>
        <ul>
          <li><b>Url:</b> {t4route.url}</li>
          <li><b>Path:</b> {t4route.path}</li>
          <li><b>Hash:</b> {t4route.hash}</li>
          <li><b>Params:</b>
            <ul>
              {Object.keys(t4route.params).map(key => (
                <li key={key}><b>{key}:</b> {t4route.params[key]}</li>
              ))}
            </ul>
          </li>
          <li><b>Query:</b>
            <ul>
              {Object.keys(t4route.query).map(key => (
                <li key={key}><b>{key}:</b> {t4route.query[key]}</li>
              ))}
            </ul>
          </li>
          <li><b>Route:</b> {t4route.route.path}</li>
        </ul>
      </Block>
      <Block strong>
        <Link onClick={() => t4router.back()}>Go back via Router API</Link>
      </Block>
    </Page>
  );
}

export default DynamicRoutePage;
