/*****************************************************************************/
/* Settings: Event Handlers */
/*****************************************************************************/
Template.Settings.events({

  'click .change-team': function() {
    $('.choose-team').addClass('show');
  },

  'keyup #name': function() {
    const user = Meteor.user();
    if (user.name !== $('#name').val()) {
      $('button[type="submit"]').prop('disabled', false);
    }
  },

  'keyup #email': function() {
    const user = Meteor.user();
    if (user.emails.length && user.emails[0].address !== $('#email').val()) {
      $('button[type="submit"]').prop('disabled', false);
    }
  },

  'click .choose-team .team': function(e) {
    const $selectedTeam = $(e.currentTarget);
    $('#supported-team').val($selectedTeam.data('id'));
    $('.change-team').prop('class', 'change-team ' + $selectedTeam.find('.flag').prop('class'));
    $('.team1 .name').html($selectedTeam.find('.name').html());
    $('.choose-team').removeClass('show');
    $('button[type="submit"]').prop('disabled', false);
  },

  'submit .settings form': function(e) {
    e.preventDefault();
    $submitButton = $('button[type="submit"]');
    $submitButton.blur();
    if (!$submitButton.prop('disabled')) {
      const profile = {
        name: $('#name').val(),
        email: $('#email').val(),
        supportedTeam: $('#supported-team').val(),
      };
      Meteor.users.update({_id: Meteor.userId()}, {$set: {
        "profile.name": profile.name,
        "profile.supportedTeam": profile.supportedTeam,
      }}, err => {
        if (err) {
          error(err.reason);
        } else {
          info('Changes have been saved');
          $submitButton.prop('disabled', true);
        }
      });
    } else {
      error('You didn\'t change anything...');
    }
  },

  'click .signout': function() {
    Meteor.logout();
  },

});

/*****************************************************************************/
/* Settings: Helpers */
/*****************************************************************************/
Template.Settings.helpers({

  user: function() {
    let user = Meteor.user();
    if (user) {
      if (user.services) {
        if (user.services.facebook) {
          const fb = user.services.facebook;
          user.name = fb.name;
          user.email = fb.email;
          user.picture = "http://graph.facebook.com/" + fb.id + "/picture/?type=large";
        } else if (user.services.google) {
          const google = user.services.google;
          user.name = google.name;
          user.email = google.email;
          user.picture = google.picture;
        } else {
          user.picture = '/images/profile-default.png';
        }
      } else {
        user.picture = '/images/profile-default.png';
      }
      if (!user.name && user.profile && user.profile.name) {
        user.name = user.profile.name;
      }

      // user.profile.email = user.emails.length ? user.emails[0].address : '';
      user.supportedTeamFlag = 'tbd';
      if (user.profile && user.profile.supportedTeam) {
        user.supportedTeam = user.profile.supportedTeam;
        const team = Teams.findOne({_id: user.supportedTeam});
        if (team) {
          user.supportedTeamName = team.name;
          user.supportedTeamFlag = team.name;
        }
      }
      return user;
    }
  },

  teams: function() {
    return Teams.find({}, {sort: {name: 1}});
  },

});

/*****************************************************************************/
/* Settings: Lifecycle Hooks */
/*****************************************************************************/
Template.Settings.onCreated(function () {
});

Template.Settings.onRendered(function () {
  Session.set('menuItem', 'settings');
});

Template.Settings.onDestroyed(function () {
});
