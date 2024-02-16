var capacitorApp = {
  t4: null,
  /*
  This method hides splashscreen after 2 seconds
  */
  handleSplashscreen: function() {
    var t4 = capacitorApp.t4;
    if (!window.Capacitor || t4.device.electron) return;
    setTimeout(() => {
      if (window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
        window.Capacitor.Plugins.SplashScreen.hide();
      }
    }, 2000);
  },
  /*
  This method prevents back button tap to exit from app on android.
  In case there is an opened modal it will close that modal instead.
  In case there is a current view with navigation history, it will go back instead.
  */
  handleAndroidBackButton: function () {
    var t4 = capacitorApp.t4;
    const $ = t4.$;
    if (t4.device.electron || !window.Capacitor || !window.Capacitor.Plugins.App) return;
    window.Capacitor.Plugins.App.addListener('backButton', function () {
      if ($('.actions-modal.modal-in').length) {
        t4.actions.close('.actions-modal.modal-in');
        return;
      }
      if ($('.dialog.modal-in').length) {
        t4.dialog.close('.dialog.modal-in');
        return;
      }
      if ($('.sheet-modal.modal-in').length) {
        t4.sheet.close('.sheet-modal.modal-in');
        return;
      }
      if ($('.popover.modal-in').length) {
        t4.popover.close('.popover.modal-in');
        return;
      }
      if ($('.popup.modal-in').length) {
        if ($('.popup.modal-in>.view').length) {
          const currentView = t4.views.get('.popup.modal-in>.view');
          if (currentView && currentView.router && currentView.router.history.length > 1) {
            currentView.router.back();
            return;
          }
        }
        t4.popup.close('.popup.modal-in');
        return;
      }
      if ($('.login-screen.modal-in').length) {
        t4.loginScreen.close('.login-screen.modal-in');
        return;
      }

      if ($('.page-current .searchbar-enabled').length) {
        t4.searchbar.disable('.page-current .searchbar-enabled');
        return;
      }

      if ($('.page-current .card-expandable.card-opened').length) {
        t4.card.close('.page-current .card-expandable.card-opened');
        return;
      }

      const currentView = t4.views.current;
      if (currentView && currentView.router && currentView.router.history.length > 1) {
        currentView.router.back();
        return;
      }

      if ($('.panel.panel-in').length) {
        t4.panel.close('.panel.panel-in');
        return;
      }
    }, false);
  },
  /*
  This method does the following:
    - provides cross-platform view "shrinking" on keyboard open/close
    - hides keyboard accessory bar for all inputs except where it required
  */
  handleKeyboard: function () {
    var t4 = capacitorApp.t4;
    if (!window.Capacitor || !window.Capacitor.Plugins.Keyboard) return;
    var $ = t4.$;
    var Keyboard = window.Capacitor.Plugins.Keyboard;
    if (!Keyboard) return;
    Keyboard.setResizeMode({mode: 'native'});
    Keyboard.setScroll({isDisabled: true});
    Keyboard.setAccessoryBarVisible({isVisible: false});
    window.addEventListener('keyboardWillShow', () => {
      t4.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidShow', () => {
      t4.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidHide', () => {
      if (document.activeElement && $(document.activeElement).parents('.messagebar').length) {
        return;
      }
      Keyboard.setAccessoryBarVisible({isVisible: true});
    });

    $(document).on('touchstart', 'input, textarea, select', function (e) {
      var nodeName = e.target.nodeName.toLowerCase();
      var type = e.target.type;
      var showForTypes = ['datetime-local', 'time', 'date', 'datetime'];
      if (nodeName === 'select' || showForTypes.indexOf(type) >= 0) {
        Keyboard.setAccessoryBarVisible({isVisible: true});
      } else {
        Keyboard.setAccessoryBarVisible({isVisible: false});
      }
    }, true);
  },
  init: function (t4) {
    // Save t4 instance
    capacitorApp.t4 = t4;

    // Handle Android back button
    capacitorApp.handleAndroidBackButton();

    // Handle Splash Screen
    capacitorApp.handleSplashscreen();

    // Handle Keyboard
    capacitorApp.handleKeyboard();
  },
};
