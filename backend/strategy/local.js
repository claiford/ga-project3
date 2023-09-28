const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Customer = require("../models/CustomerModel");
const Merchant = require("../models/MerchantModel");

// using email and password
// passport.use(
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//     async (email, password, done) => {
//       console.log("email:", email);
//       try {
//         const result = await Customer.findOne({ email });
//         console.log("customer found: ", result);
//         if (!result) {
//           return done(null, false, {
//             message: "Invalid email or password. Please try again.",
//           });
//         }
//         const passwordMatch = await bcrypt.compare(password, result.password);
//         if (!passwordMatch) {
//           return done(null, false, {
//             message: "Invalid password or password. Please try again.",
//           });
//         }
//         return done(null, result);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

passport.use(
  'local-customer',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, customer.password);

        if (!isPasswordMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, customer);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((customer, done) => {
  console.log("serializing user: ", customer._id);
  done(null, customer._id);
});

passport.deserializeUser(async (_id, err, done) => {
  try {
    const customer = await Customer.findById(_id);
    const merchant = await Merchant.findById(_id);
    
    if (customer) {
      console.log("Found customer:", customer);
      return done(null, customer);
    } else if (!customer) {
      return done(err)
    } else if (merchant) {
      console.log("Found merchant:", merchant);
      return done(null, merchant);
    } else {
      return done("User not found", err);
    }
  } catch (err) {
    console.log("Catching error:", err);
    return done(err);
  }
});
// passport.deserializeUser(async (_id, err, done) => {
//   try {
//     const user = await Customer.findById(_id);
//     if (!user) {
//       return done(err);
//     } else {
//       console.log("Found user:", user);
//     }
//   } catch (err) {
//     console.log("Catching error:", err);
//   }
// });

module.exports = passport;
