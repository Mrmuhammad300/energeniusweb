# 🧪 Stripe Payment Integration Testing Guide

## Quick Access

- **Live Site:** https://rrg-solutions.com
- **Admin Login:** https://rrg-solutions.com/admin/login
  - Email: `admin@energenius.com`
  - Password: `admin123`
- **Stripe Dashboard:** https://dashboard.stripe.com/test

---

## 📋 Pre-Testing Checklist

### ✅ Webhook Configuration (CRITICAL)

1. **Navigate to:** https://dashboard.stripe.com/test/webhooks
2. **Add endpoint:** https://rrg-solutions.com/api/webhooks/stripe
3. **Select events:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. **Verify signing secret matches:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_POt2Be7lh2RKxaF0B7IpUTVcVw4xhKL6
   ```

---

## 🧪 Test Card Numbers

### ✅ **Successful Payments**

| Card Number | Description | Use Case |
|-------------|-------------|----------|
| `4242 4242 4242 4242` | Visa (Success) | Standard successful payment |
| `5555 5555 5555 4444` | Mastercard (Success) | Alternative success test |
| `3782 822463 10005` | Amex (Success) | 4-digit CVC test |

### ❌ **Declined Payments**

| Card Number | Error Type | Use Case |
|-------------|------------|----------|
| `4000 0000 0000 0002` | Generic decline | Test decline handling |
| `4000 0000 0000 9995` | Insufficient funds | Test insufficient funds |
| `4000 0000 0000 9987` | Lost card | Test lost/stolen card |
| `4000 0000 0000 9979` | Stolen card | Test fraud prevention |
| `4000 0000 0000 0069` | Expired card | Test expiry validation |

### ⚠️ **Special Scenarios**

| Card Number | Behavior | Use Case |
|-------------|----------|----------|
| `4000 0025 0000 3155` | Requires authentication | Test 3D Secure |
| `4000 0000 0000 0341` | Attach/charge failure | Test processing errors |

**Note:** Use any future expiry date (e.g., `12/25`), any 3-digit CVC (e.g., `123`), and any ZIP code (e.g., `12345`)

---

## 🎯 Testing Scenarios

### **Scenario 1: Full Payment - Success** ✅

**Objective:** Test complete invoice payment

1. **Create Invoice:**
   - Go to Admin Dashboard → Invoices → New Invoice
   - Customer: "John Doe"
   - Email: "john@test.com"
   - Add Product: "EnerGenius Guardian 5000" ($4,899)
   - Tax: $367.43 (7.5%)
   - **Total:** $5,266.43
   - Save Invoice

2. **Make Payment:**
   - Click "Pay Full Amount" button
   - Use card: `4242 4242 4242 4242`
   - Expiry: `12/25`, CVC: `123`, ZIP: `12345`
   - Click "Pay"

3. **Expected Results:**
   - ✅ Redirect to success page
   - ✅ Toast notification: "Payment successful!"
   - ✅ Invoice status: "Paid"
   - ✅ Payment recorded in database
   - ✅ Stripe dashboard shows successful charge

---

### **Scenario 2: Deposit + Balance** ✅

**Objective:** Test split payment (deposit first, balance later)

#### **Step 2A: Pay Deposit**

1. **Create Invoice:**
   - Total: $10,000
   - Deposit: $3,000 (30%)
   - Balance: $7,000

2. **Pay Deposit:**
   - Click "Pay Deposit ($3,000)" button
   - Use card: `4242 4242 4242 4242`
   - Complete payment

3. **Expected Results:**
   - ✅ Status: "Partially Paid"
   - ✅ Deposit Paid: $3,000
   - ✅ Balance Due: $7,000
   - ✅ "Pay Balance" button appears

#### **Step 2B: Pay Balance**

1. **Pay Balance:**
   - Click "Pay Balance ($7,000)" button
   - Use card: `5555 5555 5555 4444`
   - Complete payment

2. **Expected Results:**
   - ✅ Status: "Paid"
   - ✅ Total Paid: $10,000
   - ✅ All payment buttons disabled

---

### **Scenario 3: Payment Declined** ❌

**Objective:** Test error handling for declined cards

1. **Create Invoice:**
   - Any amount (e.g., $2,000)

2. **Attempt Payment:**
   - Click "Pay Full Amount"
   - Use **declined card:** `4000 0000 0000 0002`
   - Try to complete payment

3. **Expected Results:**
   - ❌ Payment fails at Stripe
   - ❌ Error message: "Your card was declined"
   - ❌ Invoice status remains "Pending"
   - ❌ No payment recorded

---

### **Scenario 4: Insufficient Funds** ❌

**Objective:** Test specific decline reason

1. **Create Invoice:**
   - Amount: $5,000

2. **Attempt Payment:**
   - Use card: `4000 0000 0000 9995`
   - Try to complete payment

3. **Expected Results:**
   - ❌ Error: "Insufficient funds"
   - ❌ Invoice remains "Pending"
   - ❌ Webhook receives `payment_intent.payment_failed` event

---

### **Scenario 5: Multiple Payment Attempts** 🔄

**Objective:** Test retry logic and status tracking

1. **Create Invoice:** $3,000

2. **First Attempt (Fail):**
   - Use declined card: `4000 0000 0000 0002`
   - Payment fails

3. **Second Attempt (Success):**
   - Click payment button again
   - Use success card: `4242 4242 4242 4242`
   - Payment succeeds

4. **Expected Results:**
   - ✅ Invoice status updates to "Paid"
   - ✅ Only successful payment recorded
   - ✅ Failed attempts not counted

---

## 🔍 Verification Checklist

After each test, verify:

### **In EnerGenius Admin Dashboard:**
- [ ] Invoice status updated correctly
- [ ] Payment amount recorded
- [ ] Deposit/Balance tracking accurate
- [ ] Payment method saved
- [ ] Timestamps correct

### **In Stripe Dashboard:**
- [ ] Payment Intent created
- [ ] Charge successful (or failed as expected)
- [ ] Webhook delivered successfully
- [ ] Customer email recorded
- [ ] Metadata includes invoice ID

### **In Database (via Prisma Studio):**
```bash
cd /home/ubuntu/energenius_website/nextjs_space
yarn prisma studio
```
- [ ] Invoice record updated
- [ ] Payment record created
- [ ] Relationships correct (Invoice ↔ Payment)

---

## 🐛 Troubleshooting

### **Issue: Webhook not firing**

**Solution:**
1. Check webhook endpoint is active in Stripe Dashboard
2. Verify URL: `https://rrg-solutions.com/api/webhooks/stripe`
3. Test webhook manually in Stripe Dashboard
4. Check server logs for errors

### **Issue: Payment succeeds but invoice not updating**

**Possible causes:**
- Webhook signing secret mismatch
- Webhook events not selected correctly
- Database connection issue

**Debug steps:**
```bash
# Check webhook events in Stripe Dashboard
# Look for failed webhook attempts
# Verify signing secret matches .env
```

### **Issue: "Payment processing" stuck**

**Solution:**
- Check Stripe Dashboard for payment status
- Verify webhook was delivered
- Manually trigger webhook retry in Stripe Dashboard
- Check invoice status in database

---

## 📊 Expected Payment Flow

```
1. User clicks "Pay" button
   ↓
2. API creates Stripe Checkout Session
   ↓
3. User redirected to Stripe Checkout
   ↓
4. User enters card details
   ↓
5. Stripe processes payment
   ↓
6. Webhook receives "checkout.session.completed"
   ↓
7. API updates invoice status
   ↓
8. User redirected back to invoice page
   ↓
9. Success toast notification shown
```

---

## 🎯 Key Metrics to Monitor

### **During Testing:**
- Payment success rate: Should be 100% with valid test cards
- Webhook delivery time: Typically < 3 seconds
- Invoice update latency: < 5 seconds after webhook
- Error handling: Graceful failures with clear messages

### **Production Readiness:**
- [ ] All test scenarios passed
- [ ] Webhooks configured and tested
- [ ] Error messages user-friendly
- [ ] Payment confirmations working
- [ ] Database updates atomic and consistent
- [ ] Ready to switch to live keys

---

## 🚀 Going Live

When ready for production:

1. **Get Live API Keys:**
   - Navigate to: https://dashboard.stripe.com/apikeys
   - Copy Live `Secret key` (starts with `sk_live_`)
   - Copy Live `Publishable key` (starts with `pk_live_`)

2. **Configure Live Webhook:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Add endpoint: https://rrg-solutions.com/api/webhooks/stripe
   - Select same events as test
   - Copy Live `Signing secret` (starts with `whsec_`)

3. **Update Environment Variables:**
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Deploy:**
   - Test with real card first (small amount)
   - Monitor Stripe Dashboard
   - Verify webhooks firing

---

## 📞 Support

**Stripe Documentation:**
- Testing: https://stripe.com/docs/testing
- Webhooks: https://stripe.com/docs/webhooks
- Checkout: https://stripe.com/docs/payments/checkout

**EnerGenius Admin:**
- Email: admin@energenius.com
- Dashboard: https://rrg-solutions.com/admin

---

**Last Updated:** December 24, 2024  
**Integration Status:** ✅ Complete - Ready for Testing
