export default (props, { $h }) => {
  return () => $h`
    <div class="page" data-name="home">
      <div class="navbar navbar-large navbar-large-transparent no-sliding">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="title">
            <i class="t4-navbar-logo"></i>
            <span>Techno4 CLI</span>
          </div>
          <div class="title-large">
            <div class="title-large-text">
              <i class="t4-navbar-logo"></i>
              <span>Techno4 CLI</span>
            </div>
          </div>
        </div>
      </div>

      <div class="page-content">
        <div class="center-content">
          <div class="block padding home-cards row">
            <div class="col-100 medium-33 card">
              <a href="/create/" class="card-content card-content-padding link">
                <i class="t4-icons">plus_circle_fill</i>
                <span>Create App</span>
              </a>
            </div>
            <div class="col-100 medium-33 card">
              <a href="/assets/" class="card-content card-content-padding link">
                <i class="t4-icons">photo_fill_on_rectangle_fill</i>
                <span>Generate Assets</span>
              </a>
            </div>
            <div class="col-100 medium-33"></div>
          </div>
        </div>
      </div>
    </div>
  `;
};
