const passport = require('passport');

exports.validateAuth = passport.authenticate('jwt', { session: false });
