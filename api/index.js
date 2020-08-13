const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
const mercadopago = require('mercadopago');
const port = 3001;


// Set the mercadopago credentials
mercadopago.configurations.setAccessToken('TEST-1456055079143308-051916-8ad472fa5fd87ef418bdc7c48d9614f0-233894286');

// Attach the body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/pay', function (req, res) {
  const token = req.body.token;
  const paymentMethodId = req.body.paymentMethodId;
  const email = req.body.email;

  console.log(`Parameters receive ${JSON.stringify(req.body)}`);

  // Creating payment payload
  const paymentData = {
    transaction_amount: 100,
    token: token,
    description: 'ReactJS/MercadoPago - Test Payment',
    installments: 1,
    payment_method_id: paymentMethodId,
    payer: {
      email: email,
    },
  };

  // Do payment
  mercadopago.payment.save(paymentData).then((payment) => {
    console.log('Payment done!');
    res.send(payment);
  }).catch(function (error) {
    console.log(`There was an error making the payment ${error.message}`);
    res.status(500).send({
      message: error.message
    });
  });
});

console.log(`Application listening on port ${port}`);

app.listen(port);
