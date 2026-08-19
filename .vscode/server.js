const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'northstar_secret_key';

app.use(express.json({
  verify: (req, res, buf) => {
      req.rawBody = buf;
        }
        }));

        app.post('/api/webhook/inventory', (req, res) => {
          const signature = req.headers['x-signature'];

            if (!signature) {
                return res.status(401).json({ 
                      status: 'error', 
                            message: 'Missing x-signature header' 
                                });
                                  }

                                    const hmac = crypto.createHmac('sha256', SECRET_KEY);
                                      hmac.update(req.rawBody);
                                        const computedSignature = `sha256=${hmac.digest('hex')}`;

                                          let isMatch = false;
                                            try {
                                                isMatch = crypto.timingSafeEqual(
                                                      Buffer.from(signature),
                                                            Buffer.from(computedSignature)
                                                                );
                                                                  } catch (error) {
                                                                      isMatch = false;
                                                                        }

                                                                          if (isMatch) {
                                                                              console.log('✅ Webhook verified successfully:', req.body);
                                                                                  return res.status(200).json({ 
                                                                                        status: 'success', 
                                                                                              message: 'Webhook payload verified',
                                                                                                    data: req.body 
                                                                                                        });
                                                                                                          } else {
                                                                                                              console.log('❌ Invalid webhook signature!');
                                                                                                                  return res.status(401).json({ 
                                                                                                                        status: 'error', 
                                                                                                                              message: 'Invalid signature: HMAC match failed' 
                                                                                                                                  });
                                                                                                                                    }
                                                                                                                                    });

                                                                                                                                    app.listen(PORT, () => {
                                                                                                                                      console.log(`Webhook Verifier listening on http://localhost:${PORT}`);
                                                                                                                                      });