<template>
  <t4-page name="settings">
    <t4-navbar title="Settings"></t4-navbar>

    <t4-block-title>Form Example</t4-block-title>
    <t4-list no-hairlines-md>
      <t4-list-input
        label="Name"
        type="text"
        placeholder="Your name"
      ></t4-list-input>

      <t4-list-input
        label="E-mail"
        type="email"
        placeholder="E-mail"
      ></t4-list-input>

      <t4-list-input
        label="URL"
        type="url"
        placeholder="URL"
      ></t4-list-input>

      <t4-list-input
        label="Password"
        type="password"
        placeholder="Password"
      ></t4-list-input>

      <t4-list-input
        label="Phone"
        type="tel"
        placeholder="Phone"
      ></t4-list-input>

      <t4-list-input
        label="Gender"
        type="select"
        >
        <option>Male</option>
        <option>Female</option>
      </t4-list-input>

      <t4-list-input
        label="Birth date"
        type="date"
        placeholder="Birth day"
        defaultValue="2014-04-30"
      ></t4-list-input>

      <t4-list-item
        title="Toggle"
      >
        <template #after>
          <t4-toggle />
        </template>
      </t4-list-item>

      <t4-list-input
        label="Range"
        :input="false"
      >
        <template #input>
          <t4-range :value="50" :min="0" :max="100" :step="1" />
        </template>
      </t4-list-input>

      <t4-list-input
        type="textarea"
        label="Textarea"
        placeholder="Bio"
      ></t4-list-input>
      <t4-list-input
        type="textarea"
        label="Resizable"
        placeholder="Bio"
        resizable
      ></t4-list-input>
    </t4-list>

    <t4-block-title>Buttons</t4-block-title>
    <t4-block strong>
      <t4-row tag="p">
        <t4-button class="col">Button</t4-button>
        <t4-button class="col" fill>Fill</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" raised>Raised</t4-button>
        <t4-button class="col" raised fill>Raised Fill</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" round>Round</t4-button>
        <t4-button class="col" round fill>Round Fill</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" outline>Outline</t4-button>
        <t4-button class="col" round outline>Outline Round</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" small outline>Small</t4-button>
        <t4-button class="col" small round outline>Small Round</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" small fill>Small</t4-button>
        <t4-button class="col" small round fill>Small Round</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" large raised>Large</t4-button>
        <t4-button class="col" large fill raised>Large Fill</t4-button>
      </t4-row>
      <t4-row tag="p">
        <t4-button class="col" large fill raised color="red">Large Red</t4-button>
        <t4-button class="col" large fill raised color="green">Large Green</t4-button>
      </t4-row>
    </t4-block>

    <t4-block-title>Checkbox group</t4-block-title>
    <t4-list>
      <t4-list-item
        checkbox
        name="my-checkbox"
        value="Books"
        title="Books"
      ></t4-list-item>
      <t4-list-item
        checkbox
        name="my-checkbox"
        value="Movies"
        title="Movies"
      ></t4-list-item>
      <t4-list-item
        checkbox
        name="my-checkbox"
        value="Food"
        title="Food"
      ></t4-list-item>
    </t4-list>

    <t4-block-title>Radio buttons group</t4-block-title>
    <t4-list>
      <t4-list-item
        radio
        name="radio"
        value="Books"
        title="Books"
      ></t4-list-item>
      <t4-list-item
        radio
        name="radio"
        value="Movies"
        title="Movies"
      ></t4-list-item>
      <t4-list-item
        radio
        name="radio"
        value="Food"
        title="Food"
      ></t4-list-item>
    </t4-list>
  </t4-page>
</template>
