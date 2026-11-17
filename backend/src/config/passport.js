const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const pool = require('./db');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secreto_utn'
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        const [users] = await pool.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [jwtPayload.id]);
        if (users.length > 0) {
          return done(null, users[0]);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};