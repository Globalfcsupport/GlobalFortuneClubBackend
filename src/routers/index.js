const express = require("express");
const router = express.Router();
const ReferalRoute = require("./referal.route");
const UserRoute = require("./user.route");
const AuthRoute = require("./auth.route");
const AdminRoute = require("./admin.router");
const Routes = [
  {
    path: "/referal",
    route: ReferalRoute,
  },
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/admin",
    route: AdminRoute,
  },
];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
