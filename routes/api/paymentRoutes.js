const express = require("express");
const passport = require("passport");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { CustomError, checkAuth } = require("../../utility");
const {
  handlePaymentErrors,
  handleServerErrors,
} = require("../../errorHandlers");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const flutterwaveCall = async (_data) => {
  const reqObject = JSON.stringify({
    tx_ref: _data._refId,
    amount: _data.bookingFee,
    currency: "KES",
    redirect_url: _data.redirect_url,
    payment_options: _data.paymentMethod,
    meta: {
      consumer_id: _data.customerId,
      // consumer_mac: "92a3-912ba-1192a",
    },
    customer: _data.customer,
    customizations: {
      title: "Salon Order Payment.",
      description: "Complete your order from salon through payment.",
      logo: _data.logo_url,
    },
  });

  console.log("called");
  return axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": reqObject.length,
      Authorization: process.env.FLUTTERWAVE_SECRET,
    },
    url: "https://api.flutterwave.com/v3/payments",
    data: reqObject,
  })
    .then((_response) => {
      const _data = _response.data;
      if (_data.status === "success") return _data;
      throw new CustomError(_data.message, "paymentError");
    })
    .catch((_err) => {
      console.log(_err);
      throw new CustomError(
        "Problem connecting to Payment System.",
        "paymentError"
      );
    });
};

const flutterwaveVerification = async (_id) => {
  return axios
    .get(`https://api.flutterwave.com/v3/transactions/${_id}/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.FLUTTERWAVE_SECRET,
      },
    })
    .then((_response) => {
      const _data = _response.data;
      if (_data.status === "success") return _data;
      throw new CustomError(_data.message, "veririficationError");
    })
    .catch((_err) => {
      handlePaymentErrors(_err);
      throw _err;
    });
};

const paymentRoutes = (Payment, Order) => {
  const paymentRouter = express.Router();

  // TODO: add auth check
  paymentRouter.route("/").post(async (req, res) => {
    const _origin = req.get("origin");
    const _host = req.protocol + "://" + req.get("host") + "/";
    try {
      // const _user = req.user.toJSON();
      const _refId = uuidv4();

      const _newPayment = new Payment({
        clientId: req.body.client.email,
        order: { ...req.body },
        refId: _refId,
        initiatedAt: new Date(),
        completed: false,
        currency: "KES",
        totalPayable: req.body.appointment.pricing,
        bookingFee: req.body.appointment.pricing * 0.5,
        payment: { method: req.body.appointment.paymentMethod },
      });

      //   check for duplicate transactions
      const openPayment = async () => {
        return await Payment.find({
          clientId: req.body.client.email,
        }).then((_results) => {
          const _openPayments = _results.find(
            (_payment) =>
              !_payment.completed &&
              _payment.totalPayable === _newPayment.totalPayable &&
              _payment.order.appointment.paymentMethod ===
                req.body.appointment.paymentMethod
          );

          // console.log("open check: ", _openPayments);
          if (_openPayments) {
            console.log(
              "pre check: ",
              // _results,
              _results.length > 0,
              _results.length
            );

            return res
              .status(201)
              .json({ redirectUrl: _openPayments.payment.link });
            console.log("ssss");
            // TODO: log error
            // throw new CustomError(
            //   "Similar transaction currently underway.",
            //   "duplicateTransaction"
            // );
          }

          return false;
        });
      };
      await _newPayment.validateSync();

      if (!(await openPayment())) {
        const _flutterwaveData = {
          _refId,
          customer: {
            // email: _user.email,
            ..._newPayment.order.client,
          },
          paymentMethod: req.body.appointment.paymentMethod,
          currency: _newPayment.currency,
          redirect_url: _origin + "/booking/" + _newPayment._id,
          logo: _host + "logo.jpeg",
          totalPayable: _newPayment.totalPayable,
          bookingFee: _newPayment.bookingFee,
        };

        const _savedPayment = await _newPayment
          .save()
          .then(async (_saved) => _saved);

        console.log("saved: ", _savedPayment);
        const _flutterwave_call = await flutterwaveCall(_flutterwaveData);
        const _updatedPayment = _savedPayment.toJSON();
        _updatedPayment.payment.link = _flutterwave_call.data.link;

        Payment.findOneAndUpdate(
          { refId: _savedPayment.refId },
          { $set: _updatedPayment }
        ).then((_res) => {
          // console.log("saved: ", _res.payment.link);
          return res
            .status(201)
            .json({ redirectUrl: _flutterwave_call.data.link });
        });
      }
      // await openPayment()
      //   .then((_res) => {
      //     console.log("here open: ", _res);
      //   })
      //   .catch((_err) => {
      //     console.log(_err);
      //   });
    } catch (_err) {
      handlePaymentErrors(_err);
      return res.status(421).json({
        errorMessage:
          _err.name === "duplicateTransaction"
            ? _err.message
            : "Sorry, an error occured processing your payment. Please try again.",
      });
    }
  });

  paymentRouter.route("/already-paid").post((req, res) => {
    console.log("sss: ", req.body);
    req.user = {};
    // TODO: use req.user id
    Payment.find({
      clientId: req.body.client.email,
    })
      .then(async (_results) => {
        const _openPayments = _results.find(
          (_payment) =>
            _payment.completed && _payment.totalPayable === req.body.payable
        );
        if (_openPayments) {
          _openPayments.toJSON();
          console.log(
            "some: ",
            _openPayments.order.payment.refId,
            _openPayments.refId
          );
          _openPayments.order.payment.refId = _openPayments.refId;
          await Order.findOne({ "payment.refId": _openPayments.refId }).then(
            (_res) => {
              if (_res) {
                return res.status(201).json({
                  message:
                    "An order has already been placed with similar details. Place new order or contact support for assistance",
                  order: _res,
                });
              }
              return res.status(201).json(_openPayments.order);
            }
          );
        } else {
          res.json({
            errorMessage: "No matching payment found. Please contact support.",
            code: "noPayment",
          });
        }
      })
      .catch((_err) => {
        handlePaymentErrors(_err);
        res.json({
          errorMessage: "Sorry an error occured.",
          code: "verificationError",
        });
      });
  });

  paymentRouter.route("/:id").post(async (req, res) => {
    Payment.findById(req.params.id)
      .then(async (_result) => {
        const _verificationResponse = await flutterwaveVerification(
          req.body.transaction_id
        );
        if (_result.refId === _verificationResponse.data.tx_ref) {
          _result.completed = true;
          _result.payment = {
            ..._result.payment,
            gateway: _verificationResponse.data,
          };
          await _result.save((_err, _savedData) => {
            if (_err) throw _err;
            // _savedData.order.payment.refId = _savedData.refId;
            // console.log(_savedData);
            return res.status(201).json(_result.order);
          });
        } else {
          Payment.findOne(
            { refId: _verificationResponse.data.tx_ref },
            async (_err, _res) => {
              if (_err) throw _err;
              if (_res) {
                // TODO: find order
                await Order.findOne({
                  "payment.refId": _result.refId,
                }).then((_res) => {
                  if (_res) {
                    return res.status(201).json({
                      message:
                        "An order has already been placed with similar details. Place new order or contact support for assistance",
                      order: _res,
                    });
                  }
                  return res.status(201).json({
                    message:
                      "Sorry the transaction was initiated but not completed.",
                  });
                });
              }
              return res.status(421).json({
                errorMessage:
                  "Sorry, your transaction id is invalid. Please contact support fo assistance.",
                code: "mismatchedCode",
              });
            }
          );
        }
      })
      .catch((_err) => {
        handleServerErrors(_err);
        return res
          .status(401)
          .json({ errorMessage: "Sorry, authentication error." });
      });
  });

  return paymentRouter;
};

module.exports = paymentRoutes;
