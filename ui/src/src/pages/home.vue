<template>
  <t4-page name="home">
    <t4-navbar :sliding="false" large large-transparent>
      <t4-nav-title>
        <i class="t4-navbar-logo"></i>
        <span>Techno4 CLI</span>
      </t4-nav-title>
      <t4-nav-title-large>
        <i class="t4-navbar-logo"></i>
        <span>Techno4 CLI</span>
      </t4-nav-title-large>
    </t4-navbar>

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
  </t4-page>
</template>
