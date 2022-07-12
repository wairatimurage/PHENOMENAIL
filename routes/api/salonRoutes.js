const express = require("express");
const passport = require("passport");

const salonRoutes = (Salon, Booking) => {
  const salonRouter = express.Router();

  salonRouter
    .route("/")
    .get((req, res) => {
      Salon.find({})
        .then((_data) => {
          let _newSalons = [];
          if (_data) {
            _newSalons = _data.map((_salon) => {
              let _newSalon = _salon.toJSON();

              delete _newSalon.__v;
              return _newSalon;
            });
          }
          return res.status(200).json(_newSalons);
        })
        .catch((_err) => {
          console.log(_err);
          res.status(500).json({
            errorMessage: "Sorry an error occured. Please try again.",
          });
        });
    })
    .post((req, res) => {
      try {
        // add new salon
        const _newSalon = new Salon({
          ...req.body,
          createdOn: new Date(),
        });
        console.log("called: ", _newSalon, req.body);

        _newSalon.save((err) => {
          if (err) throw err;
        });
        return res.status(201).json({
          message: "Successfully created",
          salon: _newSalon,
        });
      } catch (error) {
        res.json({ error: error.message, code: error.name });
      }
    });

  salonRouter.route("/booking").post((req, res) => {
    try {
      req.user = {};
      const _newBooking = new Booking({
        ...req.body,
        client: req.user,
        time: new Date(),
      });

      _newBooking.save((err) => {
        if (err) throw err;
      });

      return res.status(201).json({
        message: "Successfully created",
        booking: _newBooking,
      });
    } catch (error) {
      res.json({ error: error.message, code: error.name });
    }
  });

  //   fetch salon bookings
  salonRouter.route("/bookings/:id").get((req, res) => {
    Booking.find({ salon: req.params.id })
      .then((_data) => {
        let _newSalons = [];
        if (_data) {
          _newSalons = _data.map((_salon) => {
            let _newSalon = _salon.toJSON();

            delete _newSalon.__v;
            return _newSalon;
          });
        }
        return res.status(200).json(_newSalons);
      })
      .catch((_err) => {
        console.log(_err);
        res
          .status(500)
          .json({ errorMessage: "Sorry an error occured. Please try again." });
      });
  });

  //   fetch individuals bookings
  salonRouter.route("/my-bookings").get((req, res) => {
    req.user = {};
    // TODO: find by user ID
    Booking.find({})
      .then((_data) => {
        let _newSalons = [];
        if (_data) {
          _newSalons = _data.map((_salon) => {
            let _newSalon = _salon.toJSON();

            delete _newSalon.__v;
            return _newSalon;
          });
        }
        return res.status(200).json(_newSalons);
      })
      .catch((_err) => {
        console.log(_err);
        res
          .status(500)
          .json({ errorMessage: "Sorry an error occured. Please try again." });
      });
  });

  return salonRouter;
};

module.exports = salonRoutes;
